import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Verify auth and admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");
  
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
    
  if (!profile || profile.role !== "admin") redirect("/");

  // Fetch alerts
  const [
    { count: lowStockCount },
    { count: pendingOrdersCount }
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).lt("stock", 10),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid")
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans">
      <AdminSidebar lowStockCount={lowStockCount ?? 0} pendingOrdersCount={pendingOrdersCount ?? 0} />
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
