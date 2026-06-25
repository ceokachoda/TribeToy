import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions - TribeToy",
  description: "Terms and Conditions for TribeToy",
};

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Terms and Conditions</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground mb-16">
          Terms and Conditions
        </h1>
        
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-p:text-foreground/70 prose-p:leading-relaxed prose-li:text-foreground/70 marker:text-primary bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-foreground/5">
          <p>Welcome to the website of TribeToy Private Limited. By using our platform, you agree to the following terms:</p>
          
          <h2>Orders & Payments</h2>
          <p>All orders are subject to availability and acceptance. Payments must be completed through our secure payment gateway.</p>

          <h2>Shipping</h2>
          <p>Products are shipped across India. Delivery timelines may vary based on location and courier delays.</p>

          <h2>Product Information</h2>
          <p>While we ensure accuracy, product images and descriptions may slightly vary due to handmade elements.</p>

          <h2>Intellectual Property</h2>
          <p>All content, including images, designs, and text, is owned by TribeToy and may not be reused without permission.</p>

          <h2>Limitation of Liability</h2>
          <p>We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
        </div>
      </div>
    </main>
  );
}
