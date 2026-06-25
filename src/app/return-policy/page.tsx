import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Return Policy - TribeToy",
  description: "Return Policy for TribeToy",
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Return Policy</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground mb-16">
          Return Policy
        </h1>
        
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-p:text-foreground/70 prose-p:leading-relaxed prose-li:text-foreground/70 marker:text-primary bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-foreground/5">
          <p>We want you to be satisfied with your purchase. If something isn't right, we're here to help.</p>
          
          <h2>Returns</h2>
          <ul>
            <li>Returns are accepted within 10 days of delivery.</li>
            <li>Items must be unused, in original condition and packaging.</li>
            <li>Customized or hand-painted products are not returnable unless defective or damaged.</li>
          </ul>

          <h2>How to Initiate a Return</h2>
          <p>Contact us at <a href="mailto:tribetoy2025@gmail.com" className="text-primary hover:text-secondary transition-colors">tribetoy2025@gmail.com</a> with your order number and reason for return. Include clear photos if the item is damaged.</p>

          <h2>Refunds</h2>
          <p>Approved returns will be refunded to your original payment method within 7–10 business days after inspection.</p>

          <h2>Exchanges</h2>
          <p>We replace items if they are defective or damaged. If you need an exchange, contact us promptly.</p>
        </div>
      </div>
    </main>
  );
}
