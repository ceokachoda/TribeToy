import ProductClient from "./ProductClient";
import { createStaticClient } from "@/utils/supabase/static";

export const revalidate = 3600;
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createStaticClient();
  const { data: product } = await supabase.from('products').select('id, name, category, price, original_price, image_url, additional_images, is_new, is_sale, is_premium, description, stock_quantity').eq('id', id).single();
  
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} - TribeToy`,
    description: `Buy ${product.name} at TribeToy.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createStaticClient();
  const { data: product, error } = await supabase.from('products').select('id, name, category, price, original_price, image_url, additional_images, is_new, is_sale, is_premium, description, stock_quantity').eq('id', id).single();
  
  if (!product) {
    notFound();
  }

  const { data: relatedProductsData } = await supabase
    .from('products')
    .select('id, name, category, price, original_price, image_url, additional_images, is_new, is_sale, is_premium, description, stock_quantity')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4);

  const mappedProduct = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: `₹${parseFloat(product.price).toFixed(2)}`,
    originalPrice: product.original_price ? `₹${parseFloat(product.original_price).toFixed(2)}` : undefined,
    image: product.image_url || "",
    additional_images: product.additional_images || [],
    isNew: product.is_new,
    isSale: product.is_sale,
    isPremium: product.is_premium,
  };

  const mappedRelatedProducts = (relatedProductsData || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: `₹${parseFloat(p.price).toFixed(2)}`,
    originalPrice: p.original_price ? `₹${parseFloat(p.original_price).toFixed(2)}` : undefined,
    image: p.image_url || "",
    additional_images: p.additional_images || [],
    isNew: p.is_new,
    isSale: p.is_sale,
    isPremium: p.is_premium,
  }));

  return (
    <main className="min-h-screen bg-background">
      <ProductClient product={mappedProduct} relatedProducts={mappedRelatedProducts as any} />
    </main>
  );
}
