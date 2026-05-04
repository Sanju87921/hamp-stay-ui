// ============================================================
// BookingWidget — Sticky booking sidebar on Resort Detail page
// Calculates nights, total price, real-time availability display.
// ============================================================

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalIcon, Users, Star, ShieldCheck } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Calendar, type DateRange } from "../ui/Calendar";
import { cn } from "../../utils/cn";
import type { Resort } from "../../types/resort";

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
  const parseDate = (s?: string) => (s ? parseISO(s) : undefined);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: parseDate(initialCheckIn),
    to: parseDate(initialCheckOut),
  });
  const [adults, setAdults] = useState(initialAdults);
  const [showCal, setShowCal] = useState(false);

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

  return (
    <div className="bg-white rounded-3xl shadow-luxury border border-sand-100 p-6">
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
      <Link
        to="/register"
        className={cn(
          "w-full block text-center py-4 rounded-2xl font-bold text-base transition-all duration-300",
          hasAvailability && nights > 0
            ? "bg-gold-600 hover:bg-gold-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            : "bg-sand-200 text-navy-800/40 cursor-not-allowed pointer-events-none"
        )}
      >
        {nights === 0 ? "Select dates to book" : "Reserve Now"}
      </Link>

      {nights > 0 && hasAvailability && (
        <p className="text-center text-xs text-navy-950/50 mt-3">
          You won't be charged yet
        </p>
      )}

      {/* Policy */}
      <div className="flex items-start gap-2 mt-4 p-3 bg-navy-100 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-navy-900 leading-relaxed">{resort.policies.cancellation}</p>
      </div>
    </div>
  );
}
