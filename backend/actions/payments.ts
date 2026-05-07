"use server";

/**
 * actions/payments.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Actions for Cashfree payment lifecycle management.
 *
 * Actions exported:
 *  1. createPaymentOrderAction  — creates a Cashfree order, stores a pending
 *                                  Payment record, returns paymentSessionId
 *  2. verifyPaymentAction       — server-side verification after checkout
 *  3. getPendingPayoutsAction   — lists captured payments pending payout (admin)
 *  4. markPayoutAsSentAction    — admin marks a payout as sent with reference
 *
 * Security rules
 * ──────────────
 * • All price calculations are server-side only.
 * • Only SUPER_ADMIN can access payout management actions.
 * • Idempotency: we check for an existing Payment before creating a new one.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  createCashfreeOrder,
  getCashfreePaymentStatus,
  mapCashfreeStatusToInternal,
} from "@/lib/cashfree";
import { sendNotificationAction } from "./notifications";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Commission rates — sourced from env so they can be changed without deploys */
const STANDARD_RATE = Number(process.env.COMMISSION_STANDARD_PERCENT ?? 7);
const PEAK_RATE = Number(process.env.COMMISSION_PEAK_PERCENT ?? 10);

/** Peak season months for Hampi (October – February) */
const PEAK_MONTHS = [10, 11, 12, 1, 2];

function getCommissionRate(checkIn: Date, isFeatured: boolean): number {
  const month = checkIn.getMonth() + 1; // getMonth() is 0-indexed
  if (isFeatured || PEAK_MONTHS.includes(month)) {
    return PEAK_RATE;
  }
  return STANDARD_RATE;
}

// ── 1. createPaymentOrderAction ───────────────────────────────────────────────

export type CreatePaymentOrderResult =
  | { success: true; paymentSessionId: string; bookingId: string; cfOrderId: string }
  | { success: false; error: string };

export async function createPaymentOrderAction(data: {
  bookingId?: string;
  resortId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  specialRequests?: string;
  /** Customer phone — required by Cashfree */
  phone: string;
}): Promise<CreatePaymentOrderResult> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return { success: false, error: "Please log in to book." };
  }

  const {
    resortId,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight,
    specialRequests,
    phone,
  } = data;

  if (guests <= 0 || nights <= 0) {
    return { success: false, error: "Invalid guest count or duration." };
  }

  try {
    // ── Validate resort exists and is live ────────────────────────────────
    const resort = await db.resort.findUnique({
      where: { id: resortId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        status: true,
        isFeatured: true,
        pricePerNight: true,
      },
    });

    if (!resort || resort.status !== "ACTIVE") {
      return { success: false, error: "This resort is not available for booking." };
    }

    const checkInDate = new Date(checkIn);
    const dbPricePerNight = resort.pricePerNight; 
    const subtotal = parseFloat((dbPricePerNight * nights).toFixed(2));
    const commissionRate = getCommissionRate(checkInDate, resort.isFeatured);
    const commissionAmount = parseFloat(
      ((subtotal * commissionRate) / 100).toFixed(2)
    );
    const ownerEarnings = parseFloat((subtotal - commissionAmount).toFixed(2));
    const totalPrice = subtotal; 

    // ── Idempotency: check for existing pending booking for same slot ─────
    const existingBooking = await db.booking.findFirst({
      where: {
        resortId,
        travellerId: session.user.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: { payment: true },
    });

    let bookingId = existingBooking?.id;

    if (existingBooking?.payment?.providerOrderId) {
      const payload = existingBooking.payment.providerPayload as
        | { paymentSessionId?: string }
        | null;
      const cachedSessionId = payload?.paymentSessionId ?? "";
      if (cachedSessionId) {
        return {
          success: true,
          paymentSessionId: cachedSessionId,
          bookingId: existingBooking.id,
          cfOrderId: existingBooking.payment.providerOrderId,
        };
      }
    }

    if (!bookingId) {
      const newBooking = await db.booking.create({
        data: {
          resortId,
          travellerId: session.user.id,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests,
          nights,
          pricePerNight: dbPricePerNight,
          subtotal,
          commissionRate,
          commissionAmount,
          ownerEarnings,
          totalPrice,
          status: "PENDING",
          specialRequests,
        },
      });
      bookingId = newBooking.id;
    }

    const orderId = `CF_${bookingId}`; 
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
    const returnUrl = `${appUrl}/booking/confirm?booking_id=${bookingId}&cf_order_id={order_id}&payment_status={payment_status}`;

    if (!phone || phone.length < 10) {
      if (process.env.CASHFREE_ENV === "PRODUCTION") {
        return { success: false, error: "A valid phone number is required for payment." };
      }
    }

    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      amount: totalPrice,
      customer: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: phone || "9999999999", 
      },
      returnUrl,
    });

    await db.payment.upsert({
      where: { bookingId },
      update: {
        amount: totalPrice,
        providerOrderId: cashfreeOrder.cfOrderId,
        providerStatus: cashfreeOrder.orderStatus,
        payoutAmount: ownerEarnings,
        providerPayload: { paymentSessionId: cashfreeOrder.paymentSessionId },
      },
      create: {
        bookingId,
        amount: totalPrice,
        currency: "INR",
        status: "PENDING",
        provider: "cashfree",
        providerOrderId: cashfreeOrder.cfOrderId,
        providerStatus: cashfreeOrder.orderStatus,
        payoutAmount: ownerEarnings,
        payoutStatus: "PENDING_MANUAL",
        providerPayload: { paymentSessionId: cashfreeOrder.paymentSessionId },
      },
    });

    return {
      success: true,
      paymentSessionId: cashfreeOrder.paymentSessionId,
      bookingId,
      cfOrderId: cashfreeOrder.cfOrderId,
    };

  } catch (error) {
    console.error("[createPaymentOrderAction] Error:", error);
    return { success: false, error: "Failed to initiate payment. Please try again." };
  }
}

