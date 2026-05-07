"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { useResorts } from "@/hooks/useResorts";
import { ResortCard } from "@/components/resorts/ResortCard";
import { ResortFilters } from "@/components/resorts/ResortFilters";
import { SortBar } from "@/components/resorts/SortBar";
import { ResortMap } from "@/components/resorts/ResortMap";
import { CompareBar } from "@/components/resorts/CompareBar";
import type { FilterState, SortOption, CompareItem, Resort } from "@/types/resort";

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 60000,
  amenities: [],
  types: [],
  minRating: 0,
};

export default function ResortsClient() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = Number(searchParams.get("adults") ?? 1);
  const children = Number(searchParams.get("children") ?? 0);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("popularity");
  const [view, setView] = useState<"list" | "map">("list");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  const { resorts, total, isEmpty, maxPrice, isLoading } = useResorts({
    search: { location, checkIn, checkOut, adults, children },
    filters,
    sort,
  });

  const handleCompareToggle = useCallback((resort: Resort) => {
    setCompareItems((prev) => {
      const exists = prev.find((i) => i.resortId === resort.id);
      if (exists) return prev.filter((i) => i.resortId !== resort.id);
      if (prev.length >= 3) return prev;
      return [...prev, { resortId: resort.id, resortSlug: resort.slug, resortName: resort.name }];
    });
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-sand-50">
        <main className="flex-grow pt-20">
          {/* Search Header */}
          <div className="bg-navy-950 py-8 px-4">
            <div className="container mx-auto max-w-5xl">
              <SearchBar />
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-6 py-8">
            {/* Active Search Info */}
            {location && (
              <div className="flex items-center gap-2 mb-6 text-navy-950/60">
                <Search className="w-4 h-4" />
                <span className="text-sm">
                  Results for <strong className="text-navy-950">&ldquo;{location}&rdquo;</strong>
                </span>
              </div>
            )}

            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <ResortFilters filters={filters} onChange={setFilters} maxPrice={maxPrice} />
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Mobile Filter Button */}
                <div className="flex items-center gap-3 mb-4 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sand-200 bg-white text-navy-900 font-semibold text-sm hover:border-stone-400 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(filters.amenities.length + filters.types.length + (filters.minRating > 0 ? 1 : 0)) > 0 && (
                      <span className="bg-gold-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {filters.amenities.length + filters.types.length + (filters.minRating > 0 ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Sort Bar */}
                <SortBar sort={sort} onSortChange={setSort} view={view} onViewChange={setView} total={total} />

                {/* Map View */}
                {view === "map" && (
                  <div className="mt-6 rounded-3xl overflow-hidden border border-sand-200" style={{ height: "600px" }}>
                    <ResortMap resorts={resorts} className="w-full h-full" />
                  </div>
                )}

                {/* List View */}
                {view === "list" && (
                  <>
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="aspect-[4/5] bg-sand-200 animate-pulse rounded-3xl" />
                        ))}
                      </div>
                    ) : isEmpty ? (
                      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-sand-300 mt-6">
                        <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-sand-400" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-navy-950 mb-2">No resorts found</h3>
                        <p className="text-navy-950/50 max-w-xs mx-auto">
                          Try adjusting your filters or search area to find more results.
                        </p>
                        <button
                          onClick={() => setFilters({ minPrice: 0, maxPrice: maxPrice, amenities: [], types: [], minRating: 0 })}
                          className="mt-6 text-gold-600 font-bold text-sm uppercase tracking-wider hover:text-gold-700"
                        >
                          Clear all filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                        {resorts.map((resort, index) => (
                          <ResortCard
                            key={resort.id}
                            resort={resort}
                            index={index}
                            isInCompare={compareItems.some((i) => i.resortId === resort.id)}
                            onCompareToggle={handleCompareToggle}
                            compareDisabled={compareItems.length >= 3}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Filters Slide-In */}
      <ResortFilters
        filters={filters}
        onChange={setFilters}
        maxPrice={maxPrice}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />

      {/* Compare Bar */}
      <CompareBar
        items={compareItems}
        onRemove={(id) => setCompareItems((p) => p.filter((i) => i.resortId !== id))}
        onClear={() => setCompareItems([])}
      />
    </>
  );
}
