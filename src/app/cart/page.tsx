import CartClient from "./CartClient";

export const metadata = {
  title: "Shopping Cart - TribeToy",
  description: "Review your selected items and proceed to checkout.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <CartClient />
    </main>
  );
}
