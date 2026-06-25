"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-24 md:pt-0">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0 flex justify-end bg-background">
        <div className="w-full h-full md:w-[65%] relative">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-100 brightness-110"
          >
            <source src="/3D_printer_printing_glowing_heart.mp4" type="video/mp4" />
          </video>
          {/* Gradient mask to seamlessly blend the left edge of the video into the black background */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-start text-left pt-10 md:pt-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Ideas. Layer by Layer.</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            PRINT BEYOND <br />
            <span className="text-gradient">IMAGINATION.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-md text-lg text-foreground/70 mb-10 leading-relaxed"
          >
            From personalized gifts and home decor to prototypes and custom creations, we turn your ideas into beautifully crafted 3D reality.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/shop" className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] hover:scale-105 flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                EXPLORE PRODUCTS
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
            </Link>
            
            <Link href="/customization" className="group w-full sm:w-auto px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white/20">
              <span className="relative z-10 flex items-center gap-2 text-sm tracking-wider">
                START CUSTOM PRINT
                <Sparkles size={16} className="text-secondary" />
              </span>
            </Link>
          </motion.div>

          {/* Feature highlights below buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 grid grid-cols-2 gap-x-8 gap-y-4 opacity-70 hidden md:grid"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Premium Quality</span>
              <span className="text-xs text-foreground/60">Top-grade materials</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Custom Made</span>
              <span className="text-xs text-foreground/60">Endless possibilities</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer z-20"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Scroll to Discover</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
