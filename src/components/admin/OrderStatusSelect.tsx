"use client";

import { useState } from "react";
import { updateOrderStatus, type OrderStatus } from "@/utils/admin/orders";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus as OrderStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    const oldStatus = status;
    
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.ok) {
        throw new Error(res.error || "Failed to update order status");
      }
      alert(`Order updated to ${newStatus}`);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      alert(err.message || "Failed to update order status");
      setStatus(oldStatus);
    } finally {
      setLoading(false);
    }
  };

  const currentAllowed = VALID_TRANSITIONS[currentStatus as OrderStatus] || [];

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className={`text-sm rounded-full px-3 py-1 font-medium outline-none border transition-colors ${
        status === "pending"
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : status === "paid"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : status === "shipped"
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : status === "delivered"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      <option value="pending" disabled={status !== "pending"}>Pending</option>
      <option value="paid" disabled={status !== "paid" && !currentAllowed.includes("paid")}>Paid</option>
      <option value="shipped" disabled={status !== "shipped" && !currentAllowed.includes("shipped")}>Shipped</option>
      <option value="delivered" disabled={status !== "delivered" && !currentAllowed.includes("delivered")}>Delivered</option>
      <option value="cancelled" disabled={status !== "cancelled" && !currentAllowed.includes("cancelled")}>Cancelled</option>
    </select>
  );
}
