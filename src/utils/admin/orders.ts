"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getActorId, logAudit } from "@/utils/admin/audit";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const actorId = await getActorId(supabase);
  if (!actorId) return { ok: false, error: "Unauthorized" };

  // 1. Fetch current order status
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) return { ok: false, error: "Order not found" };

  const currentStatus = order.status as OrderStatus;

  if (currentStatus === newStatus) {
    return { ok: false, error: `Order is already ${newStatus}` };
  }

  // 2. Validate transition
  if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    return { ok: false, error: `Invalid transition from ${currentStatus} to ${newStatus}` };
  }

  // 3. Fetch order items for inventory adjustments
  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (itemsErr) return { ok: false, error: "Failed to load order items" };

  // 4. Handle inventory logic
  // We don't have RPCs in the DB for this yet, so we will process each item sequentially.
  // In a production app, an atomic RPC is preferred.
  try {
    for (const item of items || []) {
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity, reserved")
        .eq("id", item.product_id)
        .single();

      if (!product) continue;

      let newStock = product.stock_quantity;
      let newReserved = product.reserved || 0;

      // Logic:
      // pending -> paid: Reserve stock
      if (currentStatus === "pending" && newStatus === "paid") {
        newReserved += item.quantity;
      }
      // paid -> shipped: Fulfill stock (deduct from reserved and stock_quantity)
      else if (currentStatus === "paid" && newStatus === "shipped") {
        newReserved = Math.max(0, newReserved - item.quantity);
        newStock = Math.max(0, newStock - item.quantity);
      }
      // pending -> shipped: Fast-track fulfill (deduct directly from stock)
      // Wait, pending -> shipped is not a valid transition in our map.
      // paid -> cancelled: Release reservation
      else if (currentStatus === "paid" && newStatus === "cancelled") {
        newReserved = Math.max(0, newReserved - item.quantity);
      }
      // shipped -> cancelled: Restock items
      else if (currentStatus === "shipped" && newStatus === "cancelled") {
        newStock += item.quantity;
      }

      await supabase
        .from("products")
        .update({ stock_quantity: newStock, reserved: newReserved })
        .eq("id", item.product_id);
    }
  } catch (err) {
    console.error("Inventory update failed:", err);
    return { ok: false, error: "Failed to update inventory" };
  }

  // 5. Update order status
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (updateErr) return { ok: false, error: "Failed to update order status" };

  // 6. Log audit event
  await logAudit(supabase, {
    actorId,
    action: "order.status_change",
    entity: "order",
    entityId: orderId,
    before: { status: currentStatus },
    after: { status: newStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  
  return { ok: true };
}
