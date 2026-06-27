"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getActorId, logAudit } from "@/utils/admin/audit";

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "returned" 
  | "refunded";

// Transition flow (from -> to options)
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned", "cancelled"],
  delivered: ["returned"],
  cancelled: ["refunded"],
  returned: ["refunded"],
  refunded: [],
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

  // Inventory handling
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

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

      // Restocking logic
      if (
        (currentStatus !== "cancelled" && currentStatus !== "returned" && currentStatus !== "refunded") && 
        (newStatus === "cancelled" || newStatus === "returned" || newStatus === "refunded")
      ) {
        if (["shipped", "delivered"].includes(currentStatus)) {
          newStock += item.quantity;
        } else {
          newReserved = Math.max(0, newReserved - item.quantity);
        }
      }

      // Deducting stock permanently when shipped
      if (
        !["shipped", "delivered"].includes(currentStatus) &&
        ["shipped"].includes(newStatus)
      ) {
        newReserved = Math.max(0, newReserved - item.quantity);
        newStock = Math.max(0, newStock - item.quantity);
      }
      
      // Reserving stock initially
      if (
        ["pending"].includes(currentStatus) &&
        ["processing"].includes(newStatus)
      ) {
        newReserved += item.quantity;
      }

      await supabase
        .from("products")
        .update({ stock_quantity: newStock, reserved: newReserved })
        .eq("id", item.product_id);
    }
  } catch (err) {
    console.error("Inventory update failed:", err);
  }

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (updateErr) return { ok: false, error: "Failed to update order status." };

  // Phase 6: Sync Shipments if order is dispatched but no shipment exists
  if (["shipped", "delivered"].includes(newStatus)) {
    const { data: existingShipment } = await supabase
      .from("shipments")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (!existingShipment) {
      // Auto-create a dummy shipment record to link them
      await supabase.from("shipments").insert({
        id: crypto.randomUUID(),
        order_id: orderId,
        created_by: actorId,
        courier: "speedpost", // default
      });
    }
  }

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
