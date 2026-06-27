"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { FiMenu, FiX } from "react-icons/fi";

interface AdminClientLayoutProps {
  children: React.ReactNode;
  userEmail: string;
  lowStockCount: number;
  pendingOrdersCount: number;
}

export default function AdminClientLayout({
  children,
  userEmail,
  lowStockCount,
  pendingOrdersCount,
}: AdminClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer & Desktop Fixed */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <AdminSidebar 
          lowStockCount={lowStockCount} 
          pendingOrdersCount={pendingOrdersCount} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 shadow-sm flex-shrink-0">
          <div className="flex min-w-0 items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 lg:hidden truncate">TribeToy Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm leading-tight text-slate-500 sm:block">
              <span className="text-xs">Signed in as</span>{" "}
              <span className="font-semibold text-slate-800 truncate max-w-[150px] inline-block align-bottom">{userEmail}</span>
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

        <main id="admin-main-scroll" className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto pb-safe">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
