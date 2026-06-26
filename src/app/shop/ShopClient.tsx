"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Eye, Heart, Sparkles, Filter, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, memo } from "react";
import { products, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { useToast } from "@/context/ToastContext";

const ProductCard = memo(({ product, wishlist, toggleWishlist, addToCart, router }: { product: Product, wishlist: string[], toggleWishlist: (id: string) => void, addToCart: (product: Product) => void, router: any }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => router.push('/product/' + product.id)}
      className="group relative rounded-3xl bg-white border border-foreground/10 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(121,152,122,0.25)] group-hover:-translate-y-2 flex flex-col h-full transform-gpu cursor-pointer"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
        {product.isSale && (
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-accent text-black text-[5px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">Sale</span>
        )}
        {product.isPremium && (
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[5px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-1.5 h-1.5 md:w-2 md:h-2" /> <span className="hidden lg:inline">Pro</span>
          </span>
        )}
        {product.isNew && (
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-primary text-white text-[5px] md:text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">New</span>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-1 md:gap-2 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-1 md:p-0 rounded-full md:rounded-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] md:shadow-none border border-black/5 md:border-none md:translate-x-8 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(String(product.id)); }}
          className={`w-6 h-6 md:w-8 md:h-8 md:bg-white/90 md:backdrop-blur-xl md:border md:border-foreground/10 rounded-full flex items-center justify-center transition-colors md:shadow-lg ${
            wishlist.includes(String(product.id)) ? "text-red-500 hover:text-red-600 md:hover:bg-red-50" : "text-foreground/80 hover:bg-primary md:hover:border-primary hover:text-white"
          }`}
        >
          <Heart size={12} className={wishlist.includes(String(product.id)) ? "fill-current" : ""} />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/product/' + product.id); }}
          className="w-6 h-6 md:w-8 md:h-8 md:bg-white/90 md:backdrop-blur-xl md:border md:border-foreground/10 rounded-full flex items-center justify-center text-foreground/80 hover:bg-primary md:hover:border-primary hover:text-white transition-colors md:shadow-lg"
        >
          <Eye size={12} />
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
            className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110 transform-gpu backface-hidden"
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
              e.stopPropagation();
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
  );
});
ProductCard.displayName = "ProductCard";

function ShopContent({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState<string>("All Toys");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tribetoy_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) {}
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
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setSearchQuery(""); // Clear search if category is selected
    }
    if (searchParam) {
      setSearchQuery(searchParam);
      setActiveCategory("All Toys"); // Search across all by default
    }
  }, [categoryParam, searchParam]);
  
  // Dynamically calculate category counts
  const categories = ["All Toys", "Cultural", "Educational", "Statues", "Toys & Figurines", "Utility & Decor"];
  
  const getCategoryCount = (cat: string) => {
    if (cat === "All Toys") return initialProducts.length;
    return initialProducts.filter(p => p.category === cat).length;
  };

  const filteredProducts = useMemo(() => {
    let result = activeCategory === "All Toys" 
      ? initialProducts 
      : initialProducts.filter(p => p.category === activeCategory);

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [initialProducts, activeCategory, searchQuery]);

  return (
    <div className="w-full">
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
      <div className="block lg:hidden relative w-full -mx-6 mb-4">
        {/* Scroll affordance gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        <div className="overflow-x-auto px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 min-w-max pr-6">
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
      </div>

      {/* Main Product Grid */}
      <div className="w-full lg:w-3/4">
        {/* Dynamic Category Header */}
        <div className="mb-12 pb-6 border-b border-foreground/10 flex flex-col gap-3">
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground drop-shadow-sm">
            {searchQuery ? (
              <>Search: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">&quot;{searchQuery}&quot;</span></>
            ) : activeCategory === "All Toys" ? (
              <>Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Collection</span></>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">{activeCategory}</span>
            )}
          </h1>
          <p className="text-foreground/60 font-medium text-sm md:text-base">
            {searchQuery 
              ? `Showing search results for "${searchQuery}"` 
              : `Explore ${activeCategory === "All Toys" ? "our entire catalog" : `our curated selection of ${activeCategory}`}. `}
            Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> results.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product as any} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart as any} router={router} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>

      {/* Premium Customer Reviews Section */}
      <div className="mt-12 mb-8 md:mt-24 md:mb-12 lg:mt-32 lg:mb-20">
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-4"
          >
            <Star size={14} className="text-primary fill-primary" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary uppercase">Trusted by Thousands</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground"
          >
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Tribe</span> Says
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              name: "Faraah Yasmin Bora",
              rating: 5,
              text: "Absolutely stunning quality. The intricate details on the 3D models blew me away. Worth every penny for such premium craftsmanship!",
              date: "June 2026"
            },
            {
              name: "Karan Malakar",
              rating: 5,
              text: "The checkout process was seamless, and the tracking timeline was incredibly accurate. But the best part is definitely the product itself—flawless finish.",
              date: "June 2026"
            },
            {
              name: "Kaustab Borah",
              rating: 5,
              text: "I've bought 3D prints from various places, but TribeToy is on another level. The pro-grade materials they use make the figurines feel like high-end collectibles.",
              date: "May 2026"
            }
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl bg-white border border-foreground/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(121,152,122,0.15)] p-6 md:p-8 flex flex-col group transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star key={idx} size={14} className="fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              
              <p className="text-foreground/80 font-medium leading-relaxed mb-8 flex-grow relative z-10 text-sm md:text-base">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-foreground/5">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-black text-sm md:text-base border border-primary/20 shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-sm md:text-base">{review.name}</span>
                  <span className="text-[10px] md:text-xs text-foreground/50 font-bold uppercase tracking-wider">Verified Buyer • {review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(String(quickViewProduct.id)) : false}
        toggleWishlist={() => quickViewProduct && toggleWishlist(String(quickViewProduct.id))}
      />
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
