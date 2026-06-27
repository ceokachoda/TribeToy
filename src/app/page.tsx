import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductCategories from "@/components/sections/ProductCategories";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import OffersSection from "@/components/sections/OffersSection";
import { createStaticClient } from "@/utils/supabase/static";
import { HomepageConfig, HomepageSection } from "@/types/homepage";

import MarqueeSection from "@/components/sections/MarqueeSection";
import BlogSection from "@/components/sections/BlogSection";

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const supabase = createStaticClient();
  const [productsResponse, configResponse] = await Promise.all([
    supabase.from('products').select('id, name, category, price, original_price, image_url, is_new, is_sale, is_premium, is_hero').order('created_at', { ascending: false }),
    supabase.from('site_settings').select('value').eq('key', 'homepage_cms_config').single()
  ]);

  const dbProducts = productsResponse.data || [];
  const mappedProducts = dbProducts.map((p: any) => ({
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

  // Fallback to default if no config
  const config = (configResponse.data?.value || {
    sections: [
      { id: "hero", type: "hero", enabled: true, order: 0, data: {} },
      { id: "categories", type: "categories", enabled: true, order: 1, data: {} },
      { id: "featured", type: "featured_products", enabled: true, order: 2, data: {} },
      { id: "blog", type: "blog", enabled: true, order: 3, data: {} },
      { id: "about", type: "about", enabled: true, order: 4, data: {} }
    ]
  }) as HomepageConfig;

  // Sort sections by order
  const sections = config.sections.sort((a, b) => a.order - b.order);

  const renderSection = (section: HomepageSection) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case "hero":
        return <HeroSection key={section.id} products={mappedProducts} config={section.data} />;
      case "marquee":
        return <MarqueeSection key={section.id} products={mappedProducts} data={section.data} />;
      case "categories":
        return <ProductCategories key={section.id} />;
      case "featured_products":
        return <FeaturedProducts key={section.id} products={mappedProducts} title={section.data?.title} />;
      case "testimonials":
        return <TestimonialsSection key={section.id} data={section.data} />;
      case "faq":
        return <FaqSection key={section.id} data={section.data} />;
      case "offers":
        return <OffersSection key={section.id} data={section.data} />;
      case "about":
        return <AboutSection key={section.id} />;
      case "blog":
        return <BlogSection key={section.id} />;
      default:
        return null;
    }
  };

  return (
    <>
      {sections.map(renderSection)}
    </>
  );
}
