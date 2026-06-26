import { FiActivity } from "react-icons/fi";
import DashboardSkeleton from "./DashboardSkeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 w-full overflow-hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <FiActivity className="text-emerald-500" /> Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Welcome to the TribeToy administration panel.</p>
      </div>

      <DashboardSkeleton />
    </div>
  );
}
