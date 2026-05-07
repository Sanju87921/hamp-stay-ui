"use client";

import { useState } from "react";
import { Calendar, Users, MapPin, Search } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(Number(searchParams.get("adults") || 1) + Number(searchParams.get("children") || 0));
  
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  const handleFocus = (section: string) => setFocusedSection(section);
  const handleBlur = () => setFocusedSection(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", Math.max(1, guests).toString());
    
    router.push(`/resorts?${params.toString()}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-luxury p-2 md:p-3 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-0 border border-white/60 relative group transition-all duration-300 hover:shadow-luxury-hover hover:bg-white/95">
      {/* Location Section */}
      <div
        className={cn(
          "flex-1 w-full md:w-auto px-8 py-4 md:py-3 rounded-full transition-all duration-300 cursor-pointer relative",
          focusedSection === "location" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
        )}
        onMouseEnter={() => handleFocus("location")}
        onMouseLeave={handleBlur}
      >
        <label className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
          Where
        </label>
        <div className="flex items-center gap-3 text-stone-500">
          <MapPin className="w-5 h-5 text-terracotta-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400 w-full truncate font-medium text-base transition-colors"
          />
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-stone-200 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Date Section (Check-in/Out simplified for now) */}
      <div
        className={cn(
          "flex-1 w-full md:w-auto px-8 py-4 md:py-3 rounded-full transition-all duration-300 cursor-pointer relative",
          focusedSection === "dates" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
        )}
        onMouseEnter={() => handleFocus("dates")}
        onMouseLeave={handleBlur}
      >
        <label className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
          When
        </label>
        <div className="flex items-center gap-3 text-stone-500">
          <Calendar className="w-5 h-5 text-terracotta-500" />
          <div className="flex flex-col">
            <input 
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-bold text-stone-900"
            />
            <input 
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-bold text-stone-900"
            />
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-stone-200 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Guests Section */}
      <div
        className={cn(
          "flex-[1.2] w-full md:w-auto pl-8 pr-3 py-4 md:py-2 rounded-full transition-all duration-300 cursor-pointer flex justify-between items-center",
          focusedSection === "guests" ? "bg-white shadow-md z-10" : "hover:bg-stone-100/50"
        )}
        onMouseEnter={() => handleFocus("guests")}
        onMouseLeave={handleBlur}
      >
        <div>
          <label className="block text-[11px] font-bold text-forest-950 uppercase tracking-widest mb-1.5">
            Who
          </label>
          <div className="flex items-center gap-3 text-stone-500">
            <Users className="w-5 h-5 text-terracotta-500" />
            <input 
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-stone-900 font-medium text-base w-12"
            />
          </div>
        </div>

        <Button
          onClick={handleSearch}
          size="lg"
          className="w-14 h-14 md:w-auto md:h-14 p-0 md:px-8 rounded-full ml-4 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-terracotta-600 hover:bg-terracotta-700 border-none"
        >
          <Search className="w-5 h-5 text-white" />
          <span className="hidden md:inline font-bold text-white text-base">Search</span>
        </Button>
      </div>
    </div>
  );
}
