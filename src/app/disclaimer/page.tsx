import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Disclaimer - TribeToy",
  description: "Disclaimer for TribeToy",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Disclaimer</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground mb-16">
          Disclaimer
        </h1>
        
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-p:text-foreground/70 prose-p:leading-relaxed prose-li:text-foreground/70 marker:text-primary bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-foreground/5">
          <p>All products on this website are designed with child safety and eco-friendliness in mind. However, adult supervision is advised during use.</p>
          
          <p>While we strive for accuracy in content and product information, TribeToy Private Limited does not guarantee the completeness or reliability of all data displayed. We reserve the right to make changes to product designs, pricing, and availability at any time.</p>
        </div>
      </div>
    </main>
  );
}
