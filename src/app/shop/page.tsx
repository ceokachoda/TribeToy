import ShopClient from "./ShopClient";
import { products } from "@/data/products";

export const metadata = {
  title: "Shop All Toys - TribeToy",
  description: "Browse our complete collection of premium 3D printed toys, educational kits, cultural souvenirs, and utility decor.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        {/* Dynamic header moved to ShopClient */}

        <ShopClient initialProducts={products} />
      </div>
    </main>
  );
}
