"use client";

import { useState } from "react";
import { updateOrderStatus, type OrderStatus } from "@/utils/admin/orders";
import { useToast } from "@/context/ToastContext";
import { FiChevronDown } from "react-icons/fi";

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  processing: { label: "Processing", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  shipped: { label: "Shipped", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  delivered: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  returned: { label: "Returned", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  refunded: { label: "Refunded", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
};

export default function OrderStatusBadge({
  status: initialStatus,
  orderId,
  interactive = false
}: {
  status: string;
  orderId?: string;
  interactive?: boolean;
}) {
  const [status, setStatus] = useState<OrderStatus>((initialStatus as OrderStatus) || "pending");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!orderId) return;
    const newStatus = e.target.value as OrderStatus;
    const oldStatus = status;
    
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update order status");
      }
      showToast(`Order updated to ${STATUS_STYLES[newStatus].label}`, "success");
    } catch (err: any) {
      console.error("Error updating order status:", err);
      showToast(err.message || "Failed to update order status", "error");
      setStatus(oldStatus);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to pending if status is somehow not in the config (e.g. legacy DB value)
  const config = STATUS_STYLES[status as string] || STATUS_STYLES.pending;
  const baseClasses = `text-xs px-3 py-1.5 font-bold rounded-lg border flex items-center justify-between gap-2 transition-colors w-full ${config.bg} ${config.text} ${config.border}`;

  if (!interactive) {
    return <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>;
  }

  return (
    <div className="relative w-full">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className={`${baseClasses} outline-none cursor-pointer appearance-none z-10 relative bg-transparent`}
      >
        {Object.entries(STATUS_STYLES).map(([key, val]) => (
          <option key={key} value={key} className="bg-white text-slate-900">
            {val.label}
          </option>
        ))}
      </select>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${config.text}`}>
        {loading ? <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"></div> : <FiChevronDown size={14} />}
      </div>
    </div>
  );
}
