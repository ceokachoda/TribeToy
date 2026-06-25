"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, User, MapPin, CreditCard, ChevronRight, ChevronLeft, Download, Truck, CheckCircle2, Circle, X, Heart } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { products, Product } from "@/data/products";

// Mock Tracking Stages
const trackingStages = [
  { label: "Order Placed", status: "completed" },
  { label: "Processing", status: "current" },
  { label: "Shipped", status: "upcoming" },
  { label: "Delivered", status: "upcoming" },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tab || "profile");
  const [isMobileMenu, setIsMobileMenu] = useState(!tab);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      setIsMobileMenu(false);
    } else {
      setIsMobileMenu(true);
    }
  }, [tab]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("tribetoy_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {}
    }

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
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Full Name</label>
                  <input type="text" defaultValue="Karan Malakar" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Email</label>
                  <input type="email" defaultValue="karan@example.com" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full px-5 py-3 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 outline-none font-medium text-[#1a1a1a]" />
                </div>
              </div>
              <button className="mt-8 px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-colors">
                Save Changes
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
                        <span className="px-3 py-1 bg-[#eff4f0] text-[#4a5d4e] rounded-lg text-xs font-bold uppercase tracking-wider">{order.status}</span>
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
                          <p className="font-bold text-[#1a1a1a]">Order #{order.id}</p>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-center">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Saved Addresses</h2>
              <p className="text-[#5a6b5e]">You haven't saved any addresses yet.</p>
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
                  <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-black/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
                      <h3 className="text-base md:text-lg font-bold text-[#1a1a1a] whitespace-nowrap">Invoice Details</h3>
                      <button className="flex items-center gap-1.5 md:gap-2 text-[#4a5d4e] hover:text-[#3a4d3e] font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0">
                        <Download size={14} className="hidden lg:block"/>
                        <Download size={12} className="lg:hidden"/>
                        Download PDF
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 md:gap-4 py-4 border-b border-black/5">
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#f4f5f4] rounded-xl relative overflow-hidden flex-shrink-0">
                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-xs md:text-sm font-bold text-[#1a1a1a] line-clamp-2 md:line-clamp-none leading-snug">{item.name}</h4>
                            <p className="text-[10px] md:text-xs text-[#8a958c] mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm md:text-base font-bold text-[#1a1a1a] whitespace-nowrap shrink-0">₹{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 mt-6 text-[#5a6b5e] font-medium text-sm">
                      <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span className="font-bold text-[#1a1a1a]">₹{selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping</span>
                        <span className="font-bold text-[#4a5d4e]">Free</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment Method</span>
                        <span className="font-bold text-[#1a1a1a]">Cash on Delivery</span>
                      </div>
                      <div className="w-full h-px bg-black/10 my-2" />
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-black text-[#1a1a1a]">Total Paid</span>
                        <span className="font-black text-[#1a1a1a]">₹{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfileClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
