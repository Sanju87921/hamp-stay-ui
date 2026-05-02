// ============================================================
// CompareBar — Fixed bottom tray showing resorts selected for 
// comparison. Shows up to 3 resorts, links to /resorts/compare
// ============================================================

import { Link } from "react-router-dom";
import { X, GitCompareArrows } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CompareItem } from "../../types/resort";

interface CompareBarProps {
  items: CompareItem[];
  onRemove: (resortId: string) => void;
  onClear: () => void;
}

export function CompareBar({ items, onRemove, onClear }: CompareBarProps) {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-luxury py-4 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-forest-950">
              <GitCompareArrows className="w-5 h-5 text-terracotta-600" />
              <span className="font-bold text-sm">
                Compare ({items.length}/3)
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 overflow-x-auto">
              {items.map((item) => (
                <div
                  key={item.resortId}
                  className="flex items-center gap-2 bg-sand-50 border border-stone-200 rounded-xl px-3 py-1.5 flex-shrink-0"
                >
                  <span className="text-sm font-semibold text-stone-800 max-w-[140px] truncate">
                    {item.resortName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.resortId)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {Array.from({ length: 3 - items.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center justify-center border-2 border-dashed border-stone-200 rounded-xl px-6 py-1.5 flex-shrink-0"
                >
                  <span className="text-xs text-stone-400 font-medium">Add resort</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-stone-500 font-semibold hover:text-red-500 transition-colors"
              >
                Clear
              </button>
              {items.length >= 2 ? (
                <Link
                  to={`/resorts/compare?ids=${items.map((i) => i.resortId).join(",")}`}
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Compare Now
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="bg-stone-200 text-stone-400 text-sm font-bold px-5 py-2.5 rounded-xl cursor-not-allowed"
                >
                  Select {2 - items.length} more
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
