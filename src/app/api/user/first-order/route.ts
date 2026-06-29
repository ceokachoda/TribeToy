import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json().catch(() => ({ phone: null }));
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId && !phone) {
      // If we don't know who they are, we can't determine if it's their first order securely,
      // but for UI purposes, we assume true until they enter a phone number.
      return NextResponse.json({ isFirstOrder: true }, { status: 200 }); 
    }

    let query = adminSupabase.from("orders").select("id", { count: "exact", head: true });

    // A completed order is one that is not 'cancelled'
    query = query.neq("status", "cancelled");

    if (userId) {
      // If logged in, we check by user ID or phone
      if (phone) {
        query = query.or(`user_id.eq.${userId},shipping_address->>phone.eq.${phone}`);
      } else {
        query = query.eq("user_id", userId);
      }
    } else if (phone) {
      // If guest, we check strictly by phone
      query = query.eq("shipping_address->>phone", phone);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error checking first order status:", error);
      return NextResponse.json({ error: "Failed to check order history" }, { status: 500 });
    }

    const isFirstOrder = count === 0;

    return NextResponse.json({ isFirstOrder }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
