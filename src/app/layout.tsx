import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PwaRegister from "@/components/layout/PwaRegister";
import { Viewport } from "next";
import { ConditionalLayoutWrapper } from "@/components/layout/ConditionalLayoutWrapper";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { createAdminClient } from "@/utils/supabase/admin";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'homepage_cms_config').single();
  const announcementConfig = data?.value?.announcement_bar || null;
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 pb-20 lg:pb-0">
        <SmoothScroll>
          <PwaRegister />
          <Providers>
            <ConditionalLayoutWrapper announcementConfig={announcementConfig}>
              {children}
            </ConditionalLayoutWrapper>
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
