"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Leaf, GraduationCap, Users, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    title: "Eco-Friendly",
    description: "Our toys are made using biodegradable 3D printing filaments, ensuring safety for children and the planet.",
  },
  {
    icon: <Users className="w-6 h-6 text-secondary" />,
    title: "Empowering Women",
    description: "We empower women from Assam's tribal communities by providing them with skills in modern manufacturing.",
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-accent" />,
    title: "IIT Guwahati Backed",
    description: "Supported by DST and IIT Guwahati, ensuring our technology and materials are state-of-the-art.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-primary" />,
    title: "Educational Play",
    description: "Designed to spark curiosity and promote hands-on learning through interactive puzzles and tracing boards.",
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="hidden lg:block relative py-12 md:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div style={{ opacity }} className="lg:w-1/2 flex flex-col gap-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
              Blending Tradition, <br/>
              <span className="text-gradient">Technology & Sustainability.</span>
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              TribeToy is a purpose-driven company leading the Green Putola initiative. We produce eco-friendly, 3D-printed toys that are safe for children and kind to the planet, while empowering women from Assam&apos;s tribal communities through technology and creativity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 glass rounded-xl shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/about" className="mt-8 group relative w-max px-9 py-4 rounded-full flex items-center justify-center gap-3">
              {/* Core Background */}
              <div className="absolute inset-0 bg-secondary rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] opacity-80" />
              </div>
              
              {/* Ripple Effect on Hover */}
              <div className="absolute inset-0 rounded-full border-2 border-primary scale-[0.8] opacity-0 group-hover:scale-[1.3] group-hover:opacity-0 transition-all duration-700 ease-out pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-2 border-primary scale-[0.8] opacity-0 group-hover:scale-[1.5] group-hover:opacity-0 transition-all duration-1000 delay-100 ease-out pointer-events-none" />
              
              {/* Button Content */}
              <span className="relative z-10 text-white font-black tracking-[0.15em] text-xs sm:text-sm drop-shadow-sm">
                KNOW MORE ABOUT US
              </span>
              <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/40 transition-colors duration-300">
                <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>

          {/* Right Visual Content (Parallax Cards) */}
          <motion.div style={{ y, opacity }} className="lg:w-1/2 flex justify-center gap-6 h-[400px] md:h-[600px] items-center relative w-full mt-6 md:mt-12 lg:mt-0">
            {/* Left Card (Shifted Up) */}
            <div className="flex flex-col gap-6 -mt-12 md:-mt-24 w-1/2 max-w-[280px]">
              <div className="w-full h-80 glass-panel rounded-[2rem] relative overflow-hidden group p-6 flex flex-col justify-end shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('/ghibli_green_putola.png')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-20">
                  <span className="px-3 py-1 bg-primary/30 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-3 inline-block shadow-sm">Initiative</span>
                  <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">Green Putola</h3>
                </div>
              </div>
            </div>

            {/* Right Card (Shifted Down) */}
            <div className="flex flex-col gap-6 mt-12 md:mt-24 w-1/2 max-w-[280px]">
              <div className="w-full h-80 glass-panel rounded-[2rem] relative overflow-hidden group p-6 flex flex-col justify-end shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('/ghibli_impact.png')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-20">
                  <span className="px-3 py-1 bg-secondary/40 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-3 inline-block shadow-sm">Community</span>
                  <h3 className="font-heading font-bold text-xl text-white drop-shadow-md">Empowering Women</h3>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/10 to-transparent blur-[80px] -z-10 pointer-events-none" />
          </motion.div>
        </div>

        {/* Mobile Video Section */}
        {isMounted && isMobile && (
          <div className="lg:hidden mt-12 w-full px-2">
            <div className="relative w-full h-[300px] rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(121,152,122,0.2)] bg-black/5 border border-white/60 p-2 glass-panel">
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover object-center scale-[1.02]"
                >
                  <source src="/3D_printer_printing_glowing_heart.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Innovation</span>
                  <h3 className="text-lg font-black text-white leading-tight">Precision 3D Printing</h3>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
