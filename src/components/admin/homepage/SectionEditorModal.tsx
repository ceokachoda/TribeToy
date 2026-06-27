"use client";

import { useState } from "react";
import { HomepageSection } from "@/types/homepage";
import { FiX, FiUpload, FiPlus, FiTrash2, FiImage, FiVideo, FiLink, FiList, FiLayout, FiType, FiStar, FiSettings } from "react-icons/fi";
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

  const ImageUploader = ({ label, value, onChangeKey, placeholder = <FiImage size={24} /> }: { label: string, value: string, onChangeKey: string, placeholder?: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-emerald-500 transition-colors">
      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
      </div>
      <div className="relative h-32 bg-slate-50 flex items-center justify-center">
        {value ? (
          <Image src={value} alt={label} fill className="object-cover" />
        ) : (
          <div className="text-slate-300 flex flex-col items-center gap-2">
            {placeholder}
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={e => handleUpload(e, onChangeKey)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        {value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">Change Image</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight capitalize flex items-center gap-2">
              <FiLayout className="text-emerald-500" />
              Edit {section.type.replace("_", " ")}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Configure the visual and content settings for this section.</p>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"><FiX size={24} /></button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="max-w-3xl mx-auto space-y-10">
            
            {section.type === "hero" && (
              <>
                {/* Background Media */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FiVideo className="text-emerald-500" /> Background Media
                  </h3>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Video Background URL</label>
                      <input type="text" value={data.video_url || ""} onChange={e => setData({...data, video_url: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. /video.mp4" />
                      <p className="text-xs text-slate-400">Falls back to the 3D printer video if left empty.</p>
                    </div>
                    <div className="pt-2">
                      <ImageUploader label="Hero Main Image (Overrides Video)" value={data.hero_image} onChangeKey="hero_image" />
                    </div>
                  </div>
                </div>

                {/* Featured Cards */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FiImage className="text-emerald-500" /> Featured Cards (Mobile)
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <ImageUploader label="Custom Prints Card" value={data.custom_prints_img} onChangeKey="custom_prints_img" />
                    <ImageUploader label="New Arrivals Card" value={data.new_arrivals_img} onChangeKey="new_arrivals_img" />
                  </div>
                </div>

                {/* Carousel Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-2"><FiList className="text-emerald-500" /> Main Carousel Slides</span>
                    <button onClick={() => setData({...data, custom_slides: [...(data.custom_slides || []), { image: "", title: "", subtitle: "", url: "" }]})} className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                      <FiPlus /> Add Custom Slide
                    </button>
                  </h3>
                  
                  {data.custom_slides && data.custom_slides.length > 0 ? (
                    <div className="space-y-4">
                      {data.custom_slides.map((slide: any, i: number) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                          <button onClick={() => setData({...data, custom_slides: data.custom_slides.filter((_: any, idx: number) => idx !== i)})} className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100">
                            <FiTrash2 size={14} />
                          </button>
                          
                          <div className="flex gap-6">
                            <div className="w-1/3 relative h-32 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden group/img">
                              {slide.image ? (
                                <Image src={slide.image} alt="Slide" fill className="object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2"><FiImage size={24} /><span className="text-[10px] font-medium uppercase">Upload</span></div>
                              )}
                              <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "custom_slides", i, "image")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                            
                            <div className="w-2/3 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Title</label>
                                  <input type="text" placeholder="e.g. Heart Lamp" value={slide.title} onChange={e => {
                                    const arr = [...data.custom_slides]; arr[i].title = e.target.value; setData({...data, custom_slides: arr});
                                  }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold focus:border-emerald-500 outline-none transition-colors" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Subtitle</label>
                                  <input type="text" placeholder="e.g. NEW ARRIVAL" value={slide.subtitle} onChange={e => {
                                    const arr = [...data.custom_slides]; arr[i].subtitle = e.target.value; setData({...data, custom_slides: arr});
                                  }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none transition-colors" />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Link URL</label>
                                <div className="relative">
                                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input type="text" placeholder="/product/123" value={slide.url} onChange={e => {
                                    const arr = [...data.custom_slides]; arr[i].url = e.target.value; setData({...data, custom_slides: arr});
                                  }} className="w-full p-2 pl-9 bg-slate-50 border border-slate-200 rounded-md text-sm focus:border-emerald-500 outline-none transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <p className="text-sm text-slate-500 mb-2">No custom slides added. Select fallback products below:</p>
                      <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Product {i+1}</label>
                            <select value={data.carousel?.[i] || ""} onChange={e => {
                              const c = [...(data.carousel || ["", "", ""])];
                              c[i] = e.target.value;
                              setData({...data, carousel: c});
                            }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500">
                              <option value="">-- None --</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {section.type === "marquee" && (
              <>
                {/* Marquee Banner */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FiImage className="text-emerald-500" /> Hero Banner Replacement
                  </h3>
                  <ImageUploader label="Custom Marquee Banner Image" value={data.marquee_image} onChangeKey="marquee_image" />
                </div>
                
                {/* Marquee Items */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-2"><FiList className="text-emerald-500" /> Scrolling Marquee Items</span>
                    <button onClick={() => setData({...data, custom_marquee: [...(data.custom_marquee || []), { image: "", title: "", subtitle: "", url: "" }]})} className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                      <FiPlus /> Add Custom Item
                    </button>
                  </h3>
                  
                  {data.custom_marquee && data.custom_marquee.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {data.custom_marquee.map((slide: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group flex flex-col gap-3">
                          <button onClick={() => setData({...data, custom_marquee: data.custom_marquee.filter((_: any, idx: number) => idx !== i)})} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100">
                            <FiTrash2 size={12} />
                          </button>
                          
                          <div className="relative h-24 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden group/img">
                            {slide.image ? (
                              <Image src={slide.image} alt="Slide" fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400"><FiImage size={20} /></div>
                            )}
                            <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "custom_marquee", i, "image")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          </div>
                          
                          <div className="space-y-2">
                            <input type="text" placeholder="Title" value={slide.title} onChange={e => {
                              const arr = [...data.custom_marquee]; arr[i].title = e.target.value; setData({...data, custom_marquee: arr});
                            }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Subtitle" value={slide.subtitle} onChange={e => {
                              const arr = [...data.custom_marquee]; arr[i].subtitle = e.target.value; setData({...data, custom_marquee: arr});
                            }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Link URL" value={slide.url} onChange={e => {
                              const arr = [...data.custom_marquee]; arr[i].url = e.target.value; setData({...data, custom_marquee: arr});
                            }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:border-emerald-500 outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <p className="text-sm text-slate-500 mb-2">No custom items. Select products to scroll automatically:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {products.map(p => {
                          const selected = (data.products || []).includes(String(p.id));
                          return (
                            <div key={p.id} onClick={() => {
                              const c = new Set(data.products || []);
                              if (selected) c.delete(String(p.id));
                              else c.add(String(p.id));
                              setData({...data, products: Array.from(c)});
                            }} className={`p-2 border rounded-lg text-xs font-medium cursor-pointer transition-colors ${selected ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                              <div className="truncate">{p.name}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {section.type === "featured_products" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FiType className="text-emerald-500" /> Section Settings
                </h3>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Section Title</label>
                  <input type="text" value={data.title || "Featured Creations"} onChange={e => setData({...data, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:border-emerald-500 outline-none transition-colors" />
                </div>
              </div>
            )}

            {section.type === "testimonials" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2"><FiStar className="text-emerald-500" /> Customer Reviews</span>
                  <button onClick={() => setData({...data, items: [...(data.items || []), { name: "John", rating: 5, text: "Great!" }]})} className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                    <FiPlus /> Add Review
                  </button>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {(data.items || []).map((item: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group space-y-3">
                      <button onClick={() => setData({...data, items: data.items.filter((_: any, idx: number) => idx !== i)})} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100">
                        <FiTrash2 size={12} />
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <div className="relative w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 group/avatar cursor-pointer">
                          {item.avatar ? <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <FiImage className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />}
                          <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "items", i, "avatar")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="Name" value={item.name} onChange={e => {
                            const arr = [...data.items]; arr[i].name = e.target.value; setData({...data, items: arr});
                          }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:border-emerald-500 outline-none" />
                          <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={item.rating} onChange={e => {
                            const arr = [...data.items]; arr[i].rating = parseInt(e.target.value); setData({...data, items: arr});
                          }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:border-emerald-500 outline-none" />
                        </div>
                      </div>
                      <textarea placeholder="Review text..." value={item.text} onChange={e => {
                        const arr = [...data.items]; arr[i].text = e.target.value; setData({...data, items: arr});
                      }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-xs focus:border-emerald-500 outline-none resize-none" rows={3} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === "faq" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2"><FiList className="text-emerald-500" /> FAQ Items</span>
                  <button onClick={() => setData({...data, items: [...(data.items || []), { q: "Question?", a: "Answer." }]})} className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                    <FiPlus /> Add FAQ
                  </button>
                </h3>
                <div className="space-y-3">
                  {(data.items || []).map((item: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group space-y-3 flex gap-3">
                      <div className="flex-1 space-y-3">
                        <input type="text" placeholder="Question" value={item.q} onChange={e => {
                          const arr = [...data.items]; arr[i].q = e.target.value; setData({...data, items: arr});
                        }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:border-emerald-500 outline-none" />
                        <textarea placeholder="Answer" value={item.a} onChange={e => {
                          const arr = [...data.items]; arr[i].a = e.target.value; setData({...data, items: arr});
                        }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none resize-none" rows={2} />
                      </div>
                      <button onClick={() => setData({...data, items: data.items.filter((_: any, idx: number) => idx !== i)})} className="h-fit p-3 bg-white border border-slate-200 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === "offers" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2"><FiImage className="text-emerald-500" /> Offer Banners</span>
                  <button onClick={() => setData({...data, banners: [...(data.banners || []), { image: "", link: "/shop" }]})} className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                    <FiPlus /> Add Banner
                  </button>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {(data.banners || []).map((item: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                      <button onClick={() => setData({...data, banners: data.banners.filter((_: any, idx: number) => idx !== i)})} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100">
                        <FiTrash2 size={12} />
                      </button>
                      <div className="relative h-24 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden mb-3 group/img">
                        {item.image ? <Image src={item.image} alt="Offer" fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-400"><FiImage size={24} /></div>}
                        <input type="file" accept="image/*" onChange={e => handleArrayUpload(e, "banners", i, "image")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      <div className="relative">
                        <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="/shop?category=Toys" value={item.link} onChange={e => {
                          const arr = [...data.banners]; arr[i].link = e.target.value; setData({...data, banners: arr});
                        }} className="w-full p-2 pl-9 bg-slate-50 border border-slate-200 rounded-md text-xs focus:border-emerald-500 outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(section.type === "categories" || section.type === "about") && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500 mb-2">
                  <FiSettings size={24} />
                </div>
                <h4 className="text-sm font-bold text-emerald-800">Automated Section</h4>
                <p className="text-xs text-emerald-600/80 max-w-sm">This section dynamically pulls content from your store's data and requires no manual configuration.</p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3 z-10">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Discard Changes</button>
          <button onClick={save} disabled={uploading} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:bg-emerald-400 shadow-sm shadow-emerald-200 flex items-center gap-2 transition-colors">
            {uploading ? "Uploading Media..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
