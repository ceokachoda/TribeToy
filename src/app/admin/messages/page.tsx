import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  const { data: messages, count, error } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching messages:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Messages</h1>
          <p className="text-slate-500 mt-1">Manage contact inquiries.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <MessagesClient initialMessages={messages || []} />
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/admin/messages?page=${Math.max(1, currentPage - 1)}`}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 1 ? 'text-slate-400 bg-slate-100 pointer-events-none' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/messages?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === totalPages ? 'text-slate-400 bg-slate-100 pointer-events-none' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
