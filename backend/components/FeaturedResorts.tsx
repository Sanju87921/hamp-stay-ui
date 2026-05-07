"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";

const resorts = [
  {
    id: 1,
    name: "Evolve Back Kamalapura Palace",
    location: "Kamalapura, Hampi",
    price: "₹29,000",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=2070&auto=format&fit=crop",
    amenities: ["Private Pool", "Spa", "Fine Dining"],
    isPopular: true,
  },
  {
    id: 2,
    name: "Heritage Resort Hampi",
    location: "Hospet Road, Hampi",
    price: "₹18,000",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    amenities: ["Eco-friendly", "Guided Tours", "Organic Food"],
    isPopular: false,
  },
  {
    id: 3,
    name: "Boulders Resort & Spa",
    location: "Tungabhadra River, Hampi",
    price: "₹23,000",
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
    amenities: ["River View", "Wellness Center", "Yoga"],
    isPopular: true,
  },
];

export function FeaturedResorts() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-32 bg-sand-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-terracotta-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-terracotta-600 font-bold tracking-[0.15em] uppercase text-sm mb-4 block"
            >
              Exclusive Properties
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-950 font-bold mb-6 leading-tight"
            >
              Handpicked Sanctuaries
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-stone-600 max-w-2xl leading-relaxed"
            >
              Discover our curated selection of luxury properties that offer the perfect blend of modern comfort and profound heritage charm.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" className="border-forest-700 text-forest-900 hover:bg-forest-900 hover:text-white transition-all duration-300">
              View All Properties
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resorts.map((resort, index) => {
            const isFav = favorites.includes(resort.id);
            return (
              <motion.div
                key={resort.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-500 cursor-pointer border border-stone-100 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resort.image}
                    alt={resort.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Top Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    {resort.isPopular && (
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-forest-900 uppercase tracking-wider shadow-sm">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <button
                      onClick={(e) => toggleFavorite(e, resort.id)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors shadow-sm group/btn"
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          isFav ? "fill-terracotta-500 text-terracotta-500 scale-110" : "text-white group-hover/btn:scale-110"
                        )}
                      />
                    </button>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Star className="w-4 h-4 text-terracotta-500 fill-terracotta-500" />
                    <span className="text-sm font-bold text-stone-900">{resort.rating}</span>
                    <span className="text-xs text-stone-500 font-medium">({resort.reviews})</span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-stone-500 mb-3">
                      <MapPin className="w-4 h-4 text-terracotta-500" />
                      <span className="text-sm font-medium tracking-wide">{resort.location}</span>
                    </div>

                    <h3 className="text-2xl font-bold font-serif text-forest-950 group-hover:text-terracotta-600 transition-colors duration-300 mb-6 leading-snug">
                      {resort.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {resort.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-4 py-1.5 bg-stone-50 text-stone-600 text-xs font-semibold rounded-lg border border-stone-100 transition-colors group-hover:bg-sand-50"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-stone-100">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-stone-400 uppercase tracking-widest font-bold mb-1">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-forest-950">{resort.price}</span>
                        <span className="text-sm font-medium text-stone-500">/night</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-forest-700 hover:text-white font-bold px-6 py-2 h-auto hover:bg-forest-900 transition-all duration-300 rounded-xl">
                      Explore
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
