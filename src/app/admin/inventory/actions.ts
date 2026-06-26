"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addRawMaterial(data: { name: string; color: string; initial_stock: number }) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").single();
  
  if (profile?.role !== "admin") return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("raw_materials").insert({
    name: data.name,
    color: data.color,
    current_stock_grams: data.initial_stock
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function logMaterialUsage(data: { raw_material_id: string; grams_used: number; date_used: string; notes?: string }) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").single();
  
  if (profile?.role !== "admin") return { success: false, error: "Unauthorized" };

  // 1. Insert log
  const { error: logError } = await supabase.from("raw_material_logs").insert({
    raw_material_id: data.raw_material_id,
    grams_used: data.grams_used,
    date_used: data.date_used,
    notes: data.notes
  });

  if (logError) return { success: false, error: logError.message };

  // 2. Decrement stock using an RPC or a read-then-update.
  // Since we don't have an RPC, we will read the current stock and decrement.
  const { data: material } = await supabase.from("raw_materials").select("current_stock_grams").eq("id", data.raw_material_id).single();
  
  if (material) {
    await supabase.from("raw_materials").update({
      current_stock_grams: material.current_stock_grams - data.grams_used,
      updated_at: new Date().toISOString()
    }).eq("id", data.raw_material_id);
  }

  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function addMaterialStock(data: { raw_material_id: string; grams_added: number }) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("role").single();
  
  if (profile?.role !== "admin") return { success: false, error: "Unauthorized" };

  const { data: material } = await supabase.from("raw_materials").select("current_stock_grams").eq("id", data.raw_material_id).single();
  
  if (material) {
    const { error } = await supabase.from("raw_materials").update({
      current_stock_grams: material.current_stock_grams + data.grams_added,
      updated_at: new Date().toISOString()
    }).eq("id", data.raw_material_id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/inventory");
  return { success: true };
}
