// ============================================================
// SearchBar — Fully Functional (Phase 2)
// Replaces the static placeholder. Manages location, date 
// range, and guest count. Navigates to /resorts with URL params.
// ============================================================

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalIcon, Users, MapPin, Search, Minus, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/Button";
import { Calendar, type DateRange } from "./ui/Calendar";
import { cn } from "../utils/cn";

type Panel = "location" | "dates" | "guests" | null;

interface GuestCount {
  adults: number;
  children: number;
}

const LOCATIONS = [
  "Hampi",
  "Kamalapura",
  "Virupapur Gaddi",
  "Hospet Road",
  "Tungabhadra Riverbank",
];

export function SearchBar() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState<GuestCount>({ adults: 2, children: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Location suggestions
  useEffect(() => {
    if (location.length > 0) {
      setSuggestions(
        LOCATIONS.filter((l) => l.toLowerCase().includes(location.toLowerCase()))
      );
    } else {
      setSuggestions(LOCATIONS);
    }
  }, [location]);

  const togglePanel = (panel: Panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const adjustGuest = (type: keyof GuestCount, delta: number) => {
    setGuests((prev) => {
      const next = prev[type] + delta;
      if (type === "adults") return { ...prev, adults: Math.max(1, Math.min(12, next)) };
      return { ...prev, children: Math.max(0, Math.min(8, next)) };
    });
  };

  const formatDateLabel = () => {
    if (!dateRange.from) return "Add dates";
    if (!dateRange.to) return format(dateRange.from, "MMM d");
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (dateRange.from) params.set("checkIn", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to) params.set("checkOut", format(dateRange.to, "yyyy-MM-dd"));
    params.set("adults", String(guests.adults));
    if (guests.children > 0) params.set("children", String(guests.children));
    setActivePanel(null);
    navigate(`/resorts?${params.toString()}`);
  };

  const guestLabel = `${guests.adults + guests.children} guest${guests.adults + guests.children !== 1 ? "s" : ""}`;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Main Bar */}
      <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-luxury p-2 md:p-3 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-0 border border-white/60 relative group transition-all duration-300 hover:shadow-luxury-hover hover:bg-white/95">

        {/* Location */}
        <button
          type="button"
          className={cn(
            "flex-1 w-full md:w-auto px-8 py-4 md:py-3 rounded-full transition-all duration-300 cursor-pointer relative text-left",
            activePanel === "location" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
          )}
          onClick={() => togglePanel("location")}
        >
          <span className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
            Where
          </span>
          <div className="flex items-center gap-3 text-stone-500">
            <MapPin className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
            <span className={cn("text-base font-medium truncate", location ? "text-stone-900" : "text-stone-400")}>
              {location || "Search destinations"}
            </span>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-stone-200 group-hover:bg-transparent transition-colors" />
        </button>

        {/* Dates */}
        <button
          type="button"
          className={cn(
            "flex-1 w-full md:w-auto px-8 py-4 md:py-3 rounded-full transition-all duration-300 cursor-pointer relative text-left",
            activePanel === "dates" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
          )}
          onClick={() => togglePanel("dates")}
        >
          <span className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
            When
          </span>
          <div className="flex items-center gap-3 text-stone-500">
            <CalIcon className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
            <span className={cn("text-base font-medium truncate", dateRange.from ? "text-stone-900" : "text-stone-400")}>
              {formatDateLabel()}
            </span>
          </div>
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-stone-200 group-hover:bg-transparent transition-colors" />
        </button>

        {/* Guests + Search */}
        <div
          className={cn(
            "flex-[1.2] w-full md:w-auto pl-8 pr-3 py-4 md:py-2 rounded-full transition-all duration-300 flex justify-between items-center",
            activePanel === "guests" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
          )}
        >
          <button
            type="button"
            className="text-left flex-1"
            onClick={() => togglePanel("guests")}
          >
            <span className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
              Who
            </span>
            <div className="flex items-center gap-3 text-stone-500">
              <Users className="w-5 h-5 text-terracotta-500 flex-shrink-0" />
              <span className="text-base font-medium text-stone-900">{guestLabel}</span>
            </div>
          </button>

          <Button
            type="button"
            size="lg"
            onClick={handleSearch}
            className="w-14 h-14 md:w-auto md:h-14 p-0 md:px-8 rounded-full ml-4 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-terracotta-600 hover:bg-terracotta-700 border-none"
          >
            <Search className="w-5 h-5 text-white" />
            <span className="hidden md:inline font-bold text-white text-base">Search</span>
          </Button>
        </div>
      </div>

      {/* ── Dropdowns ────────────────────────────────────────── */}

      {/* Location Dropdown */}
      {activePanel === "location" && (
        <div className="absolute top-full left-0 mt-3 bg-white rounded-3xl shadow-luxury border border-stone-100 p-4 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative mb-3">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-500" />
            <input
              autoFocus
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where in Hampi?"
              className="w-full pl-9 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm font-medium outline-none focus:border-terracotta-400 transition-colors"
            />
            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 mb-2">
            Suggestions
          </p>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setLocation(s); setActivePanel("dates"); }}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sand-50 transition-colors text-stone-800 font-medium text-sm"
            >
              <MapPin className="w-4 h-4 text-terracotta-400" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Dates Dropdown */}
      {activePanel === "dates" && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Calendar
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range ?? { from: undefined, to: undefined });
              if (range?.from && range?.to) setActivePanel("guests");
            }}
          />
          {(dateRange.from || dateRange.to) && (
            <div className="mt-2 flex justify-end px-4 pb-2">
              <button
                type="button"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="text-xs text-stone-500 hover:text-terracotta-600 font-semibold underline"
              >
                Clear dates
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guests Dropdown */}
      {activePanel === "guests" && (
        <div className="absolute top-full right-0 mt-3 bg-white rounded-3xl shadow-luxury border border-stone-100 p-6 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-5">
            Guests
          </p>

          {/* Adults */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-semibold text-stone-900">Adults</p>
              <p className="text-xs text-stone-500">Ages 13 and above</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => adjustGuest("adults", -1)}
                disabled={guests.adults <= 1}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-bold text-stone-900">{guests.adults}</span>
              <button
                type="button"
                onClick={() => adjustGuest("adults", 1)}
                disabled={guests.adults >= 12}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-900">Children</p>
              <p className="text-xs text-stone-500">Ages 2–12</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => adjustGuest("children", -1)}
                disabled={guests.children <= 0}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-bold text-stone-900">{guests.children}</span>
              <button
                type="button"
                onClick={() => adjustGuest("children", 1)}
                disabled={guests.children >= 8}
                className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSearch}
            className="w-full mt-6 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl font-bold"
          >
            Search Resorts
          </Button>
        </div>
      )}
    </div>
  );
}
