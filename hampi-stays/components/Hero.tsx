"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { SearchBar } from "./SearchBar";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-forest-950">
      {/* Background Parallax Image */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/20 to-forest-950/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Floating Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terracotta-500/20 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-forest-400/20 rounded-full blur-[120px] animate-float-slow pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl flex flex-col items-center"
        >
          <motion.span
            variants={textVariant}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass text-white text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-terracotta-400 animate-pulse" />
            Welcome to Hampi
          </motion.span>

          <motion.h1
            variants={textVariant}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-6 text-shadow-lg"
          >
            Discover Ancient <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand-200 to-terracotta-200 italic font-medium pr-2">
              Luxury
            </span>
          </motion.h1>

          <motion.p
            variants={textVariant}
            className="text-lg md:text-2xl text-sand-50/90 font-medium max-w-2xl mx-auto mb-16 text-shadow-md leading-relaxed"
          >
            Experience the grandeur of the Vijayanagara Empire seamlessly blended with world-class eco-hospitality.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl relative z-20"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-50 to-transparent z-10" />
    </div>
  );
}
