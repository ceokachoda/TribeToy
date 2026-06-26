import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { amount, shipping_address, items } = await req.json();

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId || null,
        status: 'pending', // COD is pending until delivered and paid
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

      await supabase.from("order_items").insert(orderItems);
    }

    // Clear user cart if logged in
    if (userId) {
      await supabase.from("cart_items").delete().eq("user_id", userId);
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error("COD creation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
