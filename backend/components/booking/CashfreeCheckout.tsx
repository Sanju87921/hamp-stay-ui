"use client";

/**
 * components/booking/CashfreeCheckout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend Cashfree Drop-in UI checkout button.
 *
 * Usage
 * ─────
 *  <CashfreeCheckout
 *    resortId="..."
 *    checkIn="2024-12-01"
 *    checkOut="2024-12-03"
 *    guests={2}
 *    nights={2}
 *    pricePerNight={2000}
 *    phone="9876543210"
 *  />
 *
 * How it works
 * ────────────
 * 1. User clicks "Pay Now"
 * 2. We call createPaymentOrderAction (server action) to get a paymentSessionId
 * 3. We load the Cashfree SDK from CDN
 * 4. We open the Cashfree Drop-in UI modal
 * 5. On success/failure, we redirect to /booking/confirm?booking_id=...
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { createPaymentOrderAction } from "@/actions/payments";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cashfree?: any;
  }
}

interface CashfreeCheckoutProps {
  resortId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  specialRequests?: string;
  phone?: string;
  /** If we already have a booking, pass its ID */
  existingBookingId?: string;
  /** Callback when user cancels or closes modal */
  onCancel?: () => void;
  /** Override button label */
  label?: string;
  /** Additional Tailwind classes for the button */
  className?: string;
}

export function CashfreeCheckout({
  resortId,
  checkIn,
  checkOut,
  guests,
  nights,
  pricePerNight,
  specialRequests,
  phone,
  existingBookingId,
  onCancel,
  label = "Confirm & Pay",
  className = "",
}: CashfreeCheckoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCashfreeSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ── Step 1: Create order server-side ────────────────────────────────
      const result = await createPaymentOrderAction({
        bookingId: existingBookingId, // Pass if existing
        resortId,
        checkIn,
        checkOut,
        guests,
        nights,
        pricePerNight,
        specialRequests,
        phone: phone || (session.user as { phone?: string }).phone || "9999999999",
      });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const { paymentSessionId, bookingId } = result;

      // ── Step 2: Load Cashfree JS SDK ──────────────────────────────────
      await loadCashfreeSDK();

      if (!window.Cashfree) {
        throw new Error("Cashfree SDK failed to initialise.");
      }

      // ── Step 3: Open Drop-in Checkout ─────────────────────────────────
      const cashfree = await window.Cashfree({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION"
            ? "production"
            : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self", // Stay in the same tab
        onSuccess: () => {
          router.push(`/booking/confirm?booking_id=${bookingId}`);
        },
        onFailure: () => {
          router.push(`/booking/confirm?booking_id=${bookingId}&status=failed`);
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(msg);
      console.error("[CashfreeCheckout]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cashfree-checkout-wrapper">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`cashfree-pay-btn ${className}`}
        aria-busy={loading}
        aria-label="Pay with Cashfree"
      >
        {loading ? (
          <span className="cashfree-pay-btn__spinner" aria-hidden="true" />
        ) : null}
        {loading ? "Processing…" : label}
      </button>
      {error && (
        <p className="cashfree-pay-error" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .cashfree-checkout-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .cashfree-pay-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .cashfree-pay-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .cashfree-pay-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .cashfree-pay-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .cashfree-pay-btn__spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .cashfree-pay-error {
          color: #e53e3e;
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
