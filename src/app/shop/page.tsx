import ShopClient from "./ShopClient";
import { createStaticClient } from "@/utils/supabase/static";

export const dynamic = 'force-static';
export const revalidate = 3600;
import { Suspense } from "react";

export const metadata = {
  title: "Shop All Toys - TribeToy",
  description: "Browse our complete collection of premium 3D printed toys, educational kits, cultural souvenirs, and utility decor.",
  alternates: {
    canonical: 'https://thetribetoy.com/shop',
  },
};

export default async function ShopPage() {
  const supabase = createStaticClient();
  const { data: dbProducts, error } = await supabase.from('products').select('id, name, category, price, original_price, image_url, is_new, is_sale, is_premium').order('created_at', { ascending: false });

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
    <main className="min-h-screen bg-background pt-24 md:pt-28 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        {/* Dynamic header moved to ShopClient */}

        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading shop...</div>}>
          <ShopClient initialProducts={mappedProducts} />
        </Suspense>
      </div>
    </main>
  );
}
