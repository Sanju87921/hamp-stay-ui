/**
 * app/booking/confirm/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Booking confirmation page — shown after Cashfree redirects back.
 *
 * Flow:
 * 1. Cashfree redirects to: /booking/confirm?booking_id=XXX
 * 2. This Server Component calls verifyPaymentAction (server-side Cashfree check)
 * 3. Shows Success, Pending, or Failed state with appropriate CTAs
 *
 * Security: We never rely on URL query params for payment status.
 * The authoritative check is always done server-side via the Cashfree API.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Suspense } from "react";
import Link from "next/link";
import { verifyPaymentAction } from "@/actions/payments";

interface ConfirmPageProps {
  searchParams: Promise<{
    booking_id?: string;
  }>;
}

async function ConfirmationContent({ bookingId }: { bookingId: string }) {
  const result = await verifyPaymentAction(bookingId);

  // ── Determine state ────────────────────────────────────────────────────────
  type State = "success" | "pending" | "failed" | "error";
  let state: State = "error";
  let heading = "Something went wrong";
  let subtext = "Please contact support.";

  if (!result.success) {
    state = "error";
    heading = "Verification Failed";
    subtext = result.error;
  } else if (result.status === "CAPTURED") {
    state = "success";
    heading = "Booking Confirmed! 🎉";
    subtext =
      "Your payment was successful. A confirmation has been sent to your email.";
  } else if (result.status === "PENDING") {
    state = "pending";
    heading = "Payment Pending…";
    subtext =
      "Your payment is being processed. We'll notify you as soon as it's confirmed.";
  } else {
    state = "failed";
    heading = "Payment Failed";
    subtext =
      "Your payment could not be completed. No charges were made. Please try again.";
  }

  // ── Colour tokens per state ────────────────────────────────────────────────
  const tokens: Record<
    State,
    { icon: string; iconBg: string; badge: string; badgeBg: string }
  > = {
    success: {
      icon: "✓",
      iconBg: "#22c55e",
      badge: "Confirmed",
      badgeBg: "#dcfce7",
    },
    pending: {
      icon: "⏱",
      iconBg: "#f59e0b",
      badge: "Pending",
      badgeBg: "#fef3c7",
    },
    failed: {
      icon: "✕",
      iconBg: "#ef4444",
      badge: "Failed",
      badgeBg: "#fee2e2",
    },
    error: {
      icon: "!",
      iconBg: "#6b7280",
      badge: "Error",
      badgeBg: "#f3f4f6",
    },
  };

  const t = tokens[state];

  return (
    <div className="confirm-card">
      {/* Icon */}
      <div
        className="confirm-icon"
        style={{ background: t.iconBg }}
        aria-hidden="true"
      >
        {t.icon}
      </div>

      {/* Badge */}
      <span className="confirm-badge" style={{ background: t.badgeBg }}>
        {t.badge}
      </span>

      {/* Heading */}
      <h1 className="confirm-heading">{heading}</h1>
      <p className="confirm-subtext">{subtext}</p>

      {/* CTAs */}
      <div className="confirm-actions">
        {state === "success" && (
          <>
            <Link href="/dashboard" className="confirm-btn confirm-btn--primary">
              View My Bookings
            </Link>
            <Link href="/resorts" className="confirm-btn confirm-btn--ghost">
              Explore More Resorts
            </Link>
          </>
        )}
        {state === "pending" && (
          <Link href="/dashboard" className="confirm-btn confirm-btn--primary">
            Go to Dashboard
          </Link>
        )}
        {(state === "failed" || state === "error") && (
          <>
            <Link
              href={`/resorts`}
              className="confirm-btn confirm-btn--primary"
            >
              Try Again
            </Link>
            <Link href="/dashboard" className="confirm-btn confirm-btn--ghost">
              My Bookings
            </Link>
          </>
        )}
      </div>

      <style>{`
        .confirm-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          max-width: 480px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 1.25rem;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
        }
        .confirm-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .confirm-badge {
          display: inline-block;
          padding: 0.25rem 0.875rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #374151;
        }
        .confirm-heading {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .confirm-subtext {
          font-size: 1rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }
        .confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          margin-top: 0.5rem;
        }
        .confirm-btn {
          display: block;
          width: 100%;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.1s;
        }
        .confirm-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .confirm-btn--primary {
          background: linear-gradient(135deg, #1a1a2e, #0f3460);
          color: #fff;
        }
        .confirm-btn--ghost {
          background: transparent;
          border: 1.5px solid #d1d5db;
          color: #374151;
        }
      `}</style>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="confirm-card" style={{ gap: "1.25rem", maxWidth: 480, margin: "0 auto", padding: "2.5rem 2rem", background: "#fff", borderRadius: "1.25rem", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e5e7eb", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: 80, height: 24, borderRadius: 8, background: "#e5e7eb" }} />
      <div style={{ width: "70%", height: 32, borderRadius: 8, background: "#e5e7eb" }} />
      <div style={{ width: "90%", height: 48, borderRadius: 8, background: "#e5e7eb" }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

export default async function BookingConfirmPage({ searchParams }: ConfirmPageProps) {
  const params = await searchParams;
  const bookingId = params.booking_id ?? "";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {!bookingId ? (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", color: "#374151" }}>
            Invalid confirmation link.
          </h1>
          <Link
            href="/"
            style={{ color: "#0f3460", textDecoration: "underline" }}
          >
            Go Home
          </Link>
        </div>
      ) : (
        <Suspense fallback={<LoadingSkeleton />}>
          <ConfirmationContent bookingId={bookingId} />
        </Suspense>
      )}
    </main>
  );
}

export const metadata = {
  title: "Booking Confirmation | HampiStays",
  description: "Your booking status with HampiStays.",
};
