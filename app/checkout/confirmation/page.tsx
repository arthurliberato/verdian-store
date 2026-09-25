import type { Metadata } from "next";
import { ConfirmationView } from "@/components/ConfirmationView";

export const metadata: Metadata = { title: "Order confirmed" };

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
