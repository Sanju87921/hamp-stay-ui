import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Temple Trail Walk",
    subtitle: "4–5 hrs · Expert Guide Included",
    description:
      "Walk the sacred path through Virupaksha Temple, Vittala Temple, and the Lotus Mahal with a certified ASI heritage guide. Discover centuries of Vijayanagara craftsmanship up close.",
    // Virupaksha Temple gopuram — real Hampi landmark
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tungabhadra Coracle Ride",
    subtitle: "1 hr · Sunrise & Sunset Sessions",
    description:
      "Glide across the Tungabhadra on a traditional round coracle boat woven from bamboo and palm leaves. The only way to reach the boulder islands and hidden ghats of the river.",
    // River boat ride at sunset
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Boulder Sunrise Trek",
    subtitle: "2 hrs · Matanga Hill Summit",
    description:
      "Rise before dawn and trek to the summit of Matanga Hill for the most breathtaking 360° panorama in all of Hampi — ancient ruins glowing gold as the sun emerges over the plains.",
    // Hampi boulders landscape
    image: "https://images.unsplash.com/photo-1596018382916-56d2e341d784?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Heritage Cycle Tour",
    subtitle: "Full Day · Village & Ruins",
    description:
      "Pedal through the ancient bazaar, the Royal Enclosure, and forgotten village paths that no car can reach. See Hampi the way the Vijayanagara people did — at ground level.",
    // Rural Karnataka landscape with greenery
    image: "https://images.unsplash.com/photo-1588319648913-0ff4b76a9fed?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Bouldering Adventure",
    subtitle: "Half Day · All Skill Levels",
    description:
      "Hampi ranks among the top 5 bouldering destinations in Asia. Scale the iconic granite formations with local expert guides who know every route on these 500-million-year-old rocks.",
    // Rock climbing on granite
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2003&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Archaeology Deep Dive",
    subtitle: "3 hrs · With Field Archaeologist",
    description:
      "Join a private tour led by a field archaeologist to explore the Queen's Bath, Elephant Stables, and the underground Prasanna Virupaksha — sites most tourists never reach.",
    // Ancient Vijayanagara stone architecture
    image: "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?q=80&w=2070&auto=format&fit=crop",
  },
];

export function Experiences() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-terracotta-600 font-bold tracking-[0.15em] uppercase text-sm mb-4 block"
          >
            Immersive Activities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-950 font-bold mb-6 leading-tight"
          >
            Beyond Accommodation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-600 leading-relaxed"
          >
            Six signature experiences curated by local experts — from Vijayanagara heritage walks to river coracle rides — each one designed to leave you transformed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-luxury transition-shadow duration-500"
            >
              <img
                src={exp.image}
                alt={exp.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Subtitle chip */}
              <div className="absolute top-5 left-5">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                  <Clock className="w-3 h-3" />
                  {exp.subtitle}
                </span>
              </div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <h3 className="text-2xl font-serif font-bold text-white mb-3 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                  {exp.title}
                </h3>
                <p className="text-sand-100/90 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-[0.16,1,0.3,1] text-sm">
                  {exp.description}
                </p>

                <div className="flex items-center text-terracotta-400 font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-150 ease-[0.16,1,0.3,1]">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Discover More</span>
                    <span className="block absolute top-0 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">Discover More</span>
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
