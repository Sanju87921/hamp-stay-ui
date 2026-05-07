"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-950/40 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto glass-dark p-12 md:p-16 rounded-[3rem] shadow-luxury"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-terracotta-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 block"
          >
            Your Journey Awaits
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
            Begin Your Royal Retreat
          </h2>
          <p className="text-xl text-sand-200/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive membership for early access to seasonal packages and bespoke experiences tailored perfectly for your desires.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white border-none shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-full px-10 h-14 text-lg">
              Explore Packages
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-full px-10 h-14 text-lg">
              Contact Concierge
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
