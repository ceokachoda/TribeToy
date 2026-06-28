"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";

function OrderSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const id = searchParams.get("id");
      if (id) {
        setOrderId(id);
        const supabase = createClient();
        const { data } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
        if (data) {
          setOrderDetails(data);
        }
      }
      setLoading(false);
      clearCart();
    };

    fetchOrder();
  }, [clearCart, searchParams]);

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

        <div className="w-full bg-[#f4f5f4] rounded-2xl p-6 mb-10 flex flex-col items-center justify-center gap-6 border border-black/5">
          <div className="flex items-center gap-3 text-[#1a1a1a]">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Package size={18} className="text-[#8a958c]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase">Order ID</p>
              <p className="font-bold font-mono text-lg line-clamp-1 break-all max-w-[200px] sm:max-w-none">{orderId ? `TT-${orderId.split("-")[0].toUpperCase()}` : "Pending"}</p>
            </div>
          </div>
          {orderDetails && (
            <div className="w-full flex flex-col gap-2">
              <div className="w-full border-t border-black/10 pt-4 flex justify-between items-center px-4">
                <span className="text-sm font-bold text-[#5a6b5e]">Subtotal:</span>
                <span className="text-sm font-bold text-[#1a1a1a]">₹{orderDetails.subtotal_amount || orderDetails.total_amount}</span>
              </div>
              {orderDetails.discount_amount > 0 && (
                <div className="w-full flex justify-between items-center px-4 text-emerald-600">
                  <span className="text-sm font-bold">Discount Applied:</span>
                  <span className="text-sm font-bold">-₹{orderDetails.discount_amount}</span>
                </div>
              )}
              <div className="w-full flex justify-between items-center px-4 mt-2">
                <span className="text-base font-bold text-[#1a1a1a]">Final Total:</span>
                <span className="text-xl font-black text-[#1a1a1a]">₹{orderDetails.total_amount}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full relative z-20">
          <Link 
            href="/profile?tab=orders" 
            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#eff4f0] text-[#4a5d4e] font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#e1e9e3] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <FileText className="w-4 h-4" />
            <span>View E-Bill</span>
          </Link>
          <Link 
            href="/shop" 
            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col gap-4 items-center justify-center"><div className="w-8 h-8 border-4 border-[#79987A] border-t-transparent rounded-full animate-spin"></div><div className="text-[#4A5D4E] font-medium font-outfit tracking-wide">Loading...</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
