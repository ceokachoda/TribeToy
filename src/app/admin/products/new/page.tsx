import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NewProductPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Product</h1>
          <p className="text-slate-500 mt-1">Create a new product listing for your store.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
