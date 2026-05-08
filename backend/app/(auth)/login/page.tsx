"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

import { login } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "OAuthAccountNotLinked") {
      setError("This email is already associated with another login method.");
    } else if (urlError === "CredentialsSignin") {
      setError("Invalid email or password.");
    } else if (urlError) {
      setError("An error occurred during authentication. Please try again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sand-50 relative overflow-hidden">
      {/* Ambient Blur Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-terracotta-200/40 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-forest-200/40 rounded-full blur-[100px] pointer-events-none animate-float" />

      {/* Left Panel: Cinematic Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop"
          alt="Hampi Sunset"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-10 left-10 right-10 text-white z-10 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-4xl font-serif font-bold mb-4 leading-tight text-shadow-lg">
              Return to your <br />
              <span className="text-terracotta-300 italic">Sanctuary</span>
            </h2>
            <p className="text-sand-100 max-w-md leading-relaxed text-shadow-md">
              Sign in to manage your luxury experiences, upcoming stays, and exclusive member benefits.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Glassmorphism Form */}
      <div className="relative w-full md:w-1/2 h-full min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 z-10 -mt-10 md:mt-0">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-luxury border border-white/50 relative"
        >
          {/* Back button */}
          <Link href="/" className="absolute top-8 left-8 text-stone-400 hover:text-stone-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <motion.div variants={itemVariant} className="flex justify-center mb-8 mt-4">
            <div className="w-14 h-14 rounded-full bg-forest-700 flex items-center justify-center text-white shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-forest-950 mb-3">Welcome Back</h1>
            <p className="text-stone-500 font-medium">Please enter your details to sign in.</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.form variants={itemVariant} className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-terracotta-600 focus:ring-terracotta-500 transition-colors" disabled={isLoading} />
                <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-forest-700 hover:text-terracotta-600 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isLoading} className={cn("w-full h-14 text-lg mt-4 bg-forest-800 hover:bg-forest-950 shadow-luxury", isLoading && "opacity-50 cursor-not-allowed")}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </motion.form>

          <motion.div variants={itemVariant} className="mt-10">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink-0 mx-4 text-stone-400 text-sm font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button 
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 h-12 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:shadow-sm transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span className="text-sm font-bold text-stone-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-12 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:shadow-sm transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 opacity-80" alt="Apple" />
                <span className="text-sm font-bold text-stone-700">Apple</span>
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="text-center mt-10">
            <p className="text-stone-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-forest-700 font-bold hover:text-terracotta-600 transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
