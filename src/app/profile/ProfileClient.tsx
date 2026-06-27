"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, User, MapPin, CreditCard, ChevronRight, ChevronLeft, Download, Truck, CheckCircle2, Circle, X, Heart, Lock, Loader2, Phone, Shield } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { products, Product } from "@/data/products";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/utils/supabase/client";

// Mock Tracking Stages
const trackingStages = [
  { label: "Order Placed", status: "completed" },
  { label: "Processing", status: "current" },
  { label: "Shipped", status: "upcoming" },
  { label: "Delivered", status: "upcoming" },
];

function ProfileContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tab || "profile");
  const [isMobileMenu, setIsMobileMenu] = useState(!tab);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("Damaged Product");
  const [refundDescription, setRefundDescription] = useState("");
  const [refundPolicyAgreed, setRefundPolicyAgreed] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  // Phone OTP Modal State
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: Enter Number, 2: Enter OTP
  const [newPhone, setNewPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("users").update({ full_name: fullName }).eq("id", session.user.id);
    }
    setIsSavingProfile(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleSaveAddress = async () => {
    setIsSavingAddress(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("users").update({ address }).eq("id", session.user.id);
      showToast("Address updated successfully!", "success");
    }
    setIsSavingAddress(false);
  };

  const handleSavePhoneDirect = async () => {
    setIsVerifyingOtp(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { phone: newPhone }
    });
    setIsVerifyingOtp(false);
    setPhone(newPhone);
    setShowPhoneModal(false);
    setNewPhone("");
    showToast("Phone number saved successfully!", "success");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone) return;

    if (!phone) {
      await handleSavePhoneDirect();
      return;
    }

    setIsSendingOtp(true);
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSendingOtp(false);
    setOtpStep(2);
    showToast("OTP sent to new number", "success");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    setIsVerifyingOtp(true);
    // Simulate verifying OTP
    await new Promise(resolve => setTimeout(resolve, 1000));

    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { phone: newPhone }
    });

    setIsVerifyingOtp(false);
    setPhone(newPhone);
    setShowPhoneModal(false);
    setOtpStep(1);
    setNewPhone("");
    setOtpCode("");
    showToast("Phone number updated successfully!", "success");
  };

  const generatePDF = async () => {
    const element = document.getElementById("invoice-container");
    const header = document.getElementById("invoice-header");
    if (!element || !header) return;
    const html2pdf = (await import('html2pdf.js')).default;
    
    header.classList.remove("hidden");
    
    const opt = {
      margin: 0.5,
      filename: `TribeToy_Invoice_${selectedOrder?.id}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };
    
    await html2pdf().set(opt).from(element).save();
    
    header.classList.add("hidden");
  };


  const getStatusColors = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'cancelled': return 'bg-red-50 text-red-600 border border-red-200';
      case 'processing': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'shipped': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-600 border border-green-200';
      case 'refund requested': return 'bg-orange-50 text-orange-600 border border-orange-200';
      default: return 'bg-[#eff4f0] text-[#4a5d4e] border border-transparent';
    }
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      setIsMobileMenu(false);
    } else {
      setIsMobileMenu(true);
    }
  }, [tab]);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setFullName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User");
        setEmail(session.user.email || "");
        setPhone(session.user.user_metadata?.phone || "");
        
        // Fetch role and address
        const { data: userData } = await supabase
          .from("users")
          .select("role, address")
          .eq("id", session.user.id)
          .single();
          
        if (userData?.role === "admin") {
          setIsAdmin(true);
        }
        if (userData?.address) {
          setAddress(userData.address);
        }
        
        // Fetch real orders from database
        const { data: orderData } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price_at_purchase,
              products (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (orderData) {
          // Format orders to match UI expectations
          const formattedOrders = orderData.map((o: any) => ({
            id: o.id,
            status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Processing',
            date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: o.total_amount,
            items: o.order_items?.map((item: any) => ({
              id: item.products?.id,
              name: item.products?.name,
              price: item.price_at_purchase,
              quantity: item.quantity,
              image: item.products?.image_url || ""
            })) || []
          }));
          setOrders(formattedOrders);
        }
      }
    };
    
    fetchUserData();

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("tribetoy_wishlist");
    if (savedWishlist) {
      try {
        const wishlistIds = JSON.parse(savedWishlist) as number[];
        const items = products.filter(p => wishlistIds.includes(p.id));
        setWishlistItems(items);
      } catch (e) {}
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    localStorage.setItem("tribetoy_orders", JSON.stringify(updatedOrders));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, "Cancelled");
      setShowCancelModal(false);
      showToast("Your order has been cancelled.", "success");
    }
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder && refundPolicyAgreed) {
      updateOrderStatus(selectedOrder.id, "Refund Requested");
      setShowRefundModal(false);
      setRefundReason("Damaged Product");
      setRefundDescription("");
      setRefundPolicyAgreed(false);
    }
  };

  const simulateDelivery = (orderId: string) => {
    updateOrderStatus(orderId, "Delivered");
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setIsMobileMenu(false);
    router.push(`/profile?tab=${newTab}`, { scroll: false });
  };

  const handleLogout = () => {
    localStorage.removeItem("tribetoy_logged_in");
    router.push("/");
  };

  return (
    <div className="container mx-auto px-6 pt-20 md:pt-32 pb-32 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        
        {/* Sidebar Nav */}
        <div className={`w-full lg:w-1/4 flex-col gap-2 ${isMobileMenu ? 'flex' : 'hidden lg:flex'}`}>
          <h1 className="text-3xl font-heading font-black text-[#1a1a1a] mb-6">My Account</h1>
          
          <button 
            onClick={() => handleTabChange("profile")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "profile" 
                ? "bg-[#4a5d4e] text-white shadow-lg shadow-[#4a5d4e]/20" 
                : "bg-white text-[#5a6b5e] hover:bg-[#f4f5f4] border border-black/5"
            }`}
          >
            <User size={18} />
            Profile Details
          </button>
          
          <button 
            onClick={() => handleTabChange("orders")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "orders" 
                ? "bg-[#4a5d4e] text-white shadow-lg shadow-[#4a5d4e]/20" 
                : "bg-white text-[#5a6b5e] hover:bg-[#f4f5f4] border border-black/5"
            }`}
          >
            <Package size={18} />
            My Orders
          </button>

          <button 
            onClick={() => handleTabChange("wishlist")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "wishlist" 
                ? "bg-[#4a5d4e] text-white shadow-lg shadow-[#4a5d4e]/20" 
                : "bg-white text-[#5a6b5e] hover:bg-[#f4f5f4] border border-black/5"
            }`}
          >
            <Heart size={18} />
            My Wishlist
          </button>
          
          <button 
            onClick={() => handleTabChange("addresses")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              activeTab === "addresses" 
                ? "bg-[#4a5d4e] text-white shadow-lg shadow-[#4a5d4e]/20" 
                : "bg-white text-[#5a6b5e] hover:bg-[#f4f5f4] border border-black/5"
            }`}
          >
            <MapPin size={18} />
            Saved Addresses
          </button>

          {isAdmin && (
            <button 
              onClick={() => router.push("/admin")}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 mt-2 border border-emerald-100"
            >
              <Shield size={18} />
              Admin Dashboard
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm bg-red-50 text-red-500 hover:bg-red-100 mt-8"
          >
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div className={`w-full lg:w-3/4 ${!isMobileMenu ? 'block' : 'hidden lg:block'}`}>
          <button 
            onClick={() => {
              setIsMobileMenu(true);
              router.push('/profile', { scroll: false });
            }}
            className="flex lg:hidden items-center gap-2 text-[#8a958c] font-bold mb-6 hover:text-[#1a1a1a] transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Profile Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <User size={16} className="text-[#8a958c]" />
                    </div>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a] transition-all" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      readOnly
                      className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4]/50 border border-transparent outline-none font-medium text-[#1a1a1a]/50 cursor-not-allowed" 
                    />
                    <p className="text-[10px] text-[#8a958c] ml-1 mt-1 font-medium">Email address cannot be changed.</p>
                  </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Phone Number</label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Phone size={16} className="text-[#8a958c]" />
                      </div>
                      <input 
                        type="tel" 
                        value={phone || "No phone number added"} 
                        readOnly
                        className={`w-full pl-11 pr-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent outline-none font-medium ${!phone ? 'text-[#8a958c]' : 'text-[#1a1a1a]'} cursor-default`} 
                      />
                    </div>
                    <button 
                      onClick={() => setShowPhoneModal(true)}
                      className="px-6 rounded-2xl bg-[#eff4f0] text-[#4a5d4e] font-bold text-xs uppercase tracking-wider hover:bg-[#e1e9e3] transition-colors shrink-0"
                    >
                      {phone ? "Change" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="mt-8 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-colors flex items-center justify-center min-w-[200px] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-black/5 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#f4f5f4] rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-[#8a958c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">No orders yet</h3>
                  <p className="text-[#5a6b5e] mb-8">When you place an order, it will show up here.</p>
                  <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-colors">
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order, index) => (
                  <div key={index} className="bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-6 justify-between hover:border-[#4a5d4e]/20 transition-all cursor-pointer group" onClick={() => setSelectedOrder(order)}>
                    <div className="flex flex-col gap-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColors(order.status)}`}>{order.status}</span>
                        <span className="text-sm font-medium text-[#8a958c]">{order.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                          {order.items.slice(0, 3).map((item: any, i: number) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-[#f4f5f4] relative overflow-hidden flex-shrink-0">
                              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-[#f4f5f4] flex items-center justify-center text-xs font-bold text-[#5a6b5e] z-10 relative">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a]">Order #{`TT-${order.id.split("-")[0].toUpperCase()}`}</p>
                          <p className="text-sm text-[#5a6b5e]">{order.items.length} items • ₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-8">
                      <div className="flex items-center gap-2 text-[#4a5d4e] font-bold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "addresses" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Saved Address</h2>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Shipping Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  placeholder="Enter your full shipping address here..."
                  className="w-full px-5 py-4 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a] transition-all resize-none" 
                />
              </div>
              <button 
                onClick={handleSaveAddress}
                disabled={isSavingAddress}
                className="mt-6 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-colors flex items-center justify-center min-w-[200px] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isSavingAddress ? <Loader2 size={18} className="animate-spin" /> : "Save Address"}
              </button>
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">My Wishlist</h2>
              
              {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-black/5 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#f4f5f4] rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-[#8a958c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Your wishlist is empty</h3>
                  <p className="text-[#5a6b5e] mb-8">Save items you love to your wishlist to review them later.</p>
                  <button onClick={() => router.push("/shop")} className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-colors">
                    Explore Toys
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <div key={product.id} className="bg-white rounded-[2rem] p-4 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col group relative overflow-hidden">
                      <div className="w-full aspect-square bg-[#f4f5f4] rounded-xl relative overflow-hidden mb-4">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const saved = localStorage.getItem("tribetoy_wishlist");
                            if (saved) {
                              const ids = JSON.parse(saved);
                              const newIds = ids.filter((id: number) => id !== product.id);
                              localStorage.setItem("tribetoy_wishlist", JSON.stringify(newIds));
                              setWishlistItems(wishlistItems.filter(item => item.id !== product.id));
                            }
                          }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
                        >
                          <Heart size={16} className="fill-current" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1 px-2">
                        <h3 className="font-bold text-[#1a1a1a] truncate">{product.name}</h3>
                        <p className="text-[#4a5d4e] font-black">{product.price}</p>
                      </div>
                      <button 
                        onClick={() => router.push(`/shop`)}
                        className="mt-4 w-full py-3 bg-[#eff4f0] text-[#4a5d4e] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#e1e9e3] transition-colors"
                      >
                        Find in Shop
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* E-Bill & Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#f6f7f6] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 md:right-8 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-black/5 hover:scale-110 transition-all border border-black/10 shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto md:overflow-hidden custom-scrollbar flex-grow flex flex-col">
                {/* Header Graphic */}
                <div className="bg-[#4a5d4e] text-white p-10 md:py-14 md:pl-14 md:pr-24 relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start md:items-end gap-6">
                    <div className="md:max-w-[60%]">
                      <h2 className="text-3xl md:text-4xl font-heading font-black mb-2 tracking-tight">Order Details</h2>
                      <p className="text-white/80 font-medium">Thank you for shopping with TribeToy!</p>
                    </div>
                    <div className="text-left md:text-right md:max-w-[40%]">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase mb-1">Order Number</p>
                      <p className="font-mono text-xl md:text-2xl font-bold tracking-tight truncate" title={selectedOrder.id.toString()}>{selectedOrder.id}</p>
                    </div>
                  </div>
                </div>

                <div className="md:overflow-y-auto custom-scrollbar flex-grow">
                  <div className="p-8 md:p-12 flex flex-col gap-10">
                  {/* Tracking Timeline */}
                  <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-8">Tracking Status</h3>
                    <div className="flex items-center justify-between relative">
                      {/* Connecting Line */}
                      <div className="absolute top-4 left-0 w-full h-[2px] bg-[#f4f5f4] -z-10" />
                      <div className="absolute top-4 left-0 w-1/3 h-[2px] bg-[#4a5d4e] -z-10" />

                      {trackingStages.map((stage, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            stage.status === 'completed' ? 'bg-[#4a5d4e] border-[#4a5d4e] text-white' :
                            stage.status === 'current' ? 'bg-white border-[#4a5d4e] text-[#4a5d4e]' :
                            'bg-white border-[#e1e9e3] text-[#e1e9e3]'
                          }`}>
                            {stage.status === 'completed' ? <CheckCircle2 size={16} /> : <Circle size={10} className={stage.status === 'current' ? "fill-current" : ""} />}
                          </div>
                          <span className={`text-xs font-bold text-center ${
                            stage.status === 'completed' || stage.status === 'current' ? 'text-[#1a1a1a]' : 'text-[#8a958c]'
                          }`}>{stage.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex items-center gap-4 bg-[#eff4f0] p-4 rounded-xl text-[#4a5d4e] font-medium text-sm">
                      <Truck size={20} />
                      <p>Your order is currently being processed and prepared for 3D printing.</p>
                    </div>
                  </div>

                  {/* E-Bill Breakdown */}
                  <div id="invoice-container" className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-[rgba(0,0,0,0.05)] shadow-sm">
                    <div className="flex items-center justify-between mb-6 md:mb-8 gap-4" data-html2canvas-ignore>
                      <h3 className="text-base md:text-lg font-bold text-[#1a1a1a] whitespace-nowrap">Invoice Details</h3>
                      <button onClick={generatePDF} className="flex items-center gap-1.5 md:gap-2 text-[#4a5d4e] hover:text-[#3a4d3e] font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0">
                        <Download size={14} className="hidden lg:block"/>
                        <Download size={12} className="lg:hidden"/>
                        Download PDF
                      </button>
                    </div>

                    <div className="hidden" id="invoice-header">
                      <div className="flex justify-between items-end mb-8 border-b border-[rgba(0,0,0,0.1)] pb-4">
                        <div>
                          <h1 className="text-3xl font-black text-[#1a1a1a]">TribeToy Invoice</h1>
                          <p className="text-sm text-[#8a958c] mt-1">Order #{selectedOrder ? `TT-${selectedOrder.id.split("-")[0].toUpperCase()}` : ""}</p>
                        </div>
                        <div className="text-right text-sm text-[#5a6b5e]">
                          <p>{selectedOrder?.date}</p>
                          <p className="mt-1">{fullName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {(selectedOrder?.items || []).map((item: any, i: number) => {
                        const rawPrice = item.price;
                        const numericPrice = typeof rawPrice === 'string' 
                          ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) 
                          : parseFloat(rawPrice || 0);
                        const qty = item.quantity || 1;
                        const itemTotal = isNaN(numericPrice) ? 0 : numericPrice * qty;

                        return (
                          <div key={i} className="flex items-center gap-3 md:gap-4 py-4 border-b border-[rgba(0,0,0,0.05)]">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#f4f5f4] rounded-xl relative overflow-hidden flex-shrink-0">
                              {item.image && <Image src={item.image} alt={item.name || 'Product'} fill className="object-cover" />}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs md:text-sm font-bold text-[#1a1a1a] line-clamp-2 md:line-clamp-none leading-snug">{item.name || 'Product'}</h4>
                              <p className="text-[10px] md:text-xs text-[#8a958c] mt-0.5">Qty: {qty}</p>
                            </div>
                            <span className="text-sm md:text-base font-bold text-[#1a1a1a] whitespace-nowrap shrink-0">₹{itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-3 mt-6 text-[#5a6b5e] font-medium text-sm">
                      <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span className="font-bold text-[#1a1a1a]">₹{(selectedOrder?.total || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping</span>
                        <span className="font-bold text-[#4a5d4e]">Free</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment Method</span>
                        <span className="font-bold text-[#1a1a1a]">Cash on Delivery</span>
                      </div>

                      <div className="w-full h-px bg-[rgba(0,0,0,0.1)] my-2" />
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-black text-[#1a1a1a]">Total Paid</span>
                        <span className="font-black text-[#1a1a1a]">₹{(selectedOrder?.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedOrder.status === "Processing" && (
                    <div className="mt-6">
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        className="w-full py-4 rounded-xl border-2 border-red-500/20 text-red-500 font-bold uppercase tracking-wider text-sm hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === "Delivered" && (
                    <div className="mt-6">
                      <button 
                        onClick={() => setShowRefundModal(true)}
                        className="w-full py-4 rounded-xl border-2 border-amber-500/20 text-amber-600 font-bold uppercase tracking-wider text-sm hover:bg-amber-50 transition-colors"
                      >
                        Request Return / Refund
                      </button>
                    </div>
                  )}

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
                <X size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">Cancel Order?</h3>
              <p className="text-[#5a6b5e] text-sm mb-8">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 rounded-xl border-2 border-black/5 text-[#1a1a1a] font-bold text-sm uppercase hover:bg-black/5 transition-colors">Keep It</button>
                <button onClick={handleCancelOrder} className="flex-1 py-4 rounded-xl bg-red-500 text-white font-bold text-sm uppercase hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Yes, Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Refund/Return Modal */}
      <AnimatePresence>
        {showRefundModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRefundModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-black/5 shrink-0">
                <h3 className="text-xl font-black text-[#1a1a1a]">Request Return / Refund</h3>
                <button onClick={() => setShowRefundModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="refund-form" onSubmit={handleRefundSubmit} className="flex flex-col gap-5">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Reason for Return</label>
                    <select 
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none text-sm font-medium"
                    >
                      <option value="Damaged Product">Product arrived damaged</option>
                      <option value="Defective Product">Product is defective</option>
                      <option value="Wrong Item">Received the wrong item</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Description</label>
                    <textarea 
                      required
                      value={refundDescription}
                      onChange={(e) => setRefundDescription(e.target.value)}
                      placeholder="Please describe the issue in detail..."
                      className="w-full px-4 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white outline-none text-sm font-medium min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider flex justify-between">
                      <span>Upload Photos</span>
                      <span className="text-red-500">*Required</span>
                    </label>
                    <div className="w-full h-24 border-2 border-dashed border-black/10 rounded-xl bg-[#f4f5f4] flex items-center justify-center text-xs text-[#8a958c] font-medium cursor-pointer hover:bg-black/5 hover:border-[#4a5d4e]/30 transition-all">
                      Click or drag photos here
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 mt-2">
                    <input 
                      required
                      type="checkbox" 
                      id="policy-agree"
                      checked={refundPolicyAgreed}
                      onChange={(e) => setRefundPolicyAgreed(e.target.checked)}
                      className="mt-1 shrink-0 accent-amber-500"
                    />
                    <label htmlFor="policy-agree" className="text-xs text-amber-800 font-medium leading-relaxed">
                      I understand that returns are only accepted within 10 days of delivery, and customized/hand-painted products are <strong>not returnable</strong> unless defective or damaged.
                    </label>
                  </div>

                </form>
              </div>
              <div className="p-6 border-t border-black/5 bg-gray-50 shrink-0">
                <button form="refund-form" type="submit" disabled={!refundPolicyAgreed} className="w-full py-4 rounded-xl bg-[#4a5d4e] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#3a4d3e] transition-colors shadow-lg shadow-[#4a5d4e]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Phone Number OTP Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowPhoneModal(false); setOtpStep(1); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl z-10 flex flex-col text-center">
              <div className="w-12 h-12 rounded-full bg-[#eff4f0] flex items-center justify-center text-[#4a5d4e] mb-6 mx-auto">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-black text-[#1a1a1a] mb-2">Change Phone Number</h3>
              
              {otpStep === 1 ? (
                <>
                  <p className="text-[#5a6b5e] text-sm mb-6">{!phone ? "Enter your phone number." : "Enter your new phone number. We'll send a 6-digit OTP to verify it."}</p>
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 00000 00000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a] text-center text-lg"
                    />
                    <button type="submit" disabled={isSendingOtp || !newPhone} className="w-full py-4 rounded-xl bg-[#4a5d4e] text-white font-bold text-sm uppercase hover:bg-[#3a4d3e] transition-colors shadow-lg shadow-[#4a5d4e]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                      {isSendingOtp || isVerifyingOtp ? <Loader2 size={18} className="animate-spin" /> : (!phone ? "Save Phone Number" : "Send OTP")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-[#5a6b5e] text-sm mb-6">Enter the 6-digit code sent to <br/><strong className="text-[#1a1a1a]">{newPhone}</strong></p>
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="••••••"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 md:px-5 py-3 rounded-xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-bold text-[#1a1a1a] text-center text-xl md:text-2xl tracking-[0.25em] md:tracking-[0.5em] transition-all"
                    />
                    <button type="submit" disabled={isVerifyingOtp || otpCode.length !== 6} className="w-full py-4 rounded-xl bg-[#4a5d4e] text-white font-bold text-sm uppercase hover:bg-[#3a4d3e] transition-colors shadow-lg shadow-[#4a5d4e]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                      {isVerifyingOtp ? <Loader2 size={18} className="animate-spin" /> : "Verify & Save"}
                    </button>
                    <button type="button" onClick={() => setOtpStep(1)} className="text-xs text-[#8a958c] hover:text-[#1a1a1a] font-bold mt-2 transition-colors">Wrong number?</button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

}

export default function ProfileClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col gap-4 items-center justify-center"><div className="w-8 h-8 border-4 border-[#79987A] border-t-transparent rounded-full animate-spin"></div><div className="text-[#4A5D4E] font-medium font-outfit tracking-wide">Loading...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
