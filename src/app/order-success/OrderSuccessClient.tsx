"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessClient() {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Generate a random order ID
    const id = "TRB" + Math.random().toString(36).substring(2, 9).toUpperCase();
    setOrderId(id);
    
    // Clear the cart when landing on this page
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-6 pt-32 pb-32 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white rounded-[3rem] p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4a5d4e]/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4a5d4e]/5 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-24 h-24 bg-[#eff4f0] rounded-full flex items-center justify-center mb-8 relative border border-[#4a5d4e]/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -top-2 -right-2 text-[#4a5d4e]"
          >
            <Sparkles size={24} />
          </motion.div>
          <CheckCircle2 className="w-12 h-12 text-[#4a5d4e]" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-[#1a1a1a] mb-4">
          Order Placed!
        </h1>
        <p className="text-[#5a6b5e] font-medium text-lg mb-8 max-w-md">
          Thank you for your order. We've received it and our 3D printers are warming up right now.
        </p>

        <div className="w-full bg-[#f4f5f4] rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-center gap-6 border border-black/5">
          <div className="flex items-center gap-3 text-[#1a1a1a]">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Package size={18} className="text-[#8a958c]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase">Order Number</p>
              <p className="font-bold font-mono text-lg">{orderId || "TRB..."}</p>
            </div>
          </div>
        </div>

        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
