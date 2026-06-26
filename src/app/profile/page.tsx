import ProfileClient from "./ProfileClient";
import { Suspense } from "react";

export const metadata = {
  title: "My Profile - TribeToy",
  description: "Manage your TribeToy profile and view your order history.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading profile...</div>}>
        <ProfileClient />
      </Suspense>
    </main>
  );
}
