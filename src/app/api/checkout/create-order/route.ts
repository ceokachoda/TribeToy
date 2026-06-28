import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { items, coupon_code } = await req.json();

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
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => String(p.id) === String(item.id));
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 });
      }
      calculatedAmount += parseFloat(dbProduct.price) * item.quantity;
    }

    if (calculatedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    let finalAmount = calculatedAmount;
    
    // Apply coupon if provided
    if (coupon_code) {
      const { createClient: createAdminClient } = await import("@supabase/supabase-js");
      const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: coupon } = await adminSupabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .single();

      if (coupon && coupon.is_active && (coupon.max_uses === null || coupon.used_count < coupon.max_uses)) {
        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
          discountAmount = (calculatedAmount * coupon.discount_value) / 100;
        } else if (coupon.discount_type === 'fixed') {
          discountAmount = coupon.discount_value;
        }
        
        if (discountAmount > calculatedAmount) discountAmount = calculatedAmount;
        finalAmount = calculatedAmount - discountAmount;
      }
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(finalAmount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
