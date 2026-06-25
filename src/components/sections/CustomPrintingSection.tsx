"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Box, PenTool, Rocket, ChevronRight, Zap, Layers, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    icon: <PenTool className="w-8 h-8 text-secondary" />,
    title: "1. Concept & CAD",
    description: "Share your vision or 3D files. Our expert engineers will optimize the geometry for flawless physical reproduction.",
    color: "from-secondary/20 to-secondary/5",
    border: "group-hover:border-secondary/50",
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "2. Precision Deposition",
    description: "State-of-the-art SLA and advanced FDM arrays bring your design into the physical world with microscopic detail.",
    color: "from-primary/20 to-primary/5",
    border: "group-hover:border-primary/50",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-accent" />,
    title: "3. Artisan Finishing",
    description: "Rigorous quality control, meticulous sanding, and optional master-level hand-painting and varnishing.",
    color: "from-accent/20 to-accent/5",
    border: "group-hover:border-accent/50",
  },
  {
    icon: <Rocket className="w-8 h-8 text-white" />,
    title: "4. Global Fulfillment",
    description: "Secured in bespoke protective packaging and expedited globally directly to your doorstep or B2B warehouse.",
    color: "from-white/20 to-white/5",
    border: "group-hover:border-white/50",
  },
];

export default function CustomPrintingSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-32">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-secondary/10 blur-[150px] rounded-[100%] pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-64 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[200px] rounded-full pointer-events-none z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 mt-8">
        {/* Header Area */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-secondary/20 bg-secondary/5 backdrop-blur-xl mb-8"
          >
            <Sparkles size={16} className="text-secondary animate-pulse" />
            <span className="text-xs font-black tracking-[0.25em] text-secondary uppercase">B2B & Enterprise Solutions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-8 leading-[1.1]"
          >
            Turn Imagination Into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">
              Physical Reality.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            From rapid engineering prototyping to bespoke corporate gifts and ultra-detailed personalized figurines, our industrial-grade custom 3D printing service delivers unmatched precision at scale.
          </motion.p>
        </div>

        {/* Hero Image & Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-32">
          
          {/* Image Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden bg-black/40 border border-white/10 shadow-[0_0_100px_rgba(121,152,122,0.15)] backdrop-blur-3xl group p-3">
              {/* Image Inner Container */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
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
                className="absolute bottom-12 -left-6 md:-left-12 z-20 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Resolution</p>
                  <p className="text-xl font-black text-white">0.05mm Precision</p>
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute top-12 -right-6 md:-right-12 z-20 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Materials</p>
                  <p className="text-xl font-black text-white">Industrial Grade</p>
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
              className="text-3xl md:text-4xl font-heading font-black mb-8"
            >
              Built for <span className="text-secondary">Creators</span> & <span className="text-primary">Brands.</span>
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/60 text-lg mb-10 leading-relaxed"
            >
              Don't let manufacturing limits throttle your creativity. We utilize industrial SLS, SLA, and multi-extrusion FDM pipelines to build models that commercial off-the-shelf printers simply cannot achieve.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/contact" className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                <span className="relative z-10">Start Your Project</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </div>

        </div>

        {/* The Process */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black">The Custom Process</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-xl transition-all duration-500 overflow-hidden ${step.border} hover:shadow-2xl hover:-translate-y-2`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <h4 className="font-heading font-black text-xl mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">{step.title}</h4>
                  <p className="text-foreground/50 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
