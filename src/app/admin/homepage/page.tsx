"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/data/products";
import { FiSave, FiLoader, FiCheck, FiLayout } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

type StorefrontConfig = {
  carousel: string[];
  marquee: string[];
};

export default function HomepageSettings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<StorefrontConfig>({
    carousel: ["", "", ""],
    marquee: []
  });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        // Fetch all products
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (productsData) {
          const mapped = productsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            image: p.image_url,
            is_hero: p.is_hero
          }));
          setProducts(mapped as Product[]);
        }

        // Fetch config
        const { data: configData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "storefront_config")
          .single();

        if (configData?.value) {
          setConfig({
            carousel: configData.value.carousel || ["", "", ""],
            marquee: configData.value.marquee || []
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          key: "storefront_config",
          value: config,
          updated_at: new Date().toISOString()
        }, { onConflict: "key" });

      if (error) throw error;
      showToast("Homepage layout updated successfully!", "success");
    } catch (error: any) {
      console.error("Save error:", error);
      showToast("Error saving layout", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleMarqueeProduct = (productId: string) => {
    setConfig(prev => {
      const isSelected = prev.marquee.includes(productId);
      if (isSelected) {
        return { ...prev, marquee: prev.marquee.filter(id => id !== productId) };
      } else {
        return { ...prev, marquee: [...prev.marquee, productId] };
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-slate-500 font-medium">Loading layout settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiLayout className="text-emerald-500" />
            Homepage Storefront
          </h1>
          <p className="text-slate-500 mt-1">Configure which products appear on your homepage hero sections.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors font-medium shadow-sm shadow-emerald-200"
        >
          {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Carousel Configuration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Hero Carousel (Top)</h2>
          <p className="text-sm text-slate-500 mb-6">Select up to 3 products to feature in the main scrolling carousel.</p>
          
          <div className="space-y-4">
            {[0, 1, 2].map(index => (
              <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <span className="font-bold text-slate-400 w-24 shrink-0">Slide {index + 1}</span>
                <select
                  value={config.carousel[index] || ""}
                  onChange={(e) => {
                    const newCarousel = [...config.carousel];
                    newCarousel[index] = e.target.value;
                    setConfig({ ...config, carousel: newCarousel });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                >
                  <option value="">-- No product selected (Fallback to default) --</option>
                  {products.filter(p => p.image).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
                {config.carousel[index] && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200">
                    {(() => {
                      const selectedProduct = products.find(p => String(p.id) === String(config.carousel[index]));
                      return selectedProduct?.image ? (
                        <Image src={selectedProduct.image} alt="" fill className="object-cover" />
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Configuration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Featured Marquee (Bottom)</h2>
              <p className="text-sm text-slate-500 mt-1">Select products to scroll horizontally below the carousel on mobile.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
              {config.marquee.length} Selected
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-2 hide-scrollbar">
            {products.filter(p => p.image).map(product => {
              const productIdStr = String(product.id);
              const isSelected = config.marquee.includes(productIdStr);
              return (
                <div 
                  key={productIdStr}
                  onClick={() => toggleMarqueeProduct(productIdStr)}
                  className={`relative flex flex-col gap-2 p-2 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-transparent hover:border-slate-200 bg-slate-50'}`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-200 relative">
                    <Image src={product.image!} alt={product.name} fill className="object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <FiCheck className="text-emerald-600 text-xl" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{product.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
