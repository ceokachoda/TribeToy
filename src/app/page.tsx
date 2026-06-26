import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductCategories from "@/components/sections/ProductCategories";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: dbProducts, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

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
    <>
      <HeroSection products={mappedProducts} />
      <ProductCategories />
      <FeaturedProducts products={mappedProducts} />
      <AboutSection />
    </>
  );
}
