"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "All Toys", href: "/shop" },
  { name: "Customization", href: "/customization" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2 group glass-panel pl-2 pr-4 py-1.5 rounded-full transition-all duration-500 -ml-2 shadow-[0_0_20px_rgba(121,152,122,0.15)] hover:shadow-[0_0_40px_rgba(121,152,122,0.4)] border border-white/60 hover:border-primary/40 overflow-hidden">
          {/* Animated inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-lg opacity-70 group-hover:opacity-100 animate-[gradient_4s_linear_infinite] bg-[length:200%_auto] transition-opacity duration-500" />
          
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
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-foreground/80 hover:text-primary transition-colors" aria-label="User Account">
            <User size={20} />
          </button>
          <button className="p-2 text-foreground/80 hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
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
            <nav className="flex flex-col items-center gap-8">
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
