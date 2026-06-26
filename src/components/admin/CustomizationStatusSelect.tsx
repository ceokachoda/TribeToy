"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function CustomizationStatusSelect({ 
  customizationId, 
  currentStatus 
}: { 
  customizationId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("customizations")
        .update({ status: newStatus })
        .eq("id", customizationId);

      if (error) throw error;
      
      showToast("Status updated successfully", "success");
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
      setStatus(currentStatus); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none text-xs font-semibold rounded-full px-3 py-1 pr-8 border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors ${getStatusColor(status)} ${isUpdating ? 'opacity-50' : ''}`}
      >
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
