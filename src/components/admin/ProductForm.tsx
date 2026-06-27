"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiUpload, FiX, FiBox, FiTag, FiStar, FiImage } from "react-icons/fi";
import Image from "next/image";
import { upsertProduct } from "@/app/admin/products/actions";
import { useToast } from "@/context/ToastContext";

type ProductFormProps = {
  initialData?: any;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

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
    is_hero: initialData?.is_hero || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  const [existingAdditional, setExistingAdditional] = useState<string[]>(initialData?.additional_images || []);
  const [newAdditionalFiles, setNewAdditionalFiles] = useState<File[]>([]);
  const [newAdditionalPreviews, setNewAdditionalPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewAdditionalFiles(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewAdditionalPreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeExistingAdditional = (index: number) => {
    setExistingAdditional(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewAdditional = (index: number) => {
    setNewAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setNewAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
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
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;
      } else if (!imagePreview) {
        imageUrl = null;
      }

      const uploadedAdditional = [];
      for (const file of newAdditionalFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);
        if (uploadError) throw uploadError;
        uploadedAdditional.push(supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl);
      }

      const finalAdditionalImages = [...existingAdditional, ...uploadedAdditional];

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
        is_hero: formData.is_hero,
        image_url: imageUrl,
        additional_images: finalAdditionalImages,
      };

      const response = await upsertProduct(productData, initialData?.id);
      
      if (response?.error) {
        throw new Error(response.error);
      }

      showToast(initialData?.id ? "Product updated successfully!" : "Product created successfully!", "success");
      router.push("/admin/products");
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
              <option value="Toys & Figurines">Toys & Figurines</option>
              <option value="Educational">Educational</option>
              <option value="Utility Decor">Utility Decor</option>
              <option value="Cultural Heritage">Cultural Heritage</option>
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
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors flex-1">
            <input
              type="checkbox"
              checked={formData.is_hero}
              onChange={(e) => setFormData({ ...formData, is_hero: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">Hero Section</span>
              <span className="text-xs text-slate-500">Show in the Hero Carousel.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <FiImage className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Product Images</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Main Product Image *</h4>
            {imagePreview ? (
              <div className="relative w-full max-w-[240px] aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <FiX size={16} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-[240px] aspect-square border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <FiUpload className="w-8 h-8 mb-3" />
                  <p className="mb-1 text-sm font-semibold">Upload Main Image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!initialData} />
              </label>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">Additional Gallery Images</h4>
              <label className="cursor-pointer bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2">
                <FiUpload size={14} /> Add Images
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleAdditionalImagesChange} />
              </label>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {existingAdditional.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group shadow-sm">
                  <Image src={url} alt="Additional" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeExistingAdditional(idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {newAdditionalPreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-emerald-200 group shadow-sm">
                  <Image src={url} alt="New Additional" fill className="object-cover" />
                  <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeNewAdditional(idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              {existingAdditional.length === 0 && newAdditionalPreviews.length === 0 && (
                <div className="w-full py-8 text-center border-2 border-slate-200 border-dashed rounded-xl bg-slate-50 text-slate-400 text-sm">
                  No additional images. Upload some to create a gallery!
                </div>
              )}
            </div>
          </div>
        </div>
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
