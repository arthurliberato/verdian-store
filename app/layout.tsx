import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { PageViewTracker, QueryChangeTracker } from "@/components/PageViewTracker";
import { Header } from "@/components/Header";
import Script from "next/script";
import { GTM_ID, GoogleTagManagerNoScript, gtmSnippet } from "@/components/GoogleTagManager";
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
        <GoogleTagManagerNoScript />
        {GTM_ID && (
          // beforeInteractive: injected into <head> and run before the app's
          // code, so GTM's gtm.js event is queued before the first page_view.
          <Script id="gtm" strategy="beforeInteractive">
            {gtmSnippet(GTM_ID)}
          </Script>
        )}
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
