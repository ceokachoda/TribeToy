"use client";

import { useState } from "react";
import { generateLabel, GenerateLabelInput } from "@/utils/admin/labels/pdf";
import { FiFileText, FiCheckCircle, FiX, FiPackage } from "react-icons/fi";
import { type OrderStatus } from "@/utils/admin/orders";
import { COURIER_LABEL, CourierType } from "@/utils/admin/labels/courier";

export function GenerateLabelAction({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [input, setInput] = useState<GenerateLabelInput>({
    courier: "delhivery",
    awb: "",
    dispatchDate: new Date().toISOString().split("T")[0]
  });

  // Can only generate labels for processing, shipped, delivered
  const canGenerate = ["processing", "shipped", "delivered"].includes(currentStatus);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!canGenerate) return;
    setError(null);
    setPending(true);
    setSuccess(false);

    try {
      const res = await generateLabel(orderId, input);
      if (!res.ok) {
        setError(res.error || "Failed to generate label");
      } else {
        setSuccess(true);
        setShowModal(false);
        if (res.data?.signedUrl) {
           window.open(res.data.signedUrl, "_blank", "noopener,noreferrer");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate label");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return <span className="text-emerald-600 flex items-center gap-1 text-sm font-bold"><FiCheckCircle /> Label Generated</span>;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={pending || !canGenerate}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        title={canGenerate ? "Generate PDF Label" : "Must be paid/shipped to generate label"}
      >
        <FiFileText size={16} />
        <span>Create Shipping Label</span>
      </button>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FiPackage className="text-blue-500" /> Generate Label</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Courier Partner</label>
                <select 
                  value={input.courier} 
                  onChange={(e) => setInput({...input, courier: e.target.value as CourierType})}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                >
                  {Object.entries(COURIER_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">AWB / Tracking Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input 
                  type="text" 
                  value={input.awb || ""} 
                  onChange={(e) => setInput({...input, awb: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none uppercase"
                  placeholder="e.g. 1234567890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Dispatch Date</label>
                <input 
                  type="date" 
                  value={input.dispatchDate || ""} 
                  onChange={(e) => setInput({...input, dispatchDate: e.target.value})}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={pending} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm disabled:bg-blue-400 transition-colors">
                  {pending ? "Generating..." : "Generate PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
