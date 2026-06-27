import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiImage, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  const { data: blogs, count, error } = await supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blogs & Articles</h1>
            <p className="text-slate-500 mt-1">Manage your content marketing and news updates.</p>
          </div>
        </div>
        <Link
          href="/admin/blogs/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FiPlus /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {blogs?.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-10 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                      {blog.cover_image_url ? (
                        <Image
                          src={blog.cover_image_url}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FiImage size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-slate-500">/{blog.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{blog.author_name || "Unknown"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button className="text-red-500 hover:text-red-700 p-1" title="Delete">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!blogs || blogs.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No articles found. Write your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {Math.min(offset + 1, count || 0)} to {Math.min(offset + itemsPerPage, count || 0)} of {count} entries
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/blogs?page=${Math.max(1, currentPage - 1)}`}
                className={`p-2 rounded border ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft />
              </Link>
              <Link
                href={`/admin/blogs?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-2 rounded border ${
                  currentPage === totalPages
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
