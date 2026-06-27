"use client";

import { useState } from "react";
import { generateLabel } from "@/utils/admin/labels/pdf";
import { FiFileText, FiCheckCircle } from "react-icons/fi";
import { type OrderStatus } from "@/utils/admin/orders";

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

  // Can only generate labels for confirmed, ready_to_pack, packed, or already label_generated
  const canGenerate = ["payment_successful", "confirmed", "ready_to_pack", "packed", "label_generated", "picked_up", "in_transit"].includes(currentStatus);

  async function handleGenerate() {
    if (!canGenerate) return;
    setError(null);
    setPending(true);
    setSuccess(false);

    try {
      const res = await generateLabel(orderId);
      if (!res.ok) {
        setError(res.error || "Failed to generate label");
      } else {
        setSuccess(true);
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
    return <span className="text-emerald-600 flex items-center gap-1 text-xs"><FiCheckCircle /> Generated</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleGenerate}
        disabled={pending || !canGenerate}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed"
        title={canGenerate ? "Generate PDF Label" : "Must be paid/shipped to generate label"}
      >
        <FiFileText size={14} />
        <span>{pending ? "Generating..." : "Label"}</span>
      </button>
      {error && <span className="text-[10px] text-red-600 max-w-[100px] text-right leading-tight">{error}</span>}
    </div>
  );
}
