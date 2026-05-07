"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

export function AboutSection() {
  return (
    <section className="py-24 bg-sand-50 relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/home/amar/.gemini/antigravity/brain/1f1a9020-1e4f-439f-8e9f-018c2b7b1049/hampi_heritage_sunset_1778066735679.png" 
                alt="The landscape of Hampi" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Floating Detail Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-8 -right-8 bg-navy-950 p-8 rounded-[32px] shadow-luxury max-w-[280px] hidden md:block"
            >
              <p className="text-gold-500 font-serif italic text-lg mb-2">"The boulders speak if you listen long enough."</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">— Local Saying</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-5 py-2 bg-gold-600/10 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                Our Origin
              </span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-navy-950 leading-tight">
                Built on the banks of the Tungabhadra.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-xl text-navy-950/70 font-medium leading-relaxed">
                Hampi isn't a destination you simply visit; it is a landscape you inhabit. Yet, for years, finding a stay that reflected the true soul of this ancient capital was a matter of chance.
              </p>
              
              <div className="h-px w-20 bg-gold-600/30" />
              
              <p className="text-navy-950/60 leading-relaxed text-lg">
                HampiStays was born from a simple realization: the most authentic stays in this boulder-strewn valley were being lost in a sea of corporate hotel listings. We spent months on the ground exploring the granite hills to handpick a collection of stays that understand the rhythm of this city. We don't list every property; we only list the ones that belong here.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="p-8 bg-white rounded-[40px] border border-sand-200 shadow-sm"
            >
              <h4 className="text-navy-950 font-bold uppercase tracking-widest text-xs mb-3">Our Mission</h4>
              <p className="text-navy-950/80 italic font-serif text-lg leading-relaxed">
                "To return travel to its slow, intentional roots by connecting modern explorers with local hosts who treat hospitality as a craft."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="group border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white rounded-2xl px-8 py-4 transition-all duration-500 font-bold uppercase tracking-widest text-xs"
              >
                Discover the side of Hampi others miss
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
