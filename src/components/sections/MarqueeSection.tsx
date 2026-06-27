"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";

export default function MarqueeSection({ products, data }: { products: Product[], data?: any }) {
  const configuredMarqueeIds = data?.products?.filter((id: string) => id) || [];
  
  const marqueeItems = configuredMarqueeIds.length > 0 
    ? configuredMarqueeIds.map((id: string) => products.find(p => String(p.id) === String(id))).filter(Boolean) as Product[]
    : (products.filter(p => p.is_hero && p.image).length > 0 ? products.filter(p => p.is_hero && p.image) : products.filter(p => p.image).slice(0, 5));
  
  if (data?.marquee_image) {
    return (
      <div className="w-full relative overflow-hidden -mx-6 px-6 pb-2">
        <div className="relative w-full aspect-[21/9] md:aspect-[32/9] rounded-[2rem] overflow-hidden shadow-sm">
          <Image src={data.marquee_image} alt="Marquee Banner" fill className="object-cover" priority />
        </div>
      </div>
    );
  }

  if (marqueeItems.length === 0) return null;

  const duplicatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems].slice(0, 10);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="w-full relative overflow-hidden -mx-6 px-6 pb-2"
    >
      <div className="flex gap-3 w-max animate-[marquee_15s_linear_infinite] hover:[animation-play-state:paused]">
        {duplicatedItems.map((product, i) => (
          <Link href={`/product/${product.id}`} key={i} className="relative w-36 h-48 rounded-[1.5rem] overflow-hidden shrink-0 border border-foreground/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transform-gpu transition-transform active:scale-95">
            <Image src={product.image!} alt={product.name} fill className="object-cover brightness-105" sizes="144px" />
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
  );
}
