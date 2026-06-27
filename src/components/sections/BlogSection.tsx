import Link from "next/link";
import Image from "next/image";
import { createStaticClient } from "@/utils/supabase/static";
import { FiArrowRight } from "react-icons/fi";

export default async function BlogSection() {
  const supabase = createStaticClient();
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, title, slug, cover_image_url, author_name, created_at, excerpt, tags")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !blogs || blogs.length === 0) {
    return null; // Don't show the section if no published blogs
  }

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-[#3a352f] tracking-tight mb-4">
              Latest from the <span className="text-[#66A34A]">Tribe</span>
            </h2>
            <p className="text-lg text-slate-500">
              Discover tips, stories, and the latest news about toys and child development.
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[#4C7737] hover:text-[#2a451e] font-semibold transition-colors pb-1 border-b-2 border-transparent hover:border-[#4C7737]"
          >
            Read all articles <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group flex flex-col bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full aspect-[4/3] bg-slate-200 overflow-hidden">
                {blog.cover_image_url ? (
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8F0E4] to-[#FCE8ED] flex items-center justify-center">
                    <span className="text-4xl font-bold text-black/10 tracking-widest uppercase rotate-[-20deg]">TribeToy</span>
                  </div>
                )}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur text-[#D94167] text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {blog.tags[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">
                  <span>{new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{blog.author_name || "TribeToy"}</span>
                </div>
                <h3 className="text-xl font-bold text-[#3a352f] mb-3 group-hover:text-[#4C7737] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                  {blog.excerpt || "Read more about this topic..."}
                </p>
                <div className="mt-auto flex items-center text-sm font-bold text-[#D94167] group-hover:text-[#c4254f] transition-colors">
                  Read Article
                  <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
