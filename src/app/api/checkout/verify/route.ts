import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      shipping_address,
      items
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay secret not configured");

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const adminSupabase = createAdminClient();

    // Create order record using admin client to bypass RLS for order_items insertion
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        user_id: userId || null,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'paid',
        total_amount: amount,
        shipping_address
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || "Failed to create order");
    }

    // Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: parseFloat(item.price.replace(/[^0-9.]/g, ''))
      }));

      await adminSupabase.from("order_items").insert(orderItems);
    }

    // Clear user cart if logged in
    if (userId) {
      await supabase.from("cart_items").delete().eq("user_id", userId);
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
