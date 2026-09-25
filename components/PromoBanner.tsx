"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export type Promotion = {
  id: string;
  name: string;
  creative: string;
  slot: string;
  href: string;
};

// Internal promotion tracking: view_promotion when shown, select_promotion when
// clicked. In GA4 → Reports → Monetization → "Promotions" these become
// impressions, clicks and click-through rate per banner.
export function PromoLink({
  promotion,
  className,
  children,
}: {
  promotion: Promotion;
  className?: string;
  children: React.ReactNode;
}) {
  const ecommerce = {
    promotion_id: promotion.id,
    promotion_name: promotion.name,
    creative_name: promotion.creative,
    creative_slot: promotion.slot,
  };

  useEffect(() => {
    track("view_promotion", { ecommerce: { ...ecommerce, items: [] } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotion.id]);

  return (
    <Link href={promotion.href} className={className} onClick={() => track("select_promotion", { ecommerce: { ...ecommerce, items: [] } })}>
      {children}
    </Link>
  );
}
