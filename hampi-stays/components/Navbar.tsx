"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

import { useSession, signOut } from "next-auth/react";

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm py-4"
          : "bg-gradient-to-b from-black/50 to-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-white shadow-luxury transition-transform duration-300 group-hover:scale-105">
              <MapPin className="w-5 h-5" />
            </div>
            <span
              className={cn(
                "text-2xl font-serif font-bold tracking-tight transition-colors duration-300",
                isScrolled ? "text-forest-950" : "text-white"
              )}
            >
              HampiStays
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={cn(
                      "relative text-sm font-semibold tracking-wide transition-colors duration-300 group py-2",
                      isScrolled ? "text-stone-700 hover:text-forest-800" : "text-white/90 hover:text-white"
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-full h-[2px] rounded-full transform origin-left transition-transform duration-300 ease-out",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        isScrolled ? "bg-forest-700" : "bg-white"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
            <div
              className="flex items-center gap-6 border-l pl-8 transition-colors duration-300"
              style={{ borderColor: isScrolled ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" }}
            >
              {status === "authenticated" ? (
                <div className="flex items-center gap-4">
                  <span className={cn("text-sm font-bold", isScrolled ? "text-stone-800" : "text-white")}>
                    Hi, {session.user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300 hover:opacity-70",
                      isScrolled ? "text-stone-700" : "text-white"
                    )}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "text-sm font-semibold transition-colors duration-300 hover:opacity-70",
                    isScrolled ? "text-stone-700" : "text-white"
                  )}
                >
                  Log in
                </Link>
              )}
              <Button
                variant={isScrolled ? "primary" : "secondary"}
                size="sm"
                className={cn(
                  "shadow-luxury transition-all duration-300 hover:-translate-y-0.5",
                  !isScrolled && "bg-white text-forest-950 hover:bg-stone-50"
                )}
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={cn("w-6 h-6", isScrolled ? "text-stone-900" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", isScrolled ? "text-stone-900" : "text-white")} />
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
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-luxury border-t border-stone-100 flex flex-col md:hidden overflow-hidden"
          >
            <div className="py-6 px-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-stone-800 font-serif text-2xl font-semibold border-b border-stone-100 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-2">
                {status === "authenticated" ? (
                  <button
                    onClick={() => signOut()}
                    className="text-center font-semibold text-forest-700 py-3 rounded-xl border-2 border-forest-100"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-center font-semibold text-forest-700 py-3 rounded-xl border-2 border-forest-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                )}
                <Button size="lg" className="w-full shadow-luxury">Book Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
