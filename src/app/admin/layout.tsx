import AdminClientLayout from "@/components/admin/AdminClientLayout";
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
    <AdminClientLayout
      userEmail={user.email || ""}
      lowStockCount={lowStockCount ?? 0}
      pendingOrdersCount={pendingOrdersCount ?? 0}
    >
      {children}
    </AdminClientLayout>
  );
}
