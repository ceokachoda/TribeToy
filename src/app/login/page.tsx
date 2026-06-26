import LoginClient from "./LoginClient";

export const metadata = {
  title: "Login - TribeToy",
  description: "Sign in to your TribeToy account to manage your 3D printing orders.",
};

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4] pt-32 pb-32">
      <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
