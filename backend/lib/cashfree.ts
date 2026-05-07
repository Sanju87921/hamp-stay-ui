/**
 * lib/cashfree.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Secure, future-proof Cashfree Payments backend wrapper.
 *
 * Responsibilities
 * ─────────────────
 * 1. Validate that all required env vars exist at startup (fail fast).
 * 2. Expose typed helpers for order creation and payment status fetch.
 * 3. Expose webhook signature verification using HMAC-SHA256.
 *
 * Security notes
 * ──────────────
 * • CASHFREE_SECRET_KEY and CASHFREE_WEBHOOK_SECRET never leave this file.
 * • We use the official cashfree-pg SDK which handles TLS/retries internally.
 * • Amounts are handled as Float (INR) here but the SDK expects them as-is.
 * • Idempotency is enforced via unique orderId per booking.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import crypto from "crypto";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// ── 1. Validate required env vars (fail at boot, not at runtime) ─────────────

const REQUIRED_VARS = [
  "CASHFREE_APP_ID",
  "CASHFREE_SECRET_KEY",
  "CASHFREE_ENV",
  "CASHFREE_WEBHOOK_SECRET",
] as const;

for (const key of REQUIRED_VARS) {
  if (!process.env[key]) {
    const msg = `[Cashfree] Missing environment variable: ${key}. Payment features will be disabled.`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
      console.warn(`\x1b[33m%s\x1b[0m`, msg);
    }
  }
}

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || "";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "";
const CASHFREE_ENV = (process.env.CASHFREE_ENV || "SANDBOX").toUpperCase();
const CASHFREE_WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET || "";

// ── 2. Initialise Cashfree SDK ───────────────────────────────────────────────

const cashfree = new Cashfree(
  CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);
cashfree.XApiVersion = "2023-08-01";

// ── 3. Types ─────────────────────────────────────────────────────────────────

export type CreateOrderParams = {
  /** Unique order ID — we use bookingId prefixed with "CF_" */
  orderId: string;
  /** Amount in INR (e.g. 2000.00 for ₹2,000) */
  amount: number;
  /** Customer details fetched from session */
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  /** Where Cashfree redirects after payment (success or failure) */
  returnUrl: string;
  /** Optional: notify URL (defaults to our webhook route) */
  notifyUrl?: string;
};

export type CreateOrderResult = {
  cfOrderId: string; // Cashfree's internal order ID
  paymentSessionId: string; // Used by the Drop-in JS SDK on the frontend
  orderStatus: string;
};

// ── 4. Create a Cashfree order ───────────────────────────────────────────────

/**
 * Creates a new payment order on Cashfree.
 * Returns the `paymentSessionId` needed by the frontend Drop-in SDK.
 *
 * @throws Error if the Cashfree API returns an error.
 */
export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CreateOrderResult> {
  const { orderId, amount, customer, returnUrl, notifyUrl } = params;

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";

  const orderRequest = {
    order_id: orderId,
    order_amount: parseFloat(amount.toFixed(2)), // Ensure max 2 decimal places
    order_currency: "INR",
    customer_details: {
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl ?? `${appUrl}/api/webhooks/cashfree`,
    },
  };

  const response = await cashfree.PGCreateOrder(orderRequest);

  if (!response?.data?.payment_session_id || !response?.data?.cf_order_id) {
    throw new Error(
      `[Cashfree] Invalid response from PGCreateOrder: ${JSON.stringify(
        response?.data
      )}`
    );
  }

  return {
    cfOrderId: String(response.data.cf_order_id),
    paymentSessionId: response.data.payment_session_id,
    orderStatus: response.data.order_status ?? "ACTIVE",
  };
}

// ── 5. Fetch payment status (server-side verification) ───────────────────────

export type PaymentStatusResult = {
  cfPaymentId: string;
  paymentStatus: string; // "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" etc.
  paymentAmount: number;
  paymentCurrency: string;
  paymentTime: string | null;
  bankReference: string | null;
};

/**
 * Fetches the order details from Cashfree.
 */
export async function getCashfreeOrder(cfOrderId: string) {
  const response = await cashfree.PGFetchOrder(cfOrderId);
  return response?.data ?? null;
}

/**
 * Fetches all payments for a given Cashfree orderId.
 * Returns the most recent payment record.
 *
 * IMPORTANT: Always call this server-side — never expose the secret key.
 */
export async function getCashfreePaymentStatus(
  cfOrderId: string
): Promise<PaymentStatusResult | null> {
  const response = await cashfree.PGOrderFetchPayments(cfOrderId);

  const payments = response?.data;
  if (!Array.isArray(payments) || payments.length === 0) {
    return null;
  }

  // Sort by payment time descending, pick most recent
  const sorted = [...payments].sort((a, b) => {
    const tA = a.payment_completion_time
      ? new Date(a.payment_completion_time).getTime()
      : 0;
    const tB = b.payment_completion_time
      ? new Date(b.payment_completion_time).getTime()
      : 0;
    return tB - tA;
  });

  const latest = sorted[0];

  return {
    cfPaymentId: String(latest.cf_payment_id ?? ""),
    paymentStatus: latest.payment_status ?? "UNKNOWN",
    paymentAmount: Number(latest.order_amount ?? 0),
    paymentCurrency: latest.payment_currency ?? "INR",
    paymentTime: latest.payment_completion_time ?? null,
    bankReference: latest.bank_reference ?? null,
  };
}

// ── 6. Webhook signature verification ────────────────────────────────────────

/**
 * Verifies an incoming Cashfree webhook using HMAC-SHA256.
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): boolean {
  if (!signature || !timestamp || !rawBody || !CASHFREE_WEBHOOK_SECRET) {
    return false;
  }

  try {
    const message = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac("sha256", CASHFREE_WEBHOOK_SECRET)
      .update(message)
      .digest("base64");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error("[Cashfree] Webhook verification error:", error);
    return false;
  }
}

// ── 7. Map Cashfree payment status to our internal PaymentStatus ─────────────

export function mapCashfreeStatusToInternal(
  cfStatus: string
): "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED" {
  switch (cfStatus.toUpperCase()) {
    case "SUCCESS":
      return "CAPTURED";
    case "FAILED":
    case "FLAGGED":
      return "FAILED";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return "REFUNDED";
    default:
      return "PENDING";
  }
}
