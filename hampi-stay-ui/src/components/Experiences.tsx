import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Temple Trail Walk",
    description: "Guided tour through the ancient ruins and majestic temples of Vijayanagara, exploring forgotten architectural marvels.",
    image: "https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tungabhadra Coracle Ride",
    description: "A serene sunset ride on traditional circular boats across the river, surrounded by ancient boulders.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Bouldering Adventure",
    description: "Scale the unique granite rock formations that Hampi is world-famous for with our expert local guides.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2003&auto=format&fit=crop",
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
            Immerse yourself in the local culture, history, and nature with our curated signature experiences designed to make your stay unforgettable.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-luxury transition-shadow duration-500"
            >
              <img
                src={exp.image}
                alt={exp.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <h3 className="text-3xl font-serif font-bold text-white mb-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                  {exp.title}
                </h3>
                <p className="text-sand-100/90 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-[0.16,1,0.3,1]">
                  {exp.description}
                </p>
                
                <div className="flex items-center text-terracotta-400 font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-150 ease-[0.16,1,0.3,1]">
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
