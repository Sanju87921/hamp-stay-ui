// ============================================================
// useResorts — Filtered & Sorted Resort Hook
// Single source of truth for applying filters + sort.
// All filtering is client-side for now; swap getResorts() 
// with an API call later without touching any component.
// ============================================================

import { useMemo } from "react";
import { RESORTS } from "../data/resorts";
import type { Resort, FilterState, SortOption, SearchParams } from "../types/resort";

interface UseResortsOptions {
  search?: Partial<SearchParams>;
  filters?: Partial<FilterState>;
  sort?: SortOption;
}

const MAX_PRICE = 60000;

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: MAX_PRICE,
  amenities: [],
  types: [],
  minRating: 0,
};

export function useResorts({ search, filters, sort = "popularity" }: UseResortsOptions = {}) {
  const f: FilterState = { ...DEFAULT_FILTERS, ...filters };

  const filtered = useMemo(() => {
    return RESORTS.filter((resort) => {
      // Text search (location name or resort name)
      if (search?.location) {
        const q = search.location.toLowerCase();
        const haystack =
          `${resort.name} ${resort.location.area} ${resort.location.district}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Guest capacity: ensure at least one room can fit the party
      const totalGuests = (search?.adults ?? 0) + (search?.children ?? 0);
      if (totalGuests > 0) {
        const hasCapacity = resort.roomTypes.some((rt) => rt.capacity >= totalGuests);
        if (!hasCapacity) return false;
      }

      // Price range
      if (resort.pricePerNight < f.minPrice || resort.pricePerNight > f.maxPrice) {
        return false;
      }

      // Amenity filter (resort must have ALL selected amenities)
      if (f.amenities.length > 0) {
        const hasAll = f.amenities.every((a) => resort.amenities.includes(a));
        if (!hasAll) return false;
      }

      // Type filter
      if (f.types.length > 0) {
        if (!f.types.includes(resort.type)) return false;
      }

      // Rating filter
      if (resort.rating < f.minRating) return false;

      return true;
    });
  }, [search, f]);

  const sorted = useMemo((): Resort[] => {
    const arr = [...filtered];
    switch (sort) {
      case "price_asc":
        return arr.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case "price_desc":
        return arr.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "newest":
        return arr.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popularity":
      default:
        return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filtered, sort]);

  return {
    resorts: sorted,
    total: sorted.length,
    isEmpty: sorted.length === 0,
    maxPrice: MAX_PRICE,
  };
}
