"use client";

import { Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export function QuickViewModal({ 
  product, 
  isOpen, 
  onClose,
  isWishlisted,
  toggleWishlist
}: { 
  product: Product | null; 
  isOpen: boolean; 
  onClose: () => void;
  isWishlisted: boolean;
  toggleWishlist: () => void;
}) {
  const { addToCart } = useCart();

  // Prevent scroll when modal is open
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-black/5 hover:scale-110 transition-all border border-black/10"
            >
              <X size={20} />
            </button>

            {/* Left side: Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#f4f5f4] relative">
              {product.image ? (
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-[#8a958c]/40" />
                </div>
              )}
            </div>

            {/* Right side: Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
              <span className="text-xs font-black tracking-[0.2em] uppercase text-[#4a5d4e] mb-2">{product.category}</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1a1a1a] mb-4 leading-tight">{product.name}</h2>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-black text-[#1a1a1a]">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-[#8a958c] line-through font-bold">{product.originalPrice}</span>
                )}
              </div>

              <div className="prose prose-sm text-[#5a6b5e] mb-8 font-medium">
                <p>Experience the perfect blend of sustainable materials and expert craftsmanship with this unique 3D printed piece. Each item is carefully produced on-demand to minimize waste and ensure the highest quality.</p>
              </div>

              <div className="mt-auto pt-6 border-t border-black/5 flex flex-col gap-4">
                <button 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
                
                <button 
                  onClick={toggleWishlist}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 font-bold text-sm uppercase tracking-[0.1em] transition-all duration-300 ${
                    isWishlisted 
                      ? "border-red-500 text-red-500 bg-red-50/50 hover:bg-red-50" 
                      : "border-black/10 text-[#1a1a1a] hover:border-black/30 hover:bg-black/5"
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                  <span>{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
