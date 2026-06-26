"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { useToast } from "@/context/ToastContext";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featuredProducts = products.filter(p => p.image).slice(0, 4);
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tribetoy_wishlist");
    if (saved) {
      try { 
       
      setWishlist(JSON.parse(saved)); 
    } catch (_e) {}
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(id);
      const next = isRemoving ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem("tribetoy_wishlist", JSON.stringify(next));
      
      const product = products.find(p => String(p.id) === String(id));
      if (isRemoving) {
        showToast(`Removed ${product?.name || 'item'} from wishlist`, "success");
      } else {
        showToast(`Added ${product?.name || 'item'} to wishlist`, "wishlist");
      }
      
      return next;
    });
  };

  const renderCard = (product: typeof featuredProducts[0], index: number) => {
    const baseClasses = "group relative rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-foreground/10 transition-all duration-700 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(121,152,122,0.25)] backdrop-blur-xl flex flex-col hover:border-primary/50 group-hover:-translate-y-2 transform-gpu cursor-pointer";

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={baseClasses}
        onClick={() => router.push('/product/' + product.id)}
      >
        {/* Animated Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent group-hover:from-primary/20 transition-colors duration-700 pointer-events-none z-0" />

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-5 md:left-5 z-20 flex flex-col gap-1 md:gap-2">
          {product.isNew && (
            <span className="px-2 md:px-4 py-0.5 md:py-1.5 bg-primary/90 backdrop-blur-xl text-black text-[6px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl">New Release</span>
          )}
          {product.isSale && (
            <span className="px-2 md:px-4 py-0.5 md:py-1.5 bg-accent/90 backdrop-blur-xl text-black text-[6px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl">Special Offer</span>
          )}
          {product.isPremium && (
            <span className="px-2 md:px-4 py-0.5 md:py-1.5 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-xl text-white text-[6px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-xl flex items-center gap-1">
              <Sparkles className="w-2 h-2 md:w-3 md:h-3 text-white" /> <span className="hidden lg:inline">Pro Grade</span><span className="inline lg:hidden">Pro</span>
            </span>
          )}
        </div>
        
        {/* Hover Actions Menu */}
        <div className="hidden lg:flex absolute top-5 right-5 z-20 flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(String(product.id)); }}
            className={`w-10 h-10 bg-white/90 backdrop-blur-xl border border-foreground/10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
              wishlist.includes(String(product.id)) ? "text-red-500 hover:bg-red-50" : "text-foreground hover:bg-primary hover:border-primary hover:text-white"
            }`} 
            title={wishlist.includes(String(product.id)) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={16} className={wishlist.includes(String(product.id)) ? "fill-current" : ""} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/product/' + product.id); }}
            className="w-10 h-10 bg-white/90 backdrop-blur-xl border border-foreground/10 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-white transition-colors shadow-lg" 
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative h-44 md:h-72 w-full overflow-hidden bg-foreground/5 flex items-center justify-center">
          {/* Inner shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] z-10 pointer-events-none" />
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-foreground/10 flex flex-col items-center justify-center gap-4 transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
                <ShoppingBag size={24} className="text-foreground/30" />
              </div>
              <span className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] font-bold">Image Pending</span>
            </div>
          )}
        </div>

        {/* Creative Pricing & Info Section */}
        <div className="p-3 md:p-8 flex flex-col flex-grow relative z-20 bg-white">
          <span className="text-[8px] md:text-[10px] text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">{product.category}</span>
          <h3 className="text-xs md:text-xl font-heading font-black text-foreground mb-auto leading-tight tracking-tight drop-shadow-sm line-clamp-2" title={product.name}>{product.name}</h3>
          
          <div className="flex items-end justify-between mt-3 md:mt-6 pt-3 md:pt-6 border-t border-foreground/5 relative">
            {/* Subtle highlight line */}
            <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary to-transparent opacity-50" />
            
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] text-foreground/50 uppercase tracking-widest font-bold mb-0.5 md:mb-1">Price</span>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-sm md:text-3xl font-black text-foreground tracking-tighter">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="hidden lg:inline text-xs text-foreground/40 line-through font-bold mb-1">{product.originalPrice}</span>
                )}
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="relative overflow-hidden group/cart w-8 h-8 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-white to-foreground/5 border border-foreground/10 flex items-center justify-center hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-[0_0_20px_rgba(121,152,122,0.4)] shrink-0 transform-gpu hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary translate-y-[100%] group-hover/cart:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              <ShoppingBag className="text-foreground group-hover/cart:text-white relative z-10 group-hover/cart:-translate-y-0.5 group-hover/cart:scale-110 transition-transform duration-500 ease-[0.16,1,0.3,1] w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-12 md:py-24 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-64 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-foreground/10 pb-8">
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
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight text-foreground"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Creations</span>
            </motion.h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-4 transition-all duration-500 mb-2 md:mb-0">
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">View All Products</span>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-foreground/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 transform-gpu group-hover:shadow-[0_0_15px_rgba(121,152,122,0.2)] group-hover:scale-105 shrink-0">
              <ArrowRight className="text-foreground/70 group-hover:text-primary transition-all duration-500 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Unified Responsive Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mt-6">
          {featuredProducts.map((product, index) => renderCard(product, index))}
        </div>
      </div>
      
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(String(quickViewProduct.id)) : false}
        toggleWishlist={() => quickViewProduct && toggleWishlist(String(quickViewProduct.id))}
      />
    </section>
  );
}
