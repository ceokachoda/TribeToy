"use client";

import { useState } from "react";
import { FiUploadCloud, FiCheck, FiAlertTriangle, FiLoader, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { importAmazonOrders } from "./actions";

export default function ImportOrdersPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<{ importedCount: number; warnings: string[] } | null>(null);
  const { showToast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      
      setIsUploading(true);
      setResults(null);

      try {
        const res = await importAmazonOrders(text);
        if (res.success) {
          showToast(`Successfully imported ${res.importedCount} orders!`, "success");
        } else {
          showToast(res.error || "Failed to import orders", "error");
        }
        
        setResults({
          importedCount: res.importedCount || 0,
          warnings: res.warnings || []
        });
      } catch (err: any) {
        showToast(err.message || "An unexpected error occurred", "error");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <FiUploadCloud className="text-emerald-500" /> Import Amazon Orders
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Upload an Amazon order report (CSV or TXT) to bulk import orders.</p>
        </div>
        <Link 
          href="/admin/orders"
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <FiArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUploadCloud size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Amazon Report</h2>
          <p className="text-slate-500 text-sm mb-8">
            The file must contain headers like `order-id`, `sku`, `quantity`, `item-price`. Tab-separated flat files are supported.
          </p>

          <label className={`
            flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-bold text-lg cursor-pointer transition-all
            ${isUploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'}
          `}>
            {isUploading ? <FiLoader className="animate-spin" /> : <FiCheck />}
            {isUploading ? 'Importing Orders...' : 'Select File'}
            <input 
              type="file" 
              accept=".csv,.txt"
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {results && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-900">Import Results</h3>
          <p className="text-emerald-600 font-bold mb-4 flex items-center gap-2">
            <FiCheck /> Successfully imported {results.importedCount} orders.
          </p>

          {results.warnings.length > 0 && (
            <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
                <FiAlertTriangle className="text-amber-500" /> Warnings & Errors ({results.warnings.length})
              </h4>
              <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside max-h-64 overflow-y-auto">
                {results.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
