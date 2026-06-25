import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import PwaRegister from "@/components/layout/PwaRegister";
import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#79987A",
};

export const metadata: Metadata = {
  title: "TribeToy | Innovation in Every Layer",
  description: "India's most visually impressive 3D Printing company, bringing stories to life through sustainable, eco-friendly 3D printed toys and figures.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TribeToy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 pb-20 lg:pb-0">
        <PwaRegister />
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
