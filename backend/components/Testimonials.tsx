"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Travel Blogger",
    content: "The perfect blend of luxury and nature. Waking up to the view of the Tungabhadra river from our eco-villa was surreal. HampiStays curated an unforgettable experience.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "David Chen",
    role: "Photography Enthusiast",
    content: "An architectural marvel that respects its surroundings. The guided temple trails they organized were exceptional. Highly recommend their premium suites.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-forest-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-forest-900 rounded-full blur-[150px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-terracotta-900/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-terracotta-500 font-bold tracking-[0.15em] uppercase text-sm mb-4 block"
            >
              Guest Stories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-sand-50 leading-tight"
            >
              Echoes of Delight
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-forest-200 text-lg mb-10 leading-relaxed"
            >
              Read what our esteemed guests have to say about their luxurious escapades in the heart of the Vijayanagara empire.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-3"
            >
              <div className="w-16 h-1 bg-terracotta-500 rounded-full" />
              <div className="w-3 h-1 bg-forest-700 rounded-full" />
              <div className="w-3 h-1 bg-forest-700 rounded-full" />
            </motion.div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="glass-dark p-10 rounded-[2rem] relative group hover:-translate-y-2 transition-transform duration-500"
              >
                <Quote className="w-12 h-12 text-terracotta-500/20 absolute top-8 right-8 transition-transform duration-500 group-hover:scale-110 group-hover:text-terracotta-500/30" />

                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-terracotta-400 fill-terracotta-400" />
                  ))}
                </div>

                <p className="text-sand-100/90 text-lg leading-relaxed mb-10 relative z-10 font-medium">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-5 pt-6 border-t border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover border-2 border-forest-700/50 p-0.5"
                  />
                  <div>
                    <h4 className="font-bold text-white tracking-wide">{testimonial.name}</h4>
                    <p className="text-forest-300 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
