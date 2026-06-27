"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar({ config }: { config: any }) {
  if (!config?.enabled || !config?.text) return null;

  return (
    <div className="bg-emerald-800 text-white py-2 px-4 text-center text-xs md:text-sm font-medium">
      {config.link ? (
        <Link href={config.link} className="flex items-center justify-center gap-2 hover:underline">
          {config.text} <ArrowRight size={14} />
        </Link>
      ) : (
        <span>{config.text}</span>
      )}
    </div>
  );
}
