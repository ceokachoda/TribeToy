"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Totoro Mini Figurine",
    category: "Toys & Figurines",
    price: "₹349.00",
    image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=800&auto=format&fit=crop", // placeholder
    isNew: true,
  },
  {
    id: 2,
    name: "Taj Wonder - Eco Miniature",
    category: "Cultural",
    price: "₹599.00",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop",
    isSale: true,
  },
  {
    id: 3,
    name: "Educational Puzzle Bird",
    category: "Educational",
    price: "₹499.00",
    image: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Lachit Borphukan Action Figure",
    category: "Toys & Figurines",
    price: "₹999.00",
    originalPrice: "₹1,299.00",
    image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
    isSale: true,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-[#080808] relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              Featured <span className="text-gradient">Creations</span>
            </h2>
            <p className="text-foreground/60 max-w-xl">
              Discover our most popular 3D printed toys and decors. Meticulously designed, sustainably made, and hand-finished to perfection.
            </p>
          </div>
          <Link href="/shop" className="px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors font-medium text-sm whitespace-nowrap">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 relative"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-primary text-black text-xs font-bold uppercase rounded-full">New</span>
                )}
                {product.isSale && (
                  <span className="px-3 py-1 bg-accent text-white text-xs font-bold uppercase rounded-full">Sale</span>
                )}
              </div>
              
              {/* Actions on hover */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors" title="Add to Wishlist">
                  <Heart size={18} />
                </button>
                <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors" title="Quick View">
                  <Eye size={18} />
                </button>
              </div>

              {/* Image */}
              <div className="relative h-64 w-full bg-black/20 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-foreground/50 uppercase tracking-wider mb-2 block">{product.category}</span>
                <h3 className="font-heading font-semibold text-lg mb-4 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-foreground/40 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors group/btn">
                    <ShoppingBag size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
