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
  // Fetch orders in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
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
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    trendMap.set(dateStr, { revenue: 0, orders: 0 });
  }

  activeOrders.forEach(o => {
    const dateStr = o.created_at.split("T")[0];
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
