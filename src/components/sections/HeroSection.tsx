"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const revealVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-background overflow-hidden pt-28 pb-8">
      
      {/* Refined Decorative Light Background Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#79987A] blur-[120px] pointer-events-none" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D87D8A] blur-[120px] pointer-events-none" 
      />

      {/* Content Container */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full h-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16 h-full">
          
          {/* Left Side: Typography */}
          <motion.div 
            className="flex flex-col items-start text-left w-full md:w-[55%]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Badge - Elegant Pill */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/20 bg-white/70 backdrop-blur-xl mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(121,152,122,0.1)] transition-shadow duration-500 cursor-default group"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(216,125,138,0.8)]"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-secondary uppercase">
                Ideas. Layer by Layer.
              </span>
            </motion.div>

            {/* Headline - Cinematic Reveal */}
            <div className="mb-6">
              <div className="overflow-hidden pb-2">
                <motion.h1 
                  variants={revealVariants}
                  className="text-5xl sm:text-6xl md:text-[4.5rem] lg:text-[6rem] font-heading font-black tracking-tighter leading-[0.9] text-foreground drop-shadow-sm origin-bottom"
                >
                  PRINT BEYOND
                </motion.h1>
              </div>
              <div className="overflow-hidden pb-4 mt-1">
                <motion.div variants={revealVariants} className="relative inline-block origin-bottom">
                  {/* Background glow for the text */}
                  <span className="absolute inset-0 bg-primary blur-[40px] opacity-20 rounded-full scale-110"></span>
                  {/* Animated gradient text */}
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_6s_linear_infinite] drop-shadow-md text-5xl sm:text-6xl md:text-[4.5rem] lg:text-[6rem] font-heading font-black tracking-tighter leading-[0.9]">
                    IMAGINATION.
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Paragraph - Refined Typography */}
            <motion.p 
              variants={itemVariants}
              className="max-w-md text-base sm:text-lg text-foreground/60 mb-10 leading-relaxed font-medium tracking-wide"
            >
              From personalized gifts and home decor to prototypes and custom creations, we turn your ideas into beautifully crafted <strong className="font-bold text-foreground/80">3D reality</strong>.
            </motion.p>

            {/* CTA Buttons - Premium Interaction */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/shop" className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(121,152,122,0.25)] hover:shadow-[0_15px_30px_rgba(46,77,48,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm tracking-wide">
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORE PRODUCTS
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] rounded-full" />
              </Link>
              
              <Link href="/customization" className="group w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-foreground font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 border border-black/5 hover:border-primary/30 hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(121,152,122,0.1)] hover:-translate-y-0.5 text-sm">
                <span className="relative z-10 flex items-center gap-2 tracking-wider">
                  START CUSTOM PRINT
                  <Sparkles size={14} className="text-accent group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>

            {/* Features - Minimalist Details */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-8"
            >
              <div className="flex flex-col gap-1 relative pl-4 border-l-2 border-primary/20 hover:border-primary/60 transition-colors duration-300">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">Premium Quality</span>
                <span className="text-[11px] text-foreground/50 font-semibold tracking-wide">Top-grade materials</span>
              </div>
              <div className="flex flex-col gap-1 relative pl-4 border-l-2 border-accent/20 hover:border-accent/60 transition-colors duration-300">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.15em]">Custom Made</span>
                <span className="text-[11px] text-foreground/50 font-semibold tracking-wide">Endless possibilities</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Side: Video Container - Floating & Premium */}
          <motion.div 
            className="w-full md:w-[45%] h-[400px] md:h-[550px] relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-[6px] border-white/80 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -15, 0] // Floating effect
            }}
            transition={{ 
              opacity: { delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              scale: { delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              rotate: { delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              y: { 
                delay: 1.6, 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
          >
            {/* Inner glass overlay for screen reflection effect */}
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none rounded-[2rem]" />
            
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover object-center scale-105"
            >
              <source src="/3D_printer_printing_glowing_heart.mp4" type="video/mp4" />
            </video>
            
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none z-20" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
