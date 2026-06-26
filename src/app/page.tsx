import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductCategories from "@/components/sections/ProductCategories";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const [productsResponse, settingsResponse, storefrontResponse] = await Promise.all([
    supabase.from('products').select('id, name, category, price, original_price, image_url, is_new, is_sale, is_premium, is_hero').order('created_at', { ascending: false }),
    supabase.from('site_settings').select('value').eq('key', 'hero_images').single(),
    supabase.from('site_settings').select('value').eq('key', 'storefront_config').single()
  ]);

  const dbProducts = productsResponse.data;
  const heroSettings = settingsResponse.data?.value || {
    custom_prints: "/ghibli_hero_v2.png",
    new_arrivals: "/ghibli_new_arrivals_v2.png"
  };

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
    is_hero: p.is_hero,
  }));

  const storefrontConfig = storefrontResponse.data?.value || null;

  return (
    <>
      <HeroSection products={mappedProducts} heroImages={heroSettings} storefrontConfig={storefrontConfig} />
      <ProductCategories />
      <FeaturedProducts products={mappedProducts} />
      <AboutSection />
    </>
  );
}
