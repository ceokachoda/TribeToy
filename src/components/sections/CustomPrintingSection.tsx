"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Box, PenTool, Rocket } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: <PenTool className="w-6 h-6 text-primary" />,
    title: "1. Idea & Design",
    description: "Share your concept or CAD file. Our team will optimize it for perfect 3D printing.",
  },
  {
    icon: <Box className="w-6 h-6 text-secondary" />,
    title: "2. Precision Printing",
    description: "We use state-of-the-art FDM and Resin printers to bring your design into the physical world.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-accent" />,
    title: "3. Finishing & QC",
    description: "Every part undergoes strict quality control, sanding, and optional hand-painting.",
  },
  {
    icon: <Rocket className="w-6 h-6 text-primary" />,
    title: "4. Delivery",
    description: "Safely packaged and shipped directly to your doorstep or business.",
  },
];

export default function CustomPrintingSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#050505] border-y border-card-border">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-primary">
          <path d="M0,0 L100,100 L0,100 Z" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <span className="px-4 py-2 rounded-full glass inline-block text-primary text-xs font-bold uppercase tracking-wider mb-6">
              B2B & Custom Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Bring Your Ideas <br/> To <span className="text-gradient">Reality.</span>
            </h2>
            <p className="text-foreground/70 text-lg mb-8 max-w-xl leading-relaxed">
              Whether you need rapid prototyping for engineering, custom corporate gifts, or personalized figurines, our custom 3D printing service offers unmatched quality, speed, and precision.
            </p>
            
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1 p-2 glass rounded-lg">{step.icon}</div>
                  <div>
                    <h4 className="font-heading font-semibold text-lg">{step.title}</h4>
                    <p className="text-foreground/60 text-sm mt-1">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <Link href="/contact" className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                Get a Quote
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass p-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 z-10 mix-blend-overlay rounded-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop" 
                alt="Custom 3D Printing Process" 
                className="w-full h-full object-cover rounded-2xl"
              />
              
              {/* Floating stat card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-8 left-8 z-20 glass-panel p-4 rounded-xl max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold">0.05mm Precision</h5>
                    <p className="text-xs text-foreground/60">Industrial grade detail</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
