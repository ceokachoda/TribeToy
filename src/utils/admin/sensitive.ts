"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getActorId, verifyAdminActor, logAudit } from "@/utils/admin/audit";

export type RevealKey =
  | "customer.email"
  | "customer.address"
  | "order.customer_email"
  | "order.shipping_address";

export async function revealSensitive(
  key: RevealKey,
  id: string,
): Promise<string | null> {
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
  
  const actorId = await verifyAdminActor(supabase);
  if (!actorId) return null; // Must be authenticated AND admin

  let value: string | null = null;
  let entity: string;
  let field: string;

  switch (key) {
    case "customer.email": {
      entity = "user";
      field = "email";
      const { data } = await supabase
        .from("users")
        .select("email")
        .eq("id", id)
        .single();
      value = data?.email ?? null;
      break;
    }
    case "customer.address": {
      entity = "user";
      field = "address";
      const { data } = await supabase
        .from("users")
        .select("address")
        .eq("id", id)
        .single();
      value = data?.address ?? null;
      break;
    }
    case "order.customer_email": {
      entity = "order";
      field = "customer_email";
      const { data } = await supabase
        .from("orders")
        .select("customer_email")
        .eq("id", id)
        .single();
      value = data?.customer_email ?? null;
      break;
    }
    case "order.shipping_address": {
      entity = "order";
      field = "shipping_address";
      const { data } = await supabase
        .from("orders")
        .select("shipping_address")
        .eq("id", id)
        .single();
      value = data?.shipping_address ?? null;
      break;
    }
    default: {
      throw new Error(`Unknown reveal key: ${key}`);
    }
  }

  await logAudit(supabase, {
    actorId,
    action: "sensitive.reveal",
    entity,
    entityId: id,
    after: { field },
  });

  return value;
}
