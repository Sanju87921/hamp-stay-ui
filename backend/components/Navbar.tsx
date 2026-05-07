"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { BadgeList } from "./ui/UserBadge";
import { NotificationTray } from "./NotificationTray";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Resorts", path: "/resorts" },
    { name: "Experiences", path: "/experiences" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out",
        isScrolled
          ? "bg-sand-50/90 backdrop-blur-2xl border-b border-sand-200/60 shadow-sm py-2"
          : "bg-gradient-to-b from-navy-950/80 via-navy-950/30 to-transparent py-4 md:py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between relative">

          {/* Logo (Left) — Image logo */}
          <Link href="/" className="flex items-center group z-10">
            <Image
              src="/logo-full.png"
              alt="HampiStays"
              width={180}
              height={64}
              className={cn(
                "h-14 md:h-16 w-auto object-contain transition-all duration-500",
                !isScrolled && "brightness-0 invert opacity-90 hover:opacity-100"
              )}
              priority
            />
          </Link>

          {/* Desktop Nav (Center) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative text-[13px] uppercase tracking-[0.15em] font-semibold transition-colors duration-300 group py-2",
                    isScrolled
                      ? "text-navy-900 hover:text-gold-600"
                      : "text-white/90 hover:text-gold-400"
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-[2px] rounded-full transform origin-left transition-transform duration-300 ease-out",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      isScrolled ? "bg-gold-500" : "bg-gold-400"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions (Right) */}
          <div className="hidden md:flex items-center gap-5 z-10">
            {status === "authenticated" ? (
              <div className="flex items-center gap-6">
                <NotificationTray isScrolled={isScrolled} />
                {session.user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/admin-x7k"
                    className={cn(
                      "text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white",
                      isScrolled ? "opacity-100" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    DevOS
                  </Link>
                )}
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[13px] font-bold tracking-tight",
                    isScrolled ? "text-navy-950" : "text-white"
                  )}>
                    {session.user.name}
                  </span>
                  <BadgeList badges={session.user.badges} className="mt-1" />
                </div>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-[13px] uppercase tracking-[0.1em] font-semibold transition-colors duration-300 hover:opacity-70",
                    isScrolled ? "text-navy-900" : "text-white"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className={cn(
                    "text-[13px] uppercase tracking-[0.1em] font-semibold transition-colors duration-300 hover:opacity-70",
                    isScrolled ? "text-navy-900" : "text-white"
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                  className={cn(
                    "text-[13px] uppercase tracking-[0.1em] font-semibold transition-colors duration-300 hover:opacity-70",
                    isScrolled ? "text-navy-900" : "text-white"
                  )}
                >
                  Log in
                </Link>
              )}
              <Button
                variant="primary"
                size="sm"
                className={cn(
                  "transition-all duration-500 hover:-translate-y-0.5 border-none uppercase tracking-widest text-[11px] font-bold",
                  isScrolled
                    ? "bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 shadow-luxury"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-gold-500/90 hover:text-navy-950"
                )}
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 z-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={cn("w-6 h-6", isScrolled ? "text-navy-950" : "text-white")} />
              ) : (
                <Menu className={cn("w-6 h-6", isScrolled ? "text-navy-950" : "text-white")} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-sand-50/95 backdrop-blur-2xl shadow-luxury border-t border-sand-200/50 flex flex-col md:hidden overflow-hidden"
            >
              <div className="py-6 px-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-navy-950 font-serif text-2xl font-bold border-b border-sand-200 pb-4 hover:text-gold-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-4 mt-2">
                  {status === "authenticated" ? (
                    <>
                      {session.user.role === "SUPER_ADMIN" && (
                        <Link
                          href="/admin-x7k"
                          className="text-center font-bold text-indigo-600 py-3 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors uppercase tracking-widest text-[10px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Access DevOS Portal
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="text-center font-semibold text-navy-950 py-3 rounded-xl border border-sand-200 hover:border-gold-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="text-center font-semibold text-navy-950 py-3 rounded-xl border border-sand-200 hover:border-gold-400 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="text-center font-semibold text-navy-950 py-3 rounded-xl border border-sand-200 hover:border-gold-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                <Button size="lg" className="w-full border-none uppercase tracking-widest text-[11px] font-bold">
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
