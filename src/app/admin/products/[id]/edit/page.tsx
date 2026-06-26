import { createClient } from "@/utils/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Product</h1>
          <p className="text-slate-500 mt-1">Update details for {product.name}</p>
        </div>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
