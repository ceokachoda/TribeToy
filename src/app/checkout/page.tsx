import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout - TribeToy",
  description: "Complete your TribeToy order.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <CheckoutClient />
    </main>
  );
}
