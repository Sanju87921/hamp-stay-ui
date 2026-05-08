"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPin, ArrowLeft, Luggage, Key, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { register } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

type UserRole = "guest" | "owner" | null;

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError("An error occurred during authentication. Please try again.");
    }
  }, [searchParams]);

  const handleNext = () => {
    if (role) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to the terms");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      });

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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-sand-50 relative overflow-hidden">
      {/* Ambient Blur Orbs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-forest-300/30 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-terracotta-200/30 rounded-full blur-[100px] pointer-events-none animate-float" />

      {/* Right Panel: Cinematic Image */}
      <div className="relative w-full md:w-1/2 h-[35vh] md:h-screen overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Resort"
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
              Begin your <br />
              <span className="text-sand-200 italic">Journey</span>
            </h2>
            <p className="text-sand-100 max-w-md leading-relaxed text-shadow-md">
              Join our exclusive community of luxury travelers and premium resort owners in the heart of Hampi.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Left Panel: Glassmorphism Form */}
      <div className="relative w-full md:w-1/2 h-full min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 z-10 -mt-10 md:mt-0">
        <motion.div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-luxury border border-white/50 relative overflow-hidden">
          {/* Back button */}
          <button
            onClick={() => (step === 2 ? setStep(1) : router.back())}
            className="absolute top-8 left-8 text-stone-400 hover:text-stone-800 transition-colors z-20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-8 mt-4 relative z-10">
            <Link href="/">
              <div className="w-14 h-14 rounded-full bg-forest-700 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                className="relative z-10"
              >
                <motion.div variants={itemVariant} className="text-center mb-10">
                  <h1 className="text-3xl font-serif font-bold text-forest-950 mb-3">Join HampiStays</h1>
                  <p className="text-stone-500 font-medium">How would you like to use our platform?</p>
                </motion.div>

                <motion.div variants={itemVariant} className="grid grid-cols-1 gap-4 mb-8">
                  {/* Traveller Card */}
                  <div
                    onClick={() => setRole("guest")}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group bg-white/50 backdrop-blur-sm",
                      role === "guest" ? "border-terracotta-500 shadow-md scale-[1.02]" : "border-white hover:border-terracotta-300 hover:bg-white/80"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                        role === "guest" ? "bg-terracotta-100 text-terracotta-600" : "bg-stone-100 text-stone-500 group-hover:bg-terracotta-50 group-hover:text-terracotta-400"
                      )}>
                        <Luggage className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={cn("font-bold text-lg transition-colors", role === "guest" ? "text-terracotta-700" : "text-stone-800")}>Traveler</h3>
                        <p className="text-sm text-stone-500">I want to book luxury stays and experiences.</p>
                      </div>
                    </div>
                    {role === "guest" && (
                      <motion.div layoutId="check" className="absolute top-4 right-4 text-terracotta-500">
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Owner Card */}
                  <div
                    onClick={() => setRole("owner")}
                    className={cn(
                      "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group bg-white/50 backdrop-blur-sm",
                      role === "owner" ? "border-forest-500 shadow-md scale-[1.02]" : "border-white hover:border-forest-300 hover:bg-white/80"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                        role === "owner" ? "bg-forest-100 text-forest-600" : "bg-stone-100 text-stone-500 group-hover:bg-forest-50 group-hover:text-forest-400"
                      )}>
                        <Key className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={cn("font-bold text-lg transition-colors", role === "owner" ? "text-forest-700" : "text-stone-800")}>Resort Owner</h3>
                        <p className="text-sm text-stone-500">I want to list my premium property.</p>
                      </div>
                    </div>
                    {role === "owner" && (
                      <motion.div layoutId="check2" className="absolute top-4 right-4 text-forest-500">
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={itemVariant}>
                  <Button
                    className={cn(
                      "w-full h-14 text-lg shadow-luxury transition-all duration-300",
                      role === "guest"
                        ? "bg-terracotta-600 hover:bg-terracotta-700"
                        : role === "owner"
                        ? "bg-forest-700 hover:bg-forest-800"
                        : "bg-stone-300 pointer-events-none text-stone-500 shadow-none"
                    )}
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                </motion.div>

                <motion.div variants={itemVariant} className="mt-8">
                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="flex-shrink-0 mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
                    <div className="flex-grow border-t border-stone-200"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <button 
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex items-center justify-center gap-2 h-12 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:shadow-sm transition-all duration-300"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      <span className="text-sm font-bold text-stone-700">Continue with Google</span>
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariant} className="text-center mt-10">
                  <p className="text-stone-500 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-forest-700 font-bold hover:text-terracotta-600 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                variants={staggerContainer}
                initial={{ opacity: 0, x: 50 }}
                animate="show"
                exit={{ opacity: 0, x: -50 }}
                className="relative z-10"
              >
                <motion.div variants={itemVariant} className="text-center mb-8">
                  <h1 className="text-3xl font-serif font-bold text-forest-950 mb-2">Create Account</h1>
                  <p className="text-stone-500 font-medium">
                    As a {role === "guest" ? "Premium Traveler" : "Resort Partner"}
                  </p>
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
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                  />

                  <div className="pt-2 pb-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className={cn(
                          "mt-1 w-4 h-4 rounded border-stone-300 transition-colors",
                          role === "guest" ? "text-terracotta-600 focus:ring-terracotta-500" : "text-forest-600 focus:ring-forest-500"
                        )}
                        checked={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors leading-relaxed">
                        I agree to the <a href="#" className="font-bold underline">Terms of Service</a> and <a href="#" className="font-bold underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full h-14 text-lg mt-2 shadow-luxury",
                      role === "guest" ? "bg-terracotta-600 hover:bg-terracotta-700" : "bg-forest-800 hover:bg-forest-950",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
