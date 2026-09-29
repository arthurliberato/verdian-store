import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Verdian Hub", template: "%s — Verdian Hub" },
  description: "Verdian's internal hub: data requests, people and dashboards.",
  robots: { index: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen font-sans md:flex">
        <Nav />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-10">{children}</main>
      </body>
    </html>
  );
}
