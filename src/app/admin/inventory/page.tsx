import { createClient } from "@/utils/supabase/server";
import { FiBox, FiTrendingDown, FiPlusCircle, FiAlertTriangle, FiPlus, FiArrowLeft } from "react-icons/fi";
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

  const { data: products } = await supabase
    .from("products")
    .select("id, name, stock_quantity, reserved, incoming, damaged, category")
    .order("stock_quantity", { ascending: true });

  const lowStockProducts = products?.filter(p => (p.stock_quantity ?? (p as any).stock ?? 0) < 10) || [];

  return (
    <div className="space-y-8 w-full max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <FiBox className="text-emerald-500" /> Inventory & Raw Materials
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Manage product stock and track 3D printing filament usage.</p>
        </div>
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
                <th className="px-6 py-4 text-right">Available</th>
                <th className="px-6 py-4 text-right">Reserved</th>
                <th className="px-6 py-4 text-right">Total Stock</th>
                <th className="px-6 py-4 text-right">Incoming</th>
                <th className="px-6 py-4 text-right">Damaged</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products?.map(product => {
                const totalStock = product.stock_quantity || product.stock || 0;
                const reserved = product.reserved || 0;
                const available = Math.max(0, totalStock - reserved);
                const incoming = product.incoming || 0;
                const damaged = product.damaged || 0;

                return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link href={`/admin/products/${product.id}/edit`} className="hover:text-emerald-600 transition-colors line-clamp-1">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {available}
                  </td>
                  <td className="px-6 py-4 text-right text-amber-600 font-medium">
                    {reserved > 0 ? reserved : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {totalStock}
                  </td>
                  <td className="px-6 py-4 text-right text-blue-600 font-medium">
                    {incoming > 0 ? incoming : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-red-600 font-medium">
                    {damaged > 0 ? damaged : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {available === 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-[10px] uppercase font-black bg-red-50 px-2 py-1 rounded-md">
                        Out of Stock
                      </span>
                    ) : available < 10 ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-[10px] uppercase font-black bg-amber-50 px-2 py-1 rounded-md">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] uppercase font-black bg-emerald-50 px-2 py-1 rounded-md">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              )})}
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
