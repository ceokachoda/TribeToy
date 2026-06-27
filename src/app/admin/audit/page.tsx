import { createClient } from "@/utils/supabase/server";
import { FiClipboard, FiClock, FiUser, FiActivity } from "react-icons/fi";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; entity?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 50;
  const offset = (page - 1) * limit;
  const entityFilter = params.entity;

  const supabase = await createClient();

  let query = supabase
    .from("admin_audit_logs")
    .select("*, users:actor_id(full_name, email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (entityFilter) {
    query = query.eq("entity", entityFilter);
  }

  const { data: logs, count } = await query;

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="space-y-6 w-full max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FiClipboard className="text-indigo-500" /> Audit Logs
          </h1>
          <p className="text-slate-500 mt-1">Track every action taken by administrators in the system.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/admin/audit" className={`px-4 py-2 rounded-full text-sm font-bold ${!entityFilter ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</Link>
          <Link href="/admin/audit?entity=order" className={`px-4 py-2 rounded-full text-sm font-bold ${entityFilter === 'order' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Orders</Link>
          <Link href="/admin/audit?entity=product" className={`px-4 py-2 rounded-full text-sm font-bold ${entityFilter === 'product' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Products</Link>
          <Link href="/admin/audit?entity=shipment" className={`px-4 py-2 rounded-full text-sm font-bold ${entityFilter === 'shipment' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Shipments</Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 flex items-center gap-2">
                    <FiClock /> {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 text-slate-700">
                    <FiUser className="text-slate-400" />
                    {log.users?.full_name || log.users?.email || log.actor_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                      {log.entity}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 font-mono">{log.entity_id?.substring(0,8)}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600 max-w-xs truncate" title={JSON.stringify(log.after || log.before)}>
                    {JSON.stringify(log.after || log.before)}
                  </td>
                </tr>
              ))}
              {(!logs || logs.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Link 
                href={`/admin/audit?page=${page - 1}${entityFilter ? `&entity=${entityFilter}` : ''}`} 
                className={`px-3 py-1 text-sm rounded border ${page <= 1 ? 'pointer-events-none opacity-50 bg-slate-50 text-slate-400' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/audit?page=${page + 1}${entityFilter ? `&entity=${entityFilter}` : ''}`} 
                className={`px-3 py-1 text-sm rounded border ${page >= totalPages ? 'pointer-events-none opacity-50 bg-slate-50 text-slate-400' : 'hover:bg-slate-50 text-slate-700'}`}
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
