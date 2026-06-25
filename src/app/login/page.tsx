import LoginClient from "./LoginClient";

export const metadata = {
  title: "Login - TribeToy",
  description: "Sign in to your TribeToy account to manage your 3D printing orders.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4] pt-32 pb-32">
      <LoginClient />
    </main>
  );
}
