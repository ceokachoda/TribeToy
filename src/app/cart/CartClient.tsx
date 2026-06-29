"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, memo, useEffect } from "react";

const CartItemRow = memo(({ item, updateQuantity, removeFromCart }: { item: any, updateQuantity: any, removeFromCart: any }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl p-4 md:p-6 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-6 items-center sm:items-stretch"
    >
      {/* Image */}
      <Link href={`/product/${item.id}`} className="w-32 h-32 rounded-2xl bg-[#f4f5f4] flex-shrink-0 relative overflow-hidden border border-black/5 block cursor-pointer group">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <ShoppingBag className="text-black/10 w-8 h-8" />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-grow w-full text-center sm:text-left justify-between py-1">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-[#4a5d4e] uppercase mb-2 block">{item.category}</span>
          <Link href={`/product/${item.id}`} className="hover:underline">
            <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight mb-2 line-clamp-2 cursor-pointer">{item.name}</h3>
          </Link>
          <p className="text-lg font-black text-[#1a1a1a]">{item.price}</p>
        </div>
        
        <div className="flex items-center justify-between mt-6 sm:mt-0 pt-4 sm:pt-0 border-t border-black/5 sm:border-0 w-full">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 bg-[#f4f5f4] rounded-full px-2 py-1 border border-black/5">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#5a6b5e] hover:text-[#1a1a1a] hover:shadow-sm transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center font-bold text-sm text-[#1a1a1a]">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-[#5a6b5e] hover:text-[#1a1a1a] hover:shadow-sm transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Delete */}
          <button 
            onClick={() => removeFromCart(item.id)}
            className="p-3 text-[#8a958c] hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
CartItemRow.displayName = "CartItemRow";

export default function CartClient() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();

  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [shippingFlatRate, setShippingFlatRate] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data: globalSettingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "global_settings")
        .single();
        
      if (globalSettingsData?.value) {
        setGstPercentage(globalSettingsData.value.gst_percentage || 0);
        setShippingFlatRate(globalSettingsData.value.shipping_flat_rate || 0);
        setFreeShippingThreshold(globalSettingsData.value.free_shipping_threshold || 0);
      }
    };
    fetchSettings();
  }, []);

  const handleCheckout = async () => {
    setIsProcessingCheckout(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      router.push("/checkout");
    } else {
      router.push("/login?redirect=/checkout");
    }
    // We do not reset isProcessingCheckout if redirecting, to prevent double clicks during navigation
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 max-w-4xl text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 rounded-full bg-[#f4f5f4] flex items-center justify-center mb-8 border border-black/5">
          <ShoppingBag className="w-10 h-10 text-[#8a958c]" />
        </div>
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Your cart is empty</h2>
        <p className="text-[#5a6b5e] mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium 3D printed collection.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#2a2a2a] hover:scale-105 transition-all shadow-lg">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-[#1a1a1a] mb-4">
          Your Cart
        </h1>
        <p className="text-[#5a6b5e] font-medium">You have <span className="font-bold text-[#1a1a1a]">{totalItems} {totalItems === 1 ? "item" : "items"}</span> in your cart.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-[#f6f7f6] rounded-[2rem] p-8 border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-8">Order Summary</h3>
            
            <div className="flex flex-col gap-4 text-[#5a6b5e] font-medium mb-8">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a1a1a]">₹{totalPrice.toFixed(2)}</span>
              </div>
              
              {(() => {
                const shippingCost = totalPrice < freeShippingThreshold ? shippingFlatRate : 0;
                const gstAmount = (totalPrice * gstPercentage) / 100;
                const finalAmount = totalPrice + shippingCost + gstAmount;
                
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? "text-[#4a5d4e] font-bold bg-[#4a5d4e]/10 px-2 py-0.5 rounded-md text-xs uppercase tracking-wider" : "font-bold text-[#1a1a1a]"}>
                        {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {gstPercentage > 0 && (
                      <div className="flex justify-between items-center">
                        <span>GST ({gstPercentage}%)</span>
                        <span className="font-bold text-[#1a1a1a]">₹{gstAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="w-full h-px bg-black/10 my-2" />
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-[#1a1a1a]">Total</span>
                      <span className="font-black text-[#1a1a1a]">₹{finalAmount.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isProcessingCheckout ? (
                <>
                  <span>Checking...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="mt-6 flex flex-col gap-3 text-xs text-center text-[#8a958c] font-medium">
              <p>Secure checkout powered by Stripe & Razorpay</p>
              <p>7-day easy returns on non-custom items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
