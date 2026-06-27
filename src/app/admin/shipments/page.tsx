import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { COURIER_LABEL, CourierType } from "@/utils/admin/labels/courier";
import { FiDownload } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage() {
  const supabase = await createClient();

  // Fetch all shipments with related orders and creator
  const { data: shipments, error } = await supabase
    .from("shipments")
    .select(`
      *,
      orders (id, order_no, status),
      creator:created_by (full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shipments:", error);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shipments</h1>
          <p className="text-slate-500 mt-1">Every generated shipping label, its courier and AWB.</p>
        </div>
        <div className="flex items-center gap-4 text-sm hidden md:flex">
          <span className="text-slate-500">Signed in as <strong className="text-slate-900">Admin</strong></span>
          <span className="text-emerald-600 font-medium">Admin</span>
        </div>
      </div>

      {/* Main Shipments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Courier</th>
                <th className="px-6 py-4">AWB / Tracking</th>
                <th className="px-6 py-4">Dispatch</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Generated</th>
                <th className="px-6 py-4 text-right">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shipments?.map((shipment) => {
                const order = shipment.orders;
                const orderNo = order?.order_no || (order?.id ? `TT-${order.id.split("-")[0].toUpperCase()}` : "Unknown");
                
                return (
                  <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-slate-900">{orderNo}</span>
                        {order?.status && (
                          <OrderStatusBadge status={order.status} interactive={false} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-700">
                      {COURIER_LABEL[shipment.courier as CourierType] || shipment.courier}
                    </td>
                    <td className="px-6 py-5 text-slate-700">
                      {shipment.awb ? (
                         <span className="font-mono text-xs">{shipment.awb}</span>
                      ) : (
                         <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-slate-700">
                      {shipment.dispatch_date 
                        ? new Date(shipment.dispatch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : <span className="text-slate-400">—</span>
                      }
                    </td>
                    <td className="px-6 py-5 text-slate-700">
                      {shipment.creator?.full_name || "System"}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {new Date(shipment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(shipment.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {shipment.label_pdf_url ? (
                        <a 
                          href={shipment.label_pdf_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!shipments || shipments.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
