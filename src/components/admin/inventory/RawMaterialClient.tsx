"use client";

import { useState } from "react";
import { FiPlus, FiMinus, FiSave, FiClock, FiLoader } from "react-icons/fi";
import { addRawMaterial, logMaterialUsage, addMaterialStock } from "@/app/admin/inventory/actions";
import { useToast } from "@/context/ToastContext";

export default function RawMaterialClient({ initialMaterials }: { initialMaterials: any[] }) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isAdding, setIsAdding] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", color: "", initial_stock: 0 });
  const [usageLogs, setUsageLogs] = useState<Record<string, { grams: number; notes: string }>>({});
  const [addingStock, setAddingStock] = useState<Record<string, number>>({});
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleAddNew = async () => {
    if (!newMaterial.name || !newMaterial.color) {
      showToast("Name and color are required", "error");
      return;
    }
    setLoadingAction("add_new");
    try {
      const res = await addRawMaterial(newMaterial);
      if (res.success) {
        showToast("Material added", "success");
        setIsAdding(false);
        setNewMaterial({ name: "", color: "", initial_stock: 0 });
        // In a real app we'd refetch or just mutate locally, for now we let Next.js refresh or just optimistically add
        window.location.reload(); 
      } else {
        showToast(res.error || "Failed", "error");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLogUsage = async (id: string) => {
    const log = usageLogs[id];
    if (!log || log.grams <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }
    setLoadingAction(`log_${id}`);
    try {
      const res = await logMaterialUsage({
        raw_material_id: id,
        grams_used: log.grams,
        date_used: new Date().toISOString().split('T')[0],
        notes: log.notes
      });
      if (res.success) {
        showToast("Usage logged successfully", "success");
        setUsageLogs(prev => ({ ...prev, [id]: { grams: 0, notes: "" } }));
        window.location.reload();
      } else {
        showToast(res.error || "Failed", "error");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddStock = async (id: string) => {
    const amount = addingStock[id];
    if (!amount || amount <= 0) return;
    setLoadingAction(`add_${id}`);
    try {
      const res = await addMaterialStock({ raw_material_id: id, grams_added: amount });
      if (res.success) {
        showToast("Stock added", "success");
        setAddingStock(prev => ({ ...prev, [id]: 0 }));
        window.location.reload();
      } else {
        showToast(res.error || "Failed", "error");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Available Materials</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg"
        >
          {isAdding ? "Cancel" : <><FiPlus /> New Material</>}
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Material Name (e.g. PLA)</label>
            <input 
              type="text" 
              value={newMaterial.name}
              onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="e.g. PLA Matte"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Color</label>
            <input 
              type="text" 
              value={newMaterial.color}
              onChange={e => setNewMaterial({...newMaterial, color: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="e.g. Black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Initial Stock (grams)</label>
            <input 
              type="number" 
              value={newMaterial.initial_stock || ''}
              onChange={e => setNewMaterial({...newMaterial, initial_stock: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="1000"
            />
          </div>
          <button 
            onClick={handleAddNew}
            disabled={loadingAction === "add_new"}
            className="w-full px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 text-sm h-[38px]"
          >
            {loadingAction === "add_new" ? <FiLoader className="animate-spin" /> : <FiSave />} Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(m => (
          <div key={m.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="font-bold text-slate-900">{m.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{m.color}</p>
              </div>
              <div className="text-right">
                <div className={`font-black text-xl ${m.current_stock_grams < 500 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {m.current_stock_grams}g
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Stock</div>
              </div>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
              {/* Log Usage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FiMinus className="text-red-500" /> Log Daily Usage
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Grams"
                    value={usageLogs[m.id]?.grams || ''}
                    onChange={e => setUsageLogs({...usageLogs, [m.id]: { ...usageLogs[m.id], grams: parseInt(e.target.value) || 0 }})}
                    className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                  />
                  <input 
                    type="text" 
                    placeholder="Notes (optional)"
                    value={usageLogs[m.id]?.notes || ''}
                    onChange={e => setUsageLogs({...usageLogs, [m.id]: { ...usageLogs[m.id], notes: e.target.value }})}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                  />
                  <button 
                    onClick={() => handleLogUsage(m.id)}
                    disabled={loadingAction === `log_${m.id}`}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {loadingAction === `log_${m.id}` ? <FiLoader className="animate-spin" /> : "Log"}
                  </button>
                </div>
              </div>

              {/* Add Stock */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <FiPlus className="text-emerald-500" /> Add Stock (New Spool)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Grams (e.g. 1000)"
                    value={addingStock[m.id] || ''}
                    onChange={e => setAddingStock({...addingStock, [m.id]: parseInt(e.target.value) || 0})}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                  />
                  <button 
                    onClick={() => handleAddStock(m.id)}
                    disabled={loadingAction === `add_${m.id}`}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    {loadingAction === `add_${m.id}` ? <FiLoader className="animate-spin" /> : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {materials.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
            No raw materials tracked yet.
          </div>
        )}
      </div>
    </div>
  );
}
