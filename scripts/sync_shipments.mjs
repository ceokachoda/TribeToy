import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log("Fetching orders with shipped or delivered status...");
  const { data: orders, error: ordersErr } = await supabase
    .from("orders")
    .select("id, status")
    .in("status", ["shipped", "delivered"]);

  if (ordersErr) {
    console.error("Error fetching orders:", ordersErr);
    return;
  }

  console.log(`Found ${orders.length} orders.`);

  let createdCount = 0;
  for (const order of orders) {
    const { data: shipment } = await supabase
      .from("shipments")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();

    if (!shipment) {
      console.log(`Creating shipment for order ${order.id}...`);
      const { error: insertErr } = await supabase.from("shipments").insert({
        id: crypto.randomUUID(),
        order_id: order.id,
        courier: "speedpost", // Default
      });
      if (insertErr) {
        console.error(`Failed to insert shipment for ${order.id}:`, insertErr);
      } else {
        createdCount++;
      }
    }
  }

  console.log(`Sync complete. Created ${createdCount} missing shipments.`);
}

run();
