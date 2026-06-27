import { FiLoader } from "react-icons/fi";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] space-y-4">
      <FiLoader className="text-emerald-500 animate-spin" size={32} />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}
