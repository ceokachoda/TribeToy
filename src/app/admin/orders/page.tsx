import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiEye, FiShoppingCart, FiDownloadCloud, FiArrowLeft } from "react-icons/fi";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { GenerateLabelAction } from "@/components/admin/GenerateLabelAction";
import { type OrderStatus } from "@/utils/admin/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const activeTab = resolvedSearchParams.tab || "all";
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(`
      *,
      users:user_id (email, full_name)
    `, { count: "exact" })
    .order("created_at", { ascending: false });

  if (activeTab === "cod") {
    query = query.is("razorpay_order_id", null);
  } else if (activeTab === "paid") {
    query = query.not("razorpay_order_id", "is", null);
  }

  // Fetch orders with user details
  const { data: orders, count, error } = await query.range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <FiShoppingCart className="text-emerald-500" /> Orders
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Manage customer orders and fulfillment.</p>
          </div>
        </div>
        
        <Link 
          href="/admin/orders/import" 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <FiDownloadCloud /> Import Amazon CSV
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <Link 
          href="/admin/orders?tab=all"
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'all' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          All Orders
        </Link>
        <Link 
          href="/admin/orders?tab=paid"
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'paid' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Prepaid Orders
        </Link>
        <Link 
          href="/admin/orders?tab=cod"
          className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'cod' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          COD Orders
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {order.id.split("-")[0]}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {order.users?.full_name || "Guest User"}
                    </div>
                    <div className="text-xs text-slate-500">{order.users?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
                      {order.razorpay_order_id ? (
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full w-max">Prepaid</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-max">COD</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 flex items-center gap-1 justify-end" title="View Details">
                        <FiEye size={16} /> <span className="text-xs">View</span>
                      </button>
                      <GenerateLabelAction orderId={order.id} currentStatus={order.status as OrderStatus} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No orders found.
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
                href={`/admin/orders?page=${Math.max(1, currentPage - 1)}&tab=${activeTab}`}
                className={`p-2 rounded border ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft />
              </Link>
              <Link
                href={`/admin/orders?page=${Math.min(totalPages, currentPage + 1)}&tab=${activeTab}`}
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
