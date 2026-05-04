import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Luxury Villas" },
  { value: "10k+", label: "Happy Guests" },
  { value: "15+", label: "Curated Experiences" },
  { value: "4.9", label: "Average Rating" },
];

export function Statistics() {
  return (
    <section className="py-32 bg-sand-100 relative overflow-hidden">
      {/* Subtle top/bottom borders with gradients */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className="flex flex-col items-center group"
            >
              <div className="text-5xl md:text-6xl font-serif font-bold text-gold-600 mb-3 group-hover:scale-105 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-navy-950/50 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
