"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSettings(key: string, value: any) {
  try {
    const supabase = await createClient();

    // Verify auth and admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized: Please log in." };

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { error: "Unauthorized: You must be an admin to perform this action." };
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert({ 
        key, 
        value,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/shop");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
