"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles, Filter, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

function ShopContent({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { addToCart } = useCart();
  
  const [activeCategory, setActiveCategory] = useState<string>("All Toys");
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);
  
  // Dynamically calculate category counts
  const categories = ["All Toys", "Cultural", "Educational", "Statues", "Toys & Figurines", "Utility & Decor"];
  
  const getCategoryCount = (cat: string) => {
    if (cat === "All Toys") return initialProducts.length;
    return initialProducts.filter(p => p.category === cat).length;
  };

  const filteredProducts = activeCategory === "All Toys" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-full lg:w-1/4 sticky top-32 z-10">
        <div className="bg-white border border-foreground/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-foreground/10">
            <Filter size={20} className="text-primary" />
            <h2 className="text-2xl font-heading font-bold text-foreground tracking-wide">Categories</h2>
          </div>
          
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeCategory === category 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground border border-transparent"
                  }`}
                >
                  <span className={`font-semibold tracking-wide text-sm flex items-center gap-2 ${activeCategory === category ? "" : "group-hover:translate-x-1 transition-transform duration-300"}`}>
                    {activeCategory === category && (
                      <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    {category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold transition-opacity ${activeCategory === category ? "opacity-100" : "opacity-40 group-hover:opacity-80"}`}>
                      ({getCategoryCount(category)})
                    </span>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${activeCategory === category ? "text-primary translate-x-1" : "text-foreground/20 group-hover:text-foreground/40 group-hover:translate-x-0.5"}`} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Category Pill Bar */}
      <div className="block lg:hidden w-full -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mb-4">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {category} ({getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="w-full lg:w-3/4">
        {/* Dynamic Category Header */}
        <div className="mb-12 pb-6 border-b border-foreground/10 flex flex-col gap-3">
          <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight text-foreground drop-shadow-sm">
            {activeCategory === "All Toys" ? (
              <>Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Collection</span></>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">{activeCategory}</span>
            )}
          </h1>
          <p className="text-foreground/60 font-medium text-sm md:text-base">
            Explore {activeCategory === "All Toys" ? "our entire catalog" : `our curated selection of ${activeCategory}`}. 
            Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> results.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
                <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-white border border-foreground/10 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(121,152,122,0.25)] group-hover:-translate-y-2 flex flex-col h-full transform-gpu"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
                  {product.isSale && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-accent/90 backdrop-blur-xl text-black text-[8px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">Sale</span>
                  )}
                  {product.isPremium && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-xl text-white text-[8px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={8} /> <span className="hidden md:inline">Pro</span>
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-primary/90 backdrop-blur-xl text-white text-[8px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">New</span>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-2 md:translate-x-8 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-xl border border-foreground/10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-white transition-colors shadow-lg">
                    <Heart size={14} />
                  </button>
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-xl border border-foreground/10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-white transition-colors shadow-lg">
                    <Eye size={14} />
                  </button>
                </div>

                {/* Product Image Wrapper */}
                <div className="relative h-40 md:h-64 w-full bg-foreground/5 overflow-hidden flex items-center justify-center border-b border-foreground/5">
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] z-10 pointer-events-none" />
                  
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Premium Placeholder
                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-foreground/10 flex flex-col items-center justify-center gap-2 md:gap-4 transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105">
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
                        <ShoppingBag className="text-foreground/30 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="text-[8px] md:text-[10px] text-foreground/40 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-center px-2">Image Pending</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col flex-grow relative z-20 bg-white">
                  <span className="text-[8px] md:text-[9px] text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 line-clamp-1">{product.category}</span>
                  <h3 className="text-sm md:text-lg font-heading font-bold text-foreground leading-tight md:leading-snug mb-auto line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-end justify-between mt-4 md:mt-6 pt-4 border-t border-foreground/5 relative">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-1 md:gap-2">
                        <span className="text-base md:text-xl font-black text-foreground tracking-tighter">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] md:text-xs text-foreground/40 line-through font-bold mb-0.5">{product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="relative overflow-hidden group/cart w-9 h-9 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white to-foreground/5 border border-foreground/10 shadow-sm flex items-center justify-center hover:border-primary/50 hover:shadow-[0_0_20px_rgba(121,152,122,0.4)] transition-all duration-500 shrink-0 transform-gpu hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary md:translate-y-[100%] group-hover/cart:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                      <ShoppingBag className="text-foreground group-hover/cart:text-white relative z-10 md:group-hover/cart:-translate-y-0.5 group-hover/cart:scale-110 transition-all duration-500 w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <Suspense fallback={<div className="w-full h-64 flex items-center justify-center text-white/50">Loading shop...</div>}>
      <ShopContent initialProducts={initialProducts} />
    </Suspense>
  );
}
