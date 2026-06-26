"use server";

import { createClient } from "@/utils/supabase/server";
import { parseAmazonCsv } from "@/utils/admin/amazonCsv";

export async function importAmazonOrders(csvText: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("role").single();
  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  const { orders, errors } = parseAmazonCsv(csvText);

  if (orders.length === 0) {
    return { success: false, error: "No valid orders found.", warnings: errors };
  }

  let importedCount = 0;
  const insertErrors: string[] = [];

  for (const order of orders) {
    try {
      // 1. Resolve User
      let userId = null;
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", order.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({
            email: order.email,
            full_name: order.customer_name,
            role: "customer"
          })
          .select("id")
          .single();

        if (userError) throw userError;
        userId = newUser.id;
      }

      // 2. Create Order
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total_amount: order.total_amount,
          status: "paid",
          shipping_address: order.shipping_address,
          payment_method: "amazon_import",
          // Note: In a real system we would track amazon_order_id to prevent duplicates.
          // For simplicity we just import them.
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 3. Resolve Products by Name and insert order_items
      // A more robust system would map Amazon SKUs to Product IDs.
      const productNames = order.items.map(i => i.name);
      const { data: products } = await supabase
        .from("products")
        .select("id, name")
        .in("name", productNames);

      const itemsToInsert = order.items.map(item => {
        const matchedProduct = products?.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        return {
          order_id: newOrder.id,
          product_id: matchedProduct ? matchedProduct.id : null,
          quantity: item.quantity,
          price_at_time: item.price
        };
      }).filter(item => item.product_id !== null);

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      } else {
        insertErrors.push(`Order ${order.amazon_order_id} imported but items failed to match products in DB.`);
      }

      importedCount++;
    } catch (err: any) {
      insertErrors.push(`Failed to import ${order.amazon_order_id}: ${err.message}`);
    }
  }

  return { 
    success: importedCount > 0, 
    importedCount, 
    warnings: [...errors, ...insertErrors] 
  };
}
