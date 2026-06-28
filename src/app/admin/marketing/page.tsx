"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Coupon {
  id: string;
  code: string;
  affiliate_name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export default function MarketingPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const [formData, setFormData] = useState({
    code: '',
    affiliate_name: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    is_active: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Supabase Error details:", error);
      setError(error.message || "Failed to fetch coupons. Did you run the SQL migration?");
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { code, affiliate_name, discount_type, discount_value, max_uses, is_active } = formData;
    
    if (!code || !discount_value) {
      setError("Code and Discount Value are required");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from('coupons').insert({
      code: code.toUpperCase(),
      affiliate_name,
      discount_type,
      discount_value: parseFloat(discount_value),
      max_uses: max_uses ? parseInt(max_uses) : null,
      is_active
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setIsModalOpen(false);
      setFormData({ code: '', affiliate_name: '', discount_type: 'percentage', discount_value: '', max_uses: '', is_active: true });
      fetchCoupons();
    }
    setSaving(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('coupons').update({ is_active: !currentStatus }).eq('id', id);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await supabase.from('coupons').delete().eq('id', id);
      fetchCoupons();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketing & Affiliates</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons and track affiliate sales.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          + Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading coupons...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-700">Code</th>
                <th className="p-4 font-semibold text-gray-700">Affiliate</th>
                <th className="p-4 font-semibold text-gray-700">Discount</th>
                <th className="p-4 font-semibold text-gray-700">Usage</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No coupons found. Create one to get started.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-semibold">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{coupon.affiliate_name || '-'}</td>
                    <td className="p-4">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} off
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{coupon.used_count}</span>
                        <span className="text-xs text-gray-400">/ {coupon.max_uses || '∞'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {coupon.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Create New Coupon</h2>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMER20"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Name (Optional)</label>
                <input
                  type="text"
                  value={formData.affiliate_name}
                  onChange={(e) => setFormData({ ...formData, affiliate_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  placeholder="Leave empty for unlimited"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
