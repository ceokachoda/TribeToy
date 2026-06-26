import OrderSuccessClient from "./OrderSuccessClient";
import { Suspense } from "react";

export const metadata = {
  title: "Order Placed - TribeToy",
  description: "Thank you for shopping with TribeToy.",
};

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <OrderSuccessClient />
      </Suspense>
    </main>
  );
}
