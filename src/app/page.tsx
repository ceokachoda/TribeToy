import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductCategories from "@/components/sections/ProductCategories";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
    </>
  );
}
