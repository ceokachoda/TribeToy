import LoginClient from "./LoginClient";

export const metadata = {
  title: "Login - TribeToy",
  description: "Sign in to your TribeToy account to manage your 3D printing orders.",
};

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4] pt-32 pb-32">
      <Suspense fallback={<div className="min-h-[80vh] flex flex-col gap-4 items-center justify-center"><div className="w-8 h-8 border-4 border-[#79987A] border-t-transparent rounded-full animate-spin"></div><div className="text-[#4A5D4E] font-medium font-outfit tracking-wide">Loading...</div></div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
