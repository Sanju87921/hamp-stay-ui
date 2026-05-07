// ============================================================
// SortBar — Sort controls + view toggle (list/map)
// ============================================================

import { ArrowUpDown, LayoutGrid, Map } from "lucide-react";
import { cn } from "../../utils/cn";
import type { SortOption } from "../../types/resort";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

interface SortBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
  total: number;
}

export function SortBar({ sort, onSortChange, view, onViewChange, total }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-sand-100">
      <p className="text-sm text-navy-950/60 font-medium flex-shrink-0">
        <span className="font-bold text-navy-950">{total}</span> {total === 1 ? "property" : "properties"} found
      </p>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-navy-950/50" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm font-semibold text-navy-950 bg-transparent border-none outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-sand-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-label="List view"
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              view === "list" ? "bg-white shadow-sm text-navy-900" : "text-navy-950/50 hover:text-navy-950"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("map")}
            aria-label="Map view"
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              view === "map" ? "bg-white shadow-sm text-navy-900" : "text-navy-950/50 hover:text-navy-950"
            )}
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
