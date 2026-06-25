"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Toys & Figurines",
    description: "Intricately detailed characters and action figures.",
    image: "https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?q=80&w=800&auto=format&fit=crop",
    colSpan: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Educational",
    description: "Hands-on learning puzzles and tracing boards.",
    image: "https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=800&auto=format&fit=crop",
    colSpan: "md:col-span-1 md:row-span-1",
  },
  {
    name: "Utility Decor",
    description: "Functional and aesthetic homeware.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
    colSpan: "md:col-span-1 md:row-span-1",
  },
  {
    name: "Cultural",
    description: "Celebrating Indian heritage through miniatures.",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=800&auto=format&fit=crop",
    colSpan: "md:col-span-2 md:row-span-1",
  },
];

export default function ProductCategories() {
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Shop By <span className="text-gradient">Category</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            From playful figurines to educational tools, explore our diverse range of 3D printed wonders crafted for every need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl overflow-hidden group ${category.colSpan} min-h-[250px] md:min-h-0`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/70 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {category.description}
                  </p>
                  <Link href="/shop" className="inline-flex items-center gap-2 text-primary font-medium text-sm group/link">
                    Explore Collection
                    <ArrowUpRight size={16} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
