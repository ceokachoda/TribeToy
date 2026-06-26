import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiSearch, FiUser } from "react-icons/fi";
import { RevealField, maskEmail } from "@/components/admin/RevealField";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const searchQuery = resolvedSearchParams.q || "";
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  const { data: customers, count, error } = await query.range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching customers:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage your customer accounts and view their details safely.</p>
        </div>
      </div>

      <form method="get" className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search customers by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors">
          Search
        </button>
        {searchQuery && (
          <Link href="/admin/customers" className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
            Clear
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUser size={18} />
                    </div>
                    <span className="font-medium text-slate-900">{customer.full_name || "Unnamed Customer"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <RevealField masked={maskEmail(customer.email)} revealKey="customer.email" id={customer.id} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(customer.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {(!customers || customers.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {Math.min(offset + 1, count || 0)} to {Math.min(offset + itemsPerPage, count || 0)} of {count} entries
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/customers?page=${Math.max(1, currentPage - 1)}`}
                className={`p-2 rounded border ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft />
              </Link>
              <Link
                href={`/admin/customers?page=${Math.min(totalPages, currentPage + 1)}`}
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
