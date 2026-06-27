"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiSettings, FiImage, FiUploadCloud, FiCheck, FiLoader, FiX, FiArrowLeft } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";
import Link from "next/link";
import { saveSettings } from "./actions";

export default function SettingsPage() {
  const [images, setImages] = useState({ custom_prints: "", new_arrivals: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const customPrintsRef = useRef<HTMLInputElement>(null);
  const newArrivalsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_images")
        .single();

      if (data && data.value) {
        setImages({
          custom_prints: data.value.custom_prints || "/ghibli_hero_v2.png",
          new_arrivals: data.value.new_arrivals || "/ghibli_new_arrivals_v2.png"
        });
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "custom_prints" | "new_arrivals") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const supabase = createClient();
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site_settings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site_settings')
        .getPublicUrl(filePath);

      setImages(prev => ({ ...prev, [field]: publicUrl }));
      showToast("Image uploaded successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await saveSettings("hero_images", images);
      
      if (response?.error) {
        throw new Error(response.error);
      }
      
      showToast("Settings saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><FiLoader className="animate-spin text-emerald-500" size={32} /></div>;
  }

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <FiSettings className="text-emerald-500" /> Site Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Manage global website settings and graphics.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FiImage className="text-blue-500" /> Hero Section Images
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Custom Prints Image */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700">Custom 3D Prints (Left Card)</label>
            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
              <Image src={images.custom_prints} alt="Custom Prints" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button 
                  onClick={() => customPrintsRef.current?.click()}
                  disabled={uploadingField === 'custom_prints'}
                  className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-50"
                >
                  {uploadingField === 'custom_prints' ? <FiLoader className="animate-spin" /> : <FiUploadCloud />} 
                  Upload New
                </button>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={customPrintsRef}
              onChange={(e) => handleUpload(e, 'custom_prints')} 
            />
          </div>

          {/* New Arrivals Image */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700">New Arrivals (Right Card)</label>
            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
              <Image src={images.new_arrivals} alt="New Arrivals" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button 
                  onClick={() => newArrivalsRef.current?.click()}
                  disabled={uploadingField === 'new_arrivals'}
                  className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-50"
                >
                  {uploadingField === 'new_arrivals' ? <FiLoader className="animate-spin" /> : <FiUploadCloud />} 
                  Upload New
                </button>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={newArrivalsRef}
              onChange={(e) => handleUpload(e, 'new_arrivals')} 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? <FiLoader className="animate-spin" /> : <FiCheck />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
