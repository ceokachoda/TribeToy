import { createClient } from "@/utils/supabase/server";
import { FiBox, FiTrendingDown, FiPlusCircle, FiAlertTriangle, FiPlus } from "react-icons/fi";
import Link from "next/link";
import RawMaterialClient from "@/components/admin/inventory/RawMaterialClient";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const supabase = await createClient();

  // 1. Fetch raw materials
  const { data: rawMaterials } = await supabase
    .from("raw_materials")
    .select("*")
    .order("color", { ascending: true });

  // 2. Fetch products (regular inventory)
  const { data: products } = await supabase
    .from("products")
    .select("id, name, stock, category")
    .order("stock", { ascending: true });

  const lowStockProducts = products?.filter(p => p.stock < 10) || [];

  return (
    <div className="space-y-8 w-full max-w-6xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <FiBox className="text-emerald-500" /> Inventory & Raw Materials
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">Manage product stock and track 3D printing filament usage.</p>
      </div>

      {/* Raw Materials Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Filament Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">Log daily filament usage and track remaining spools.</p>
          </div>
        </div>
        
        <RawMaterialClient initialMaterials={rawMaterials || []} />
      </div>

      {/* Product Stock Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Product Stock</h2>
            <p className="text-sm text-slate-500 mt-1">Finished goods available for sale.</p>
          </div>
          <Link href="/admin/products/new" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm">
            <FiPlus /> New Product
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Stock Level</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/admin/products/${product.id}/edit`} className="hover:text-emerald-600 transition-colors">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {product.stock === 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md">
                        <FiAlertTriangle /> Out of Stock
                      </span>
                    ) : product.stock < 10 ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
