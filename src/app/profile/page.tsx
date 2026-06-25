import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile - TribeToy",
  description: "Manage your TribeToy profile and view your order history.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f4f5f4]">
      <ProfileClient />
    </main>
  );
}
