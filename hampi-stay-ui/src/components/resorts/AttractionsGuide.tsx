// ============================================================
// AttractionsGuide — Nearby Hampi heritage attractions
// Displayed on the Resort Detail page.
// ============================================================

import { MapPin, Footprints } from "lucide-react";
import { motion } from "framer-motion";
import type { NearbyAttraction } from "../../types/resort";

const TYPE_ICONS: Record<NearbyAttraction["type"], string> = {
  temple: "🛕",
  lake: "🌊",
  ruins: "🏛️",
  market: "🏪",
  viewpoint: "🔭",
  activity: "🚣",
};

interface AttractionsGuideProps {
  attractions: NearbyAttraction[];
}

export function AttractionsGuide({ attractions }: AttractionsGuideProps) {
  if (!attractions || attractions.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="w-6 h-6 text-terracotta-600" />
        <h2 className="text-2xl font-bold font-serif text-forest-950">Nearby Attractions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {attractions.map((attraction, i) => (
          <motion.div
            key={attraction.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 bg-sand-50 rounded-2xl p-5 border border-stone-100 hover:border-terracotta-200 transition-colors group"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
              {TYPE_ICONS[attraction.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-forest-950 text-base leading-snug">{attraction.name}</h4>
                <div className="flex items-center gap-1 flex-shrink-0 text-stone-500">
                  <Footprints className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{attraction.distanceKm} km</span>
                </div>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{attraction.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
