import ProductClient from "./ProductClient";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id.toString() === id);
  if (!product) return { title: 'Product Not Found' };
  
  return {
    title: `${product.name} - TribeToy`,
    description: `Buy ${product.name} at TribeToy.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id.toString() === id);
  
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <ProductClient product={product} />
    </main>
  );
}
