import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  try {
    const { amount, shipping_address, items, coupon_code } = await req.json();

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

    let finalAmount = calculatedAmount;
    let appliedCouponId = null;
    let appliedDiscountAmount = 0;

    // Apply coupon if provided
    if (coupon_code) {
      const { data: coupon } = await adminSupabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .single();

      if (coupon && coupon.is_active && (coupon.max_uses === null || coupon.used_count < coupon.max_uses)) {
        appliedCouponId = coupon.id;
        if (coupon.discount_type === 'percentage') {
          appliedDiscountAmount = (calculatedAmount * coupon.discount_value) / 100;
        } else if (coupon.discount_type === 'fixed') {
          appliedDiscountAmount = coupon.discount_value;
        }
        if (appliedDiscountAmount > calculatedAmount) appliedDiscountAmount = calculatedAmount;
      }
    }
    
    const discountedSubtotal = calculatedAmount - appliedDiscountAmount;
    finalAmount = discountedSubtotal;

    // Fetch Global Settings for GST and Shipping
    let shippingCost = 0;
    let gstAmount = 0;
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

      if (discountedSubtotal < freeShippingThreshold) {
        shippingCost = flatShippingRate;
      }
      
      gstAmount = (discountedSubtotal * gstPercentage) / 100;
      finalAmount = finalAmount + shippingCost + gstAmount;
    }

    // Create order record
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        user_id: userId || null,
        status: 'pending', // COD is pending until delivered and paid
        total_amount: finalAmount,
        subtotal_amount: calculatedAmount,
        discount_amount: appliedDiscountAmount,
        coupon_id: appliedCouponId,
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

    // Increment coupon used_count
    if (appliedCouponId) {
      const { data: c } = await adminSupabase.from("coupons").select("used_count").eq("id", appliedCouponId).single();
      if (c) {
        await adminSupabase.from("coupons").update({ used_count: c.used_count + 1 }).eq("id", appliedCouponId);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
  } catch (error: any) {
    console.error("COD creation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
