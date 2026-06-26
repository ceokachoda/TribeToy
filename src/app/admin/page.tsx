export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome to the TribeToy administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value="0" description="Awaiting fulfillment" />
        <StatCard title="Total Products" value="0" description="Active in store" />
        <StatCard title="Total Blogs" value="0" description="Published posts" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-slate-500 text-sm">Dashboard metrics will be connected to live data in future updates.</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      <p className="text-emerald-600 text-sm mt-1">{description}</p>
    </div>
  );
}
