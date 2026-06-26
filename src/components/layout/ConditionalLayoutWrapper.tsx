"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true, // We want it to be part of the initial HTML but it defers hydration/JS loading slightly if below fold
});

export function ConditionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
