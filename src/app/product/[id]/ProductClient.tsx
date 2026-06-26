"use client";

import { products, Product } from "@/data/products";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Star, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Undo2, X, Loader2, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const { showToast } = useToast();
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);


  // Mocking multiple angles for the carousel
  const images = [
    product.image,
    product.image, // Placeholder for angle 2
    product.image  // Placeholder for angle 3
  ];

  // Mock reviews
  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahul S.", rating: 5, text: "Amazing quality! Looks perfect on my desk. Highly recommended.", date: "Oct 12, 2026" },
    { id: 2, name: "Sneha P.", rating: 4, text: "Very detailed. Delivery took a bit long but the product is definitely worth the wait.", date: "Sep 28, 2026" },
    { id: 3, name: "Arjun M.", rating: 5, text: "Exceeded my expectations. The 3D printing is flawless.", date: "Aug 15, 2026" }
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    setIsSubmittingReview(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const submittedReview = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setReviews([submittedReview, ...reviews]);
    setShowReviewModal(false);
    setNewReview({ name: "", text: "", rating: 5 });
    setIsSubmittingReview(false);
    showToast("Review submitted successfully!", "success");
  };

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
    <div className="pb-32 lg:pb-12 pt-0 lg:pt-28 lg:pt-32 bg-white min-h-screen w-full">
      
      {/* Desktop Breadcrumbs (Hidden on mobile) */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-8 py-6 items-center gap-2 text-sm text-foreground/50 font-bold uppercase tracking-wider">
        <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => router.push('/shop')} className="hover:text-primary transition-colors">Shop</button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* App Header (Fixed relative on mobile only) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-black/5">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  text: `Check out ${product.name} on TribeToy!`,
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "success");
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <Share2 size={20} />
          </button>
          <button onClick={toggleWishlist} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
            <Heart size={20} className={wishlist.includes(product.id.toString()) ? "fill-red-500 text-red-500" : ""} />
          </button>
          <button onClick={() => router.push('/cart')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto md:px-8 flex flex-col lg:flex-row gap-0 md:gap-12 lg:gap-16 items-start">
        {/* Left Side: Image Carousel */}
        <div className="w-full lg:w-1/2 flex-shrink-0">
          <div className="relative w-full aspect-square md:rounded-3xl bg-[#f4f5f4] mt-16 md:mt-0 overflow-hidden lg:border md:border-black/5 md:shadow-lg">
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
            <div className="hidden lg:flex absolute top-6 right-6 flex-col gap-2 z-10">
              <button onClick={toggleWishlist} className="w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-foreground/70">
                <Heart size={20} className={wishlist.includes(product.id.toString()) ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: `Check out ${product.name} on TribeToy!`,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    showToast("Link copied to clipboard!", "success");
                  }
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-foreground/70"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Desktop thumbnails (optional, hidden on mobile) */}
          <div className="hidden lg:flex gap-4 mt-6">
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
        <div className="w-full lg:w-1/2 p-4 md:p-0 bg-white relative z-20 flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-2 md:mb-4">
            <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em]">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} className="fill-current md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-bold text-foreground">
                {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0).toFixed(1)}
              </span>
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
            {product.description || `${product.name} crafted with eco-friendly PLA bioplastic. Highly detailed finish perfect for collectors and enthusiasts. Durable, sustainable, and proudly made in India. Experience the intersection of technology and art with this masterpiece.`}
          </p>

          {/* Desktop Add to Cart */}
          <div className="flex gap-4 mb-8">
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
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">Free<br className="lg:hidden"/> Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1 md:gap-3">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#f4f5f4] flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-colors">
                <Undo2 size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">7 Days<br className="lg:hidden"/> Return</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1 md:gap-3">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#f4f5f4] flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-colors">
                <ShieldCheck size={18} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-foreground/60 tracking-wider">1 Year<br className="lg:hidden"/> Warranty</span>
            </div>
          </div>

          <div className="h-2 w-full bg-[#f4f5f4] lg:hidden" />

          {/* Review Section */}
          <div className="pt-4 md:pt-8 bg-white">
            <h2 className="text-lg md:text-2xl font-heading font-black mb-4 md:mb-8 flex items-center justify-between">
              Customer Reviews
              <span onClick={() => setShowReviewModal(true)} className="text-xs md:text-sm text-primary font-bold cursor-pointer hover:underline bg-primary/10 px-4 py-2 rounded-full transition-colors">Write a Review</span>
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-heading font-black text-foreground">
              You May Also <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Like</span>
            </h2>
            <button onClick={() => router.push('/shop?category=' + encodeURIComponent(product.category))} className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                onClick={() => router.push('/product/' + relatedProduct.id)}
                className="group relative rounded-3xl bg-white border border-foreground/10 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(121,152,122,0.25)] hover:-translate-y-2 flex flex-col h-full transform-gpu cursor-pointer"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                
                {/* Image */}
                <div className="relative h-40 md:h-56 w-full bg-foreground/5 overflow-hidden flex items-center justify-center border-b border-foreground/5">
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] z-10 pointer-events-none" />
                  {relatedProduct.image ? (
                    <Image src={relatedProduct.image} alt={relatedProduct.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-foreground/10 flex flex-col items-center justify-center gap-2 transition-transform duration-[2s] group-hover:scale-105">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-sm">
                        <ShoppingBag className="text-foreground/30 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5 flex flex-col flex-grow relative z-20 bg-white">
                  <span className="text-[8px] md:text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-1 line-clamp-1">{relatedProduct.category}</span>
                  <h3 className="text-sm md:text-base font-heading font-bold text-foreground leading-tight mb-auto line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/5">
                    <span className="text-sm md:text-lg font-black text-foreground">{relatedProduct.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/shop?category=' + encodeURIComponent(product.category))} className="md:hidden w-full mt-6 py-4 bg-primary/10 text-primary rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            View All <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Fixed Bottom Action Bar (Mobile Only) */}
      <div className="fixed lg:hidden bottom-[72px] left-0 right-0 bg-white border-t border-black/10 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] z-[60] flex shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => addToCart(product)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black tracking-widest uppercase text-sm flex items-center justify-center hover:bg-[#4a5d4e] shadow-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-[#1a1a1a]">Write a Review</h3>
                <button onClick={() => setShowReviewModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                  <X size={20} className="text-[#8a958c]" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star size={28} className={star <= newReview.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Your Name</label>
                  <input 
                    required
                    type="text" 
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Review</label>
                  <textarea 
                    required
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Tell us what you think about this product..."
                    className="w-full px-4 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-sm min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingReview || !newReview.name || !newReview.text} 
                  className="mt-2 w-full py-4 rounded-xl bg-[#4a5d4e] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#3a4d3e] transition-colors shadow-lg shadow-[#4a5d4e]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
