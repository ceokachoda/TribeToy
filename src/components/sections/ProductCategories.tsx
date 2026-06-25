"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const categories = [
  {
    id: "toys",
    name: "Toys & Figurines",
    description: "Intricately detailed, multi-part articulable characters designed for play and display.",
    image: "/products/toy.jpg",
    link: "/shop?category=Toys & Figurines"
  },
  {
    id: "edu",
    name: "Educational",
    description: "Hands-on learning puzzles.",
    image: "/products/educational.jpeg",
    link: "/shop?category=Educational"
  },
  {
    id: "utility",
    name: "Utility Decor",
    description: "Functional homeware.",
    image: "/products/utility%20decor.jpeg",
    link: "/shop?category=Utility & Decor"
  },
  {
    id: "culture",
    name: "Cultural Heritage",
    description: "Celebrating history in 3D.",
    image: "/products/cultural.jpeg",
    link: "/shop?category=Cultural"
  },
];

export default function ProductCategories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Custom Cursor Logic
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 120 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 120 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  // Parallax scrolling for the massive footer card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 bg-background relative z-10 overflow-hidden cursor-default">

      {/* Magnetic Cursor Follower */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-50 flex items-center justify-center mix-blend-difference hidden md:flex"
      >
        <motion.div
          animate={{
            scale: hovered ? 1 : 0,
            opacity: hovered ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full bg-white rounded-full flex items-center justify-center text-black font-black text-[10px] tracking-widest uppercase"
        >
          Explore
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            {/* Laser-Traced Categories Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full group mb-8 overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-[200%] h-[200%] origin-center -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(121,152,122,1)_360deg)]"
              />
              <div className="absolute inset-[1px] rounded-full bg-background" />
              <div className="absolute inset-[1px] rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500" />
              <Sparkles size={14} className="text-primary relative z-10 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500" />
              <span className="relative z-10 text-xs font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Collections
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tighter leading-[0.9]"
            >
              Curated <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic pr-4">Excellence.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="pb-4"
          >
            <Link href="/shop" className="group flex items-center gap-4 transition-all duration-500 mb-2 md:mb-0">
              <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">View Complete Catalog</span>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-foreground/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 transform-gpu group-hover:shadow-[0_0_15px_rgba(121,152,122,0.2)] group-hover:scale-105 shrink-0">
                <ArrowRight className="text-foreground/70 group-hover:text-primary transition-all duration-500 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* The Editorial Gallery - Mobile: Grid Layout */}
        <div className="grid grid-cols-2 lg:hidden gap-3 md:gap-6 mt-8">
          {categories.map((category, index) => {
            const tags = ['Signature', 'Learn', 'Living', 'Heritage'];
            return (
              <div 
                key={category.id}
                className="relative h-[220px] md:h-[350px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-foreground/10 group"
              >
                <Image src={category.image} alt={category.name} fill className="object-cover brightness-[1.05]" sizes="(max-width: 1024px) 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-90" />
                
                <Link href={category.link} className="absolute inset-0 z-40">
                  <span className="sr-only">Explore {category.name}</span>
                </Link>
                
                <div className="absolute bottom-3 left-3 right-3 p-3 md:p-5 rounded-xl md:rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-40" />
                  <div className="relative z-10">
                    <span className="text-primary font-bold tracking-[0.2em] md:tracking-[0.3em] text-[7px] md:text-[9px] uppercase mb-1 block drop-shadow-md">0{index + 1} / {tags[index]}</span>
                    <h3 className="text-sm md:text-2xl font-heading font-black text-white drop-shadow-xl tracking-tight leading-tight mb-0.5">{category.name}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Editorial Gallery - Desktop: Single Screen Composition */}
        <div className="hidden lg:flex flex-row gap-0 items-center justify-center mt-12 h-[650px] relative">

          {/* Left Column: Educational & Utility */}
          <div className="w-full lg:w-3/12 flex flex-col gap-6 lg:pt-12 z-20">
            
            {/* 02 / Educational */}
            <motion.div
              onMouseEnter={() => setHovered(categories[1].id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[250px] group z-20 hover:z-30"
            >
              {/* Premium Glow Aura */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-transparent rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
              
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-foreground/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-foreground/10 group-hover:border-primary/50 transition-colors duration-700">
                <Image src={categories[1].image} alt={categories[1].name} fill className="object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-110 brightness-[1.02]" sizes="(max-width: 1024px) 100vw, 25vw" />
                
                {/* Smooth Seamless Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5 opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                
                <Link href={categories[1].link} className="absolute inset-0 z-40">
                  <span className="sr-only">Explore {categories[1].name}</span>
                </Link>
                
                {/* Frosted Glass Text Panel */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/10 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-[0.8s] ease-[0.16,1,0.3,1] pointer-events-none overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                  <div className="relative z-10">
                    <span className="text-primary font-bold tracking-[0.3em] text-[8px] uppercase mb-1 block drop-shadow-md">02 / Learn</span>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-white drop-shadow-lg tracking-tight">{categories[1].name}</h3>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 03 / Utility Decor (Overlaps into Center) */}
            <motion.div
              onMouseEnter={() => setHovered(categories[2].id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[300px] lg:-mr-12 lg:-mt-4 group z-30 hover:z-40"
            >
              {/* Premium Glow Aura */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-transparent rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

              <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-foreground/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-foreground/10 group-hover:border-primary/50 transition-colors duration-700">
                <Image src={categories[2].image} alt={categories[2].name} fill className="object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-110 brightness-[1.1]" sizes="(max-width: 1024px) 100vw, 25vw" />
                
                {/* Smooth Seamless Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5 opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                
                <Link href={categories[2].link} className="absolute inset-0 z-40">
                  <span className="sr-only">Explore {categories[2].name}</span>
                </Link>
                
                {/* Frosted Glass Text Panel */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/10 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-[0.8s] ease-[0.16,1,0.3,1] pointer-events-none overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                  <div className="relative z-10">
                    <span className="text-primary font-bold tracking-[0.3em] text-[8px] uppercase mb-1 block drop-shadow-md">03 / Living</span>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-white drop-shadow-lg tracking-tight">{categories[2].name}</h3>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Center Column: Featured (Toys) */}
          <motion.div
            onMouseEnter={() => setHovered(categories[0].id)}
            onMouseLeave={() => setHovered(null)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-6/12 relative h-[400px] lg:h-[650px] group z-10 hover:z-20"
          >
            {/* Massive Premium Glow Aura */}
            <div className="absolute -inset-2 bg-gradient-to-t from-primary/30 via-primary/5 to-transparent rounded-[2.7rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-foreground/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-foreground/10 group-hover:border-primary/50 transition-colors duration-700">
              <Image
                src={categories[0].image}
                alt={categories[0].name}
                fill
                className="object-cover transition-transform duration-[4s] ease-[0.16,1,0.3,1] group-hover:scale-105 saturate-[1.1] contrast-[1.05]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Smooth Seamless Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 opacity-70 group-hover:opacity-90 transition-opacity duration-1000" />
              
              <Link href={categories[0].link} className="absolute inset-0 z-40">
                <span className="sr-only">Explore {categories[0].name}</span>
              </Link>

              {/* Glass Box at Bottom */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 lg:p-10 rounded-[2rem] shadow-2xl overflow-hidden transform translate-y-4 group-hover:translate-y-0 transition-all duration-[1s] ease-[0.16,1,0.3,1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <span className="text-primary font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase mb-3 block drop-shadow-md">01 / Signature</span>
                    <h3 className="text-3xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight drop-shadow-2xl">{categories[0].name}</h3>
                    <p className="text-white/90 font-medium text-sm lg:text-base max-w-sm hidden sm:block drop-shadow-md">{categories[0].description}</p>
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transform -rotate-45 group-hover:rotate-0 group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-700 shrink-0 shadow-xl">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Cultural Heritage */}
          <div className="w-full lg:w-3/12 flex flex-col gap-6 lg:mt-32 lg:pb-12 z-20">

            {/* 04 / Culture (Overlaps into Center) */}
            <motion.div
              onMouseEnter={() => setHovered(categories[3].id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[300px] lg:h-[400px] lg:-ml-12 group z-20 hover:z-30"
            >
              {/* Premium Glow Aura */}
              <div className="absolute -inset-1 bg-gradient-to-tl from-primary/40 to-transparent rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

              <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-foreground/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-foreground/10 group-hover:border-primary/50 transition-colors duration-700">
                <Image src={categories[3].image} alt={categories[3].name} fill className="object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-110 brightness-[1.05]" sizes="(max-width: 1024px) 100vw, 25vw" />
                
                {/* Smooth Seamless Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5 opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                
                <Link href={categories[3].link} className="absolute inset-0 z-40">
                  <span className="sr-only">Explore {categories[3].name}</span>
                </Link>
                
                {/* Frosted Glass Text Panel */}
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/10 transform translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-[0.8s] ease-[0.16,1,0.3,1] pointer-events-none overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                  <div className="relative z-10">
                    <span className="text-primary font-bold tracking-[0.3em] text-[8px] uppercase mb-1 block drop-shadow-md">04 / Heritage</span>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-white drop-shadow-lg tracking-tight">{categories[3].name}</h3>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
