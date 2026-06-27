import { createClient } from "@/utils/supabase/server";
import { FiAlertCircle, FiClock, FiCreditCard, FiPackage, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const supabase = await createClient();

  // 1. Low Stock Products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("id, name, stock_quantity, stock")
    .or("stock_quantity.lt.10,stock.lt.10")
    .order("stock_quantity", { ascending: true })
    .limit(20);

  // 2. Unfulfilled Old Orders (created > 48 hours ago, and status in pending/paid/confirmed/ready_to_pack)
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: oldOrders } = await supabase
    .from("orders")
    .select("id, order_no, created_at, status")
    .in("status", ["pending", "awaiting_payment", "payment_successful", "confirmed", "ready_to_pack", "packed"])
    .lt("created_at", fortyEightHoursAgo)
    .order("created_at", { ascending: true })
    .limit(20);

  // 3. Failed Payments
  const { data: failedPayments } = await supabase
    .from("orders")
    .select("id, order_no, created_at, status, total_amount, users(full_name)")
    .eq("status", "payment_failed")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <FiAlertCircle className="text-red-500" /> System Alerts
        </h1>
        <p className="text-slate-500 mt-1">Items requiring your immediate attention.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Unfulfilled Old Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-amber-50/50">
            <FiClock className="text-amber-500" size={20} />
            <h2 className="font-bold text-slate-800">Delayed Shipments ({oldOrders?.length || 0})</h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {oldOrders?.length === 0 && <div className="p-8 text-center text-slate-500">No delayed shipments. Good job!</div>}
            {oldOrders?.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="font-bold text-slate-900 hover:text-blue-600">
                    {order.order_no || `TT-${order.id.split("-")[0].toUpperCase()}`}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed {Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60))} hrs ago
                  </p>
                </div>
                <div><OrderStatusBadge status={order.status} interactive={false} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-red-50/50">
            <FiCreditCard className="text-red-500" size={20} />
            <h2 className="font-bold text-slate-800">Failed Payments ({failedPayments?.length || 0})</h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {failedPayments?.length === 0 && <div className="p-8 text-center text-slate-500">No failed payments recently.</div>}
            {failedPayments?.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="font-bold text-slate-900 hover:text-blue-600">
                    {order.order_no || `TT-${order.id.split("-")[0].toUpperCase()}`}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{(order.users as any)?.full_name || "Guest"}</p>
                </div>
                <div className="font-medium text-slate-700">₹{(order.total_amount || 0).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-blue-50/50">
            <FiPackage className="text-blue-500" size={20} />
            <h2 className="font-bold text-slate-800">Low Stock Inventory ({lowStockProducts?.length || 0})</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockProducts?.length === 0 && <div className="p-8 text-center text-slate-500">All products have sufficient stock.</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts?.map((product) => {
                const stock = product.stock_quantity ?? product.stock ?? 0;
                return (
                  <div key={product.id} className="p-4 border-b border-r border-slate-100 flex items-center justify-between hover:bg-slate-50">
                    <span className="font-medium text-slate-700 truncate pr-2">{product.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${stock === 0 ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded`}>
                        {stock} left
                      </span>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-slate-400 hover:text-emerald-600">
                        <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
