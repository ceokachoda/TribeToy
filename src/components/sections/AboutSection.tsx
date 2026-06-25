"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Leaf, GraduationCap, Users, Lightbulb } from "lucide-react";

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-background">
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
            
            <button className="mt-8 self-start px-8 py-3 glass hover:bg-white/5 transition-all font-semibold rounded-full text-sm tracking-wider uppercase">
              Know More About Us
            </button>
          </motion.div>

          {/* Right Visual Content (Parallax Cards) */}
          <motion.div style={{ y, opacity }} className="lg:w-1/2 relative h-[500px] w-full">
            <div className="absolute top-10 right-10 w-64 h-80 glass-panel rounded-2xl z-10 p-6 flex flex-col justify-end overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Placeholder for Green Putola Image */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-20">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-primary/30 mb-3 inline-block">Initiative</span>
                <h3 className="font-heading font-bold text-xl text-white">Green Putola</h3>
              </div>
            </div>

            <div className="absolute bottom-10 left-10 w-72 h-64 glass-panel rounded-2xl z-20 p-6 flex flex-col justify-end overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Placeholder for Tech/Women Image */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-20">
                <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-secondary/30 mb-3 inline-block">Community</span>
                <h3 className="font-heading font-bold text-xl text-white">Empowering Women</h3>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-primary/10 to-transparent blur-[80px] -z-10 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
