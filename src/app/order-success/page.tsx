import OrderSuccessClient from "./OrderSuccessClient";
import { Suspense } from "react";

export const metadata = {
  title: "Order Placed - TribeToy",
  description: "Thank you for shopping with TribeToy.",
};

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <Suspense fallback={<div className="min-h-screen flex flex-col gap-4 items-center justify-center"><div className="w-8 h-8 border-4 border-[#79987A] border-t-transparent rounded-full animate-spin"></div><div className="text-[#4A5D4E] font-medium font-outfit tracking-wide">Loading...</div></div>}>
        <OrderSuccessClient />
      </Suspense>
    </main>
  );
}
