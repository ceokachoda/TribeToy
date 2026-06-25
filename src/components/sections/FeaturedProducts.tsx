"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Kuromi Figurine",
    category: "All Toys",
    price: "₹699.00",
    image: "/products/batman.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Goku",
    category: "All Toys",
    price: "₹899.00",
    image: "/products/goku.jpg",
  },
  {
    id: 3,
    name: "Warm Owl Glow",
    category: "All Toys",
    price: "₹449.00",
    image: "/products/kuromi.png",
    isPremium: true,
  },
  {
    id: 4,
    name: "Batman",
    category: "All Toys",
    price: "₹999.00",
    image: "/products/owl.jpeg",
    isSale: true,
  },
];

export default function FeaturedProducts() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll and scroll tracking for mobile carousel
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    Array.from(container.children).forEach((child) => observer.observe(child));

    const interval = setInterval(() => {
      if (window.innerWidth >= 1024) return; // Desktop is fine
      setActiveIndex((current) => {
        const next = (current + 1) % products.length;
        if (container && container.children[next]) {
          container.children[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        return next;
      });
    }, 4000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const renderCard = (product: typeof products[0], index: number, isMobile: boolean) => {
    const isActive = isMobile ? activeIndex === index : true;
    const baseClasses = "group relative rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 transition-all duration-700 overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col hover:border-primary/40";
    const mobileClasses = isMobile 
      ? `min-w-[85vw] md:min-w-[55vw] snap-center shrink-0 ease-[0.16,1,0.3,1] ${isActive ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-40 blur-[2px]"}` 
      : "";

    return (
      <motion.div
        key={product.id}
        initial={!isMobile ? { opacity: 0, y: 30 } : false}
        whileInView={!isMobile ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={!isMobile ? { delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } : undefined}
        className={`${baseClasses} ${mobileClasses}`}
      >
        {/* Animated Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent group-hover:from-primary/20 transition-colors duration-700 pointer-events-none z-0" />

        {/* Badges */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-xl text-black text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl">New Release</span>
          )}
          {product.isSale && (
            <span className="px-4 py-1.5 bg-accent/90 backdrop-blur-xl text-black text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl">Special Offer</span>
          )}
          {product.isPremium && (
            <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-xl text-black text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl flex items-center gap-1.5">
              <Sparkles size={10} className="text-black" /> Pro Grade
            </span>
          )}
        </div>
        
        {/* Hover Actions Menu */}
        <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
          <button className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-xl" title="Add to Wishlist">
            <Heart size={16} />
          </button>
          <button className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-xl" title="Quick View">
            <Eye size={16} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative h-72 w-full overflow-hidden bg-white/5 flex items-center justify-center">
          {/* Inner shadow to smoothly blend the harsh edges of product background images */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(10,10,10,0.8)] z-10 pointer-events-none" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        {/* Creative Pricing & Info Section */}
        <div className="p-8 flex flex-col flex-grow relative z-20">
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">{product.category}</span>
          <h3 className="text-2xl font-heading font-black text-white mb-auto leading-tight tracking-tight drop-shadow-md">{product.name}</h3>
          
          <div className="flex items-end justify-between mt-6 pt-6 border-t border-white/10 relative">
            {/* Subtle highlight line */}
            <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary to-transparent" />
            
            <div className="flex flex-col">
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Price</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tighter drop-shadow-lg">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-white/40 line-through font-bold mb-1">{product.originalPrice}</span>
                )}
              </div>
            </div>

            <button className="relative overflow-hidden group/cart w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(121,152,122,0.3)] shrink-0">
              <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover/cart:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <ShoppingBag size={20} className="text-white relative z-10 group-hover/cart:-translate-y-0.5 group-hover/cart:scale-110 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-64 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-[1400px]">
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

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => renderCard(product, index, false))}
        </div>

        {/* Mobile Swipe Carousel Layout */}
        <div className="block lg:hidden relative mt-8">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 pt-4 -mx-6 px-6 md:-mx-12 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, index) => renderCard(product, index, true))}
          </div>

          {/* Animated Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-2 mb-8">
            {products.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 relative overflow-hidden ${
                  activeIndex === i ? "w-10 bg-primary/20" : "w-2 bg-foreground/10"
                }`}
              >
                {activeIndex === i && (
                  <motion.div
                    key={`progress-${activeIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
