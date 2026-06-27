import { createClient } from "@/utils/supabase/server";
import { FiTrendingUp, FiCalendar, FiDollarSign, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DailyAnalyticsPage() {
  const supabase = await createClient();

  // Fetch all orders (in a real production app with thousands of orders, we'd paginate or group in SQL)
  // For simplicity and detailed view, we fetch paid/shipped/delivered orders.
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, 
      created_at, 
      total_amount, 
      status,
      order_items ( quantity )
    `)
    .in("status", ["paid", "shipped", "delivered"])
    .order("created_at", { ascending: false });

  // Group by Date (YYYY-MM-DD)
  const dailyStats: Record<string, { revenue: number; orderCount: number; unitsSold: number }> = {};
  
  orders?.forEach(order => {
    const dateStr = new Date(order.created_at).toISOString().split('T')[0];
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = { revenue: 0, orderCount: 0, unitsSold: 0 };
    }
    dailyStats[dateStr].revenue += Number(order.total_amount) || 0;
    dailyStats[dateStr].orderCount += 1;
    
    let units = 0;
    order.order_items?.forEach((item: any) => {
      units += item.quantity || 1;
    });
    dailyStats[dateStr].unitsSold += units;
  });

  const sortedDates = Object.keys(dailyStats).sort((a, b) => b.localeCompare(a)); // Newest first

  return (
    <div className="space-y-6 w-full max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <FiTrendingUp className="text-emerald-500" /> Day-Wise Sales
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Detailed daily breakdown of revenue and volume.</p>
          </div>
        </div>
        <Link 
          href="/admin"
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          Overview Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 flex items-center gap-2"><FiCalendar /> Date</th>
                <th className="px-6 py-4 text-right">Orders</th>
                <th className="px-6 py-4 text-right">Units Sold</th>
                <th className="px-6 py-4 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedDates.map(date => {
                const stat = dailyStats[date];
                return (
                  <tr key={date} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {stat.orderCount}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {stat.unitsSold}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      ₹{stat.revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {sortedDates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No sales data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
