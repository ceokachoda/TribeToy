"use client";

import { useState } from "react";
import { HomepageSection } from "@/types/homepage";
import { FiX, FiUpload, FiPlus, FiTrash2 } from "react-icons/fi";
import { Product } from "@/data/products";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface Props {
  section: HomepageSection;
  products: Product[];
  onSave: (section: HomepageSection) => void;
  onClose: () => void;
}

export default function SectionEditorModal({ section, products, onSave, onClose }: Props) {
  const [data, setData] = useState<any>(JSON.parse(JSON.stringify(section.data || {})));
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
      
      setData({ ...data, [key]: url });
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleArrayUpload = async (e: React.ChangeEvent<HTMLInputElement>, arrayKey: string, index: number, field: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
      
      const newArray = [...(data[arrayKey] || [])];
      if (!newArray[index]) newArray[index] = {};
      newArray[index][field] = url;
      setData({ ...data, [arrayKey]: newArray });
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    onSave({ ...section, data });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 capitalize">Edit {section.type.replace("_", " ")}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><FiX size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {section.type === "hero" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Video Background URL</label>
                <input type="text" value={data.video_url || ""} onChange={e => setData({...data, video_url: e.target.value})} className="w-full p-2 border rounded-md" placeholder="/3D_printer_printing_glowing_heart.mp4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Hero Main Image (Optional, replaces video)</label>
                {data.hero_image && <div className="h-32 relative rounded-lg overflow-hidden border"><Image src={data.hero_image} alt="Hero Main" fill className="object-cover" /></div>}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, "hero_image")} className="w-full text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Custom Prints Image</label>
                  {data.custom_prints_img && <div className="h-32 relative rounded-lg overflow-hidden border"><Image src={data.custom_prints_img} alt="Custom Prints" fill className="object-cover" /></div>}
                  <input type="file" accept="image/*" onChange={e => handleUpload(e, "custom_prints_img")} className="w-full text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">New Arrivals Image</label>
                  {data.new_arrivals_img && <div className="h-32 relative rounded-lg overflow-hidden border"><Image src={data.new_arrivals_img} alt="New Arrivals" fill className="object-cover" /></div>}
                  <input type="file" accept="image/*" onChange={e => handleUpload(e, "new_arrivals_img")} className="w-full text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Carousel Products (Top 3)</label>
                {[0, 1, 2].map(i => (
                  <select key={i} value={data.carousel?.[i] || ""} onChange={e => {
                    const c = [...(data.carousel || ["", "", ""])];
                    c[i] = e.target.value;
                    setData({...data, carousel: c});
                  }} className="w-full p-2 border rounded-md mb-2">
                    <option value="">-- None --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                ))}
              </div>
            </div>
          )}

          {section.type === "marquee" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Custom Marquee Banner Image (Optional)</label>
                {data.marquee_image && <div className="h-32 relative rounded-lg overflow-hidden border"><Image src={data.marquee_image} alt="Marquee Banner" fill className="object-cover" /></div>}
                <input type="file" accept="image/*" onChange={e => handleUpload(e, "marquee_image")} className="w-full text-sm" />
              </div>
              <label className="text-sm font-bold text-slate-700">Or Selected Products (Auto-Scrolling)</label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {products.map(p => {
                  const selected = (data.products || []).includes(String(p.id));
                  return (
                    <div key={p.id} onClick={() => {
                      const c = new Set(data.products || []);
                      if (selected) c.delete(String(p.id));
                      else c.add(String(p.id));
                      setData({...data, products: Array.from(c)});
                    }} className={`p-2 border rounded-md text-xs cursor-pointer ${selected ? 'bg-emerald-100 border-emerald-500' : 'bg-slate-50'}`}>
                      {p.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {section.type === "featured_products" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Section Title</label>
                <input type="text" value={data.title || "Featured Creations"} onChange={e => setData({...data, title: e.target.value})} className="w-full p-2 border rounded-md" />
              </div>
            </div>
          )}

          {section.type === "testimonials" && (
            <div className="space-y-4">
              <button onClick={() => setData({...data, items: [...(data.items || []), { name: "John", rating: 5, text: "Great!" }]})} className="text-emerald-600 text-sm font-bold flex items-center gap-1"><FiPlus /> Add Testimonial</button>
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="p-4 border rounded-xl space-y-2 relative">
                  <button onClick={() => setData({...data, items: data.items.filter((_: any, idx: number) => idx !== i)})} className="absolute top-2 right-2 text-red-500"><FiTrash2 /></button>
                  <input type="text" placeholder="Name" value={item.name} onChange={e => {
                    const arr = [...data.items]; arr[i].name = e.target.value; setData({...data, items: arr});
                  }} className="w-full p-2 border rounded-md text-sm" />
                  <input type="number" min="1" max="5" placeholder="Rating" value={item.rating} onChange={e => {
                    const arr = [...data.items]; arr[i].rating = parseInt(e.target.value); setData({...data, items: arr});
                  }} className="w-full p-2 border rounded-md text-sm" />
                  <textarea placeholder="Review text" value={item.text} onChange={e => {
                    const arr = [...data.items]; arr[i].text = e.target.value; setData({...data, items: arr});
                  }} className="w-full p-2 border rounded-md text-sm" rows={2} />
                  
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Avatar (Optional)</label>
                    {item.avatar && <img src={item.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover mb-2" />}
                    <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "items", i, "avatar")} className="w-full text-xs" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === "faq" && (
            <div className="space-y-4">
              <button onClick={() => setData({...data, items: [...(data.items || []), { q: "Question?", a: "Answer." }]})} className="text-emerald-600 text-sm font-bold flex items-center gap-1"><FiPlus /> Add FAQ</button>
              {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="p-4 border rounded-xl space-y-2 relative">
                  <button onClick={() => setData({...data, items: data.items.filter((_: any, idx: number) => idx !== i)})} className="absolute top-2 right-2 text-red-500"><FiTrash2 /></button>
                  <input type="text" placeholder="Question" value={item.q} onChange={e => {
                    const arr = [...data.items]; arr[i].q = e.target.value; setData({...data, items: arr});
                  }} className="w-full p-2 border rounded-md text-sm font-bold" />
                  <textarea placeholder="Answer" value={item.a} onChange={e => {
                    const arr = [...data.items]; arr[i].a = e.target.value; setData({...data, items: arr});
                  }} className="w-full p-2 border rounded-md text-sm" rows={3} />
                </div>
              ))}
            </div>
          )}

          {section.type === "offers" && (
            <div className="space-y-4">
              <button onClick={() => setData({...data, banners: [...(data.banners || []), { image: "", link: "/shop" }]})} className="text-emerald-600 text-sm font-bold flex items-center gap-1"><FiPlus /> Add Offer Banner</button>
              {(data.banners || []).map((item: any, i: number) => (
                <div key={i} className="p-4 border rounded-xl space-y-2 relative">
                  <button onClick={() => setData({...data, banners: data.banners.filter((_: any, idx: number) => idx !== i)})} className="absolute top-2 right-2 text-red-500 z-10"><FiTrash2 /></button>
                  {item.image && <div className="h-24 relative rounded-lg overflow-hidden border mb-2"><Image src={item.image} alt="Offer" fill className="object-cover" /></div>}
                  <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "banners", i, "image")} className="w-full text-xs" />
                  <input type="text" placeholder="Link (e.g. /shop?category=Toys)" value={item.link} onChange={e => {
                    const arr = [...data.banners]; arr[i].link = e.target.value; setData({...data, banners: arr});
                  }} className="w-full p-2 border rounded-md text-sm mt-2" />
                </div>
              ))}
            </div>
          )}
          
          {(section.type === "categories" || section.type === "about") && (
            <p className="text-slate-500 italic text-sm">This section pulls data automatically and has no additional settings.</p>
          )}

        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button onClick={save} disabled={uploading} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:bg-emerald-400">
            {uploading ? "Uploading..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
