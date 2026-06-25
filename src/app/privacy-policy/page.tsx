import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - TribeToy",
  description: "Privacy Policy for TribeToy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Privacy Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground mb-16">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-p:text-foreground/70 prose-p:leading-relaxed prose-li:text-foreground/70 marker:text-primary bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-foreground/5">
          <p>At TribeToy Private Limited, we respect your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard the data you provide when using our website.</p>
          
          <h2>Information We Collect</h2>
          <ul>
            <li>Name, contact number, email, and address</li>
            <li>Order and transaction details</li>
            <li>Device and browser information for analytics</li>
          </ul>

          <h2>How We Use Your Data</h2>
          <ul>
            <li>To process orders and provide customer support</li>
            <li>To improve our products and user experience</li>
            <li>To communicate updates, promotions, or newsletters (only with your consent)</li>
          </ul>

          <h2>Data Protection</h2>
          <p>Your information is stored securely and is never sold or shared with third parties, except when required to fulfill orders or by law.</p>
          
          <h2>Cookies</h2>
          <p>We use cookies to understand user behavior and enhance your experience. You can manage cookie preferences in your browser settings.</p>

          <h2>Your Rights</h2>
          <p>You may request to access, modify, or delete your personal data by contacting us at <a href="mailto:tribetoy2025@gmail.com" className="text-primary hover:text-secondary transition-colors">tribetoy2025@gmail.com</a>.</p>
        </div>
      </div>
    </main>
  );
}
