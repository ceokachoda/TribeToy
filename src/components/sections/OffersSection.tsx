"use client";

import Image from "next/image";
import Link from "next/link";

export default function OffersSection({ data }: { data: any }) {
  if (!data?.banners || data.banners.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.banners.map((item: any, i: number) => {
            if (!item.image) return null;
            return (
              <Link href={item.link || "/shop"} key={i} className="block relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <Image src={item.image} alt="Special Offer" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
