"use client";

import { useCart } from "@/context/CartContext";
import { ArrowRight, CheckCircle2, ChevronLeft, CreditCard, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutClient() {
  const { cart, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Authentication Check
    if (localStorage.getItem("tribetoy_logged_in") !== "true") {
      router.push("/login?redirect=/checkout");
    }
  }, [router]);

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 max-w-4xl text-center pt-20">
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Your cart is empty</h2>
        <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold">Go Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/order-success");
  };

  return (
    <div className="container mx-auto px-6 md:px-12 max-w-6xl pt-32 pb-32">
      <div className="mb-12 flex items-center gap-4">
        <Link href="/cart" className="w-10 h-10 rounded-full bg-[#f4f5f4] flex items-center justify-center hover:bg-[#e1e9e3] transition-colors">
          <ChevronLeft className="text-[#1a1a1a]" size={20} />
        </Link>
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-[#1a1a1a]">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Shipping Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col gap-8">
            
            {/* Delivery Details */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-[#4a5d4e]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Delivery Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">First Name</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Last Name</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Address</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">City</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Postal Code</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-black/5" />

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-[#4a5d4e]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Payment Method</h3>
              </div>
              
              <div className="p-5 rounded-2xl border-2 border-[#4a5d4e] bg-[#eff4f0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4a5d4e] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="font-bold text-[#1a1a1a]">Cash on Delivery</span>
                </div>
                <CheckCircle2 className="text-[#4a5d4e]" />
              </div>
              <p className="text-xs text-[#8a958c] font-medium mt-3 ml-2">Razorpay and card payments will be enabled shortly.</p>
            </div>
            
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 sticky top-32">
          <div className="bg-[#f6f7f6] rounded-[2rem] p-8 border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white flex-shrink-0 relative overflow-hidden border border-black/5">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-[#1a1a1a] line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-[#5a6b5e]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#1a1a1a] whitespace-nowrap">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-black/10 my-6" />

            <div className="flex flex-col gap-3 text-[#5a6b5e] font-medium mb-8">
              <div className="flex justify-between items-center">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-[#1a1a1a]">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="text-[#4a5d4e] font-bold">Free</span>
              </div>
              <div className="w-full h-px bg-black/10 my-2" />
              <div className="flex justify-between items-center text-2xl">
                <span className="font-black text-[#1a1a1a]">Total</span>
                <span className="font-black text-[#1a1a1a]">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
