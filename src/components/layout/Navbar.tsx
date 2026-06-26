"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, Heart, Package, LogOut, Home, Store, Search, ArrowLeft, Shield, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "All Toys", href: "/shop" },
  { name: "Customization", href: "/customization" },
  { name: "Stories", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  const searchResults = useMemo(() => {
    // We will use a state for this instead
    return [];
  }, []);

  const [dynamicSearchResults, setDynamicSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        setDynamicSearchResults([]);
        return;
      }
      const query = searchQuery.toLowerCase();
      const supabase = createClient();
      const { data } = await supabase.from('products')
        .select('id, name, category, price, image_url, is_new')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(6);
      
      if (data) {
        setDynamicSearchResults(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: `₹${parseFloat(p.price).toFixed(2)}`,
          image: p.image_url || "",
        })));
      }
    };
    const timer = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User");
        
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        if (userData?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    };
    checkUser();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const checkWishlist = () => {
      const saved = localStorage.getItem("tribetoy_wishlist");
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          setWishlistCount(ids.length);
        } catch(e) {}
      } else {
        setWishlistCount(0);
      }
    };
    checkWishlist();
    const interval = setInterval(checkWishlist, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || mobileCategoriesOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [mobileMenuOpen, mobileCategoriesOpen]);

  return (
    <>
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" prefetch={true} className="relative flex items-center gap-2 group transition-all duration-500">
          <div className="relative z-10 w-10 h-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/20 group-hover:shadow-[0_0_15px_rgba(121,152,122,0.3)]">
            <Image 
              src="/logo-new.jpg" 
              alt="TribeToy Logo" 
              fill 
              className="object-cover scale-[1.15]"
            />
          </div>
          <div className="relative z-10 overflow-visible px-1">
            <span className="font-heading font-extrabold text-2xl tracking-tight hidden sm:block text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:via-primary group-hover:to-secondary group-hover:bg-[length:200%_auto] group-hover:animate-[gradient_3s_linear_infinite] group-hover:drop-shadow-[0_0_15px_rgba(121,152,122,0.4)]">
              Tribe<span className="text-primary group-hover:text-transparent">Toy</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch={link.href === '/' || link.href === '/shop'}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive ? "text-primary font-bold" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4">
          {userName ? (
            <div className="relative hidden lg:block">
              <button 
                className="p-2 text-foreground/80 hover:text-primary transition-colors flex items-center gap-2" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-black/5 p-2 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="px-4 py-4 border-b border-black/5 mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#eff4f0] text-[#4a5d4e] font-black flex items-center justify-center text-lg">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[10px] uppercase tracking-wider text-[#8a958c] font-bold mb-0.5">Signed in as</p>
                        <p className="text-sm font-black text-[#1a1a1a] truncate max-w-[120px]">{userName}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-2">
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-all group"
                        >
                          <Shield size={16} className="text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                          <span className="group-hover:translate-x-1 transition-transform">Admin Dashboard</span>
                        </Link>
                      )}
                      <Link 
                        href="/profile" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#5a6b5e] hover:text-[#1a1a1a] hover:bg-[#f4f5f4] rounded-xl font-bold transition-all group"
                      >
                        <User size={16} className="text-[#8a958c] group-hover:text-[#4a5d4e] transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">My Profile</span>
                      </Link>
                      <Link 
                        href="/profile?tab=orders" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#5a6b5e] hover:text-[#1a1a1a] hover:bg-[#f4f5f4] rounded-xl font-bold transition-all group"
                      >
                        <Package size={16} className="text-[#8a958c] group-hover:text-[#4a5d4e] transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">My Orders</span>
                      </Link>
                      <Link 
                        href="/profile?tab=wishlist" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#5a6b5e] hover:text-[#1a1a1a] hover:bg-[#f4f5f4] rounded-xl font-bold transition-all group"
                      >
                        <Heart size={16} className="text-[#8a958c] group-hover:text-red-500 transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">My Wishlist</span>
                      </Link>
                    </div>

                    <div className="h-px w-full bg-black/5 mb-2" />

                    <button 
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setUserName(null);
                        setUserMenuOpen(false);
                        showToast("Signed out successfully", "success");
                        router.refresh();
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all group"
                    >
                      <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden lg:flex px-5 py-2 rounded-full bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4a5d4e] transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
          <Link href="/profile?tab=wishlist" className="hidden lg:block p-2 text-foreground/80 hover:text-primary transition-colors relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </Link>
          <Link href="/cart" prefetch={true} className="hidden lg:block p-2 text-foreground/80 hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </Link>
        </div>

        {/* Mobile Right Side Actions */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Dynamic Greeting/Status Pill */}
          {userName ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary truncate max-w-[80px]">Hi, {userName.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full border border-foreground/5 backdrop-blur-md shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
              <span className="text-[10px] font-black uppercase tracking-wider text-foreground/60">Guest</span>
            </div>
          )}

          {/* Search Button */}
          <button 
            onClick={() => setMobileSearchOpen(true)}
            className="w-8 h-8 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-foreground/5 flex items-center justify-center text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
          >
            <Search size={14} />
          </button>

          {/* Wishlist Button (Mobile) */}
          <Link 
            href="/profile?tab=wishlist"
            className="relative w-8 h-8 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-foreground/5 flex items-center justify-center text-foreground/80 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
          >
            <Heart size={14} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </Link>

          {/* Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-white hover:bg-primary transition-all active:scale-95"
            aria-label="Menu"
          >
            <Menu size={14} />
          </button>
        </div>

      </div>
    </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 h-[100dvh] z-[60] bg-white flex flex-col lg:hidden"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-foreground/5 shadow-sm bg-white z-10">
              <button 
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 -ml-2 text-foreground/60 hover:text-foreground"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-full bg-foreground/5 rounded-full py-2.5 pl-10 pr-10 text-sm font-medium text-foreground outline-none border border-transparent focus:border-primary/30 focus:bg-white transition-all"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto bg-[#f4f5f4] p-4">
              {!searchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-50">
                  <Search size={48} className="mb-4 text-foreground/20" />
                  <p className="text-sm font-bold text-foreground/60">Type to search for toys, statues, and more</p>
                </div>
              ) : dynamicSearchResults.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/40 px-2 mb-1">Products</span>
                  {dynamicSearchResults.map(product => (
                    <button 
                      key={product.id}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        router.push(`/shop?search=${encodeURIComponent(product.name)}`);
                      }}
                      className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-foreground/5 text-left active:scale-[0.98] transition-transform"
                    >
                      <div className="w-14 h-14 bg-[#f4f5f4] rounded-xl overflow-hidden relative shrink-0">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store size={16} className="text-foreground/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{product.category}</p>
                        <h4 className="text-sm font-black text-foreground truncate">{product.name}</h4>
                        <p className="text-xs font-bold text-foreground/60 mt-0.5">{product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <X size={24} className="text-foreground/30" />
                  </div>
                  <p className="text-sm font-bold text-foreground">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-foreground/60 mt-1">Try checking for typos or using different terms.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 h-[100dvh] z-50 bg-background/98 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl overflow-y-auto overscroll-none pb-24 pt-16 transition-all duration-300 transform-gpu ${
          mobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <button
          className="absolute top-6 right-6 p-2 text-foreground hover:text-primary transition-colors z-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>
        <nav className="flex flex-col items-center gap-6 w-full">
          {navLinks.map((link, i) => (
            <div
              className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 50}ms` }}
              key={link.name}
            >
              <Link
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-heading font-bold text-foreground hover:text-primary transition-colors block px-4 py-2"
              >
                {link.name}
              </Link>
            </div>
          ))}

          <div 
            className={`w-12 h-1 bg-black/10 rounded-full my-2 transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
            style={{ transitionDelay: '300ms' }}
          />

          {userName ? (
            <>
              {isAdmin && (
                <div 
                  className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: '350ms' }}
                >
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 px-4 py-2">
                    <Shield size={24} />
                    Admin Dashboard
                  </Link>
                </div>
              )}
              <div 
                className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: '400ms' }}
              >
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors block px-4 py-2">
                  My Profile
                </Link>
              </div>
              <div 
                className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: '450ms' }}
              >
                <Link href="/profile?tab=wishlist" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors relative block px-4 py-2">
                  My Wishlist
                  {wishlistCount > 0 && <span className="absolute right-0 top-2 w-2 h-2 bg-red-500 rounded-full shadow-sm" />}
                </Link>
              </div>
              <div 
                className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: '500ms' }}
              >
                <Link href="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors block px-4 py-2">
                  My Orders
                </Link>
              </div>
              <div 
                className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: '550ms' }}
              >
                <button 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    setUserName(null);
                    setMobileMenuOpen(false);
                    showToast("Signed out successfully", "success");
                    router.refresh();
                  }}
                  className="text-xl font-heading font-bold text-red-500 hover:text-red-600 transition-colors block px-4 py-2"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div 
              className={`transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: '400ms' }}
            >
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-8 py-3 rounded-full bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#4a5d4e] transition-all block mt-4">
                Sign In
              </Link>
            </div>
          )}
        </nav>
        
        <div
          className={`mt-12 text-center flex flex-col items-center gap-1 transition-all duration-500 transform-gpu ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: '600ms' }}
        >
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
            Powered by WeDrip OS
          </span>
        </div>
      </div>
      {/* Mobile Categories Modal */}
      <AnimatePresence>
        {mobileCategoriesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-[100dvh] z-[70] bg-black/40 flex justify-end flex-col lg:hidden"
            onClick={() => setMobileCategoriesOpen(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl h-[70vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative"
            >
              {/* Drag Handle & Header */}
              <div className="flex flex-col items-center pt-3 pb-4 border-b border-black/5 shrink-0">
                <div className="w-12 h-1.5 bg-black/10 rounded-full mb-4" />
                <div className="flex justify-between items-center w-full px-6">
                  <h3 className="text-xl font-heading font-black text-slate-900 flex items-center gap-2">
                    <Filter className="text-primary" size={20} /> Categories
                  </h3>
                  <button 
                    onClick={() => setMobileCategoriesOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                <Link
                  href="/shop"
                  onClick={() => setMobileCategoriesOpen(false)}
                  className="flex items-center justify-between p-4 bg-[#eff4f0] rounded-2xl border border-primary/20 active:scale-[0.98] transition-transform group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-bold text-primary">All Toys</span>
                  </div>
                  <ArrowLeft size={16} className="rotate-180 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>

                {[
                  "Cultural",
                  "Educational",
                  "Statues",
                  "Toys & Figurines",
                  "Utility & Decor"
                ].map((category) => (
                  <Link
                    key={category}
                    href={`/shop?category=${encodeURIComponent(category)}`}
                    onClick={() => setMobileCategoriesOpen(false)}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform group"
                  >
                    <span className="font-bold text-slate-700">{category}</span>
                    <ArrowLeft size={16} className="rotate-180 text-slate-300 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar (App-like) */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[55] bg-white/95 backdrop-blur-md border-t border-black/5 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 px-2 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-300 ${
        mobileMenuOpen || mobileCategoriesOpen ? "translate-y-full" : "translate-y-0"
      }`}>
        <Link href="/" prefetch={true} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/' ? 'text-primary' : 'text-[#8a958c]'}`}>
          <Home size={22} className={pathname === '/' ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <button onClick={() => setMobileCategoriesOpen(true)} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors text-[#8a958c]`}>
          <Filter size={22} className="stroke-2" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>
        <Link href="/shop" prefetch={true} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname.startsWith('/shop') ? 'text-primary' : 'text-[#8a958c]'}`}>
          <Store size={22} className={pathname.startsWith('/shop') ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>
        <Link href="/cart" prefetch={true} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors relative ${pathname === '/cart' ? 'text-primary' : 'text-[#8a958c]'}`}>
          <ShoppingCart size={22} className={pathname === '/cart' ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Cart</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-[25%] w-2 h-2 bg-red-500 rounded-full shadow-sm" />
          )}
        </Link>
        <Link href={userName ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname.startsWith('/profile') ? 'text-primary' : 'text-[#8a958c]'}`}>
          <User size={22} className={pathname.startsWith('/profile') ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </>
  );
}
