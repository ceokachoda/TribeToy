"use client";

import { useState } from "react";
import { getLabelSignedUrl } from "@/utils/admin/labels/pdf";
import { FiDownload } from "react-icons/fi";

export function LabelDownloadButton({
  shipmentId,
  hasLabel,
  className,
}: {
  shipmentId: string;
  hasLabel: boolean;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setError(null);
    setPending(true);
    const res = await getLabelSignedUrl(shipmentId);
    setPending(false);
    
    if (!res.ok || !res.data) {
      setError(res.error || "Failed to download");
      return;
    }
    window.open(res.data, "_blank", "noopener,noreferrer");
  }

  if (!hasLabel) {
    return <span className="text-xs text-slate-400 font-medium">No label</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={open}
        disabled={pending}
        className={
          className ??
          "inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50"
        }
      >
        <FiDownload />
        {pending ? "Fetching..." : "Download"}
      </button>
      {error && <span className="text-[10px] text-red-600 font-medium">{error}</span>}
    </div>
  );
}
