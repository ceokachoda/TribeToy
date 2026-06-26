"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      // Optionally trigger a toast notification here
    } catch (err) {
      console.error("Error updating order status:", err);
      // Revert on failure
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

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
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
