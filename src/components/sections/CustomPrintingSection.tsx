"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Box, PenTool, Rocket, ChevronRight, Zap, Layers, Sparkles, Code, Printer, Paintbrush, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    icon: <PenTool className="w-8 h-8 text-[#4a5d4e]" />,
    title: "1. Concept &\nCAD",
    description: "Share your vision or 3D files. Our expert engineers will optimize the geometry for flawless physical reproduction.",
    bgColor: "bg-white",
  },
  {
    icon: <Printer className="w-8 h-8 text-[#4a5d4e]" />,
    title: "2. Precision\nDeposition",
    description: "State-of-the-art SLA and advanced FDM arrays bring your design into the physical world with microscopic detail.",
    bgColor: "bg-[#eef2ef]",
  },
  {
    icon: <Paintbrush className="w-8 h-8 text-[#4a5d4e]" />,
    title: "3. Artisan\nFinishing",
    description: "Rigorous quality control, meticulous sanding, and optional master-level hand-painting and varnishing.",
    bgColor: "bg-white",
  },
  {
    icon: <Truck className="w-8 h-8 text-[#4a5d4e]" />,
    title: "4. Global\nFulfillment",
    description: "Secured in bespoke protective packaging and expedited globally directly to your doorstep or B2B warehouse.",
    bgColor: "bg-white",
  },
];

export default function CustomPrintingSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-32">
      {/* Dynamic Background Elements - Light Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 blur-[150px] rounded-[100%] pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-64 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full pointer-events-none z-0" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 mt-8">
        {/* Header Area */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl mb-8 shadow-sm"
          >
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-primary uppercase">B2B & Enterprise Solutions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-8 leading-[1.1] text-foreground drop-shadow-sm"
          >
            Turn Imagination Into <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Physical Reality.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
          >
            From rapid engineering prototyping to bespoke corporate gifts and ultra-detailed personalized figurines, our industrial-grade custom 3D printing service delivers unmatched precision at scale.
          </motion.p>
        </div>

        {/* Hero Image & Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-12 md:mb-32">
          
          {/* Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden bg-white/50 border border-foreground/5 shadow-[0_20px_60px_rgba(121,152,122,0.15)] backdrop-blur-3xl group p-3">
              {/* Image Inner Container */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white shadow-inner">
                <Image 
                  src="/futuristic_3d_printer.png" 
                  alt="Futuristic 3D Printer" 
                  fill
                  className="object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                  priority
                />
              </div>
              
              {/* Floating Stat Card 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-12 -left-4 md:-left-12 z-20 bg-[#f6f7f6] border border-black/5 p-6 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex items-center gap-5"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#8a958c] font-bold mb-1">Resolution</p>
                  <p className="text-2xl font-black text-[#1a1a1a]">0.05mm Precision</p>
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute top-12 -right-4 md:-right-12 z-20 bg-[#f6f7f6] border border-black/5 p-5 md:pr-10 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center border-2 border-[#4a5d4e]">
                  <CheckCircle2 className="w-6 h-6 text-[#4a5d4e]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#8a958c] font-bold mb-1">Materials</p>
                  <p className="text-xl font-black text-[#1a1a1a]">Eco-Friendly PLA</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Area */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-black mb-8 leading-tight text-foreground"
            >
              Built for <span className="text-primary">Creators</span> & <span className="text-secondary">Brands.</span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/60 text-lg mb-10 leading-relaxed font-medium"
            >
              Don't let manufacturing limits throttle your creativity. We utilize industrial SLS, SLA, and multi-extrusion FDM pipelines to build models that commercial off-the-shelf printers simply cannot achieve. From eco-friendly materials to hand-painted Assam art finishes, we bring your ideas to life.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/contact" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <span className="relative z-10">Start Your Project</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </div>

        </div>

        {/* The Process */}
        <div className="mt-24 border-t border-foreground/5 pt-24">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 block">How it works</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground">The Custom Process</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative p-8 md:p-10 rounded-[2rem] ${step.bgColor} shadow-sm border border-black/[0.03] transition-all duration-500 hover:shadow-xl hover:-translate-y-2`}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center mb-10 shadow-sm border border-black/5 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a] whitespace-pre-line leading-tight">{step.title}</h3>
                  <p className="text-[#5a6b5e] font-medium leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
