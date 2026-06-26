import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NewBlogPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Write New Article</h1>
          <p className="text-slate-500 mt-1">Draft and publish a new blog post.</p>
        </div>
      </div>

      <BlogForm />
    </div>
  );
}
