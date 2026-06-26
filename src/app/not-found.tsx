"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f4f5f4] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl mix-blend-multiply" />
      
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-8xl md:text-[120px] font-black text-primary leading-none tracking-tighter mb-4">
            404
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-3xl shadow-xl w-full"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground mb-4">
            Oops! This page went missing.
          </h2>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto text-sm md:text-base">
            The toy you're looking for might have been moved, sold out, or perhaps it never existed. Let's get you back to playing!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-4 bg-white border border-foreground/10 text-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all shadow-sm group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#4a5d4e] transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 group"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
