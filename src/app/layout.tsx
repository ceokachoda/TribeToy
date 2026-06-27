import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PwaRegister from "@/components/layout/PwaRegister";
import { Viewport } from "next";
import { ConditionalLayoutWrapper } from "@/components/layout/ConditionalLayoutWrapper";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const viewport: Viewport = {
  themeColor: "#79987A",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tribetoy.com'),
  title: {
    default: "TribeToy | Innovation in Every Layer",
    template: "%s | TribeToy"
  },
  description: "India's most visually impressive 3D Printing company, bringing stories to life through sustainable, eco-friendly 3D printed toys and figures.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TribeToy",
  },
  openGraph: {
    title: "TribeToy | Innovation in Every Layer",
    description: "India's most visually impressive 3D Printing company, bringing stories to life through sustainable, eco-friendly 3D printed toys and figures.",
    url: "https://tribetoy.com",
    siteName: "TribeToy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TribeToy | Innovation in Every Layer",
    description: "India's most visually impressive 3D Printing company, bringing stories to life through sustainable, eco-friendly 3D printed toys and figures.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <SmoothScroll>
          <PwaRegister />
          <Providers>
            <ConditionalLayoutWrapper>
              {children}
            </ConditionalLayoutWrapper>
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
