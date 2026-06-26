"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiUpload, FiX, FiBox, FiTag, FiStar, FiImage } from "react-icons/fi";
import Image from "next/image";

type ProductFormProps = {
  initialData?: any;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    original_price: initialData?.original_price || "",
    description: initialData?.description || "",
    stock_quantity: initialData?.stock_quantity ?? 0,
    is_new: initialData?.is_new || false,
    is_sale: initialData?.is_sale || false,
    is_premium: initialData?.is_premium || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = initialData?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (!imagePreview) {
          imageUrl = null; // Removed image
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        description: formData.description,
        stock_quantity: parseInt(formData.stock_quantity.toString(), 10),
        is_new: formData.is_new,
        is_sale: formData.is_sale,
        is_premium: formData.is_premium,
        image_url: imageUrl,
      };

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData]);

        if (insertError) throw insertError;
      }

      router.push("/admin/products");
      router.refresh(); // Refresh RSC cache
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2">
          <FiX className="flex-shrink-0" /> {error}
        </div>
      )}

      {/* Basic Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <FiBox className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Product Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. 3D Printed Dragon"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white text-slate-900"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category...</option>
              <option value="Action Figures">Action Figures</option>
              <option value="Educational Toys">Educational Toys</option>
              <option value="Custom 3D Prints">Custom 3D Prints</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Miniatures">Miniatures</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the product, its features, and dimensions..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <FiTag className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Pricing & Inventory</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Selling Price (₹) *</label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Original Price (₹)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
              value={formData.original_price}
              onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            />
            <p className="text-xs text-slate-500">Leave blank if no discount.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Stock Quantity *</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Product Flags Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <FiStar className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Product Features</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors flex-1">
            <input
              type="checkbox"
              checked={formData.is_new}
              onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">New Arrival</span>
              <span className="text-xs text-slate-500">Mark as newly added product.</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors flex-1">
            <input
              type="checkbox"
              checked={formData.is_sale}
              onChange={(e) => setFormData({ ...formData, is_sale: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">On Sale</span>
              <span className="text-xs text-slate-500">Highlight product with sale badge.</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors flex-1">
            <input
              type="checkbox"
              checked={formData.is_premium}
              onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Premium Item</span>
              <span className="text-xs text-slate-500">Mark as high-end/exclusive.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <FiImage className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Product Image</h3>
        </div>
        
        {imagePreview ? (
          <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FiX size={18} /> Remove Image
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-emerald-500 transition-colors">
              <FiUpload className="w-10 h-10 mb-4" />
              <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs">PNG, JPG or WEBP (Max. 2MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? "Update Product" : "Publish Product"
          )}
        </button>
      </div>
    </form>
  );
}