// ── 2. verifyPaymentAction ────────────────────────────────────────────────────

export type VerifyPaymentResult =
  | { success: true; status: "CAPTURED" | "FAILED" | "PENDING" | "REFUNDED" }
  | { success: false; error: string };

/**
 * Called from the booking confirmation page after Cashfree redirects back.
 * Performs a server-side status check — never trusts URL query params alone.
 */
export async function verifyPaymentAction(
  bookingId: string
): Promise<VerifyPaymentResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        resort: { select: { ownerId: true, name: true } },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    if (booking.travellerId !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    if (!booking.payment?.providerOrderId) {
      return { success: false, error: "No payment record found for this booking." };
    }

    // Already confirmed — return immediately (idempotent)
    if (booking.payment.status === "CAPTURED") {
      return { success: true, status: "CAPTURED" };
    }

    // ── Fetch real-time status from Cashfree ──────────────────────────────
    const paymentStatus = await getCashfreePaymentStatus(
      booking.payment.providerOrderId
    );

    if (!paymentStatus) {
      return { success: true, status: "PENDING" };
    }

    const internalStatus = mapCashfreeStatusToInternal(paymentStatus.paymentStatus);

    // ── Update Payment & Booking records ──────────────────────────────────
    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { bookingId },
        data: {
          status: internalStatus,
          providerPaymentId: paymentStatus.cfPaymentId || undefined,
          providerStatus: paymentStatus.paymentStatus,
          paidAt: internalStatus === "CAPTURED" ? new Date(paymentStatus.paymentTime || Date.now()) : undefined,
        },
      });

      if (internalStatus === "CAPTURED") {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" },
        });
      } else if (internalStatus === "FAILED") {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        });
      }
    });

    // ── Send notifications on success ─────────────────────────────────────
    if (internalStatus === "CAPTURED") {
      await sendNotificationAction({
        userId: booking.resort.ownerId,
        type: "BOOKING",
        title: "New Confirmed Booking!",
        message: `Payment received for a reservation at ${booking.resort.name}.`,
        link: "/dashboard",
        channels: ["IN_APP", "EMAIL"],
      });

      await sendNotificationAction({
        userId: booking.travellerId,
        type: "SUCCESS",
        title: "Booking Confirmed! 🎉",
        message: `Your booking at ${booking.resort.name} is confirmed. See you there!`,
        link: "/dashboard",
        channels: ["IN_APP", "EMAIL"],
      });

      revalidatePath("/dashboard");
    }

    return { success: true, status: internalStatus };
  } catch (error) {
    console.error("[verifyPaymentAction] Error:", error);
    return { success: false, error: "Failed to verify payment." };
  }
}

// ── 3. getPendingPayoutsAction (Super Admin only) ─────────────────────────────

export async function getPendingPayoutsAction() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized.", data: [] };
  }

  try {
    const pendingPayments = await db.payment.findMany({
      where: {
        status: "CAPTURED",
        payoutStatus: "PENDING_MANUAL",
      },
      include: {
        booking: {
          include: {
            resort: {
              select: {
                name: true,
                ownerId: true,
                owner: { select: { name: true, email: true, phone: true } },
              },
            },
            traveller: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { paidAt: "asc" }, // Oldest first — process in FIFO order
    });

    return { success: true, data: pendingPayments };
  } catch (error) {
    console.error("[getPendingPayoutsAction] Error:", error);
    return { success: false, error: "Failed to fetch pending payouts.", data: [] };
  }
}

// ── 4. markPayoutAsSentAction (Super Admin only) ──────────────────────────────

export type MarkPayoutResult =
  | { success: true }
  | { success: false; error: string };

export async function markPayoutAsSentAction(data: {
  paymentId: string;
  payoutReference: string; // Bank transfer ID / UPI reference
  payoutDate: string;       // ISO date string
}): Promise<MarkPayoutResult> {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  const { paymentId, payoutReference, payoutDate } = data;

  if (!payoutReference.trim()) {
    return { success: false, error: "Payout reference is required." };
  }

  try {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            resort: {
              select: { ownerId: true, name: true, owner: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Payment record not found." };
    }

    if (payment.status !== "CAPTURED") {
      return { success: false, error: "Cannot mark payout for an uncaptured payment." };
    }

    if (payment.payoutStatus === "SENT") {
      return { success: false, error: "Payout already marked as sent." };
    }

    await db.payment.update({
      where: { id: paymentId },
      data: {
        payoutStatus: "SENT",
        payoutReference: payoutReference.trim(),
        payoutDate: new Date(payoutDate),
      },
    });

    // Notify resort owner about payout
    await sendNotificationAction({
      userId: payment.booking.resort.ownerId,
      type: "PAYMENT",
      title: "Payout Sent! 💰",
      message: `Your earnings of ₹${payment.payoutAmount?.toFixed(2)} for the booking at ${payment.booking.resort.name} have been transferred. Reference: ${payoutReference}`,
      link: "/dashboard/earnings",
      channels: ["IN_APP", "EMAIL"],
    });

    revalidatePath("/admin-x7k");
    return { success: true };
  } catch (error) {
    console.error("[markPayoutAsSentAction] Error:", error);
    return { success: false, error: "Failed to update payout status." };
  }
}
