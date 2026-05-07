"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mountain, Shield, Leaf, Heart, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const values = [
  {
    icon: Heart,
    title: "Passion for Heritage",
    desc: "Every property we list tells a story of the Vijayanagara empire and the timeless boulders of Hampi.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "Verified properties, honest reviews, and transparent pricing. No hidden fees, ever.",
    color: "text-gold-600",
    bg: "bg-gold-50",
  },
  {
    icon: Leaf,
    title: "Sustainable Tourism",
    desc: "We partner exclusively with eco-conscious properties committed to preserving Hampi's UNESCO environment.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Gem,
    title: "Curated Excellence",
    desc: "We accept fewer than 30% of applications to maintain our luxury and authenticity standard.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function AboutClient() {
  return (
    <main className="bg-sand-50 min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-navy-950">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 bg-gold-600/20 text-gold-400 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-gold-600/30">
              Our Origin
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-tight">
              Built on the banks <br /> of the <span className="text-gold-500 italic">Tungabhadra.</span>
            </h1>
            <p className="text-xl md:text-2xl text-sand-200/60 max-w-3xl mx-auto leading-relaxed font-light">
              Hampi isn't a destination you simply visit; it is a landscape you inhabit. 
              We are here to ensure you find your place within it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── THE STORY ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white bg-sand-200">
              <img 
                src="/home/amar/.gemini/antigravity/brain/1f1a9020-1e4f-439f-8e9f-018c2b7b1049/hampi_heritage_sunset_1778066735679.png" 
                alt="Hampi Heritage" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-950 mb-8 leading-tight">
                Finding the real Hampi <br /> was harder than it should be.
              </h2>
              <div className="space-y-6 text-navy-950/70 text-lg leading-relaxed">
                <p>
                  Three years ago, we'd visit Hampi and struggle to find anywhere that felt authentic. Search results were dominated by generic chains and replicas. The best stays—heritage properties, local guesthouses, thoughtfully-run villas—were scattered across WhatsApp groups and word-of-mouth.
                </p>
                <p>
                  We started documenting properties we believed in. Checked every detail. Stayed at them ourselves. Asked hard questions about water sourcing, local employment, and how they treat their staff. We realized there was a real gap: travelers wanted substance, but had no reliable way to find it.
                </p>
                <p>
                  HampiStays exists to close that gap. We vet every property. We verify reviews. We stay transparent about what we list and why.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-10 bg-white rounded-[40px] border border-sand-200 shadow-sm"
            >
              <h4 className="text-navy-950 font-bold uppercase tracking-widest text-[10px] mb-4">What We Believe</h4>
              <p className="text-navy-950 font-serif text-2xl leading-relaxed">
                Hampi works best when you stay with people who know it. Not people selling it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-sand-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-navy-950 mb-4">How we move</h2>
            <p className="text-navy-950/50">Four principles that guide every property we curate.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-sand-200/50 hover:shadow-luxury transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-6`}>
                  <value.icon className={`w-6 h-6 ${value.color}`} />
                </div>
                <h3 className="text-lg font-bold text-navy-950 mb-3">{value.title}</h3>
                <p className="text-sm text-navy-950/60 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-navy-950 rounded-[50px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">Ready to experience Hampi?</h2>
            <p className="text-xl text-sand-200/60 mb-12">Join thousands of travelers who have discovered the magic of Hampi through our curated collection.</p>
            
            <Link href="/resorts">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-12 py-5 rounded-full uppercase tracking-widest text-xs transition-all duration-500 hover:scale-105">
                Explore our handpicked collection
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
