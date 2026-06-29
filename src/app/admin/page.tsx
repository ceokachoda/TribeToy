import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { FiBox, FiShoppingCart, FiDollarSign, FiActivity, FiClock, FiAlertTriangle, FiPackage, FiTruck } from "react-icons/fi";
import Link from "next/link";
import DashboardSkeleton from "./DashboardSkeleton";
import { getAnalyticsData } from "@/utils/admin/analytics";
import { RevenueTrendChart, OrdersTrendChart, CategorySplitChart } from "@/components/admin/analytics/LazyCharts";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 w-full overflow-hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <FiActivity className="text-emerald-500" /> Dashboard Analytics
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Sales performance for the last 30 days.</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}

async function DashboardData() {
  const supabase = await createClient();

  // Parallel fetch: Analytics + Low Stock + Backlog
  const [
    analytics,
    { data: lowStock },
    { data: backlog }
  ] = await Promise.all([
    getAnalyticsData(supabase),
    supabase.from("products").select("id, name, stock, category").lt("stock", 10).order("stock", { ascending: true }),
    supabase.from("orders").select("id, total_amount, created_at, status, users:user_id(full_name)").eq("status", "paid").order("created_at", { ascending: true })
  ]);

  const { kpis, trend, categorySplit } = analytics;

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard 
          title="Revenue (30d)" 
          value={`₹${kpis.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} 
          icon={<FiDollarSign size={20} className="text-emerald-600" />}
          gradient="from-emerald-500/10 to-emerald-500/5"
        />
        <KpiCard 
          title="Orders (30d)" 
          value={kpis.orders.toString()} 
          icon={<FiShoppingCart size={20} className="text-blue-600" />}
          gradient="from-blue-500/10 to-blue-500/5"
        />
        <KpiCard 
          title="Avg Order Value" 
          value={`₹${kpis.aov.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} 
          icon={<FiActivity size={20} className="text-purple-600" />}
          gradient="from-purple-500/10 to-purple-500/5"
        />
        <KpiCard 
          title="Pending Fulfillment" 
          value={kpis.pendingFulfillment.toString()} 
          icon={<FiPackage size={20} className={kpis.pendingFulfillment > 0 ? "text-amber-600" : "text-slate-500"} />}
          gradient={kpis.pendingFulfillment > 0 ? "from-amber-500/10 to-amber-500/5" : "from-slate-500/10 to-slate-500/5"}
          highlight={kpis.pendingFulfillment > 0}
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Revenue Trend (Last 30 Days)</h2>
          <RevenueTrendChart data={trend} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Orders Trend (Last 30 Days)</h2>
          <OrdersTrendChart data={trend} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:col-span-1">
           <h2 className="text-sm font-bold text-slate-800 mb-4">Category Split (Revenue)</h2>
           {categorySplit.length > 0 ? (
             <CategorySplitChart data={categorySplit} />
           ) : (
             <div className="h-64 flex items-center justify-center text-sm text-slate-500">
               No sales data available for split.
             </div>
           )}
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden flex flex-col">
            <div className="p-4 bg-red-50/50 border-b border-red-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-red-900 flex items-center gap-2">
                <FiAlertTriangle className="text-red-500" /> Low Stock Alerts
              </h2>
              <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {lowStock?.length || 0}
              </span>
            </div>
            <div className="overflow-auto max-h-[300px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full min-w-[300px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStock?.map(item => (
                    <tr key={item.id} className="hover:bg-red-50/30">
                      <td className="px-4 py-2 font-medium text-slate-900 truncate max-w-[150px]" title={item.name}>
                        <Link href={`/admin/products/${item.id}/edit`} className="hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-red-600">
                        {item.stock}
                      </td>
                    </tr>
                  ))}
                  {(!lowStock || lowStock.length === 0) && (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-slate-500 text-xs">
                        All products are sufficiently stocked.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packing Backlog */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden flex flex-col">
            <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <FiTruck className="text-amber-500" /> Packing Backlog
              </h2>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {backlog?.length || 0}
              </span>
            </div>
            <div className="overflow-auto max-h-[300px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full min-w-[400px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Order #</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2 text-right">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {backlog?.map(order => {
                    const daysOld = Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / (1000 * 3600 * 24));
                    return (
                      <tr key={order.id} className="hover:bg-amber-50/30">
                        <td className="px-4 py-2 font-mono text-xs">
                          <Link href="/admin/orders" className="hover:underline text-slate-900 font-semibold">
                            {`TT-${order.id.split("-")[0].toUpperCase()}`}
                          </Link>
                        </td>
                        <td className="px-4 py-2 truncate max-w-[100px]" title={(order.users as any)?.full_name || ""}>
                          {(order.users as any)?.full_name || "Guest"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className={`text-xs font-bold ${daysOld > 1 ? "text-red-600" : "text-amber-600"}`}>
                            {daysOld === 0 ? "Today" : `${daysOld}d`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {(!backlog || backlog.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500 text-xs">
                        No pending orders to pack.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({ title, value, icon, gradient, highlight }: { title: string; value: string; icon: React.ReactNode; gradient: string; highlight?: boolean }) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border ${highlight ? 'border-amber-200' : 'border-slate-200'} relative overflow-hidden group hover:border-emerald-300 transition-colors`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} rounded-bl-full -mr-6 -mt-6 pointer-events-none transition-transform group-hover:scale-110`} />
      
      <div className="flex justify-between items-start relative z-10 mb-4">
        <h3 className="text-slate-600 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <div className="w-10 h-10 bg-slate-50 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      
      <div className={`text-3xl font-black tracking-tight relative z-10 ${highlight ? 'text-amber-700' : 'text-slate-900'}`}>
        {value}
      </div>
    </div>
  );
}
