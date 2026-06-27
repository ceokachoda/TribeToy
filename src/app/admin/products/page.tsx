import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiSearch, FiArrowLeft, FiBox } from "react-icons/fi";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const searchQuery = resolvedSearchParams.q || "";
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data: products, count, error } = await query.range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching products:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
            <p className="text-slate-500 mt-1">Manage your store's inventory and listings.</p>
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      <form method="get" className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors">
          Search
        </button>
        {searchQuery && (
          <Link href="/admin/products" className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
            Clear
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products?.map((product) => {
                const available = (product.stock_quantity || 0) - (product.reserved || 0);
                const isLow = available <= (product.low_stock_threshold || 5);
                const isOutOfStock = available <= 0;

                return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FiBox size={20} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-slate-900 line-clamp-2">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.category || "Uncategorized"}</td>
                  <td className="px-6 py-4 font-medium text-emerald-600">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isOutOfStock
                            ? "bg-red-100 text-red-800"
                            : isLow
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {available} available
                      </span>
                      {product.reserved > 0 && (
                        <span className="text-xs text-slate-400" title={`${product.reserved} reserved for pending orders`}>
                          ({product.reserved} rsv)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <DeleteButton productId={product.id} />
                    </div>
                  </td>
                </tr>
                );
              })}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                        <FiBox size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-sm">We couldn't find any products. Add a new product to your catalog to get started!</p>
                      <Link href="/admin/products/new" className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-lg hover:bg-emerald-100 transition-colors">
                        + Add Product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {Math.min(offset + 1, count || 0)} to {Math.min(offset + itemsPerPage, count || 0)} of {count} entries
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/products?page=${Math.max(1, currentPage - 1)}`}
                className={`p-2 rounded border ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronLeft />
              </Link>
              <Link
                href={`/admin/products?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-2 rounded border ${
                  currentPage === totalPages
                    ? "border-slate-200 text-slate-300 pointer-events-none"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiChevronRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

