// Visitor archetypes for the scripted traffic generator.
//
// Each archetype is a set of probabilities, not a fixed script: every visit
// is sampled from these, so no two sessions are identical. Tune the numbers
// here; the browser automation lives in run.ts.

import type { Line } from "../lib/catalog";

export type Device = "desktop" | "tablet" | "mobile";

export type SourceType = "direct" | "organic_google" | "instagram" | "meta_paid" | "email";

export type Archetype = {
  id: string;
  description: string;
  /** Share of sessions at a peak hour, before time-of-day weighting. */
  share: number;
  /** Local hours (0–23) when this archetype is most active. */
  peakHours: number[];
  /** Line they gravitate to; null = no preference. */
  line: Line | null;
  devices: Record<Device, number>;
  sources: Partial<Record<SourceType, number>>;
  /** Preferred Meta creatives (1–5) when arriving from a paid ad. */
  creatives: number[];
  /** Pages viewed after landing, inclusive range. [0, 0] = bounce. */
  pages: [number, number];
  /** Probability of adding to cart on a visit. */
  pAddToCart: number;
  /** Probability of going to checkout when the cart has items. */
  pCheckout: number;
  /** Probability of placing the order once at checkout. */
  pPurchase: number;
  /** Multiplier on add/checkout/purchase from the 2nd visit on. */
  returningBoost: number;
  /** Probability that a session is a returning visitor (if any exist). */
  pReturning: number;
  /** Seconds spent on a page, inclusive range. */
  dwell: [number, number];
};

export const archetypes: Archetype[] = [
  {
    id: "bouncer",
    description: "Lands, glances, leaves. Mostly ad and search clicks with low intent.",
    share: 0.4,
    peakHours: [],
    line: null,
    devices: { mobile: 0.75, desktop: 0.2, tablet: 0.05 },
    sources: { meta_paid: 0.5, organic_google: 0.3, instagram: 0.2 },
    creatives: [1, 2, 3, 4, 5],
    pages: [0, 0],
    pAddToCart: 0,
    pCheckout: 0,
    pPurchase: 0,
    returningBoost: 1,
    pReturning: 0.05,
    dwell: [2, 8],
  },
  {
    id: "window_shopper",
    description: "Browses a few pages across lines, rarely commits.",
    share: 0.25,
    peakHours: [12, 13, 20, 21, 22],
    line: null,
    devices: { mobile: 0.6, desktop: 0.3, tablet: 0.1 },
    sources: { organic_google: 0.35, instagram: 0.25, direct: 0.2, meta_paid: 0.2 },
    creatives: [2, 3, 5],
    pages: [2, 6],
    pAddToCart: 0.1,
    pCheckout: 0.2,
    pPurchase: 0.3,
    returningBoost: 1.2,
    pReturning: 0.2,
    dwell: [4, 15],
  },
  {
    id: "heritage",
    description: "60s, loyal to Classic, compares carefully, usually buys on a later visit.",
    share: 0.12,
    peakHours: [8, 9, 10, 11, 14, 15, 16],
    line: "Classic",
    devices: { desktop: 0.5, tablet: 0.35, mobile: 0.15 },
    sources: { email: 0.3, organic_google: 0.35, direct: 0.2, meta_paid: 0.15 },
    creatives: [1],
    pages: [3, 8],
    pAddToCart: 0.3,
    pCheckout: 0.45,
    pPurchase: 0.55,
    returningBoost: 1.7,
    pReturning: 0.5,
    dwell: [8, 25],
  },
  {
    id: "hype",
    description: "Teens and young adults chasing Street drops. Mobile, evenings, impulsive.",
    share: 0.13,
    peakHours: [18, 19, 20, 21, 22, 23],
    line: "Street",
    devices: { mobile: 0.85, desktop: 0.1, tablet: 0.05 },
    sources: { meta_paid: 0.45, instagram: 0.35, direct: 0.2 },
    creatives: [3, 4],
    pages: [2, 5],
    pAddToCart: 0.3,
    pCheckout: 0.5,
    pPurchase: 0.5,
    returningBoost: 1.1,
    pReturning: 0.3,
    dwell: [3, 10],
  },
  {
    id: "runner",
    description: "Performance buyers: runners and gym-goers who research specs.",
    share: 0.1,
    peakHours: [6, 7, 8, 19, 20, 21],
    line: "Performance",
    devices: { mobile: 0.5, desktop: 0.45, tablet: 0.05 },
    sources: { organic_google: 0.5, meta_paid: 0.2, email: 0.2, direct: 0.1 },
    creatives: [2, 5],
    pages: [3, 7],
    pAddToCart: 0.3,
    pCheckout: 0.5,
    pPurchase: 0.6,
    returningBoost: 1.3,
    pReturning: 0.35,
    dwell: [6, 18],
  },
];

/** Relative traffic by local hour (0–23): quiet nights, busy evenings. */
export const hourlyTraffic = [
  0.2, 0.1, 0.1, 0.1, 0.15, 0.25, 0.45, 0.7, 0.85, 0.9, 0.9, 0.95,
  1.1, 1.0, 0.9, 0.9, 0.95, 1.1, 1.3, 1.5, 1.6, 1.5, 1.1, 0.6,
];

/** Archetype weight at a given hour: full share at peak hours, less otherwise. */
export function archetypeWeight(a: Archetype, hour: number): number {
  if (a.peakHours.length === 0) return a.share;
  return a.share * (a.peakHours.includes(hour) ? 1.6 : 0.5);
}

// ─── Randomness helpers ────────────────────────────────────────────────

export function chance(p: number): boolean {
  return Math.random() < p;
}

export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickWeighted<K extends string>(weights: Partial<Record<K, number>>): K {
  const entries = Object.entries(weights) as [K, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}
