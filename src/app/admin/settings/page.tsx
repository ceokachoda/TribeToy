"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiSettings, FiCheck, FiLoader, FiArrowLeft, FiTruck, FiCreditCard, FiPercent, FiInfo } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { saveSettings } from "./actions";

export default function SettingsPage() {
  const [globalSettings, setGlobalSettings] = useState({
    gst_percentage: 18,
    shipping_flat_rate: 100,
    free_shipping_threshold: 1000,
    razorpay_key_id: "",
    razorpay_key_secret: "",
    store_email: "support@tribetoy.in",
    store_phone: "+91 99999 99999"
  });
  const [senderInfo, setSenderInfo] = useState({
    sender_name: "TribeToy",
    sender_address: "123 Toy Street",
    sender_city: "Mumbai",
    sender_state: "Maharashtra",
    sender_pincode: "400001",
    sender_phone: "+91 99999 99999",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      
      // Fetch global_settings from site_settings
      const { data: globalData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "global_settings")
        .single();

      if (globalData?.value) {
        setGlobalSettings(prev => ({ ...prev, ...globalData.value }));
      }

      // Fetch sender info from settings table (used in PDF labels)
      const { data: senderData } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (senderData) {
        setSenderInfo({
          sender_name: senderData.sender_name || "",
          sender_address: senderData.sender_address || "",
          sender_city: senderData.sender_city || "",
          sender_state: senderData.sender_state || "",
          sender_pincode: senderData.sender_pincode || "",
          sender_phone: senderData.sender_phone || "",
        });
      }

      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // Save global_settings via server action to invalidate cache
      const response = await saveSettings("global_settings", globalSettings);
      if (response?.error) throw new Error(response.error);
      
      // Save senderInfo directly to settings table
      const { error } = await supabase
        .from("settings")
        .upsert({ id: 1, ...senderInfo });
        
      if (error) throw error;
      
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
    <div className="space-y-6 w-full max-w-5xl pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <FiSettings className="text-emerald-500" /> Enterprise Settings
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Configure commerce logic, shipping, and API keys.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiCheck />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taxes & Shipping */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FiPercent className="text-blue-500" /> Taxes & Shipping
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">GST Percentage (%)</label>
              <input type="number" value={globalSettings.gst_percentage} onChange={e => setGlobalSettings({...globalSettings, gst_percentage: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Flat Shipping Rate (₹)</label>
                <input type="number" value={globalSettings.shipping_flat_rate} onChange={e => setGlobalSettings({...globalSettings, shipping_flat_rate: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">Free Shipping Above (₹)</label>
                <input type="number" value={globalSettings.free_shipping_threshold} onChange={e => setGlobalSettings({...globalSettings, free_shipping_threshold: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FiCreditCard className="text-indigo-500" /> Payment Gateway (Razorpay)
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Key ID</label>
              <input type="text" value={globalSettings.razorpay_key_id} onChange={e => setGlobalSettings({...globalSettings, razorpay_key_id: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm" placeholder="rzp_test_..." />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Key Secret</label>
              <input type="password" value={globalSettings.razorpay_key_secret} onChange={e => setGlobalSettings({...globalSettings, razorpay_key_secret: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm" placeholder="••••••••••••" />
              <p className="text-xs text-slate-400 mt-1">Keep this secret secure. Do not share.</p>
            </div>
          </div>
        </div>

        {/* Sender Info (Shipping Labels) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 md:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FiTruck className="text-orange-500" /> Shipping Label Origin (Sender Info)
          </h2>
          <p className="text-sm text-slate-500 -mt-4">This information will be printed on all generated shipping labels.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Sender Name (Company)</label>
              <input type="text" value={senderInfo.sender_name} onChange={e => setSenderInfo({...senderInfo, sender_name: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Phone Number</label>
              <input type="text" value={senderInfo.sender_phone} onChange={e => setSenderInfo({...senderInfo, sender_phone: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-700 block mb-1">Address Line</label>
              <input type="text" value={senderInfo.sender_address} onChange={e => setSenderInfo({...senderInfo, sender_address: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">City</label>
              <input type="text" value={senderInfo.sender_city} onChange={e => setSenderInfo({...senderInfo, sender_city: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">State</label>
                <input type="text" value={senderInfo.sender_state} onChange={e => setSenderInfo({...senderInfo, sender_state: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-1">PIN Code</label>
                <input type="text" value={senderInfo.sender_pincode} onChange={e => setSenderInfo({...senderInfo, sender_pincode: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Store Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 md:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FiInfo className="text-emerald-500" /> Public Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Support Email</label>
              <input type="email" value={globalSettings.store_email} onChange={e => setGlobalSettings({...globalSettings, store_email: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Support Phone</label>
              <input type="text" value={globalSettings.store_phone} onChange={e => setGlobalSettings({...globalSettings, store_phone: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
