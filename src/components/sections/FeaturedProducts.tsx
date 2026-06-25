"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Cyberpunk Oni Mask",
    category: "Cosplay & Wearables",
    price: "₹4,999",
    image: "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=800&auto=format&fit=crop", // placeholder
    isNew: true,
  },
  {
    id: 2,
    name: "Parametric Desk Lamp",
    category: "Utility Decor",
    price: "₹2,499",
    originalPrice: "₹3,199",
    image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=800&auto=format&fit=crop",
    isSale: true,
  },
  {
    id: 3,
    name: "Articulated Dragon",
    category: "Toys & Figurines",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Architectural Taj Model",
    category: "Cultural & Lithophanes",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop",
    isPremium: true,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-64 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/10 pb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/5 backdrop-blur-md mb-6"
            >
              <Sparkles size={14} className="text-secondary" />
              <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">Signature Collection</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Creations</span>
            </motion.h2>
          </div>
          <Link href="/shop" className="group relative px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            <span className="relative z-10 text-sm font-bold tracking-widest uppercase">View All Products</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2rem] bg-black/20 border border-white/5 hover:border-white/20 hover:bg-black/40 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md flex flex-col"
            >
              {/* Animated Glow behind card */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/20 group-hover:to-accent/20 opacity-0 group-hover:opacity-100 rounded-[2rem] blur-md transition-all duration-700 -z-10" />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/50 text-primary text-[10px] font-black tracking-widest uppercase rounded-full shadow-[0_0_10px_rgba(121,152,122,0.3)]">New Release</span>
                )}
                {product.isSale && (
                  <span className="px-4 py-1.5 bg-accent/20 backdrop-blur-md border border-accent/50 text-accent text-[10px] font-black tracking-widest uppercase rounded-full shadow-[0_0_10px_rgba(216,125,138,0.3)]">Special Offer</span>
                )}
                {product.isPremium && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-500/50 text-amber-500 text-[10px] font-black tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1">
                    <Sparkles size={10} /> Pro Grade
                  </span>
                )}
              </div>
              
              {/* Hover Actions Menu */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <button className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-colors" title="Add to Wishlist">
                  <Heart size={16} />
                </button>
                <button className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-colors" title="Quick View">
                  <Eye size={16} />
                </button>
              </div>

              {/* Product Image */}
              <div className="relative h-72 w-full overflow-hidden bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20 -mt-10 bg-gradient-to-t from-black via-black/95 to-transparent">
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em] mb-2">{product.category}</span>
                <h3 className="font-heading font-black text-xl mb-6 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">{product.name}</h3>
                
                <div className="mt-auto flex items-end justify-between">
                  {/* Premium Pricing Holder */}
                  <div className="flex flex-col relative px-4 py-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_2s_infinite]" />
                    {product.originalPrice && (
                      <span className="text-[10px] text-foreground/40 line-through font-bold">{product.originalPrice}</span>
                    )}
                    <span className="font-black text-2xl tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{product.price}</span>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="relative w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors group/btn shrink-0">
                    <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    <ShoppingBag size={20} className="relative z-10 text-white group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
