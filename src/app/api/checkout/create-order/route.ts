import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { items, coupon_code, shipping_address } = await req.json();

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
    let discountAmount = 0;
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (coupon_code) {
      const { data: coupon } = await adminSupabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .single();

      if (coupon && coupon.is_active && (coupon.max_uses === null || coupon.used_count < coupon.max_uses)) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = (calculatedAmount * coupon.discount_value) / 100;
        } else if (coupon.discount_type === 'fixed') {
          discountAmount = coupon.discount_value;
        }
        
        if (discountAmount > calculatedAmount) discountAmount = calculatedAmount;
      }
    }
    
    const discountedSubtotal = calculatedAmount - discountAmount;
    finalAmount = discountedSubtotal;

    // Fetch Global Settings for GST and Shipping
    const { data: globalSettingsData } = await adminSupabase
      .from("site_settings")
      .select("value")
      .eq("key", "global_settings")
      .single();

    if (globalSettingsData?.value) {
      const settings = globalSettingsData.value;
      const gstPercentage = settings.gst_percentage || 0;
      const flatShippingRate = settings.shipping_flat_rate || 0;
      const freeShippingThreshold = settings.free_shipping_threshold || 0;

      // Add Shipping
      let shippingCost = 0;
      let isFirstOrder = false;

      // Check first order status securely
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        let query = adminSupabase.from("orders").select("id", { count: "exact", head: true }).neq("status", "cancelled");
        if (userId) {
          query = query.or(`user_id.eq.${userId},shipping_address->>phone.eq.${shipping_address?.phone}`);
        } else if (shipping_address?.phone) {
          query = query.eq("shipping_address->>phone", shipping_address.phone);
        } else {
          query = null as any; // No user or phone, assume not first order to be safe
        }

        if (query) {
          const { count } = await query;
          isFirstOrder = count === 0;
        }
      } catch (e) {
        console.error("Error checking first order status:", e);
      }

      if (isFirstOrder && (discountedSubtotal >= 399 || coupon_code?.toUpperCase() === "DISH10")) {
        shippingCost = 0;
      } else if (discountedSubtotal < freeShippingThreshold) {
        shippingCost = flatShippingRate;
      }
      
      // Calculate GST on the discounted subtotal
      const gstAmount = (discountedSubtotal * gstPercentage) / 100;

      finalAmount = finalAmount + shippingCost + gstAmount;
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
