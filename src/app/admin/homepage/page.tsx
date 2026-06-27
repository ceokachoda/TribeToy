"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiSave, FiLoader, FiLayout, FiArrowLeft, FiPlus, FiMonitor, FiRefreshCw } from "react-icons/fi";
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
    { id: "hero-1", type: "hero", enabled: true, order: 0, data: { carousel: [], video_url: "/3D_printer_printing_glowing_heart.mp4", custom_prints_img: "/ghibli_hero_v2.png", new_arrivals_img: "/ghibli_new_arrivals_v2.png" } },
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
      
      // Refresh iframe preview automatically
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
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
    <div className="absolute inset-0 bg-white flex flex-col overflow-hidden z-10 pt-16 lg:pt-0">
      {/* Header Panel */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2"><FiLayout className="text-emerald-500" /> Storefront Editor</h1>
          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Live Preview</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <FiRefreshCw size={16} /> Refresh Preview
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-200 font-bold transition-all disabled:opacity-50">
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} {saving ? "Saving..." : "Save Storefront"}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden bg-slate-100">
        
        {/* Left Sidebar (Editor) */}
        <div className="w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          
          <div className="p-6 space-y-8">
            {/* Global Theme Settings */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Global Settings</h2>
              
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">SEO Title</label>
                  <input type="text" value={config.seo.title} onChange={e => setConfig({...config, seo: {...config.seo, title: e.target.value}})} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">SEO Description</label>
                  <textarea value={config.seo.description} onChange={e => setConfig({...config, seo: {...config.seo, description: e.target.value}})} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500 transition-colors resize-none" rows={2} />
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Announcement Bar</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={config.announcement_bar.enabled} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, enabled: e.target.checked}})} />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                {config.announcement_bar.enabled && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <input type="text" placeholder="Text" value={config.announcement_bar.text} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, text: e.target.value}})} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500" />
                    <input type="text" placeholder="Link URL" value={config.announcement_bar.link} onChange={e => setConfig({...config, announcement_bar: {...config.announcement_bar, link: e.target.value}})} className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-emerald-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Sections Organizer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Page Sections</h2>
              </div>
              
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={config.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
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

            {/* Add Section Library */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Add a Section</h2>
              <div className="grid grid-cols-2 gap-2">
                {(["hero", "marquee", "categories", "featured_products", "offers", "testimonials", "faq", "about"] as SectionType[]).map(type => (
                  <button 
                    key={type} 
                    onClick={() => addSection(type)}
                    className="flex flex-col items-center justify-center p-3 border border-slate-200 border-dashed rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-[11px] font-bold text-slate-600 hover:text-emerald-700 capitalize gap-1 group"
                  >
                    <FiPlus className="text-slate-400 group-hover:text-emerald-500 mb-1" size={16} />
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Preview Area */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 z-10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="mx-auto w-1/2 bg-white h-6 rounded-md border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                tribetoy.com
              </div>
            </div>
            
            <div className="w-full h-full pt-10">
              {/* Iframe loads the homepage */}
              <iframe 
                ref={iframeRef} 
                src="/" 
                className="w-full h-full border-none bg-white"
                title="Storefront Preview"
              />
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-500 font-medium">Preview updates automatically when you <strong className="text-emerald-600">Save Storefront</strong>.</p>
          </div>
        </div>
      </div>

      {/* Editor Modal Overlay */}
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
