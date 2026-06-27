import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiPackage, FiTruck, FiCreditCard, FiUser, FiMapPin, FiClock, FiFileText, FiTag } from "react-icons/fi";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { GenerateLabelAction } from "@/components/admin/GenerateLabelAction";
import { type OrderStatus } from "@/utils/admin/orders";
import Image from "next/image";

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
      users:user_id (email, full_name, phone),
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          id,
          name,
          image_url,
          category
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
  
  // Calculate financials (mocking some if missing in DB for UI demonstration based on Shopify)
  const subtotal = order.order_items.reduce((acc: number, item: any) => acc + (parseFloat(item.price_at_purchase) * item.quantity), 0);
  const discount = order.discount || 0;
  const coupon = order.coupon_code || null;
  const shippingCharge = order.shipping_fee || 0;
  const gst = order.gst_amount || (subtotal * 0.18); // Example GST if not in DB
  const grandTotal = order.total_amount;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              Order {shortId}
              {isCOD ? (
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-md border border-amber-200">Cash on Delivery</span>
              ) : (
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-200">Paid Online</span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-1">{new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <OrderStatusBadge orderId={order.id} status={order.status} interactive={true} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <FiPackage className="text-slate-400" /> Products
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-4 items-start hover:bg-slate-50/50 transition-colors">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden border border-slate-200 relative">
                    {item.products?.image_url ? (
                      <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><FiPackage /></div>
                    )}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white z-10">
                      {item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/products/${item.products?.id}/edit`} className="font-bold text-blue-600 hover:underline line-clamp-1">
                      {item.products?.name}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1 flex gap-3">
                      <span>SKU: {item.products?.id.substring(0, 8).toUpperCase()}</span>
                      <span>Variant: {item.products?.category || 'Standard'}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-medium text-slate-900">₹{(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-500">₹{parseFloat(item.price_at_purchase).toLocaleString("en-IN")} × {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50/50 p-6 border-t border-slate-200">
              <div className="space-y-3 max-w-sm ml-auto text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({order.order_items.reduce((a: number, c: any) => a + c.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount {coupon && <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-mono">{coupon}</span>}</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? "Free" : `₹${shippingCharge.toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-lg pt-4 border-t border-slate-200 mt-2">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                {!isCOD && (
                  <div className="flex justify-between text-slate-500 text-xs pt-1">
                    <span>Paid by customer</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <FiClock className="text-slate-400" /> Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Order placed</p>
                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {order.updated_at && order.updated_at !== order.created_at && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Order updated ({order.status})</p>
                      <p className="text-xs text-slate-500">{new Date(order.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <FiFileText className="text-slate-400" /> Notes
              </h3>
              <p className="text-sm text-slate-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                {order.notes || "No notes from customer."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Customer, Shipping, Payment */}
        <div className="space-y-6">
          
          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiUser className="text-slate-400" /> Customer
            </h3>
            <div className="space-y-1">
              <Link href={`/admin/customers/${order.user_id}`} className="font-medium text-blue-600 hover:underline">
                {order.users?.full_name || order.shipping_address?.name || "Guest"}
              </Link>
              <p className="text-sm text-slate-600">{order.users?.email}</p>
              <p className="text-sm text-slate-600">{order.users?.phone || order.shipping_address?.phone || "No phone provided"}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-1">
                <FiMapPin className="text-slate-400" /> Shipping Address
              </h4>
              <div className="text-sm text-slate-600 space-y-0.5 bg-slate-50 p-3 rounded-lg">
                <p className="font-medium text-slate-900">{order.shipping_address?.name}</p>
                <p>{order.shipping_address?.address}</p>
                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                <p>PIN: {order.shipping_address?.pincode}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-1">
                <FiMapPin className="text-slate-400" /> Billing Address
              </h4>
              <p className="text-sm text-slate-500 italic">Same as shipping address</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiCreditCard className="text-slate-400" /> Payment
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Method</span>
                <span className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{isCOD ? "Cash on Delivery" : "Razorpay"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Status</span>
                {isCOD ? (
                   <span className="text-sm font-medium text-amber-600">Pending Collection</span>
                ) : (
                   <span className="text-sm font-medium text-emerald-600">Paid Successfully</span>
                )}
              </div>
              
              {!isCOD && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Razorpay Order ID</span>
                    <code className="text-xs bg-slate-50 p-1.5 rounded block text-slate-700 break-all">{order.razorpay_order_id}</code>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Razorpay Payment ID</span>
                    <code className="text-xs bg-slate-50 p-1.5 rounded block text-slate-700 break-all">{order.razorpay_payment_id || "N/A"}</code>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Shipping & Tracking */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiTruck className="text-slate-400" /> Shipping & Tracking
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Partner</span>
                <span className="font-medium text-slate-900">{order.shipping_partner || "Delhivery"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">AWB Number</span>
                <span className="font-medium text-slate-900">{order.awb_number || "Not assigned"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tracking Number</span>
                <span className="font-medium text-blue-600">{order.tracking_number || "Pending"}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <GenerateLabelAction orderId={order.id} currentStatus={order.status as OrderStatus} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
