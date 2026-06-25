"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    // If they are already logged in, redirect them
    if (localStorage.getItem("tribetoy_logged_in") === "true") {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && name) {
      // Trigger beautiful welcome animation for signup
      setShowWelcome(true);
      localStorage.setItem("tribetoy_logged_in", "true");
      localStorage.setItem("tribetoy_user_name", name);
      
      setTimeout(() => {
        router.push(redirectTo);
      }, 3500); // Wait for animation to finish
    } else {
      // Simple login
      localStorage.setItem("tribetoy_logged_in", "true");
      router.push(redirectTo);
    }
  };

  const handleGuest = () => {
    localStorage.setItem("tribetoy_logged_in", "true");
    router.push(redirectTo);
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f4f5f4] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] bg-[#4a5d4e]/10 rounded-full blur-[100px]"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-8 border border-black/5"
          >
            <Sparkles className="w-10 h-10 text-[#4a5d4e]" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black text-[#1a1a1a] mb-4 tracking-tight">
            Welcome to the Tribe, <br/>
            <span className="text-[#4a5d4e] italic">{name}!</span>
          </h1>
          <p className="text-xl text-[#5a6b5e] font-medium">Taking you to checkout...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand/Image */}
        <div className="w-full md:w-5/12 bg-[#f4f5f4] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4a5d4e]/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <Link href="/" className="flex items-center gap-3 relative z-10 w-max">
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm overflow-hidden flex items-center justify-center">
              <Image src="/logo-new.jpg" alt="Logo" width={40} height={40} className="object-cover scale-[1.15]" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#1a1a1a]">
              Tribe<span className="text-[#4a5d4e]">Toy</span>
            </span>
          </Link>

          <div className="relative z-10 mt-12 md:mt-24">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4 leading-tight">
              {isLogin ? "Welcome back to your creative journey." : "Join the sustainable 3D printing revolution."}
            </h2>
            <p className="text-[#5a6b5e] text-sm font-medium leading-relaxed">
              Unlock exclusive customization tools, track your bulk orders, and earn points on every eco-friendly toy.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-[#1a1a1a]">{isLogin ? "Sign In" : "Create Account"}</h3>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#8a958c] font-bold text-xs uppercase tracking-widest hover:text-[#4a5d4e] transition-colors"
            >
              {isLogin ? "Sign Up instead" : "Sign In instead"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a958c]" />
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe" 
                      className="w-full pl-14 pr-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a958c]" />
                <input 
                  required
                  type="email" 
                  placeholder="jane@example.com" 
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8a958c]" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="mt-4 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px bg-black/10 flex-grow" />
            <span className="text-[#8a958c] text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="h-px bg-black/10 flex-grow" />
          </div>

          <button 
            onClick={handleGuest}
            className="mt-8 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-black/10 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.1em] hover:bg-black/5 transition-all duration-300"
          >
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
}
