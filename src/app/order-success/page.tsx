import OrderSuccessClient from "./OrderSuccessClient";

export const metadata = {
  title: "Order Placed - TribeToy",
  description: "Thank you for shopping with TribeToy.",
};

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <OrderSuccessClient />
    </main>
  );
}
