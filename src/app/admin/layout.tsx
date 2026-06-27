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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800 lg:hidden">TribeToy Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm leading-tight text-slate-500 sm:block">
              <span className="text-xs">Signed in as</span>{" "}
              <span className="font-semibold text-slate-800">{user.email}</span>
              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Admin
              </span>
            </div>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main id="admin-main-scroll" className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
