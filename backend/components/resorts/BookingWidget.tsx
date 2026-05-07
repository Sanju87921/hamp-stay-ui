"use client";
// ============================================================
// BookingWidget — Sticky booking sidebar on Resort Detail page
// Calculates nights, total price, real-time availability display.
// ============================================================

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar as CalIcon, Users, Star, ShieldCheck, Loader2 } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Calendar, type DateRange } from "../ui/Calendar";
import { cn } from "@/utils/cn";
import type { Resort } from "@/types/resort";
import { createBookingAction } from "@/actions/bookings";
import { CashfreeCheckout } from "../booking/CashfreeCheckout";

interface BookingWidgetProps {
  resort: Resort;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
}

export function BookingWidget({
  resort,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
}: BookingWidgetProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const parseDate = (s?: string) => (s ? parseISO(s) : undefined);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: parseDate(initialCheckIn),
    to: parseDate(initialCheckOut),
  });
  const [adults, setAdults] = useState(initialAdults);
  const [showCal, setShowCal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;
    return Math.max(0, differenceInDays(dateRange.to, dateRange.from));
  }, [dateRange]);

  const basePrice = resort.pricePerNight;
  const subtotal = nights * basePrice;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const hasAvailability = resort.roomTypes.some(
    (rt) => rt.availableCount > 0 && rt.capacity >= adults
  );

  const handleBooking = async () => {
    if (!session) {
      router.push("/login?callbackUrl=" + window.location.pathname);
      return;
    }

    if (!dateRange.from || !dateRange.to) return;

    setIsBooking(true);
    try {
      const result = await createBookingAction({
        resortId: resort.id,
        checkIn: dateRange.from.toISOString(),
        checkOut: dateRange.to.toISOString(),
        guests: adults,
        nights,
        pricePerNight: basePrice,
      });

      if (result.success && result.bookingId) {
        // Instead of immediate redirect, we trigger the payment flow
        setActiveBookingId(result.bookingId);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-luxury border border-sand-100 p-6">
      {/* ── Cashfree Checkout Flow ────────────────────────────────────────── */}
      {activeBookingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setActiveBookingId(null)}
              className="absolute top-4 right-4 p-2 hover:bg-sand-50 rounded-full transition-colors"
            >
              <Loader2 className="w-5 h-5 text-navy-400 rotate-45" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold text-navy-950 mb-2">Secure Payment</h3>
              <p className="text-navy-950/50">Complete your reservation at {resort.name}</p>
            </div>

            <div className="bg-sand-50 rounded-2xl p-4 mb-8 border border-sand-100">
              <div className="flex justify-between font-bold text-navy-950 text-lg">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <CashfreeCheckout 
              existingBookingId={activeBookingId}
              resortId={resort.id}
              checkIn={dateRange.from?.toISOString() || ""}
              checkOut={dateRange.to?.toISOString() || ""}
              guests={adults}
              nights={nights}
              pricePerNight={basePrice}
              onCancel={() => setActiveBookingId(null)}
              label="Pay Securely Now"
            />
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-1">
        <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
        <span className="font-bold text-navy-950">{resort.rating}</span>
        <span className="text-navy-950/50 text-sm">({resort.reviewCount} reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-serif font-bold text-navy-950">
          ₹{basePrice.toLocaleString("en-IN")}
        </span>
        <span className="text-navy-950/50 text-sm">/night</span>
      </div>

      {/* Date Picker Trigger */}
      <button
        type="button"
        onClick={() => setShowCal(!showCal)}
        className="w-full flex items-center gap-3 border-2 border-sand-200 rounded-2xl p-4 hover:border-gold-400 transition-colors mb-3 text-left"
      >
        <CalIcon className="w-5 h-5 text-gold-500 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-navy-800/40 uppercase tracking-widest">Dates</p>
          <p className="text-sm font-semibold text-navy-950 mt-0.5">
            {dateRange.from
              ? `${format(dateRange.from, "MMM d")}${dateRange.to ? ` – ${format(dateRange.to, "MMM d")}` : ""}`
              : "Select dates"}
          </p>
        </div>
      </button>

      {showCal && (
        <div className="mb-4 -mx-2">
          <Calendar
            selected={dateRange}
            onSelect={(r) => {
              setDateRange(r ?? { from: undefined, to: undefined });
              if (r?.from && r?.to) setShowCal(false);
            }}
          />
        </div>
      )}

      {/* Guests */}
      <div className="flex items-center gap-3 border-2 border-sand-200 rounded-2xl p-4 mb-5">
        <Users className="w-5 h-5 text-gold-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] font-bold text-navy-800/40 uppercase tracking-widest">Guests</p>
          <p className="text-sm font-semibold text-navy-950 mt-0.5">{adults} adult{adults !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdults((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-full border border-sand-300 flex items-center justify-center text-navy-950/60 hover:border-sand-400 text-lg font-bold transition-colors"
          >
            −
          </button>
          <span className="w-5 text-center font-bold text-navy-950 text-sm">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults((p) => Math.min(12, p + 1))}
            className="w-7 h-7 rounded-full border border-sand-300 flex items-center justify-center text-navy-950/60 hover:border-sand-400 text-lg font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="mb-5 space-y-2 bg-sand-50 rounded-2xl p-4 border border-sand-100">
          <div className="flex justify-between text-sm text-navy-900">
            <span>₹{basePrice.toLocaleString("en-IN")} × {nights} night{nights !== 1 ? "s" : ""}</span>
            <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-navy-900">
            <span>Taxes & fees (12% GST)</span>
            <span className="font-semibold">₹{taxes.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-bold text-navy-950 pt-2 border-t border-sand-200 text-base">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleBooking}
        disabled={!hasAvailability || nights === 0 || isBooking}
        className={cn(
          "w-full block text-center py-4 rounded-2xl font-bold text-base transition-all duration-300",
          hasAvailability && nights > 0
            ? "bg-gold-600 hover:bg-gold-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            : "bg-sand-200 text-navy-800/40 cursor-not-allowed"
        )}
      >
        {isBooking ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : nights === 0 ? (
          "Select dates to book"
        ) : (
          "Reserve & Pay"
        )}
      </button>

      {/* Policy */}
      {resort.policies?.cancellation && (
        <div className="flex items-start gap-2 mt-4 p-3 bg-navy-100 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy-900 leading-relaxed">{(resort.policies as any).cancellation}</p>
        </div>
      )}
    </div>
  );
}
