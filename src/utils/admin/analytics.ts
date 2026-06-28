import { createClient } from "@supabase/supabase-js";

// Uses service role key since this runs on the server and aggregates data.
// In actual prod, RLS might be bypassed or handled differently for analytics.
// Since we run this in server components where admin is already verified,
// we can use a service client or just the regular client if RLS allows admins.
// We'll export a function that takes the supabase client to run queries.
import type { SupabaseClient } from "@supabase/supabase-js";

export type DailyTrend = {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
};

export type CategorySplit = {
  category: string;
  revenue: number;
};

export type AnalyticsKpis = {
  revenue: number;
  orders: number;
  aov: number;
  pendingFulfillment: number;
};

export async function getAnalyticsData(supabase: SupabaseClient) {
  const getISTDateString = (date: Date | string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const str = new Intl.DateTimeFormat('en-GB', options).format(d);
    const [day, month, year] = str.split('/');
    return `${year}-${month}-${day}`;
  };

  // Fetch orders in the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

  // 1. Get all active orders (paid, shipped, delivered)
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total_amount, created_at, status")
    .gte("created_at", thirtyDaysAgoIso)
    .neq("status", "cancelled")
    .neq("status", "pending"); // Assuming pending means unpaid

  const activeOrders = orders || [];
  
  // KPIs
  const revenue = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const ordersCount = activeOrders.length;
  const aov = ordersCount > 0 ? revenue / ordersCount : 0;
  
  const pendingFulfillment = activeOrders.filter(o => o.status === "paid").length;

  const kpis: AnalyticsKpis = {
    revenue,
    orders: ordersCount,
    aov,
    pendingFulfillment,
  };

  // Daily Trends
  const trendMap = new Map<string, { revenue: number; orders: number }>();
  
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = getISTDateString(d);
    if (!trendMap.has(dateStr)) {
      trendMap.set(dateStr, { revenue: 0, orders: 0 });
    }
  }

  activeOrders.forEach(o => {
    const dateStr = getISTDateString(o.created_at);
    if (trendMap.has(dateStr)) {
      const current = trendMap.get(dateStr)!;
      current.revenue += Number(o.total_amount);
      current.orders += 1;
    }
  });

  const trend: DailyTrend[] = Array.from(trendMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }));

  // 2. Category split
  // To get this perfectly we need order_items joined with products
  // For simplicity we will fetch order_items for these active orders
  const activeOrderIds = activeOrders.map(o => o.id);
  
  let categorySplit: CategorySplit[] = [];
  
  if (activeOrderIds.length > 0) {
    // Supabase RPC or complex joins can be tricky, let's just fetch items and join in JS for now
    // In production we would create a view or RPC for this.
    const { data: items } = await supabase
      .from("order_items")
      .select("quantity, price_at_time, products(category)")
      .in("order_id", activeOrderIds);
      
    if (items) {
      const catMap = new Map<string, number>();
      items.forEach(item => {
        const cat = (item.products as any)?.category || "Uncategorized";
        const rev = item.quantity * Number(item.price_at_time);
        catMap.set(cat, (catMap.get(cat) || 0) + rev);
      });
      
      categorySplit = Array.from(catMap.entries()).map(([category, revenue]) => ({
        category,
        revenue
      })).sort((a, b) => b.revenue - a.revenue);
    }
  }

  return { kpis, trend, categorySplit };
}
