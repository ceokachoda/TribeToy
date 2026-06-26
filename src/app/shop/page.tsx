import ShopClient from "./ShopClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Shop All Toys - TribeToy",
  description: "Browse our complete collection of premium 3D printed toys, educational kits, cultural souvenirs, and utility decor.",
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: dbProducts, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  // Map db records to the Product type expected by ShopClient
  const mappedProducts = (dbProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: `₹${parseFloat(p.price).toFixed(2)}`,
    originalPrice: p.original_price ? `₹${parseFloat(p.original_price).toFixed(2)}` : undefined,
    image: p.image_url || "",
    isNew: p.is_new,
    isSale: p.is_sale,
    isPremium: p.is_premium,
  }));

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        {/* Dynamic header moved to ShopClient */}

        <ShopClient initialProducts={mappedProducts} />
      </div>
    </main>
  );
}
