"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection({ data }: { data: any }) {
  if (!data?.items || data.items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground font-heading">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Customers Say</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.items.map((item: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-foreground/10 flex flex-col hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-5 h-5 ${j < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="text-foreground/80 italic mb-8 flex-grow">"{item.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-slate-200 relative overflow-hidden shrink-0">
                  {item.avatar ? <Image src={item.avatar} alt={item.name} fill className="object-cover" /> : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">{item.name.charAt(0)}</div>}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{item.name}</h4>
                  <span className="text-xs text-foreground/50 uppercase tracking-wider">Verified Buyer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
