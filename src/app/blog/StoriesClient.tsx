"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Award, Sparkles } from "lucide-react";
import type { BlogPost } from "@/data/blogs";

export default function StoriesClient({ blogs }: { blogs: BlogPost[] }) {
  const [activeTab, setActiveTab] = useState<"blogs" | "achievements">("blogs");

  return (
    <>
      {/* Header Title */}
      <div className="mb-12 pb-8 flex flex-col items-start gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Our Journey</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-2 text-foreground drop-shadow-md">
          Stories & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Impact</span>
        </h1>
        <p className="text-foreground/50 max-w-2xl text-lg font-medium">
          Explore our community workshops, sustainability efforts, and how we are building a greener future through 3D printing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-foreground/10 pb-0 mb-12 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab("blogs")}
          className={`flex items-center gap-2 px-6 py-4 font-bold tracking-widest uppercase text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === "blogs" ? "border-primary text-primary" : "border-transparent text-foreground/40 hover:text-foreground/80"}`}
        >
          <BookOpen size={18} /> Editorials
        </button>
        <button 
          onClick={() => setActiveTab("achievements")}
          className={`flex items-center gap-2 px-6 py-4 font-bold tracking-widest uppercase text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === "achievements" ? "border-primary text-primary" : "border-transparent text-foreground/40 hover:text-foreground/80"}`}
        >
          <Award size={18} /> Workshops & Achievements
        </button>
      </div>

      {activeTab === "blogs" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 animate-in fade-in duration-700">
          {blogs.map((blog) => (
            <Link 
              key={blog.slug} 
              href={`/blog/${blog.slug}`}
              className="group relative rounded-[2.5rem] bg-white border border-foreground/10 transition-all duration-700 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(121,152,122,0.25)] flex flex-col h-full hover:border-primary/50 group-hover:-translate-y-2 transform-gpu"
            >
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-foreground/5 flex items-center justify-center">
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] z-10 pointer-events-none" />
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow relative z-20 bg-white">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {blog.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-primary font-black uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-2xl font-heading font-black text-foreground mb-4 leading-tight tracking-tight drop-shadow-sm line-clamp-3 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-foreground/60 text-sm md:text-base font-medium mb-auto line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-end justify-between mt-8 pt-6 border-t border-foreground/5 relative">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-bold mb-1">Published</span>
                    <span className="text-sm font-bold text-foreground tracking-tight">{blog.date}</span>
                  </div>

                  <div className="relative overflow-hidden group/arrow w-12 h-12 rounded-full bg-gradient-to-br from-white to-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(121,152,122,0.4)] shrink-0 transform-gpu group-hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary translate-y-[100%] group-hover/arrow:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                    <ArrowRight size={20} className="text-foreground group-hover/arrow:text-white relative z-10 group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-12 animate-in fade-in duration-700">
          
          {/* Featured Achievement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-[3rem] p-8 md:p-12 border border-foreground/5 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md w-fit">
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Milestone</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground leading-tight">
                IIT Guwahati SPE & Inter IIT 2025
              </h2>
              <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                TribeToy is proud to partner with prestigious institutions to bring sustainable 3D-printed innovations to major events. From eco-friendly medals for the Inter IIT Sports Meet to custom world map trophies for the IIT Guwahati SPE Student Chapter, we are redefining modern awards.
              </p>
            </div>
            <div className="lg:col-span-7 relative aspect-[4/3] md:aspect-square lg:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-foreground/10 group">
              <Image src="/Tribetoy_blogs/Tribetoy_blog_2.png" alt="IIT Guwahati SPE Order" fill className="object-cover group-hover:scale-105 transition-transform duration-[2s]" />
            </div>
          </div>

          {/* Masonry Gallery of Workshops and Trophies */}
          <div className="mt-8">
            <h3 className="text-2xl font-heading font-black mb-8">Workshop Highlights & Custom Orders</h3>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="relative rounded-[2rem] overflow-hidden bg-white border border-foreground/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(121,152,122,0.15)] transition-all duration-500 group break-inside-avoid">
                  {/* Aspect ratio auto handles varying image sizes naturally in columns */}
                  <Image 
                    src={`/Tribetoy_blogs/Tribetoy_blog_${num}.png`} 
                    alt={`Highlight ${num}`} 
                    width={800} 
                    height={800} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
}
