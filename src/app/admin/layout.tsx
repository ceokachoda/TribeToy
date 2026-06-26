import Link from "next/link";
import { FiHome, FiBox, FiShoppingCart, FiFileText, FiUsers, FiGlobe, FiSettings, FiPenTool, FiPackage } from "react-icons/fi";
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 md:min-h-screen flex flex-col">
        <div className="p-6">
          <Link href="/admin">
            <h2 className="text-2xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">
              TribeToy <span className="text-emerald-400">Admin</span>
            </h2>
          </Link>
          <p className="text-slate-400 text-sm mt-1">Management Dashboard</p>
        </div>
        <nav className="mt-2 flex md:flex-col gap-1 px-4 overflow-x-auto hide-scrollbar flex-1">
          <NavItem href="/admin" icon={<FiHome />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<FiBox />} label="Products" badge={(lowStockCount ?? 0) > 0 ? (lowStockCount ?? 0) : undefined} badgeColor="bg-amber-500" />
          <NavItem href="/admin/orders" icon={<FiShoppingCart />} label="Orders" badge={(pendingOrdersCount ?? 0) > 0 ? (pendingOrdersCount ?? 0) : undefined} badgeColor="bg-blue-500" />
          <NavItem href="/admin/shipments" icon={<FiPackage />} label="Shipments" />
          <NavItem href="/admin/customizations" icon={<FiPenTool />} label="Customizations" />
          <NavItem href="/admin/blogs" icon={<FiFileText />} label="Blogs" />
          <NavItem href="/admin/customers" icon={<FiUsers />} label="Customers" />
          <NavItem href="/admin/homepage" icon={<FiHome />} label="Homepage" />
          <NavItem href="/admin/settings" icon={<FiSettings />} label="Settings" />
        </nav>
        <div className="p-4 mt-auto hidden md:block">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all font-medium border border-slate-700"
          >
            <FiGlobe />
            Back to Store
          </Link>
        </div>
        {/* Mobile version of the button */}
        <div className="px-4 pb-4 md:hidden">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm font-medium border border-slate-700"
          >
            <FiGlobe />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, badge, badgeColor }: { href: string; icon: React.ReactNode; label: string; badge?: number; badgeColor?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all flex-shrink-0"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium whitespace-nowrap">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor || "bg-emerald-500"}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
