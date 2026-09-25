import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { PageViewTracker, QueryChangeTracker } from "@/components/PageViewTracker";
import { DataLayerDebug } from "@/components/DataLayerDebug";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Verdian — Classic, Performance & Street Footwear",
    template: "%s | Verdian",
  },
  description: "Heritage silhouettes, performance running gear, and limited street drops.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <GoogleTagManager />
        <StoreProvider>
          {/* Must come before the page content so page_view fires first. */}
          <PageViewTracker />
          <Suspense fallback={null}>
            <QueryChangeTracker />
          </Suspense>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <DataLayerDebug />
        </StoreProvider>
      </body>
    </html>
  );
}
