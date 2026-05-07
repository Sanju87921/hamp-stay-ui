"use client";

import React from "react";
import type { User } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Hotel, 
  Calendar, 
  Settings, 
  LogOut, 
  Heart,
  TrendingUp
} from "lucide-react";
import { signOut } from "next-auth/react";
import { BadgeList } from "@/components/ui/UserBadge";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType;
}


interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
  user: User;
}

export function DashboardLayout({ children, role, user }: DashboardLayoutProps) {
  const pathname = usePathname();

  const travellerLinks: SidebarLink[] = [
    { label: "My Bookings", href: "/dashboard", icon: Calendar },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const ownerLinks: SidebarLink[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Resorts", href: "/dashboard/resorts", icon: Hotel },
    { label: "Inventory", href: "/dashboard/inventory", icon: Calendar },
    { label: "Earnings", href: "/dashboard/earnings", icon: TrendingUp },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const links = role === "RESORT_OWNER" ? ownerLinks : travellerLinks;

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-sand-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-sand-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-sand-100">
          <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Logged in as</p>
          <p className="font-bold text-navy-950 truncate">{user.name || user.email}</p>
          <div className="mt-2 space-y-2">
            <span className="inline-block px-2 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
              {role.replace("_", " ")}
            </span>
            <BadgeList badges={(user as any).badges} />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-navy-950 text-white shadow-lg shadow-navy-950/20"
                    : "text-navy-950/60 hover:bg-sand-100 hover:text-navy-950"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-gold-500" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sand-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
