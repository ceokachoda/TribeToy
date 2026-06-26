"use client";

import { useState, useTransition } from "react";
import { revealSensitive, type RevealKey } from "@/utils/admin/sensitive";

export function RevealField({
  masked,
  revealKey,
  id,
}: {
  masked: string;
  revealKey: RevealKey;
  id: string;
}) {
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  if (value !== null) {
    return <span className="font-medium text-slate-900">{value}</span>;
  }

  if (masked === "—" || !masked) return <span className="text-slate-400">—</span>;

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-slate-500">{masked}</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(false);
            try {
              const result = await revealSensitive(revealKey, id);
              setValue(result ?? "—");
            } catch {
              setError(true);
            }
          })
        }
        className="text-xs font-semibold text-emerald-600 underline decoration-dotted underline-offset-2 hover:text-emerald-700 disabled:opacity-50"
      >
        {pending ? "Revealing..." : error ? "Retry" : "Reveal"}
      </button>
    </span>
  );
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : `*`;
  return `${maskedName}@${domain}`;
}

export function maskAddress(address: string | null | undefined): string {
  if (!address) return "—";
  if (address.length <= 10) return "***";
  return `${address.substring(0, 10)}...`;
}
