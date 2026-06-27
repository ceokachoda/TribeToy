"use client";

import { useState } from "react";
import { updateOrderStatus, type OrderStatus } from "@/utils/admin/orders";
import { useToast } from "@/context/ToastContext";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "shipped", "cancelled"],
  paid: ["reserved", "packed", "shipped", "cancelled", "refunded"],
  reserved: ["packed", "shipped", "cancelled"],
  packed: ["shipped", "dispatched", "cancelled"],
  shipped: ["dispatched", "delivered", "returned"],
  dispatched: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: ["refunded"],
  returned: ["refunded"],
  refunded: [],
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Pending", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  paid: { label: "Paid", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  reserved: { label: "Reserved", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  packed: { label: "Packed", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  shipped: { label: "Label generated", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  dispatched: { label: "Dispatched", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  delivered: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  returned: { label: "Returned", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  refunded: { label: "Refunded", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
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
  const [status, setStatus] = useState<OrderStatus>(initialStatus as OrderStatus);
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

  const config = STATUS_CONFIG[status as OrderStatus] || STATUS_CONFIG.pending;
  const currentAllowed = VALID_TRANSITIONS[status as OrderStatus] || [];

  const baseClasses = `text-[11px] px-3 py-1 font-bold rounded-full inline-flex items-center justify-center transition-colors ${config.bg} ${config.text}`;

  if (!interactive) {
    return <span className={baseClasses}>{config.label}</span>;
  }

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className={`${baseClasses} outline-none cursor-pointer appearance-none text-center`}
      style={{ backgroundImage: 'none' }} // Hide default select arrow for cleaner look
    >
      {Object.entries(STATUS_CONFIG).map(([key, val]) => {
        const isCurrent = key === status;
        const isAllowed = currentAllowed.includes(key as OrderStatus);
        
        // Only show if it's the current status, or it's an allowed transition
        if (!isCurrent && !isAllowed) return null;
        
        return (
          <option key={key} value={key}>
            {val.label}
          </option>
        );
      })}
    </select>
  );
}
