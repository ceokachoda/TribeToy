"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";

type BlogFormProps = {
  initialData?: any;
};

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    author_name: initialData?.author_name || "",
    tags: initialData?.tags?.join(", ") || "",
    is_published: initialData?.is_published ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = initialData?.cover_image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blogs")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("blogs")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (!imagePreview) {
          imageUrl = null;
      }

      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        author_name: formData.author_name,
        tags: formData.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0),
        cover_image_url: imageUrl,
        is_published: formData.is_published,
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("blogs")
          .insert([blogData]);

        if (insertError) throw insertError;
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6 overflow-hidden">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title *</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-sm font-medium"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Amazing Blog Post Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Slug</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-sm"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Leave blank to auto-generate"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Author</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-sm"
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Excerpt</label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-sm"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A short summary of the blog post..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex justify-between">
            <span>Content *</span>
            <span className="text-xs text-slate-400 font-normal">Supports Markdown format</span>
          </label>
          <textarea
            required
            rows={15}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-base sm:text-sm"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="# Markdown Heading\n\nStart writing your amazing content here..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tags</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base sm:text-sm"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="toys, education, fun (comma separated)"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">Cover Image</label>
        
        {imagePreview ? (
          <div className="relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden border border-slate-200 group">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full md:w-1/2 h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-500">16:9 Aspect ratio recommended</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 sticky bottom-0 bg-white/90 backdrop-blur-md pb-safe p-4 -mx-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-t-0 sm:pb-0 z-20">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={(e) => {
             const form = e.currentTarget.form;
             if (form?.checkValidity()) {
                setFormData({ ...formData, is_published: false });
                handleSubmit(e as any);
             } else {
                form?.reportValidity();
             }
          }}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={loading}
          onClick={() => setFormData({ ...formData, is_published: true })}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : initialData ? "Update & Publish" : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}
