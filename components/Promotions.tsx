"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/catalog";
import { pushSelectPromotion, pushViewPromotion, type Promotion } from "@/lib/datalayer";

export type PromotedProduct = { promotion: Promotion; product: Product };

// view_promotion for each promotion on the page, once per page view.
export function PromotionViews({ promotions }: { promotions: PromotedProduct[] }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    promotions.forEach(({ promotion, product }) => pushViewPromotion(promotion, product));
  }, [promotions]);
  return null;
}

// A link inside a promotion: select_promotion on click, with which link it was.
export function PromotionLink({
  promoted,
  link,
  ...props
}: { promoted: PromotedProduct; link: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      data-promotion={promoted.promotion.promotion_id}
      onClick={() => pushSelectPromotion(promoted.promotion, promoted.product, link)}
    />
  );
}
