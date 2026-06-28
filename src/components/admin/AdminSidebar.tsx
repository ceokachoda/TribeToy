"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, 
  FiPackage, FiTruck, FiBell, FiClipboard
} from "react-icons/fi";

export default function AdminSidebar({
  lowStockCount,
  pendingOrdersCount,
  onClose,
}: {
  lowStockCount: number;
  pendingOrdersCount: number;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: <FiHome size={20} />, label: "Dashboard" },
    { href: "/admin/orders", icon: <FiShoppingCart size={20} />, label: "Orders" },
    { href: "/admin/products", icon: <FiBox size={20} />, label: "Products" },
    { href: "/admin/customers", icon: <FiUsers size={20} />, label: "Customers" },
    { href: "/admin/inventory", icon: <FiPackage size={20} />, label: "Inventory" },
    { href: "/admin/shipments", icon: <FiTruck size={20} />, label: "Shipments" },
    { href: "/admin/homepage", icon: <FiClipboard size={20} />, label: "Homepage CMS" },
    { href: "/admin/blogs", icon: <FiClipboard size={20} />, label: "Blogs CMS" },
    { href: "/admin/alerts", icon: <FiBell size={20} />, label: "Alerts", badge: lowStockCount + pendingOrdersCount },
    { href: "/admin/audit", icon: <FiClipboard size={20} />, label: "Audit log" },
    { href: "/admin/settings", icon: <FiSettings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="w-full h-full bg-white border-r border-slate-200 flex-shrink-0 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-6 pb-8 border-b border-slate-100 flex-shrink-0 flex justify-between items-start">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <div className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shadow-sm flex-shrink-0">
            <Image src="/logo-new.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-[#4C7737] leading-tight">
              TribeToy
            </h2>
            <span className="text-[10px] font-bold text-[#D94167] uppercase tracking-wide">Commerce Dashboard</span>
          </div>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <nav className="mt-6 flex flex-col gap-1 px-4 flex-1 pb-4">
        {navItems.map((item) => {
          // Exact match for dashboard, prefix match for others
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-full transition-all ${
                isActive 
                  ? "bg-[#66A34A] text-white shadow-md shadow-green-900/10" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white text-[#66A34A]" : "bg-pink-100 text-[#D94167]"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-100 hidden md:block space-y-4 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors border border-slate-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Storefront
        </Link>
        <div className="text-xs text-slate-400 text-center font-medium">TribeToy Admin v2.0<br/>TIC · IIT Guwahati</div>
      </div>
    </aside>
  );
}
