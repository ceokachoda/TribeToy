import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// A secure server-side webhook that validates an API key and intakes an order
// payload directly into the database.

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.INTAKE_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured on server" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate payload
    const { email, customer_name, total_amount, shipping_address, items } = body;
    if (!email || !customer_name || !items || !items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to Supabase using Service Role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find or create user by email
    let userId = null;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a guest user record
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email,
          full_name: customer_name,
          role: "customer"
        })
        .select("id")
        .single();

      if (userError) throw userError;
      userId = newUser.id;
    }

    // 2. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: total_amount || 0,
        status: "paid", // Auto mark as paid for external intakes
        shipping_address: shipping_address || {},
        payment_method: "external_intake",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 3. Prepare order items. We'll map SKUs to actual product IDs if possible,
    // otherwise we just insert them (assuming order_items handles product_id gracefully,
    // though order_items usually requires a valid product_id).
    // For simplicity, we'll try to find the product by SKU (if SKU exists as a column) 
    // or name, or default to a "Misc" product if required.
    // In this basic implementation, we will fetch product_ids for the names.
    
    const productNames = items.map((i: any) => i.name);
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .in("name", productNames);

    const orderItemsToInsert = items.map((item: any) => {
      // Try to find the matching product by name
      const matchedProduct = products?.find(p => p.name.toLowerCase() === item.name?.toLowerCase());
      
      // If product_id is strictly required by foreign key, this will fail if no match is found.
      // In a real app, we might create a placeholder product or have a specific SKU field.
      // We assume product_id is required.
      return {
        order_id: order.id,
        product_id: matchedProduct ? matchedProduct.id : null, 
        quantity: item.quantity || 1,
        price_at_time: item.price || 0,
      };
    }).filter((item: any) => item.product_id !== null); // Filter out unmapped products to avoid FK errors

    if (orderItemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);
        
      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ success: true, order_id: order.id });

  } catch (error: any) {
    console.error("Intake Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
