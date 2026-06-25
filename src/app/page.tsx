import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProductCategories from "@/components/sections/ProductCategories";
import CustomPrintingSection from "@/components/sections/CustomPrintingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <CustomPrintingSection />
      <AboutSection />
    </>
  );
}
