import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ error: "Code and subtotal are required" }, { status: 400 });
    }

    // 1. Fetch coupon details using service role since coupons are protected
    // Wait, createClient uses the user's session. Since RLS blocks it, we need an admin client.
    // I will use @supabase/supabase-js to bypass RLS for this specific check, or an RPC.
    // It's safer to use service_role here to validate coupon securely.
    const { createClient: createAdminClient } = await import("@supabase/supabase-js");
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: coupon, error } = await adminSupabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 404 });
    }

    // 2. Validate active status
    if (!coupon.is_active) {
      return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
    }

    // 3. Validate max uses
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
    }

    // 4. Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
    } else if (coupon.discount_type === 'fixed') {
      discountAmount = coupon.discount_value;
    }

    // 5. Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    const finalAmount = subtotal - discountAmount;

    return NextResponse.json({
      valid: true,
      coupon_id: coupon.id,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value
    }, { status: 200 });

  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}
