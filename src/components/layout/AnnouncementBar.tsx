"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar({ config }: { config: any }) {
  if (!config?.enabled || !config?.text) return null;

  let href = config.link;
  if (config.text.toLowerCase().includes('free shipping')) {
    href = '/shop';
  } else if (!href || href === '#' || href === '/') {
    href = '/shop';
  }

  return (
    <div className="bg-emerald-800 text-white py-2 px-4 text-center text-xs md:text-sm font-medium">
      <Link href={href} className="flex items-center justify-center gap-2 hover:underline">
        {config.text} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
