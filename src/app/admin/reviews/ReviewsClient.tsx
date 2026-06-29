"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const { showToast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
      showToast("Review status updated", "success");
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast("Failed to update status", "error");
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== id));
      showToast("Review deleted", "success");
      router.refresh();
    } catch(err) {
      console.error(err);
      showToast("Failed to delete review", "error");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Author</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4 w-1/3">Review Text</th>
            <th className="px-6 py-4">Status / Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap align-top">
                {new Date(review.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 align-top">
                <Link href={`/product/${review.product_id}`} className="text-blue-600 hover:underline line-clamp-2">
                  {review.products?.name || review.product_id}
                </Link>
              </td>
              <td className="px-6 py-4 align-top font-medium text-slate-900">
                {review.name}
              </td>
              <td className="px-6 py-4 align-top">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm text-slate-700 whitespace-pre-wrap max-w-md">
                  "{review.text}"
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="flex flex-col gap-2">
                  <select
                    value={review.status}
                    onChange={(e) => handleStatusChange(review.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-3 py-1 cursor-pointer outline-none border ${
                      review.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                      review.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={() => handleDelete(review.id)} className="text-xs text-red-500 hover:underline text-left">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
