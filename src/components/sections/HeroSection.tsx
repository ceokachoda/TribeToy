"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { products } from "@/data/products";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
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
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-background overflow-hidden pt-20 md:pt-28 pb-4 md:pb-8">
      
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
          
          {/* Left Side: Typography - Desktop Only */}
          <motion.div 
            className="hidden md:flex flex-col items-start text-left w-full md:w-[55%]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Badge - Elegant Pill */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-primary/20 bg-white/70 backdrop-blur-xl mb-4 md:mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(121,152,122,0.1)] transition-shadow duration-500 cursor-default group"
            >
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(216,125,138,0.8)]"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-secondary uppercase">
                Welcome to Tribe Toy
              </span>
            </motion.div>

            {/* Headline */}
            <div className="mb-6 flex flex-col items-start">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-[4rem] font-heading font-black tracking-tighter leading-[1.05] text-foreground drop-shadow-sm pb-1 md:pb-2"
              >
                Eco-Friendly Toys.<br />
                Powered by Innovation.<br />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_6s_linear_infinite] drop-shadow-md pr-2">
                  Made with Care.
                </span>
              </motion.h1>
            </div>

            <motion.p 
              variants={itemVariants}
              className="max-w-md text-sm md:text-lg text-foreground/60 mb-6 md:mb-10 leading-relaxed font-medium tracking-wide"
            >
              Bringing stories to life through sustainable 3D-printed and hand-painted toys
            </motion.p>

            {/* CTA Buttons - Premium Interaction */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-3 md:gap-5 w-full sm:w-auto mt-2 md:mt-6"
            >
              {/* Primary Button */}
              <Link href="/shop" className="group relative w-full sm:w-auto px-9 py-4 rounded-full flex items-center justify-center gap-3">
                {/* Core Background */}
                <div className="absolute inset-0 bg-secondary rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] opacity-80" />
                </div>
                
                {/* Ripple Effect on Hover */}
                <div className="absolute inset-0 rounded-full border-2 border-primary scale-[0.8] opacity-0 group-hover:scale-[1.3] group-hover:opacity-0 transition-all duration-700 ease-out pointer-events-none" />
                <div className="absolute inset-0 rounded-full border-2 border-primary scale-[0.8] opacity-0 group-hover:scale-[1.5] group-hover:opacity-0 transition-all duration-1000 delay-100 ease-out pointer-events-none" />
                
                {/* Button Content */}
                <span className="relative z-10 text-white font-black tracking-[0.15em] text-xs sm:text-sm drop-shadow-sm">
                  EXPLORE PRODUCTS
                </span>
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/40 transition-colors duration-300">
                  <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </Link>
              
              {/* Secondary Button */}
              <Link href="/customization" className="group relative w-full sm:w-auto px-9 py-4 rounded-full flex items-center justify-center gap-3">
                {/* Glass Background */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-500 group-hover:bg-white/70 group-hover:shadow-[0_8px_30px_rgba(216,125,138,0.15)] group-hover:border-accent/30" />
                
                {/* Button Content */}
                <span className="relative z-10 text-foreground font-black tracking-[0.15em] text-xs sm:text-sm transition-colors duration-300 group-hover:text-accent">
                  START CUSTOM PRINT
                </span>
                
                {/* Floating Sparkle Icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <Sparkles size={16} className="text-accent group-hover:rotate-[180deg] group-hover:scale-125 transition-all duration-500 ease-[0.16,1,0.3,1]" />
                  {/* Icon Glow */}
                  <div className="absolute inset-0 bg-accent blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>

            {/* Features - Interactive Glass Cards */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 md:mt-14 grid grid-cols-2 sm:flex sm:flex-row gap-3 md:gap-5"
            >
              {[
                { title: "Premium Quality", desc: "Top-grade materials", color: "from-primary", shadow: "group-hover:shadow-[0_8px_20px_rgba(121,152,122,0.15)]" },
                { title: "Custom Made", desc: "Endless possibilities", color: "from-accent", shadow: "group-hover:shadow-[0_8px_20px_rgba(216,125,138,0.15)]" }
              ].map((feature, i) => (
                <div key={i} className={`group relative flex flex-col gap-1.5 px-6 py-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm transition-all duration-500 hover:-translate-y-1.5 cursor-default overflow-hidden ${feature.shadow}`}>
                  {/* Animated Top Border */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Inner Glass Reflection */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  
                  <span className="text-[10px] sm:text-xs font-black text-foreground uppercase tracking-[0.2em] relative z-10 transition-colors duration-300">
                    {feature.title}
                  </span>
                  <span className="text-[11px] sm:text-[13px] text-foreground/60 font-medium tracking-wide relative z-10">
                    {feature.desc}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Mobile Only: Amazon-Style App Layout */}
          <motion.div 
            className="flex md:hidden flex-col w-full relative z-10 -mx-6 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Bento Box Grid */}
            <div className="grid grid-cols-2 gap-3 mt-2 mb-4">
              {/* Large Hero Carousel spanning full width */}
              <div className="col-span-2 relative h-48 rounded-[2rem] overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (swipe < -100) {
                        setCurrentSlide((prev) => (prev + 1) % 3);
                      } else if (swipe > 100) {
                        setCurrentSlide((prev) => (prev - 1 + 3) % 3);
                      }
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  >
                    <Link 
                      href={[
                        "/shop?category=Cultural",
                        "/shop?category=Educational",
                        "/shop?category=Toys%20%26%20Figurines"
                      ][currentSlide]} 
                      className="absolute inset-0 block"
                    >
                      {products.find(p => p.category === ['Cultural', 'Educational', 'Toys & Figurines'][currentSlide])?.image && (
                        <Image 
                          src={products.find(p => p.category === ['Cultural', 'Educational', 'Toys & Figurines'][currentSlide])!.image} 
                          alt="Featured" 
                          fill 
                          className="object-cover brightness-95" 
                          sizes="(max-width: 768px) 100vw" 
                          priority
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">
                          {["Featured Collection", "Interactive Learning", "Premium Figurines"][currentSlide]}
                        </span>
                        <h3 className="text-xl font-black text-white leading-tight">
                          {["Assamese Heritage Models", "Educational Eco-Toys", "New Arrivals"][currentSlide]}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
                
                {/* Pagination Dots */}
                <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-5 bg-primary' : 'w-1.5 bg-white/40 backdrop-blur-md'}`} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Two Square Cards */}
              <Link href="/customization" className="relative h-40 rounded-[2rem] overflow-hidden shadow-sm active:scale-[0.98] transition-transform block">
                <Image src="/ghibli_hero_v2.png" alt="Custom 3D Prints" fill className="object-cover brightness-95" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-col">
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest mb-0.5">Your Design</span>
                  <h3 className="text-sm font-black text-white leading-tight">Custom 3D Prints</h3>
                </div>
              </Link>
              
              <Link href="/shop" className="relative h-40 rounded-[2rem] overflow-hidden shadow-sm active:scale-[0.98] transition-transform bg-[#f4f5f4] flex flex-col justify-between p-4 block">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8a958c] font-black uppercase tracking-widest mb-0.5">Explore All</span>
                  <h3 className="text-sm font-black text-[#1a1a1a] leading-tight">New Arrivals</h3>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Mobile Only: Featured Products Marquee */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-full md:hidden relative overflow-hidden -mx-6 px-6 mt-4 pb-2"
          >
            <div className="flex gap-3 w-max animate-[marquee_15s_linear_infinite] hover:[animation-play-state:paused]">
              {[...products.slice(0, 5), ...products.slice(0, 5)].map((product, i) => (
                <Link href={`/product/${product.id}`} key={i} className="relative w-36 h-48 rounded-[1.5rem] overflow-hidden shrink-0 border border-foreground/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transform-gpu transition-transform active:scale-95">
                  <Image src={product.image} alt={product.name} fill className="object-cover brightness-105" sizes="144px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col">
                    <span className="text-[10px] text-primary font-black uppercase tracking-widest line-clamp-1 mb-0.5">{product.category}</span>
                    <p className="text-xs font-bold text-white line-clamp-1 leading-tight">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Fade Edges for Marquee */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          </motion.div>

          {/* Mobile Only: Brand Mission Statement (Moved below fold) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex md:hidden flex-col items-center text-center w-full mt-10 mb-2 px-4"
          >
            <h2 className="text-3xl font-heading font-black tracking-tighter leading-[1.1] text-foreground drop-shadow-sm">
              Eco-Friendly Toys.<br />
              Powered by Innovation.<br />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_6s_linear_infinite] drop-shadow-md">
                Made with Care.
              </span>
            </h2>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed font-medium tracking-wide max-w-[280px]">
              Bringing stories to life through sustainable 3D-printed and hand-painted toys.
            </p>
          </motion.div>

          {/* Right Side: Video Container - Desktop Only */}
          <motion.div 
            className="hidden md:block w-[45%] relative"
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
            {/* Outer Glass Frame */}
            <div className="relative p-3 sm:p-5 rounded-[2.5rem] sm:rounded-[3rem] glass-panel border border-white/60 shadow-[0_20px_50px_rgba(121,152,122,0.15)] hover:shadow-[0_30px_60px_rgba(121,152,122,0.3)] transition-shadow duration-700 group overflow-hidden">
              
              {/* Animated Inner Glass Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Sweeping Light Reflection (Triggers on Hover) */}
              <div className="absolute top-0 -left-[150%] h-full w-[150%] z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 group-hover:left-[150%] ease-in-out pointer-events-none" />

              {/* Inner Video Container */}
              <div className="relative w-full h-[350px] md:h-[480px] rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] bg-black/5 border border-white/30">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none" />
                
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-700 group-hover:scale-[1.05]"
                >
                  <source src="/3D_printer_printing_glowing_heart.mp4" type="video/mp4" />
                </video>
                
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-[1.8rem] sm:rounded-[2.2rem] shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none z-20" />
              </div>
            </div>

            {/* Ambient Background Glows behind the glass frame */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-24 h-24 bg-primary/40 rounded-full blur-2xl" />
            <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-3xl" />
          </motion.div>

        </div>
      </div>

      {/* 3D Printer Extruder Scroll Indicator - Desktop Only */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, type: "spring" }}
        className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center z-20 cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[9px] font-black tracking-[0.3em] text-foreground/40 uppercase mb-2 group-hover:text-primary transition-colors duration-300">
          Extrude
        </span>
        
        <motion.div 
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          {/* Custom SVG 3D Printer Nozzle */}
          <div className="relative z-10 text-foreground/80 group-hover:text-primary transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              {/* Heat Break */}
              <rect x="9" y="2" width="6" height="4" rx="0.5" />
              {/* Heater Block */}
              <rect x="5" y="6" width="14" height="6" rx="1" />
              {/* Nozzle Cone */}
              <path d="M7 12 L10 18 L14 18 L17 12 Z" />
              {/* Nozzle Tip */}
              <rect x="10.5" y="18" width="3" height="2" rx="0.5" />
            </svg>
          </div>

          {/* Extruding Glowing Filament */}
          <div className="w-[3px] h-16 bg-gradient-to-b from-foreground/10 to-transparent relative -mt-1 rounded-full overflow-hidden">
            <motion.div 
              animate={{ height: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 w-full bg-primary drop-shadow-[0_0_8px_rgba(121,152,122,1)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
