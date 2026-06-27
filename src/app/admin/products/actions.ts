"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
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

    // Delete product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      return { error: error.message };
    }

    // Revalidate to update the UI
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}

export async function upsertProduct(productData: any, id?: string) {
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

    if (id) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("products")
        .insert([productData]);
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    if (id) revalidatePath(`/product/${id}`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
