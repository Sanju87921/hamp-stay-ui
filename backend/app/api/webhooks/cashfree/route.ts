/**
 * app/api/webhooks/cashfree/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cashfree webhook handler — the source of truth for payment status.
 *
 * This endpoint is called by Cashfree whenever a payment status changes.
 * It is the ONLY place that should mark a payment as CAPTURED.
 *
 * Security
 * ────────
 * 1. Verify HMAC-SHA256 signature before touching any data.
 * 2. Parse only known fields — unknown payloads are logged and ignored.
 * 3. Idempotent: if the Payment is already CAPTURED, skip processing.
 * 4. Uses a DB transaction to update Payment + Booking atomically.
 * 5. Always returns 200 to Cashfree (even on soft errors) to prevent retries
 *    for events we've already processed.
 *
 * Cashfree Webhook Docs:
 * https://docs.cashfree.com/docs/payment-webhooks
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyCashfreeWebhookSignature,
  mapCashfreeStatusToInternal,
} from "@/lib/cashfree";
import { sendNotificationAction } from "@/actions/notifications";

// Cashfree sends a POST request
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Read raw body (needed for HMAC verification) ───────────────────────
  const rawBody = await req.text();

  // ── 2. Extract Cashfree signature headers ──────────────────────────────────
  const signature = req.headers.get("x-webhook-signature") ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";

  // ── 3. Verify signature ────────────────────────────────────────────────────
  const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);

  if (!isValid) {
    // Log as security warning but return 200 to prevent retry flood
    console.warn("[Cashfree Webhook] ⚠️ Invalid signature. Possible spoofed request.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 4. Parse the webhook payload ───────────────────────────────────────────
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    console.error("[Cashfree Webhook] Failed to parse JSON payload.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 5. Extract key fields ──────────────────────────────────────────────────
  const type = event.type as string | undefined;

  // We only care about payment status events
  if (!type?.startsWith("PAYMENT_")) {
    // Not a payment event — acknowledge and exit
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const data = event.data as Record<string, unknown> | undefined;
  const order = data?.order as Record<string, unknown> | undefined;
  const payment = data?.payment as Record<string, unknown> | undefined;

  if (!order || !payment) {
    console.error("[Cashfree Webhook] Missing order/payment data in payload.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const cfOrderId = String(order.order_id ?? "");
  const cfPaymentId = String(payment.cf_payment_id ?? "");
  const cfPaymentStatus = String(payment.payment_status ?? "");
  const paymentAmount = Number(payment.payment_amount ?? 0);
  const paymentTime = payment.payment_completion_time as string | undefined;

  if (!cfOrderId) {
    console.error("[Cashfree Webhook] Missing cf_order_id.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 6. Look up Payment record via providerOrderId ──────────────────────────
  const paymentRecord = await db.payment.findUnique({
    where: { providerOrderId: cfOrderId },
    include: {
      booking: {
        include: {
          resort: {
            select: { ownerId: true, name: true },
          },
        },
      },
    },
  });

  if (!paymentRecord) {
    // Could be a test event or a retried event we don't have — ignore safely
    console.warn(`[Cashfree Webhook] No Payment record for cfOrderId: ${cfOrderId}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 7. Idempotency check ───────────────────────────────────────────────────
  if (paymentRecord.status === "CAPTURED") {
    // Already processed — no-op
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // ── 8. Map Cashfree status → internal status ───────────────────────────────
  const internalStatus = mapCashfreeStatusToInternal(cfPaymentStatus);

  // ── 9. Atomically update Payment + Booking ─────────────────────────────────
  try {
    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: internalStatus,
          providerPaymentId: cfPaymentId || undefined,
          providerStatus: cfPaymentStatus,
          providerPayload: event as object,
          paidAt:
            internalStatus === "CAPTURED"
              ? new Date(paymentTime ?? Date.now())
              : undefined,
        },
      });

      const newBookingStatus =
        internalStatus === "CAPTURED"
          ? "CONFIRMED"
          : internalStatus === "FAILED"
          ? "CANCELLED"
          : undefined;

      if (newBookingStatus) {
        await tx.booking.update({
          where: { id: paymentRecord.bookingId },
          data: { status: newBookingStatus },
        });
      }
    });

    // ── 10. Send notifications ─────────────────────────────────────────────
    if (internalStatus === "CAPTURED") {
      const { booking } = paymentRecord;

      // Notify owner
      await sendNotificationAction({
        userId: booking.resort.ownerId,
        type: "BOOKING",
        title: "Payment Received! ✅",
        message: `A payment of ₹${paymentAmount.toFixed(2)} was received for a booking at ${booking.resort.name}.`,
        link: "/dashboard",
        channels: ["IN_APP", "EMAIL"],
      });

      // Notify traveller
      await sendNotificationAction({
        userId: booking.travellerId,
        type: "SUCCESS",
        title: "Booking Confirmed! 🎉",
        message: `Your payment for ${booking.resort.name} was successful. Get ready for your trip!`,
        link: "/dashboard",
        channels: ["IN_APP", "EMAIL"],
      });
    }

    console.log(
      `[Cashfree Webhook] Processed ${type} for order ${cfOrderId} → ${internalStatus}`
    );
  } catch (error) {
    // Log but still return 200 — Cashfree will retry if we return 4xx/5xx
    console.error("[Cashfree Webhook] DB update failed:", error);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
