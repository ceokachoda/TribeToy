"use client";

import { FiTrash2, FiAlertTriangle, FiX } from "react-icons/fi";
import { useState } from "react";
import { deleteProduct } from "./actions";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteProduct(productId);
      if (response?.error) {
        throw new Error(response.error);
      }
      setShowModal(false);
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      alert(error.message || "Failed to delete product. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isDeleting}
        className={`text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-all ${isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"}`} 
        title="Delete"
      >
        <FiTrash2 size={18} className={isDeleting ? "animate-pulse" : ""} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FiAlertTriangle className="text-red-600 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Delete Product</h3>
                    <p className="text-sm text-slate-500 mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>
                <button 
                  onClick={() => !isDeleting && setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">
                Are you absolutely sure you want to permanently delete this product? All associated data, including stock history and listings, will be permanently removed from our servers.
              </p>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, delete product"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
