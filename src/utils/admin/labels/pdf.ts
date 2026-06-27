"use server";

import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { getActorId, logAudit } from "@/utils/admin/audit";
import { updateOrderStatus } from "@/utils/admin/orders";
import { makeQrDataUrl } from "./qr";
import { LabelDocument, type LabelItem } from "./label";
import { COURIER_LABEL, DEFAULT_LABEL_TEMPLATE, type CourierType } from "./courier";

const BUCKET = "labels";

export type GenerateLabelInput = {
  courier?: CourierType;
  awb?: string | null;
  dispatchDate?: string | null; // YYYY-MM-DD
};

export type GenerateLabelData = {
  shipmentId: string;
  path: string;
  version: number;
  signedUrl: string | null;
  reprint: boolean;
};

export async function generateLabel(
  orderId: string,
  input: GenerateLabelInput = {},
): Promise<{ ok: boolean; data?: GenerateLabelData; error?: string }> {
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

  const adminSupabase = createAdminClient();
  const { data: settings } = await adminSupabase.from("settings").select("*").eq("id", 1).single();
  const senderInfo = settings || {
    sender_name: "TribeToy",
    sender_address: "123 Toy Street",
    sender_city: "Mumbai",
    sender_state: "Maharashtra",
    sender_pincode: "400001",
    sender_phone: "+91 99999 99999",
  };

  // 1. load order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*, users(email, full_name)")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) return { ok: false, error: "Order not found." };

  // Wait, in our DB, we have 18 statuses.
  // The label can only be generated if status is at least confirmed or paid.
  if (["pending", "awaiting_payment", "payment_failed", "cancelled", "refund_requested", "refunded"].includes(order.status)) {
    return { ok: false, error: "Order must be confirmed or paid to generate a label." };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(name)")
    .eq("order_id", orderId);

  const { data: existingShipment } = await supabase
    .from("shipments")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const orderItems = items ?? [];

  // 2. resolve shipment
  const reprint = !!existingShipment;
  const courier: CourierType = input.courier ?? existingShipment?.courier ?? "speedpost";
  const awb = (input.awb?.trim() || null) ?? existingShipment?.awb ?? null;
  const dispatchDate = input.dispatchDate || existingShipment?.dispatch_date || null;

  let shipmentId: string;
  let version: number = 1;
  if (existingShipment) {
    shipmentId = existingShipment.id;
    // We could bump version based on audit logs, but for simplicity we will just increment a version counter if we had one.
    // We'll just generate v2, v3 based on a timestamp.
    version = Date.now();
  } else {
    shipmentId = crypto.randomUUID();
  }

  const path = `${order.id}/${shipmentId}-v${version}.pdf`;

  // 3. QR + render PDF
  const orderDisplayId = order.order_no || order.id;
  const qrText = awb ? `${orderDisplayId} ${awb}` : orderDisplayId;
  const qrDataUrl = await makeQrDataUrl(qrText);

  const labelItems: LabelItem[] = orderItems.map((it) => ({
    name: it.products?.name || "Product",
    qty: it.quantity,
  }));

  // Parse shipping address
  const shipName = order.users?.full_name || "Customer";
  let shipAddress = "";
  let shipCity = "";
  let shipState = "";
  let shipPincode = "";
  let shipPhone = "";

  if (order.shipping_address) {
    const addr = order.shipping_address as any;
    shipAddress = addr.address || "";
    shipCity = addr.city || "";
    shipState = addr.state || "";
    shipPincode = addr.pincode || "";
    shipPhone = addr.phone || "";
  }

  const labelElement = createElement(LabelDocument, {
    sender: {
      name: senderInfo.sender_name,
      address: senderInfo.sender_address,
      city: senderInfo.sender_city,
      state: senderInfo.sender_state,
      pincode: senderInfo.sender_pincode,
      phone: senderInfo.sender_phone,
    },
    recipient: {
      name: shipName,
      address: shipAddress,
      city: shipCity,
      state: shipState,
      pincode: shipPincode,
      phone: shipPhone,
    },
    orderNo: order.order_no || `TT-${order.id.split("-")[0].toUpperCase()}`,
    courierLabel: COURIER_LABEL[courier],
    awb,
    items: labelItems,
    dispatchDate: dispatchDate,
    qrDataUrl,
  }) as unknown as Parameters<typeof renderToBuffer>[0];

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(labelElement);
  } catch (e) {
    return { ok: false, error: `Could not render the label PDF` };
  }

  // 4. upload + persist shipment
  // Note: We assume 'labels' bucket exists. If not, the upload will fail.
  const { error: uploadErr } = await adminSupabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: "application/pdf", upsert: true });

  if (uploadErr) {
    // If bucket doesn't exist, try to create it first (in real prod, do this via migration).
    return { ok: false, error: `Could not upload the label: ${uploadErr.message}` };
  }

  if (existingShipment) {
    const { error: upErr } = await supabase
      .from("shipments")
      .update({ label_pdf_url: path, courier, awb, dispatch_date: dispatchDate })
      .eq("id", shipmentId);
    if (upErr) return { ok: false, error: upErr.message };
  } else {
    const { error: insErr } = await supabase.from("shipments").insert({
      id: shipmentId,
      order_id: orderId,
      courier,
      created_by: actorId,
      awb,
      dispatch_date: dispatchDate,
      label_pdf_url: path,
    });
    if (insErr) return { ok: false, error: insErr.message };
  }

  // 5. advance the order if it's prior to label_generated
  if (["payment_successful", "confirmed", "ready_to_pack", "packed"].includes(order.status)) {
    await updateOrderStatus(orderId, "label_generated");
  }

  // 6. audit
  await logAudit(supabase, {
    actorId,
    action: reprint ? "shipment.reprint" : "shipment.label_generated",
    entity: "shipment",
    entityId: shipmentId,
    after: { order_no: order.id, courier, awb, version, path },
  });

  const { data: signed } = await adminSupabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/shipments");

  return {
    ok: true,
    data: { shipmentId, path, version, signedUrl: signed?.signedUrl ?? null, reprint },
  };
}

export async function getLabelSignedUrl(
  shipmentId: string,
): Promise<{ ok: boolean; data?: string; error?: string }> {
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

  const adminSupabase = createAdminClient();

  const { data: shipment, error } = await supabase
    .from("shipments")
    .select("label_pdf_url")
    .eq("id", shipmentId)
    .single();

  if (error || !shipment) return { ok: false, error: "Shipment not found." };
  if (!shipment.label_pdf_url) return { ok: false, error: "No label has been generated." };

  const { data, error: signErr } = await adminSupabase.storage
    .from(BUCKET)
    .createSignedUrl(shipment.label_pdf_url, 3600);
    
  if (signErr || !data) {
    return { ok: false, error: signErr?.message ?? "Could not create link." };
  }
  
  return { ok: true, data: data.signedUrl };
}
