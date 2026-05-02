// ============================================================
// ResortFilters — Sidebar filter panel for /resorts page
// ============================================================

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { RangeSlider } from "../ui/RangeSlider";
import { cn } from "../../utils/cn";
import type { FilterState, Amenity, ResortType } from "../../types/resort";

const AMENITY_OPTIONS: Amenity[] = [
  "Pool", "Spa", "WiFi", "Restaurant", "Bar", "Yoga",
  "River View", "Heritage View", "Guided Tours", "Cycling",
  "Organic Food", "Campfire", "Rooftop",
];

const TYPE_OPTIONS: { value: ResortType; label: string }[] = [
  { value: "luxury", label: "Luxury" },
  { value: "boutique", label: "Boutique" },
  { value: "eco", label: "Eco-Stay" },
  { value: "heritage", label: "Heritage" },
  { value: "budget", label: "Budget" },
];

const RATING_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "3.0+", value: 3 },
  { label: "4.0+", value: 4 },
  { label: "4.5+", value: 4.5 },
  { label: "4.8+", value: 4.8 },
];

interface ResortFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  maxPrice?: number;
  /** Mobile: show as slide-in panel */
  isOpen?: boolean;
  onClose?: () => void;
}

export function ResortFilters({
  filters,
  onChange,
  maxPrice = 60000,
  isOpen,
  onClose,
}: ResortFiltersProps) {
  const [localPrice, setLocalPrice] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleAmenity = (a: Amenity) => {
    const next = filters.amenities.includes(a)
      ? filters.amenities.filter((x) => x !== a)
      : [...filters.amenities, a];
    update("amenities", next);
  };

  const toggleType = (t: ResortType) => {
    const next = filters.types.includes(t)
      ? filters.types.filter((x) => x !== t)
      : [...filters.types, t];
    update("types", next);
  };

  const clearAll = () => {
    setLocalPrice([0, maxPrice]);
    onChange({ minPrice: 0, maxPrice, amenities: [], types: [], minRating: 0 });
  };

  const hasActiveFilters =
    filters.amenities.length > 0 ||
    filters.types.length > 0 ||
    filters.minRating > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPrice;

  const content = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-forest-700" />
          <h3 className="font-bold text-forest-950 text-lg font-serif">Filters</h3>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-terracotta-600 font-bold hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="text-stone-500 hover:text-stone-800">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-1">
        {/* Price Range */}
        <section>
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
            Price Per Night
          </h4>
          <RangeSlider
            min={0}
            max={maxPrice}
            value={localPrice}
            step={500}
            formatLabel={(v) => `₹${v.toLocaleString("en-IN")}`}
            onChange={(val) => {
              setLocalPrice(val);
              onChange({ ...filters, minPrice: val[0], maxPrice: val[1] });
            }}
          />
        </section>

        {/* Property Type */}
        <section>
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
            Property Type
          </h4>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleType(value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200",
                  filters.types.includes(value)
                    ? "bg-forest-700 text-white border-forest-700"
                    : "border-stone-200 text-stone-700 hover:border-forest-400"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Rating */}
        <section>
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
            Minimum Rating
          </h4>
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => update("minRating", value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200",
                  filters.minRating === value
                    ? "bg-terracotta-600 text-white border-terracotta-600"
                    : "border-stone-200 text-stone-700 hover:border-terracotta-400"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
            Amenities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {AMENITY_OPTIONS.map((a) => {
              const active = filters.amenities.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium border text-left transition-all duration-200",
                    active
                      ? "bg-forest-50 text-forest-800 border-forest-300"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );

  // Mobile overlay
  if (typeof isOpen !== "undefined") {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        )}
        <div
          className={cn(
            "fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-luxury p-6 transition-transform duration-300 ease-[0.16,1,0.3,1] overflow-hidden flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 sticky top-28 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
      {content}
    </div>
  );
}
