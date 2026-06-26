import CustomPrintingSection from "@/components/sections/CustomPrintingSection";
import CustomizationClient from "./CustomizationClient";

export default function CustomizationPage() {
  return (
    <main className="min-h-screen pt-16 md:pt-24 bg-background">
      <CustomPrintingSection />
      <div className="bg-background relative -mt-32 pt-20 z-10 pb-32">
        <CustomizationClient />
      </div>
    </main>
  );
}
