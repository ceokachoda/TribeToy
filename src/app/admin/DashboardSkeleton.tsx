import { FiBox, FiShoppingCart, FiDollarSign, FiActivity } from "react-icons/fi";

export default function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-3 w-full">
                <div className="h-3 w-24 bg-slate-200 rounded-full" />
                <div className="h-10 w-20 bg-slate-200 rounded-lg" />
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-32 bg-slate-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 animate-pulse">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-40 bg-slate-200 rounded-lg" />
              <div className="h-3 w-48 bg-slate-200 rounded-full" />
            </div>
          </div>
          
          <div className="p-0">
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-grow flex flex-col gap-2 pt-1">
                    <div className="flex justify-between">
                      <div className="h-4 w-48 bg-slate-200 rounded-md" />
                      <div className="h-3 w-16 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-3 w-32 bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 min-h-[300px] xl:min-h-0 flex flex-col justify-end gap-4">
          <div className="h-8 w-48 bg-slate-700 rounded-lg" />
          <div className="h-16 w-full bg-slate-700 rounded-lg" />
          <div className="flex gap-4 mt-2">
            <div className="w-10 h-10 rounded-full bg-slate-700" />
            <div className="w-10 h-10 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>
    </>
  );
}
