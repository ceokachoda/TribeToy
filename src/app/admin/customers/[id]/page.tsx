import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiUser, FiMail, FiMapPin, FiCalendar } from "react-icons/fi";
import { RevealField, maskEmail, maskAddress } from "@/components/admin/RevealField";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: customer, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !customer) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Details</h1>
          <p className="text-slate-500 mt-1">View information for {customer.full_name || "Unnamed Customer"}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{customer.full_name || "Unnamed Customer"}</h2>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <FiCalendar size={14} /> Joined {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <FiMail className="text-slate-400" /> Email Address
            </label>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <RevealField masked={maskEmail(customer.email)} revealKey="customer.email" id={customer.id} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <FiMapPin className="text-slate-400" /> Shipping Address
            </label>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <RevealField masked={maskAddress(customer.address)} revealKey="customer.address" id={customer.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
