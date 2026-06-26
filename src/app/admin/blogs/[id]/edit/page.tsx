import { createClient } from "@/utils/supabase/server";
import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Article</h1>
          <p className="text-slate-500 mt-1">Update content for {blog.title}</p>
        </div>
      </div>

      <BlogForm initialData={blog} />
    </div>
  );
}
