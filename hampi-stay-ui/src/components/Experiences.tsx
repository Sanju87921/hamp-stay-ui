import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "../utils/cn";

const experiences = [
  {
    id: 1,
    title: "Heritage Cycle Tour",
    subtitle: "Full Day · Village & Ruins",
    description:
      "Pedal through the ancient bazaar, the Royal Enclosure, and forgotten village paths that no car can reach. See Hampi the way the Vijayanagara people did — at ground level.",
    image:
      "https://images.unsplash.com/photo-1588319648913-0ff4b76a9fed?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Archaeology Deep Dive",
    subtitle: "3 hrs · Field Archaeologist",
    description:
      "Join a private tour led by a field archaeologist to explore the Queen's Bath, Elephant Stables, and the underground Prasanna Virupaksha — sites most tourists never reach.",
    image:
      "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Boulder Sunrise Trek",
    subtitle: "2 hrs · Matanga Hill",
    description:
      "Rise before dawn and trek to the summit of Matanga Hill for the most breathtaking 360° panorama in all of Hampi — ancient ruins glowing gold as the sun emerges over the plains.",
    image:
      "https://images.unsplash.com/photo-1596018382916-56d2e341d784?q=80&w=2070&auto=format&fit=crop",
  },
];

export function Experiences() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-32 md:py-48 bg-sand-100 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-600 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6 block"
          >
            Immersive Activities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-navy-950 font-bold mb-8 leading-[1.1]"
          >
            Beyond Accommodation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-editorial"
          >
            Three signature experiences curated by local experts — designed 
            to grant you exclusive access to the heart of the Vijayanagara empire.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {experiences.map((exp, index) => {
            const isExpanded = expanded === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setExpanded(isExpanded ? null : exp.id)}
                className={cn(
                  "group relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-md hover:shadow-luxury transition-all duration-700 hover:-translate-y-2",
                  "h-96 md:aspect-[3/4] md:h-auto"
                )}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/60 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Subtitle chip */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-medium tracking-wide text-xs px-4 py-2 rounded-full border border-white/20 shadow-sm">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-gold-400" />
                    {exp.subtitle}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-20">
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] leading-tight text-shadow-md">
                    {exp.title}
                  </h3>

                  {/* On mobile: always visible when expanded; on md+: hover reveal */}
                  <p
                    className={cn(
                      "text-sand-100/90 font-light leading-[1.8] mb-6 text-sm lg:text-base transition-all duration-700 ease-[0.16,1,0.3,1]",
                      "block md:hidden",
                      isExpanded ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"
                    )}
                  >
                    {exp.description}
                  </p>
                  <p className="hidden md:block text-sand-100/90 font-light leading-[1.8] mb-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-100 ease-[0.16,1,0.3,1] text-base">
                    {exp.description}
                  </p>

                  <div
                    className={cn(
                      "flex items-center text-gold-400 font-bold uppercase tracking-[0.2em] text-xs",
                      "md:opacity-0 md:group-hover:opacity-100 md:translate-y-6 md:group-hover:translate-y-0 md:transition-all md:duration-700 md:delay-150",
                      isExpanded ? "opacity-100" : "opacity-70"
                    )}
                  >
                    <span>Reserve Experience</span>
                    <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
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
