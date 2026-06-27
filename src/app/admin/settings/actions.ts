"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSettings(key: string, value: any) {
  const supabase = await createClient();

  // Verify auth and admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ 
      key, 
      value,
      updated_at: new Date().toISOString()
    }, { onConflict: "key" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/shop");
}
