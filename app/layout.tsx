import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { PageViewTracker, QueryChangeTracker } from "@/components/PageViewTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Fonts are downloaded at build time and self-hosted by Next.js —
// no requests to Google from the visitor's browser.
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Verdian — Classic, Performance & Street",
    template: "%s — Verdian",
  },
  description: "Considered footwear and apparel. Timeless Classics, technical Performance, and limited Street drops.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          {/* Rendered before the page so page_view is pushed before view_item. */}
          <PageViewTracker />
          <Suspense fallback={null}>
            <QueryChangeTracker />
          </Suspense>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
