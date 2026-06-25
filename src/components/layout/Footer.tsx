import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="hidden lg:block relative mt-20 pt-20 pb-10 overflow-hidden border-t border-black/5 bg-background">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group glass-panel px-3 py-2 rounded-2xl w-max hover:shadow-[0_8px_32px_rgba(121,152,122,0.2)] transition-all">
              <div className="relative w-12 h-12 rounded-lg bg-white shadow-sm overflow-hidden transform transition-transform group-hover:scale-105 ring-1 ring-black/5 flex items-center justify-center">
                <Image 
                  src="/logo-new.jpg" 
                  alt="TribeToy Logo" 
                  fill 
                  className="object-cover scale-[1.15]"
                />
              </div>
              <div className="relative overflow-hidden px-1 pr-3">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground relative z-10 transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:via-primary group-hover:to-secondary group-hover:bg-[length:200%_auto] group-hover:animate-[gradient_3s_linear_infinite]">
                  Tribe<span className="text-primary group-hover:text-transparent">Toy</span>
                </span>
              </div>
            </Link>
            <p className="text-foreground/70 leading-relaxed max-w-sm">
              We bring imagination to life through premium 3D printing. From custom gifts to rapid prototyping, we build your ideas layer by layer.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/tribe_toy?igsh=MWxkY3phM2M2MXJhMg==" target="_blank" rel="noopener noreferrer" className="p-2 glass rounded-full hover:text-primary transition-colors flex items-center justify-center w-10 h-10 group/insta">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover/insta:scale-110 transition-transform duration-300"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Shop</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors text-sm">All Toys</Link></li>
              <li><Link href="/shop?category=Educational" className="text-foreground/60 hover:text-primary transition-colors text-sm">Educational</Link></li>
              <li><Link href="/shop?category=Utility & Decor" className="text-foreground/60 hover:text-primary transition-colors text-sm">Utility Decor</Link></li>
              <li><Link href="/customization" className="text-foreground/60 hover:text-primary transition-colors text-sm">Custom 3D Printing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-foreground/60 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">Technology Incubation Centre (TIC),<br/>IIT Guwahati, Assam, 781039</span>
              </li>
              <li>
                <a href="tel:+918099962939" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary transition-colors group/link">
                  <Phone size={18} className="text-primary shrink-0 group-hover/link:animate-pulse" />
                  <span>(+91) 8099962939</span>
                </a>
              </li>
              <li>
                <a href="mailto:tribetoy2025@gmail.com" className="flex items-center gap-3 text-sm text-foreground/60 hover:text-primary transition-colors group/link">
                  <Mail size={18} className="text-primary shrink-0 group-hover/link:animate-pulse" />
                  <span>tribetoy2025@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} TribeToy. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-xs text-foreground/40 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms and Conditions</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/return-policy" className="hover:text-primary transition-colors">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
