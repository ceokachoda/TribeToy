"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, Heart, Package, LogOut, Home, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

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
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("tribetoy_logged_in") === "true") {
        setUserName(localStorage.getItem("tribetoy_user_name") || "Guest");
      } else {
        setUserName(null);
      }
    }
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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2 group transition-all duration-500">
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
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
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
            <div className="relative hidden md:block">
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
                      onClick={() => {
                        localStorage.removeItem("tribetoy_logged_in");
                        localStorage.removeItem("tribetoy_user_name");
                        setUserName(null);
                        setUserMenuOpen(false);
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
              className="hidden md:flex px-5 py-2 rounded-full bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4a5d4e] transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
          <Link href="/profile?tab=wishlist" className="hidden md:block p-2 text-foreground/80 hover:text-primary transition-colors relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </Link>
          <Link href="/cart" className="hidden md:block p-2 text-foreground/80 hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 glass-panel flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-6 right-6 p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col items-center gap-6 w-full">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.3 }}
                className="w-12 h-1 bg-black/10 rounded-full my-2" 
              />

              {userName ? (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors">
                      My Profile
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Link href="/profile?tab=wishlist" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors relative">
                      My Wishlist
                      {wishlistCount > 0 && <span className="absolute -right-3 top-1 w-2 h-2 bg-red-500 rounded-full shadow-sm" />}
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Link href="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)} className="text-xl font-heading font-bold text-[#5a6b5e] hover:text-[#1a1a1a] transition-colors">
                      My Orders
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <button 
                      onClick={() => {
                        localStorage.removeItem("tribetoy_logged_in");
                        localStorage.removeItem("tribetoy_user_name");
                        setUserName(null);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xl font-heading font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-8 py-3 rounded-full bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#4a5d4e] transition-all">
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Bottom Navigation Bar (App-like) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-black/5 pb-safe pt-2 px-2 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Link href="/" className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname === '/' ? 'text-primary' : 'text-[#8a958c]'}`}>
          <Home size={22} className={pathname === '/' ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname.startsWith('/shop') ? 'text-primary' : 'text-[#8a958c]'}`}>
          <Store size={22} className={pathname.startsWith('/shop') ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors relative ${pathname === '/cart' ? 'text-primary' : 'text-[#8a958c]'}`}>
          <ShoppingCart size={22} className={pathname === '/cart' ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Cart</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-[25%] w-2 h-2 bg-red-500 rounded-full shadow-sm" />
          )}
        </Link>
        <Link href="/profile?tab=wishlist" className="flex flex-col items-center gap-1 flex-1 py-2 transition-colors relative text-[#8a958c]">
          <Heart size={22} className="stroke-2" />
          <span className="text-[10px] font-bold">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-[25%] w-2 h-2 bg-red-500 rounded-full shadow-sm" />
          )}
        </Link>
        <Link href={userName ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${pathname.startsWith('/profile') ? 'text-primary' : 'text-[#8a958c]'}`}>
          <User size={22} className={pathname.startsWith('/profile') ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>

    </header>
  );
}
