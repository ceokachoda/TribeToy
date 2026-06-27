import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiPackage, FiTruck, FiCreditCard, FiUser, FiMapPin } from "react-icons/fi";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { GenerateLabelAction } from "@/components/admin/GenerateLabelAction";
import { type OrderStatus } from "@/utils/admin/orders";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      users:user_id (email, full_name),
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    return notFound();
  }

  const isCOD = !order.razorpay_order_id;
  const shortId = `TT-${order.id.split("-")[0].toUpperCase()}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Order {shortId}
            {isCOD ? (
              <span className="text-xs uppercase font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">COD</span>
            ) : (
              <span className="text-xs uppercase font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Prepaid</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 font-semibold text-slate-800 flex items-center gap-2">
              <FiPackage /> Ordered Items
            </div>
            <ul className="divide-y divide-slate-100">
              {order.order_items.map((item: any) => (
                <li key={item.id} className="p-6 flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border border-slate-200">
                    {item.products?.image_url && (
                      <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{item.products?.name}</h4>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium text-slate-900">
                    ₹{(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-xl font-black text-slate-900">₹{order.total_amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FiTruck /> Actions
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Status</label>
                <OrderStatusBadge orderId={order.id} status={order.status} interactive={true} />
              </div>
              <div className="pt-2">
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Shipping Label</label>
                <div className="inline-block">
                  <GenerateLabelAction orderId={order.id} currentStatus={order.status as OrderStatus} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FiUser /> Customer
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-medium text-slate-900">{order.users?.full_name || order.shipping_address?.name || "Guest"}</p>
              <p>{order.users?.email}</p>
              {order.shipping_address?.phone && <p>{order.shipping_address.phone}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FiMapPin /> Shipping Address
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-medium text-slate-900">{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
            </div>
          </div>
          
          {!isCOD && (
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6 space-y-4">
              <h3 className="font-semibold text-blue-900 border-b border-blue-100 pb-2 flex items-center gap-2">
                <FiCreditCard /> Payment Details
              </h3>
              <div className="text-sm text-blue-800 space-y-1 font-mono break-all">
                <p><span className="font-semibold">Razorpay Order ID:</span><br/>{order.razorpay_order_id}</p>
                <p className="pt-2"><span className="font-semibold">Razorpay Payment ID:</span><br/>{order.razorpay_payment_id}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
