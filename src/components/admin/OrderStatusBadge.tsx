"use client";

import { useState } from "react";
import { updateOrderStatus, type OrderStatus } from "@/utils/admin/orders";
import { useToast } from "@/context/ToastContext";
import { FiChevronDown } from "react-icons/fi";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  awaiting_payment: { label: "Awaiting Payment", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  payment_failed: { label: "Payment Failed", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  payment_successful: { label: "Payment Successful", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  ready_to_pack: { label: "Ready To Pack", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  packed: { label: "Packed", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  label_generated: { label: "Label Generated", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  picked_up: { label: "Picked Up", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  in_transit: { label: "In Transit", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  out_for_delivery: { label: "Out For Delivery", bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
  delivered: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  refund_requested: { label: "Refund Requested", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  refunded: { label: "Refunded", bg: "bg-slate-200", text: "text-slate-800", border: "border-slate-300" },
  returned: { label: "Returned", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  lost_shipment: { label: "Lost Shipment", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  delivery_failed: { label: "Delivery Failed", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
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
      showToast(`Order updated to ${STATUS_CONFIG[newStatus].label}`, "success");
    } catch (err: any) {
      console.error("Error updating order status:", err);
      showToast(err.message || "Failed to update order status", "error");
      setStatus(oldStatus);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to pending if status is somehow not in the config (e.g. legacy DB value)
  const config = STATUS_CONFIG[status as OrderStatus] || STATUS_CONFIG.pending;
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
        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
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
