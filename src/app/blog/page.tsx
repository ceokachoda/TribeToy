import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import StoriesClient from "./StoriesClient";
import { createStaticClient } from "@/utils/supabase/static";

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
  title: "Stories & Impact - TribeToy",
  description: "Read about our workshops, IIT collaborations, and the community impact we are making across Assam.",
};

export default async function BlogPage() {
  const supabase = createStaticClient();
  const { data: dbBlogs, error } = await supabase.from('blogs').select('slug, title, excerpt, content, cover_image_url, created_at, author_name, tags').order('created_at', { ascending: false });

  const mappedBlogs = (dbBlogs || []).map((b: any) => ({
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.cover_image_url || "",
    date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: b.author_name,
    tags: b.tags || [],
  }));

  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        <StoriesClient blogs={mappedBlogs} />
      </div>
    </main>
  );
}
