import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!name || !email || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use service role key to bypass RLS for anonymous uploads
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let reference_image_url = null;

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const folderName = userId || 'anonymous';
      const filePath = `${folderName}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("user-uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }

      // Since user-uploads might be private, we could generate a signed URL or just store the path
      // But if it's meant to be viewed in admin, the admin panel uses getPublicUrl which won't work on private buckets
      // Wait, is user-uploads private? Yes.
      // So admin panel needs to use createSignedUrl to view it, or we just store the path and let admin handle it.
      // However, the admin panel currently assumes it's a public URL: 
      // `<a href={customization.reference_image_url} target="_blank"`
      // So let's generate a signed URL that lasts for a long time, OR we can just use the public bucket 'products' or 'blogs'.
      // Wait, actually, let's just create a signed URL for 10 years, or we can use the 'products' bucket which is public.
      // Let's use 'products' bucket for now, or just let Supabase return public URL (it'll be accessible if we make the bucket public).
      // Let's store the path and we'll fix the admin panel to generate a signed url if needed, or we just put it in a public bucket.
      // Given the requirement, let's just upload to 'products' bucket in a 'customizations' folder to ensure it's public.

      const { data: uploadPublicData, error: publicUploadError } = await supabaseAdmin.storage
        .from("products")
        .upload(`customizations/${filePath}`, file);
        
      if (publicUploadError) {
         console.error("Upload to products error:", publicUploadError);
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("products")
        .getPublicUrl(`customizations/${filePath}`);

      reference_image_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabaseAdmin
      .from("customizations")
      .insert({
        user_id: userId || null,
        name,
        email,
        description,
        reference_image_url,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Customization submission error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
