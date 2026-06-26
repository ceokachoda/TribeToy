import { createClient } from "@/utils/supabase/server";
import CustomizationStatusSelect from "@/components/admin/CustomizationStatusSelect";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminCustomizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  // Fetch customizations
  const { data: customizations, count, error } = await supabase
    .from("customizations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  if (error) {
    console.error("Error fetching customizations:", error);
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customizations</h1>
        <p className="text-slate-500 mt-1">Manage 3D toy customization requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Reference Image</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customizations?.map((customization) => (
                <tr key={customization.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 align-top">
                    {customization.id.split("-")[0]}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    {new Date(customization.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="font-medium text-slate-900">
                      {customization.name}
                    </div>
                    <div className="text-xs text-slate-500">{customization.email}</div>
                  </td>
                  <td className="px-6 py-4 align-top max-w-xs">
                    <div className="text-sm text-slate-700 whitespace-pre-wrap">
                      {customization.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    {customization.reference_image_url ? (
                      <a href={customization.reference_image_url} target="_blank" rel="noopener noreferrer" className="block relative w-16 h-16 rounded bg-slate-100 overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                        <Image src={customization.reference_image_url} alt="Reference" fill className="object-cover" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No image provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <CustomizationStatusSelect customizationId={customization.id} currentStatus={customization.status} />
                  </td>
                </tr>
              ))}
              {(!customizations || customizations.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No custom requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <a 
                href={`/admin/customizations?page=${Math.max(1, currentPage - 1)}`}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 1 ? 'text-slate-400 bg-slate-100 pointer-events-none' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'}`}
              >
                Previous
              </a>
              <a 
                href={`/admin/customizations?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === totalPages ? 'text-slate-400 bg-slate-100 pointer-events-none' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'}`}
              >
                Next
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
