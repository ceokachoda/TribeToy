import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const { amount, shipping_address, items } = await req.json();

    const supabase = await createClient();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

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

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const adminSupabase = createAdminClient();

    // Create order record
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        user_id: userId || null,
        status: 'pending', // COD is pending until delivered and paid
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
    console.error("COD creation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
