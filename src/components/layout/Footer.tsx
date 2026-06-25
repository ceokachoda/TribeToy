import Link from "next/link";
import { Mail, MapPin, Phone, Globe, MessageCircle, Camera, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-20 pb-10 overflow-hidden border-t border-card-border bg-[#050505]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden p-1">
                <Image 
                  src="/logo.png" 
                  alt="TribeToy Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-wide">
                TribeToy
              </span>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Bringing stories to life through sustainable 3D-printed and hand-painted toys. Empowering communities through technology.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Globe size={18} />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <MessageCircle size={18} />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Camera size={18} />
              </Link>
              <Link href="#" className="p-2 glass rounded-full hover:text-primary transition-colors">
                <Briefcase size={18} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Shop</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">All Toys</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Educational</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Utility Decor</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Custom 3D Printing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Green Putola</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>Assam, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/60">
                <Mail size={18} className="text-primary shrink-0" />
                <span>hello@tribetoy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} TribeToy. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-foreground/40">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
