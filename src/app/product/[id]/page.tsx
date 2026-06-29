import ProductClient from "./ProductClient";
import { createStaticClient } from "@/utils/supabase/static";

export const revalidate = 3600;
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createStaticClient();
  const { data: product } = await supabase.from('products').select('id, name, category, price, original_price, image_url, additional_images, is_new, is_sale, is_premium, description, stock_quantity').eq('id', id).single();
  
  if (!product) return { title: 'Product Not Found' };
  
  const title = `${product.name} - TribeToy`;
  const description = product.description?.substring(0, 160) || `Buy ${product.name} at TribeToy.`;
  const url = `https://thetribetoy.com/product/${id}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: product.image_url || '/logo-new.jpg',
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image_url || '/logo-new.jpg'],
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url ? [product.image_url] : undefined,
    "description": product.description || `Buy ${product.name} at TribeToy.`,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://thetribetoy.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": parseFloat(product.price).toFixed(2),
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={mappedProduct} relatedProducts={mappedRelatedProducts as any} />
    </main>
  );
}
