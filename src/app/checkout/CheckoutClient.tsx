"use client";

import { useCart } from "@/context/CartContext";
import { ArrowRight, CheckCircle2, ChevronLeft, CreditCard, Truck, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutClient() {
  const { cart, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [pincode, setPincode] = useState("");
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [phone, setPhone] = useState("");
  const [savedAddressData, setSavedAddressData] = useState<any>(null);

  // Global settings state
  const [gstPercentage, setGstPercentage] = useState(0);
  const [shippingFlatRate, setShippingFlatRate] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  useEffect(() => {
    const fetchUserDataAndSettings = async () => {
      const supabase = createClient();
      
      // Fetch global settings
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

      // Fetch user data
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (session.user.user_metadata?.phone) {
          setPhone(session.user.user_metadata.phone);
        }
        
        const { data: userData } = await supabase
          .from("users")
          .select("phone, address")
          .eq("id", session.user.id)
          .single();
          
        if (userData?.phone && !session.user.user_metadata?.phone) {
          setPhone(userData.phone);
        }
        
        if (userData?.address) {
          try {
            const parsed = JSON.parse(userData.address);
            if (parsed && typeof parsed === 'object') {
              setSavedAddressData(parsed);
              if (parsed.pincode) setPincode(parsed.pincode);
              if (parsed.phone) setPhone(parsed.phone);
            }
          } catch (e) {
            setSavedAddressData({ streetAddress: userData.address });
          }
        }
      }
    };
    fetchUserDataAndSettings();
  }, []);

  useEffect(() => {
    if (pincode.length === 6) {
      setIsFetchingLocation(true);
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success") {
            const postOffices = data[0].PostOffice;
            const uniqueCities = Array.from(new Set(postOffices.map((po: any) => po.District || po.Region))) as string[];
            setCityOptions(uniqueCities);
            setSelectedCity(uniqueCities[0] || "");
            setStateName(postOffices[0].State || "");
          } else {
            setCityOptions([]);
            setStateName("");
          }
        })
        .catch(() => {
          setCityOptions([]);
          setStateName("");
        })
        .finally(() => setIsFetchingLocation(false));
    } else {
      setCityOptions([]);
      setStateName("");
    }
  }, [pincode]);

  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    const checkFirstOrder = async () => {
      // Check if logged in or if phone is provided and at least 10 digits
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user && (!phone || phone.length < 10)) {
        setIsFirstOrder(true);
        return;
      }

      try {
        const res = await fetch("/api/user/first-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phone || null })
        });
        const data = await res.json();
        setIsFirstOrder(!!data.isFirstOrder);
      } catch (e) {
        console.error(e);
      }
    };
    
    const timeoutId = setTimeout(() => {
      checkFirstOrder();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [phone]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 max-w-4xl text-center pt-20">
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Your cart is empty</h2>
        <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold">Go Shopping</button>
      </div>
    );
  }

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const discountedSubtotal = totalPrice - discountAmount;
  
  let shippingCost = shippingFlatRate;
  
  if (isFirstOrder && discountedSubtotal >= 399) {
    shippingCost = 0;
  } else if (discountedSubtotal >= freeShippingThreshold) {
    shippingCost = 0;
  }
  
  const gstAmount = (discountedSubtotal * gstPercentage) / 100;
  
  const finalAmount = discountedSubtotal + shippingCost + gstAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: totalPrice })
      });
      const data = await res.json();
      if (data.error) {
        setCouponError(data.error);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
      }
    } catch (err) {
      setCouponError("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    const shipping_address = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      pincode,
      state: stateName,
      city: selectedCity
    };

    // If the user didn't have a phone number, update it in their profile
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && !session.user.user_metadata?.phone && shipping_address.phone) {
      await supabase.auth.updateUser({
        data: { phone: shipping_address.phone }
      });
    }

    const payload = {
      amount: finalAmount,
      shipping_address,
      items: cart,
      coupon_code: appliedCoupon ? couponCode : undefined
    };

    if (paymentMethod === "cod") {
      try {
        const res = await fetch("/api/checkout/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          router.push(`/order-success?id=${data.orderId}`);
        } else {
          alert("Error placing order: " + data.error);
        }
      } catch (err) {
        console.error("COD error", err);
        alert("Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        const res = await fetch("/api/checkout/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const orderData = await res.json();

        if (orderData.error) {
          alert("Error creating order: " + orderData.error);
          setIsProcessing(false);
          return;
        }
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "TribeToy",
          description: "Purchase from TribeToy",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: finalAmount,
                shipping_address,
                items: cart,
                coupon_code: appliedCoupon ? couponCode : undefined
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/order-success?id=${verifyData.orderId}`);
            } else {
              alert("Payment verification failed: " + verifyData.error);
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${shipping_address.firstName} ${shipping_address.lastName}`
          },
          theme: {
            color: "#4a5d4e"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } catch (err) {
        console.error("Razorpay error", err);
        alert("Something went wrong initiating payment");
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container mx-auto px-6 md:px-12 max-w-6xl pt-20 md:pt-32 pb-32">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">First Name</label>
                    <input name="firstName" required type="text" defaultValue={savedAddressData?.firstName || ""} className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Last Name</label>
                    <input name="lastName" required type="text" defaultValue={savedAddressData?.lastName || ""} className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-span-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Phone Number</label>
                    <input 
                      name="phone" 
                      required 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-span-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Address</label>
                    <input name="address" required type="text" defaultValue={savedAddressData?.streetAddress || savedAddressData?.address || ""} className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Postal Code</label>
                    <input 
                      name="pincode"
                      required 
                      type="text" 
                      maxLength={6} 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">State</label>
                    <input 
                      required 
                      type="text" 
                      readOnly 
                      value={stateName} 
                      placeholder={isFetchingLocation ? "Fetching..." : "Auto-filled via Pincode"}
                      className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4]/50 border border-transparent outline-none font-medium text-[#1a1a1a]/70 placeholder:text-[#1a1a1a]/30 cursor-not-allowed" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-span-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">City</label>
                    {cityOptions.length > 0 ? (
                      <div className="relative">
                        <select 
                          required 
                          value={selectedCity} 
                          onChange={(e) => setSelectedCity(e.target.value)} 
                          className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a] appearance-none"
                        >
                          {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-[#8a958c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    ) : (
                      <input 
                        required 
                        type="text" 
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)} 
                        disabled={isFetchingLocation} 
                        placeholder={isFetchingLocation ? "Fetching..." : "Enter City"} 
                        className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none font-medium text-[#1a1a1a]" 
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-black/5" />

              {/* Payment Method */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="text-[#4a5d4e]" />
                  <h3 className="text-xl font-bold text-[#1a1a1a]">Payment Method</h3>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "razorpay" 
                      ? "border-[#4a5d4e] bg-[#eff4f0]" 
                      : "border-black/10 bg-white hover:border-[#4a5d4e]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      paymentMethod === "razorpay" ? "bg-[#4a5d4e] border-[#4a5d4e]" : "border-black/20"
                    }`}>
                      {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1a1a]">Online Payment (Razorpay)</span>
                      <span className="text-xs text-[#8a958c] font-medium mt-1">UPI, Credit/Debit Cards, NetBanking</span>
                    </div>
                  </div>
                  {paymentMethod === "razorpay" && <CheckCircle2 className="text-[#4a5d4e]" />}
                </div>

                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "cod" 
                      ? "border-[#4a5d4e] bg-[#eff4f0]" 
                      : "border-black/10 bg-white hover:border-[#4a5d4e]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      paymentMethod === "cod" ? "bg-[#4a5d4e] border-[#4a5d4e]" : "border-black/20"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1a1a]">Cash on Delivery</span>
                      <span className="text-xs text-[#8a958c] font-medium mt-1">Pay when your order arrives</span>
                    </div>
                  </div>
                  {paymentMethod === "cod" && <CheckCircle2 className="text-[#4a5d4e]" />}
                </div>
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

              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1a1a1a] mb-3">Discount Code</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    disabled={!!appliedCoupon || isApplyingCoupon}
                    className="flex-grow px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-[#4a5d4e] outline-none font-medium text-sm"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                        setCouponError("");
                      }}
                      className="px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors border border-red-100"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || isApplyingCoupon}
                      className="px-6 py-3 rounded-xl bg-[#4a5d4e] text-white font-bold text-sm hover:bg-[#38463b] transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {couponError && <p className="text-red-500 text-xs font-medium mt-2">{couponError}</p>}
                {appliedCoupon && <p className="text-[#4a5d4e] text-xs font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> Coupon applied successfully!</p>}
              </div>

              <div className="w-full h-px bg-black/10 my-6" />

              <div className="flex flex-col gap-3 text-[#5a6b5e] font-medium mb-8">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-[#1a1a1a]">₹{totalPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-[#4a5d4e]">
                    <span>Discount ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₹${appliedCoupon.discount_value}`})</span>
                    <span className="font-bold">-₹{appliedCoupon.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-[#4a5d4e] font-bold" : "font-bold text-[#1a1a1a]"}>
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
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-black text-[#1a1a1a]">Total</span>
                  <span className="font-black text-[#1a1a1a]">₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing || isFetchingLocation || !selectedCity || !stateName}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl ${isProcessing ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''}`}
              >
                <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
