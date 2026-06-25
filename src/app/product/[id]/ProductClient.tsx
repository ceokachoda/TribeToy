"use client";

import { Product } from "@/data/products";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Star, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Undo2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mocking multiple angles for the carousel
  const images = [
    product.image,
    product.image, // Placeholder for angle 2
    product.image  // Placeholder for angle 3
  ];

  // Mock reviews
  const reviews = [
    { id: 1, name: "Rahul S.", rating: 5, text: "Amazing quality! Looks perfect on my desk. Highly recommended.", date: "Oct 12, 2023" },
    { id: 2, name: "Sneha P.", rating: 4, text: "Very detailed. Delivery took a bit long but the product is definitely worth the wait.", date: "Sep 28, 2023" },
    { id: 3, name: "Arjun M.", rating: 5, text: "Exceeded my expectations. The 3D printing is flawless.", date: "Aug 15, 2023" }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("tribetoy_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const toggleWishlist = () => {
    const idStr = product.id.toString();
    setWishlist(prev => {
      const isRemoving = prev.includes(idStr);
      const next = isRemoving ? prev.filter(p => p !== idStr) : [...prev, idStr];
      localStorage.setItem("tribetoy_wishlist", JSON.stringify(next));
      if (isRemoving) showToast("Removed from wishlist", "success");
      else showToast("Added to wishlist", "wishlist");
      return next;
    });
  };

  return (
    <div className="pb-32 md:pb-12 pt-0 md:pt-28 lg:pt-32 bg-white min-h-screen w-full">
      
      {/* Desktop Breadcrumbs (Hidden on mobile) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-8 py-6 items-center gap-2 text-sm text-foreground/50 font-bold uppercase tracking-wider">
        <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => router.push('/shop')} className="hover:text-primary transition-colors">Shop</button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* App Header (Fixed relative on mobile only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-black/5">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
            <Share2 size={20} />
          </button>
          <button onClick={toggleWishlist} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
            <Heart size={20} className={wishlist.includes(product.id.toString()) ? "fill-red-500 text-red-500" : ""} />
          </button>
          <button onClick={() => router.push('/cart')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 relative">
            <ShoppingBag size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto md:px-8 flex flex-col md:flex-row gap-0 md:gap-12 lg:gap-16 items-start">
        {/* Left Side: Image Carousel */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div className="relative w-full aspect-square md:rounded-3xl bg-[#f4f5f4] mt-16 md:mt-0 overflow-hidden md:border md:border-black/5 md:shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -100) {
                    setCurrentImageIndex((prev) => (prev + 1) % images.length);
                  } else if (swipe > 100) {
                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                  }
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                {images[currentImageIndex] ? (
                  <Image src={images[currentImageIndex]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30">
                    <ShoppingBag size={48} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 md:w-6 bg-primary' : 'w-1.5 md:w-2 bg-black/20 md:bg-black/30'}`} />
              ))}
            </div>
            
            {/* Badges */}
            <div className="absolute top-20 md:top-6 left-4 md:left-6 flex flex-col gap-2 z-10">
              {product.isSale && <span className="px-2 md:px-3 py-0.5 md:py-1 bg-red-500 text-white text-[10px] md:text-xs font-black uppercase tracking-wider rounded-sm md:rounded-md shadow-md">Sale</span>}
              {product.isPremium && <span className="px-2 md:px-3 py-0.5 md:py-1 bg-amber-500 text-white text-[10px] md:text-xs font-black uppercase tracking-wider rounded-sm md:rounded-md shadow-md flex items-center gap-1"><Star size={10} className="fill-white"/> Premium</span>}
            </div>

            {/* Desktop Wishlist & Share overlay */}
            <div className="hidden md:flex absolute top-6 right-6 flex-col gap-2 z-10">
              <button onClick={toggleWishlist} className="w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-foreground/70">
                <Heart size={20} className={wishlist.includes(product.id.toString()) ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-foreground/70">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Desktop thumbnails (optional, hidden on mobile) */}
          <div className="hidden md:flex gap-4 mt-6">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${i === currentImageIndex ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                {img ? <Image src={img} alt={`Angle ${i+1}`} fill className="object-cover" /> : <div className="w-full h-full bg-black/5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full md:w-1/2 p-4 md:p-0 bg-white relative z-20 flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-2 md:mb-4">
            <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em]">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} className="fill-current md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-bold text-foreground">4.8</span>
              <span className="text-xs md:text-sm text-foreground/50">({reviews.length})</span>
            </div>
          </div>
          
          <h1 className="text-xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-4 md:mb-6">{product.name}</h1>
          
          <div className="flex items-end gap-2 mb-4 md:mb-8 pb-4 md:pb-8 border-b border-black/5">
            <span className="text-3xl md:text-5xl font-black text-primary">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm md:text-xl font-bold text-foreground/40 line-through mb-1.5 md:mb-2">{product.originalPrice}</span>
            )}
            {product.originalPrice && product.isSale && (
              <span className="text-xs md:text-sm font-bold text-red-500 mb-1.5 md:mb-2 ml-1 md:ml-3 px-2 py-1 bg-red-50 rounded-lg">
                Save {Math.round((1 - parseInt(product.price.replace(/\D/g,'')) / parseInt(product.originalPrice.replace(/\D/g,''))) * 100)}%
              </span>
            )}
          </div>
          
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-6 md:mb-8 max-w-prose">
            Premium 3D printed model crafted with eco-friendly PLA bioplastic. Highly detailed finish perfect for collectors and enthusiasts. Durable, sustainable, and proudly made in India. Experience the intersection of technology and art with this masterpiece.
          </p>

          {/* Desktop Add to Cart */}
          <div className="hidden md:flex gap-4 mb-8">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 py-4 md:py-5 bg-primary text-white rounded-2xl font-black tracking-widest uppercase text-sm md:text-base flex items-center justify-center hover:bg-[#4a5d4e] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              Add to Cart - {product.price}
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 border-y border-black/5 py-4 md:py-6 my-2 md:my-6">
            <div className="flex flex-col items-center justify-center text-center gap-1 md:gap-3">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#f4f5f4] flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-colors">
                <Truck size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Free<br className="md:hidden"/> Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1 md:gap-3">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#f4f5f4] flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-colors">
                <Undo2 size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">7 Days<br className="md:hidden"/> Return</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1 md:gap-3">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#f4f5f4] flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-colors">
                <ShieldCheck size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">1 Year<br className="md:hidden"/> Warranty</span>
            </div>
          </div>

          <div className="h-2 w-full bg-[#f4f5f4] md:hidden" />

          {/* Review Section */}
          <div className="pt-4 md:pt-8 bg-white">
            <h2 className="text-lg md:text-2xl font-heading font-black mb-4 md:mb-8 flex items-center justify-between">
              Customer Reviews
              <span className="text-xs md:text-sm text-primary font-bold cursor-pointer hover:underline bg-primary/10 px-4 py-2 rounded-full">Write a Review</span>
            </h2>
            
            <div className="flex flex-col gap-6 md:gap-8">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-black/5 pb-6 md:pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs md:text-base">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-bold">{review.name}</p>
                        <p className="text-[10px] md:text-xs text-foreground/40 font-bold uppercase tracking-wider">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={`md:w-4 md:h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 leading-snug md:leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar (Mobile Only) */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-black/10 p-3 pb-safe z-50 flex shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => addToCart(product)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black tracking-widest uppercase text-sm flex items-center justify-center hover:bg-[#4a5d4e] shadow-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
