import ProductClient from "./ProductClient";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('id, name, category, price, original_price, image_url, is_new, is_sale, is_premium, description, stock_quantity').eq('id', id).single();
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} - TribeToy`,
    description: `Buy ${product.name} at TribeToy.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase.from('products').select('id, name, category, price, original_price, image_url, is_new, is_sale, is_premium, description, stock_quantity').eq('id', id).single();
  
  if (!product) {
    notFound();
  }

  const mappedProduct = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: `₹${parseFloat(product.price).toFixed(2)}`,
    originalPrice: product.original_price ? `₹${parseFloat(product.original_price).toFixed(2)}` : undefined,
    image: product.image_url || "",
    isNew: product.is_new,
    isSale: product.is_sale,
    isPremium: product.is_premium,
  };

  return (
    <main className="min-h-screen bg-background">
      <ProductClient product={mappedProduct} />
    </main>
  );
}
