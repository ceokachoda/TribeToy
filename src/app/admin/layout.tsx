import Link from "next/link";
import { FiHome, FiBox, FiShoppingCart, FiFileText, FiUsers, FiGlobe } from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <NavItem href="/admin/products" icon={<FiBox />} label="Products" />
          <NavItem href="/admin/orders" icon={<FiShoppingCart />} label="Orders" />
          <NavItem href="/admin/blogs" icon={<FiFileText />} label="Blogs" />
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

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all flex-shrink-0"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
}
