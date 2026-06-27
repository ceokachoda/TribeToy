"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiSave, FiLoader, FiLayout, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { saveSettings } from "../settings/actions";
import { HomepageConfig, HomepageSection, SectionType } from "@/types/homepage";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSectionItem from "@/components/admin/homepage/SortableSectionItem";
import SectionEditorModal from "@/components/admin/homepage/SectionEditorModal";
import { Product } from "@/data/products";

const DEFAULT_CONFIG: HomepageConfig = {
  seo: { title: "TribeToy - Eco-Friendly Toys", description: "Sustainable 3D-printed toys" },
  announcement_bar: { enabled: true, text: "Free shipping on all orders over ₹1000", link: "/shop" },
  sections: [
    { id: "hero-1", type: "hero", enabled: true, order: 0, data: { carousel: [], video_url: "", custom_prints_img: "/ghibli_hero_v2.png", new_arrivals_img: "/ghibli_new_arrivals_v2.png" } },
    { id: "marquee-1", type: "marquee", enabled: true, order: 1, data: { products: [] } },
    { id: "categories-1", type: "categories", enabled: true, order: 2, data: {} },
    { id: "featured-1", type: "featured_products", enabled: true, order: 3, data: {} },
    { id: "about-1", type: "about", enabled: true, order: 4, data: {} }
  ]
};

export default function HomepageSettings() {
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const { showToast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        const { data: pData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (pData) setProducts(pData as Product[]);

        const { data: configData } = await supabase.from("site_settings").select("value").eq("key", "homepage_cms_config").single();
        if (configData?.value) {
          setConfig(configData.value as HomepageConfig);
        } else {
          // Attempt to migrate old storefront_config if new one doesn't exist
          const { data: oldData } = await supabase.from("site_settings").select("value").eq("key", "storefront_config").single();
          if (oldData?.value) {
            const migrated = { ...DEFAULT_CONFIG };
            migrated.sections[0].data.carousel = oldData.value.carousel || [];
            migrated.sections[1].data.products = oldData.value.marquee || [];
            setConfig(migrated);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over.id);
        const newSections = arrayMove(prev.sections, oldIndex, newIndex);
        return { ...prev, sections: newSections.map((s, i) => ({ ...s, order: i })) };
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveSettings("homepage_cms_config", config);
      if (res?.error) throw new Error(res.error);
      showToast("Homepage layout updated successfully!", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: HomepageSection = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: config.sections.length,
      data: type === 'offers' ? { banners: [] } : type === 'testimonials' ? { items: [] } : type === 'faq' ? { items: [] } : {}
    };
    setConfig(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSection = (updated: HomepageSection) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === updated.id ? updated : s)
    }));
    setEditingSection(null);
  };

  const deleteSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><FiLoader className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"><FiArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FiLayout className="text-emerald-500" /> Homepage Builder</h1>
            <p className="text-slate-500 mt-1">Drag and drop sections to reorganize your storefront.</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-200">
          {saving ? <FiLoader className="animate-spin" /> : <FiSave />} {saving ? "Saving..." : "Save Layout"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Announcement Bar & SEO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Global Settings</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">SEO Title</label>
              <input type="text" value={config.seo.title} onChange={e => setConfig({...config, seo: {...config.seo, title: e.target.value}})} className="w-full p-2 border rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">SEO Description</label>
              <textarea value={config.seo.description} onChange={e => setConfig({...config, seo: {...config.seo, description: e.target.value}})} className="w-full p-2 border rounded-md" rows={2} />
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Announcement Bar</label>
                <input type="checkbox" checked={config.announcement_bar.enabled} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, enabled: e.target.checked}})} className="w-4 h-4 text-emerald-600" />
              </div>
              {config.announcement_bar.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Text" value={config.announcement_bar.text} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, text: e.target.value}})} className="p-2 border rounded-md" />
                  <input type="text" placeholder="Link" value={config.announcement_bar.link} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, link: e.target.value}})} className="p-2 border rounded-md" />
                </div>
              )}
            </div>
          </div>

          {/* Draggable Sections */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Page Sections</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={config.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {config.sections.map((section) => (
                    <SortableSectionItem 
                      key={section.id} 
                      section={section} 
                      onEdit={() => setEditingSection(section)}
                      onDelete={() => deleteSection(section.id)}
                      onToggle={(enabled) => updateSection({...section, enabled})}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Add Sections Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-28">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Add Section</h2>
          <div className="flex flex-col gap-2">
            {(["hero", "marquee", "categories", "featured_products", "offers", "testimonials", "faq", "about"] as SectionType[]).map(type => (
              <button 
                key={type} 
                onClick={() => addSection(type)}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-sm font-medium text-slate-700 capitalize"
              >
                {type.replace("_", " ")}
                <FiPlus className="text-emerald-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {editingSection && (
        <SectionEditorModal 
          section={editingSection} 
          products={products}
          onSave={updateSection} 
          onClose={() => setEditingSection(null)} 
        />
      )}
    </div>
  );
}
