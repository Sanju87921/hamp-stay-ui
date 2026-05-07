"use client";

import React from "react";
import { ShieldCheck, Star, Award, Zap, Compass, Heart } from "lucide-react";
import { cn } from "@/utils/cn";

const BADGE_CONFIG: Record<string, { icon: any, color: string, bg: string, border: string }> = {
  "Hampi Explorer": { 
    icon: Compass, 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    border: "border-amber-100" 
  },
  "Luxury Nomad": { 
    icon: Star, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50", 
    border: "border-indigo-100" 
  },
  "Verified Partner": { 
    icon: ShieldCheck, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    border: "border-emerald-100" 
  },
  "Certified Partner": { 
    icon: Award, 
    color: "text-gold-600", 
    bg: "bg-gold-50", 
    border: "border-gold-100" 
  },
  "Dev Root": { 
    icon: Zap, 
    color: "text-violet-600", 
    bg: "bg-violet-50", 
    border: "border-violet-100" 
  },
  "System Root": { 
    icon: Zap, 
    color: "text-indigo-400", 
    bg: "bg-indigo-500/10", 
    border: "border-indigo-500/20" 
  }
};

export function UserBadge({ badge, className }: { badge: string, className?: string }) {
  const config = BADGE_CONFIG[badge] || { 
    icon: Award, 
    color: "text-slate-600", 
    bg: "bg-slate-50", 
    border: "border-slate-100" 
  };
  
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      config.bg,
      config.color,
      config.border,
      className
    )}>
      <Icon className="w-3 h-3" />
      {badge}
    </div>
  );
}

export function BadgeList({ badges, className }: { badges: string[], className?: string }) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <UserBadge key={badge} badge={badge} />
      ))}
    </div>
  );
}
