"use client";

import { Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star, Send } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

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
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  
  // Mock reviews state
  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahul S.", rating: 5, text: "Amazing quality! Looks perfect on my desk. Highly recommended.", date: "Oct 12, 2023" },
    { id: 2, name: "Sneha P.", rating: 4, text: "Very detailed. Delivery took a bit long but the product is definitely worth the wait.", date: "Sep 28, 2023" }
  ]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
       
      setActiveTab("details"); // Reset tab on open
      setIsWritingReview(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }
    
    const newReview = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setReviews([newReview, ...reviews]);
    setIsWritingReview(false);
    setReviewText("");
    setReviewName("");
    setReviewRating(5);
    showToast("Review submitted successfully", "success");
  };

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
            className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-black/5 hover:scale-110 transition-all border border-black/10"
            >
              <X size={20} />
            </button>

            {/* Left side: Image */}
            <div className="w-full lg:w-1/2 h-48 sm:h-64 md:h-auto bg-[#f4f5f4] relative shrink-0">
              {product.image ? (
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-[#8a958c]/40" />
                </div>
              )}
            </div>

            {/* Right side: Content */}
            <div className="w-full lg:w-1/2 flex flex-col flex-1 min-h-0">
              
              {/* Tabs */}
              <div className="flex border-b border-black/5 px-6 md:px-8 pt-6 md:pt-8 shrink-0 gap-4 md:gap-6">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'details' ? 'text-[#1a1a1a]' : 'text-foreground/40 hover:text-foreground/70'}`}
                >
                  Details
                  {activeTab === 'details' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${activeTab === 'reviews' ? 'text-[#1a1a1a]' : 'text-foreground/40 hover:text-foreground/70'}`}
                >
                  Reviews <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[10px]">{reviews.length}</span>
                  {activeTab === 'reviews' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]" />
                  )}
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                <AnimatePresence mode="wait">
                  {activeTab === 'details' ? (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col h-full"
                    >
                      <span className="text-xs font-black tracking-[0.2em] uppercase text-primary mb-2">{product.category}</span>
                      <h2 className="text-2xl md:text-3xl font-heading font-black text-[#1a1a1a] mb-4 leading-tight">{product.name}</h2>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl font-black text-[#1a1a1a]">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-base text-[#8a958c] line-through font-bold">{product.originalPrice}</span>
                        )}
                      </div>

                      <div className="prose prose-sm text-[#5a6b5e] mb-8 font-medium">
                        <p>Experience the perfect blend of sustainable materials and expert craftsmanship with this unique piece. Each item is carefully produced on-demand to minimize waste and ensure the highest quality.</p>
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
                          <span>{isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="reviews"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col h-full"
                    >
                      {!isWritingReview ? (
                        <>
                          <div className="flex items-center justify-between mb-6 border-b border-foreground/5 pb-4">
                            <div>
                              <h3 className="text-xl font-heading font-black">Customer Reviews</h3>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className={i < 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/30 text-amber-400/30"} />
                                ))}
                                <span className="text-xs font-bold text-foreground/60 ml-2">4.8 out of 5</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setIsWritingReview(true)}
                              className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Write Review
                            </button>
                          </div>

                          <div className="flex flex-col gap-6 flex-1">
                            {reviews.map(review => (
                              <div key={review.id} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm text-foreground">{review.name}</span>
                                  <span className="text-[10px] font-bold text-foreground/40 uppercase">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-foreground/20"} />
                                  ))}
                                </div>
                                <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                                  &quot;{review.text}&quot;
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col h-full">
                          <h3 className="text-xl font-heading font-black mb-6">Write a Review</h3>
                          <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 flex-1">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Rating</label>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    <Star size={24} className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "fill-transparent text-foreground/20"} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Your Name</label>
                              <input 
                                type="text"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm"
                                placeholder="John Doe"
                              />
                            </div>
                            
                            <div className="flex-1 flex flex-col">
                              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">Your Review</label>
                              <textarea 
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full flex-1 min-h-[120px] p-4 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-medium text-sm"
                                placeholder="What did you think about this product?"
                              />
                            </div>

                            <div className="flex items-center gap-3 mt-auto pt-4">
                              <button 
                                type="button"
                                onClick={() => setIsWritingReview(false)}
                                className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-secondary transition-colors"
                              >
                                <Send size={16} /> Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
