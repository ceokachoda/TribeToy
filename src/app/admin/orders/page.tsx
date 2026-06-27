import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { GenerateLabelAction } from "@/components/admin/GenerateLabelAction";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  // Fetch all orders
  const { data: orders, count } = await supabase
    .from("orders")
    .select(`*, users:user_id (email, full_name)`, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  // Fetch packing exceptions (orders paid/reserved > 3 days ago)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const { data: exceptions } = await supabase
    .from("orders")
    .select(`*, users:user_id (email, full_name)`)
    .in("status", ["paid", "reserved", "packed", "shipped"])
    .lte("created_at", threeDaysAgo.toISOString())
    .order("created_at", { ascending: true })
    .limit(5);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  const calculateAge = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">Signed in as <strong className="text-slate-900">Admin</strong></span>
          <span className="text-emerald-600 font-medium">Admin</span>
        </div>
      </div>

      {/* Packing Exceptions */}
      {exceptions && exceptions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50">
            <h2 className="text-lg font-bold text-slate-900">Packing exceptions</h2>
            <p className="text-sm text-slate-500">Orders waiting to dispatch for 3+ days.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] text-slate-500 text-xs uppercase tracking-wider font-semibold border-y border-slate-100">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exceptions.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.order_no || `TT-${order.id.split("-")[0].toUpperCase()}`}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        {order.channel || "Website"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {order.users?.full_name || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right text-orange-600 font-bold">
                      {calculateAge(order.created_at)}d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders?.map((order) => {
                const isPaid = !!order.razorpay_order_id;
                const orderNo = order.order_no || `TT-${order.id.split("-")[0].toUpperCase()}`;
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-slate-900">
                      {orderNo}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100">
                        {order.channel || "Website"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-700">
                      {order.users?.full_name || "Guest"}
                    </td>
                    <td className="px-6 py-5 text-slate-700 font-medium">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-5">
                      <OrderStatusBadge status={order.status} orderId={order.id} interactive={true} />
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${isPaid ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                        {isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <GenerateLabelAction orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                );
              })}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-50 px-6 py-4 flex items-center justify-between bg-[#FAF8F5]">
            <span className="text-sm text-slate-500 font-medium">
              Showing {offset + 1} to {Math.min(offset + itemsPerPage, count || 0)} of {count}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/orders?page=${Math.max(1, currentPage - 1)}`}
                className={`p-2 rounded-lg bg-white border shadow-sm ${
                  currentPage === 1
                    ? "border-slate-100 text-slate-300 pointer-events-none"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft />
              </Link>
              <Link
                href={`/admin/orders?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-2 rounded-lg bg-white border shadow-sm ${
                  currentPage === totalPages
                    ? "border-slate-100 text-slate-300 pointer-events-none"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
