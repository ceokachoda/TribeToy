"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const urlError = searchParams.get("error");
  const showWelcomeFlag = searchParams.get("welcome") === "true";

  useEffect(() => {
    if (urlError) {
      if (urlError === "auth_callback_failed") {
        setError("Authentication failed. Please try again.");
      } else {
        setError(urlError);
      }
    }
  }, [urlError]);

  useEffect(() => {
    // If they are already logged in, redirect them
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (showWelcomeFlag) {
          setName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User");
          showToast("Signed in successfully", "success");
          setShowWelcome(true);
          setTimeout(() => {
            router.push(redirectTo);
          }, 3500);
        } else {
          router.push(redirectTo);
        }
      }
    };
    checkUser();
  }, [router, redirectTo, showWelcomeFlag, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const supabase = createClient();

    if (!isLogin) {
      // Signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      // Trigger beautiful welcome animation for signup
      setShowWelcome(true);
      setTimeout(() => {
        router.push(redirectTo);
      }, 3500); // Wait for animation to finish
    } else {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      showToast("Signed in successfully", "success");
      setName(data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || "User");
      setShowWelcome(true);
      setTimeout(() => {
        router.push(redirectTo);
      }, 3500);
    }
  };

  const handleGuest = () => {
    router.push(redirectTo);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
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
          <span className="font-heading font-extrabold text-7xl md:text-9xl tracking-tighter text-[#1a1a1a] mb-6 drop-shadow-2xl">
            Tribe<span className="text-[#4a5d4e]">Toy</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-[#5a6b5e] tracking-tight">
            Welcome, <span className="text-[#1a1a1a] italic">{name}</span>!
          </h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Brand/Image */}
        <div className="w-full md:w-5/12 p-10 md:p-14 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 z-0">
            <Image src="/ghibli_hero_v2.png" alt="TribeToy Background" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-[#1a1a1a]/80" />
          </div>
          
          <Link href="/" className="flex items-center gap-2 relative z-10 w-max group">
            <span className="font-heading font-extrabold text-3xl tracking-tight text-white drop-shadow-md">
              Tribe<span className="text-primary group-hover:text-white transition-colors duration-300">Toy</span>
            </span>
          </Link>

          <div className="relative z-10 mt-auto pt-20">
            <h2 className="text-4xl font-black text-white mb-4 leading-[1.1] drop-shadow-md">
              {isLogin ? "Welcome back to your creative journey." : "Join the sustainable 3D printing revolution."}
            </h2>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[90%]">
              Unlock exclusive customization tools, track your bulk orders, and earn points on every eco-friendly toy.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-10 md:p-16 lg:p-20 flex flex-col justify-center">
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
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
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

          <div className="mt-8 flex flex-col gap-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-black/10 bg-white text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#f4f5f4] hover:shadow-sm transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <button 
              onClick={handleGuest}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-black/10 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.1em] hover:bg-black/5 transition-all duration-300"
            >
              Continue as Guest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
