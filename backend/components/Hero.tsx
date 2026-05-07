"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { SearchBar } from "./SearchBar";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center bg-navy-950 z-30">
      {/* Background container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Parallax background */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
            style={{ backgroundImage: 'url("/chariot-bg.png")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/20 to-navy-950/85 pointer-events-none" />
          <div className="absolute inset-0 bg-navy-950/30 pointer-events-none" />
        </motion.div>

        {/* Floating ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gold-400/15 rounded-full blur-[80px] md:blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-sunset-500/10 rounded-full blur-[100px] md:blur-[120px] animate-float-slow pointer-events-none" />
      </div>

      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 flex flex-col items-center text-center pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl w-full flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.span
            variants={textVariant}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-6 sm:mb-8 cursor-default select-none"
          >
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse flex-shrink-0" />
            Welcome to Hampi
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={textVariant}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-4 sm:mb-6 text-shadow-lg"
          >
            Discover Ancient{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 italic font-medium pr-2">
              Luxury
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={textVariant}
            className="text-editorial-dark mb-8 sm:mb-10 px-2 text-shadow-md"
          >
            Experience the grandeur of the Vijayanagara Empire seamlessly
            blended with world-class eco-hospitality.
          </motion.p>

          {/* Brand tagline */}
          <motion.div
            variants={textVariant}
            className="flex items-center justify-center gap-4 mb-12 sm:mb-16 md:mb-20"
          >
            {["Stay", "Experience", "Remember"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.9 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-4"
              >
                <motion.span
                  whileHover={{
                    y: -3,
                    scale: 1.08,
                    color: "rgba(200, 169, 107, 1)",
                    textShadow: "0 0 20px rgba(200, 169, 107, 0.5)",
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="uppercase tracking-[0.35em] text-xs sm:text-sm font-semibold cursor-default select-none"
                  style={{ color: "rgba(200, 169, 107, 0.85)" }}
                >
                  {word}
                </motion.span>
                {i < 2 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 + i * 0.15 }}
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: "rgba(200, 169, 107, 0.5)" }}
                  />
                )}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl relative z-20"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Bottom fade to sandstone */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-sand-50 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
