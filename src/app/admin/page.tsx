import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { FiBox, FiShoppingCart, FiDollarSign, FiActivity, FiClock, FiPlusCircle, FiEdit3, FiTrash2 } from "react-icons/fi";
import DashboardSkeleton from "./DashboardSkeleton";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 w-full overflow-hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <FiActivity className="text-emerald-500" /> Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Welcome to the TribeToy administration panel.</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}

async function DashboardData() {
  const supabase = await createClient();

  // Fetch parallel data
  const [
    { count: productsCount },
    { count: ordersCount, data: orders },
    { data: logs },
    { data: categoriesData }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount", { count: "exact" }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("products").select("category")
  ]);

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
  const uniqueCategories = Array.from(new Set(categoriesData?.map(p => p.category).filter(Boolean))).sort();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total Orders" 
          value={ordersCount?.toString() || "0"} 
          description="Lifetime orders"
          icon={<FiShoppingCart size={24} className="text-emerald-500" />}
          gradient="from-emerald-500/10 to-emerald-500/5"
        />
        <StatCard 
          title="Total Products" 
          value={productsCount?.toString() || "0"} 
          description="Active in store"
          icon={<FiBox size={24} className="text-blue-500" />}
          gradient="from-blue-500/10 to-blue-500/5"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} 
          description="Lifetime earnings"
          icon={<FiDollarSign size={24} className="text-purple-500" />}
          gradient="from-purple-500/10 to-purple-500/5"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiActivity className="text-emerald-600" /> Live Audit Logs
              </h2>
              <p className="text-slate-500 text-xs mt-1">Real-time tracking of system events.</p>
            </div>
            <div className="flex gap-2 items-center">
               <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <div className="p-0 overflow-y-auto max-h-[500px] custom-scrollbar">
            {logs && logs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {logs.map((log: any) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <FiClock className="text-slate-300" size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Activity Yet</h3>
                <p className="text-xs text-slate-500">System events will appear here once actions are taken.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Graphic / Secondary Card for layout balance */}
        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative flex flex-col p-8 text-white min-h-[300px] xl:min-h-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 blur-[50px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <FiBox className="text-emerald-400" /> Active Categories
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Currently active product categories in the store.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {uniqueCategories.map((cat: any) => (
                <span key={cat} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-lg text-sm font-medium backdrop-blur-sm">
                  {cat}
                </span>
              ))}
              {uniqueCategories.length === 0 && (
                <span className="text-slate-400 text-sm italic">No categories found.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, description, icon, gradient }: { title: string; value: string; description: string; icon: React.ReactNode; gradient: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden group hover:border-emerald-200 transition-colors">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
          <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{value}</div>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <p className="text-slate-400 text-xs mt-4 font-medium relative z-10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        {description}
      </p>
    </div>
  );
}

function AuditLogItem({ log }: { log: any }) {
  const getActionDetails = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created') || act.includes('published')) {
      return { icon: <FiPlusCircle size={14} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    }
    if (act.includes('updated')) {
      return { icon: <FiEdit3 size={14} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    if (act.includes('deleted')) {
      return { icon: <FiTrash2 size={14} />, color: 'bg-red-50 text-red-600 border-red-100' };
    }
    return { icon: <FiActivity size={14} />, color: 'bg-slate-50 text-slate-600 border-slate-200' };
  };

  const { icon, color } = getActionDetails(log.action);
  const time = new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50/80 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${color}`}>
        {icon}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
          <p className="text-sm font-bold text-slate-900 truncate">
            {log.action}
          </p>
          <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
            <FiClock size={10} /> {time}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase tracking-wider">
            {log.entity_type}
          </span>
          {log.details?.name && (
            <span className="text-slate-500 truncate">- {log.details.name}</span>
          )}
          {log.details?.title && (
            <span className="text-slate-500 truncate">- {log.details.title}</span>
          )}
          {log.details?.total && (
            <span className="text-slate-500 font-medium">₹{log.details.total}</span>
          )}
        </div>
      </div>
    </div>
  );
}
