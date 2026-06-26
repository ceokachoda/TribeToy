"use client";

import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { deleteProduct } from "./actions";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(productId);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-500 hover:text-red-700 p-1 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`} 
      title="Delete"
    >
      <FiTrash2 size={18} className={isDeleting ? "animate-pulse" : ""} />
    </button>
  );
}
