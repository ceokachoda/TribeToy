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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Fetch prices from DB to secure checkout
    const itemIds = items.map((item: any) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', itemIds);

    if (dbError || !dbProducts) {
      return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
    }

    let calculatedAmount = 0;
    const secureItems = items.map((item: any) => {
      const dbProduct = dbProducts.find((p) => String(p.id) === String(item.id));
      if (!dbProduct) throw new Error(`Product not found: ${item.id}`);
      
      const price = parseFloat(dbProduct.price);
      calculatedAmount += price * item.quantity;
      
      return {
        ...item,
        securePrice: price
      };
    });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay secret not configured");

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

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
        total_amount: calculatedAmount,
        shipping_address
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || "Failed to create order");
    }

    // Insert order items
    if (items && items.length > 0) {
      const orderItems = secureItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.securePrice
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
