// Verdian product catalog.
//
// This is the single source of truth for everything the store sells. Every
// analytics `items[]` entry is built from these records (see lib/analytics.ts),
// so the item_id / item_category values you see in GA4 and BigQuery come from here.
//
// `cost` is deliberately NOT sent to GA4. It represents the external
// "cost of goods" data you would load into BigQuery separately and join to
// purchase events on item_id to calculate margin.

export type CategorySlug = "classic" | "performance" | "street";

export type ProductType =
  | "court"
  | "runner"
  | "high-top"
  | "hoodie"
  | "tee"
  | "jacket"
  | "pant";

export type Audience = "heritage" | "performance" | "hype";

export type Colorway = { name: string; hex: string; accent: string };

export type Product = {
  id: string; // SKU, used as GA4 item_id
  slug: string;
  name: string;
  category: CategorySlug;
  type: ProductType;
  audience: Audience;
  price: number;
  compareAtPrice?: number; // original price when discounted
  cost: number; // cost of goods — never sent to GA4
  colors: Colorway[];
  sizes: string[];
  soldOutSizes: string[];
  lowStockSizes: string[];
  limited: boolean; // limited drop (hype behaviour)
  isNew: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
};

export const categories: Category[] = [
  {
    slug: "classic",
    name: "Classic",
    tagline: "Built to last. Made to be worn in.",
    description:
      "Heritage silhouettes in full-grain leather and suede. Comfortable, understated, and made for everyday wear.",
  },
  {
    slug: "performance",
    name: "Performance",
    tagline: "Engineered for the long run.",
    description:
      "Lightweight running and training gear with responsive cushioning and breathable knits.",
  },
  {
    slug: "street",
    name: "Street",
    tagline: "Limited drops. No restocks.",
    description:
      "Bold colorways and collaborations released in small numbers. When they're gone, they're gone.",
  },
];

const SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  // ─── Classic (heritage) ──────────────────────────────────────────────
  {
    id: "VRD-CL-001",
    slug: "heritage-court-70",
    name: "Heritage Court '70",
    category: "classic",
    type: "court",
    audience: "heritage",
    price: 110,
    cost: 38,
    colors: [
      { name: "White / Forest", hex: "#f4f1ea", accent: "#1f4d3a" },
      { name: "White / Navy", hex: "#f4f1ea", accent: "#1d2b4f" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: ["13"],
    limited: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 1284,
    description:
      "Our original 1970 court shoe, rebuilt with a cushioned insole and a full-grain leather upper that softens with every wear.",
    features: ["Full-grain leather upper", "Cushioned OrthoLite insole", "Stitched rubber cupsole", "Wide fit available"],
  },
  {
    id: "VRD-CL-002",
    slug: "marathon-suede-78",
    name: "Marathon Suede '78",
    category: "classic",
    type: "runner",
    audience: "heritage",
    price: 120,
    cost: 42,
    colors: [
      { name: "Tan / Cream", hex: "#c8a878", accent: "#efe6d2" },
      { name: "Grey / Burgundy", hex: "#9a9a96", accent: "#6d1f2c" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 842,
    description:
      "A retro runner inspired by our first marathon shoe. Soft suede overlays, a nylon base, and a gum sole.",
    features: ["Suede and nylon upper", "EVA midsole", "Gum rubber outsole", "Padded collar"],
  },
  {
    id: "VRD-CL-003",
    slug: "club-leather-low",
    name: "Club Leather Low",
    category: "classic",
    type: "court",
    audience: "heritage",
    price: 95,
    cost: 31,
    colors: [
      { name: "Black / Gum", hex: "#1c1c1c", accent: "#b88a4e" },
      { name: "White / White", hex: "#f7f7f5", accent: "#dcdcd8" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 2210,
    description: "A clean, minimal leather sneaker that goes with everything. Our best seller for three decades.",
    features: ["Leather upper", "Perforated toe box", "Rubber cupsole", "Removable insole"],
  },
  {
    id: "VRD-CL-004",
    slug: "comfort-walker",
    name: "Comfort Walker",
    category: "classic",
    type: "runner",
    audience: "heritage",
    price: 130,
    cost: 47,
    colors: [
      { name: "Stone", hex: "#b9b4a9", accent: "#6f6a60" },
      { name: "Navy", hex: "#23304f", accent: "#a9b3c9" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 512,
    description:
      "Designed for all-day walking with extra arch support and a wide toe box. Podiatrist recommended.",
    features: ["Extra arch support", "Wide toe box", "Shock-absorbing heel", "Slip-resistant outsole"],
  },
  {
    id: "VRD-CL-005",
    slug: "heritage-hi-65",
    name: "Heritage Hi '65",
    category: "classic",
    type: "high-top",
    audience: "heritage",
    price: 115,
    cost: 40,
    colors: [
      { name: "Cream / Forest", hex: "#efe6d2", accent: "#1f4d3a" },
      { name: "Black / White", hex: "#1c1c1c", accent: "#f4f4f4" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: ["6"],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.4,
    reviewCount: 396,
    description: "The basketball high-top that started it all, faithfully reissued in canvas and leather.",
    features: ["Canvas and leather upper", "Vulcanized sole", "Ankle padding", "Metal eyelets"],
  },
  {
    id: "VRD-CL-006",
    slug: "heritage-crew-sweatshirt",
    name: "Heritage Crew Sweatshirt",
    category: "classic",
    type: "hoodie",
    audience: "heritage",
    price: 75,
    cost: 22,
    colors: [
      { name: "Heather Grey", hex: "#b3b3b0", accent: "#1f4d3a" },
      { name: "Forest", hex: "#1f4d3a", accent: "#efe6d2" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 733,
    description: "Heavyweight loopback cotton with an embroidered Verdian crest. A relaxed, easy fit.",
    features: ["100% organic cotton", "Loopback terry", "Embroidered crest", "Ribbed cuffs"],
  },
  {
    id: "VRD-CL-007",
    slug: "classic-pique-polo",
    name: "Classic Piqué Polo",
    category: "classic",
    type: "tee",
    audience: "heritage",
    price: 55,
    cost: 15,
    colors: [
      { name: "White", hex: "#f7f7f5", accent: "#1f4d3a" },
      { name: "Navy", hex: "#23304f", accent: "#f4f4f4" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.3,
    reviewCount: 288,
    description: "A breathable cotton piqué polo with a two-button placket. Tailored but comfortable.",
    features: ["Cotton piqué", "Two-button placket", "Ribbed collar", "Side vents"],
  },
  {
    id: "VRD-CL-008",
    slug: "harrington-jacket",
    name: "Harrington Jacket",
    category: "classic",
    type: "jacket",
    audience: "heritage",
    price: 160,
    cost: 58,
    colors: [
      { name: "Stone", hex: "#c9bfa8", accent: "#6d1f2c" },
      { name: "Forest", hex: "#1f4d3a", accent: "#b9322b" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: ["XXL"],
    limited: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 164,
    description: "A timeless water-resistant jacket with a tartan lining and a classic stand-up collar.",
    features: ["Water-resistant shell", "Tartan cotton lining", "Stand-up collar", "Ribbed hem"],
  },

  // ─── Performance ─────────────────────────────────────────────────────
  {
    id: "VRD-PF-001",
    slug: "velocity-run-3",
    name: "Velocity Run 3",
    category: "performance",
    type: "runner",
    audience: "performance",
    price: 150,
    cost: 52,
    colors: [
      { name: "Volt / Black", hex: "#d7f25c", accent: "#161616" },
      { name: "Ocean / White", hex: "#2b6fd6", accent: "#f4f4f4" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 947,
    description: "Our most responsive daily trainer. A nitrogen-infused foam midsole and an engineered mesh upper.",
    features: ["Nitrogen-infused foam", "Engineered mesh upper", "8mm drop", "Reflective details"],
  },
  {
    id: "VRD-PF-002",
    slug: "endurance-max",
    name: "Endurance Max",
    category: "performance",
    type: "runner",
    audience: "performance",
    price: 170,
    cost: 60,
    colors: [
      { name: "Grey / Coral", hex: "#8c8f94", accent: "#ff6a4d" },
      { name: "Black / Black", hex: "#1a1a1a", accent: "#3a3a3a" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 611,
    description: "Maximum cushioning for long miles. Built for marathon training and recovery runs.",
    features: ["Max-stack cushioning", "Wide stable base", "Knit collar", "Durable rubber outsole"],
  },
  {
    id: "VRD-PF-003",
    slug: "tempo-carbon-elite",
    name: "Tempo Carbon Elite",
    category: "performance",
    type: "runner",
    audience: "performance",
    price: 250,
    cost: 88,
    colors: [{ name: "Signal Orange", hex: "#ff5a1f", accent: "#161616" }],
    sizes: SHOE_SIZES,
    soldOutSizes: ["9", "10"],
    lowStockSizes: ["11"],
    limited: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 203,
    description: "A carbon-plated racer for race day. Lightest shoe we have ever made.",
    features: ["Full-length carbon plate", "PEBA foam", "Race-fit upper", "190g (US 9)"],
  },
  {
    id: "VRD-PF-004",
    slug: "trail-ridge-gtx",
    name: "Trail Ridge GTX",
    category: "performance",
    type: "runner",
    audience: "performance",
    price: 165,
    compareAtPrice: 185,
    cost: 61,
    colors: [
      { name: "Moss / Rust", hex: "#4f5b3a", accent: "#b5562a" },
      { name: "Slate", hex: "#4a4f57", accent: "#d7f25c" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.4,
    reviewCount: 318,
    description: "Waterproof trail runner with aggressive lugs and a protective rock plate.",
    features: ["Waterproof membrane", "5mm lugs", "Rock plate", "Gusseted tongue"],
  },
  {
    id: "VRD-PF-005",
    slug: "studio-trainer",
    name: "Studio Trainer",
    category: "performance",
    type: "court",
    audience: "performance",
    price: 110,
    cost: 37,
    colors: [
      { name: "White / Mint", hex: "#f4f4f4", accent: "#63d2a7" },
      { name: "Black / Volt", hex: "#1a1a1a", accent: "#d7f25c" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.3,
    reviewCount: 455,
    description: "A stable, flat trainer for lifting, HIIT, and studio classes.",
    features: ["Flat stable base", "Lateral support", "Breathable mesh", "Flexible forefoot"],
  },
  {
    id: "VRD-PF-006",
    slug: "aero-dry-tee",
    name: "AeroDry Running Tee",
    category: "performance",
    type: "tee",
    audience: "performance",
    price: 40,
    cost: 10,
    colors: [
      { name: "Volt", hex: "#d7f25c", accent: "#161616" },
      { name: "Black", hex: "#1a1a1a", accent: "#d7f25c" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 822,
    description: "Ultra-light, sweat-wicking tee with laser-cut ventilation.",
    features: ["Sweat-wicking fabric", "Laser-cut vents", "Flatlock seams", "Reflective logo"],
  },
  {
    id: "VRD-PF-007",
    slug: "stormshell-run-jacket",
    name: "StormShell Run Jacket",
    category: "performance",
    type: "jacket",
    audience: "performance",
    price: 140,
    compareAtPrice: 160,
    cost: 49,
    colors: [
      { name: "Ocean", hex: "#2b6fd6", accent: "#d7f25c" },
      { name: "Black", hex: "#1a1a1a", accent: "#ff6a4d" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.4,
    reviewCount: 190,
    description: "A packable, waterproof shell that stuffs into its own pocket.",
    features: ["Waterproof and breathable", "Packable pocket", "Reflective trim", "Adjustable hood"],
  },
  {
    id: "VRD-PF-008",
    slug: "pace-tight",
    name: "Pace Running Tight",
    category: "performance",
    type: "pant",
    audience: "performance",
    price: 65,
    cost: 18,
    colors: [{ name: "Black", hex: "#1a1a1a", accent: "#2b6fd6" }],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 540,
    description: "Compressive running tights with a phone pocket and a secure waistband.",
    features: ["Light compression", "Phone pocket", "Zip ankles", "Reflective details"],
  },

  // ─── Street (hype) ───────────────────────────────────────────────────
  {
    id: "VRD-ST-001",
    slug: "phantom-hi-og",
    name: "Phantom Hi OG",
    category: "street",
    type: "high-top",
    audience: "hype",
    price: 190,
    cost: 55,
    colors: [{ name: "Bred", hex: "#b9322b", accent: "#161616" }],
    sizes: SHOE_SIZES,
    soldOutSizes: ["9", "10", "11"],
    lowStockSizes: ["8", "12"],
    limited: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 88,
    description: "The drop of the season. Tumbled leather, a padded collar, and a numbered insole.",
    features: ["Tumbled leather", "Numbered insole", "Two lace sets", "Collector's box"],
  },
  {
    id: "VRD-ST-002",
    slug: "nightshift-low",
    name: "Nightshift Low",
    category: "street",
    type: "court",
    audience: "hype",
    price: 160,
    cost: 46,
    colors: [
      { name: "Triple Black", hex: "#141414", accent: "#2a2a2a" },
      { name: "Glow", hex: "#141414", accent: "#c7ff3d" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: ["10"],
    lowStockSizes: ["9", "11"],
    limited: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 142,
    description: "A stealth low-top with a glow-in-the-dark outsole. Made for after dark.",
    features: ["Nubuck upper", "Glow-in-the-dark outsole", "Reflective heel tab", "Limited run"],
  },
  {
    id: "VRD-ST-003",
    slug: "verdian-x-atlas-runner",
    name: "Verdian x Atlas Runner",
    category: "street",
    type: "runner",
    audience: "hype",
    price: 220,
    cost: 64,
    colors: [{ name: "Sand / Forest", hex: "#d8c7a3", accent: "#1f4d3a" }],
    sizes: SHOE_SIZES,
    soldOutSizes: ["8", "9", "10", "11"],
    lowStockSizes: ["7", "12"],
    limited: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 61,
    description: "Our collaboration with Atlas Studio. Premium suede, co-branded tongue, and a one-time release.",
    features: ["Premium suede", "Co-branded details", "Special box", "One-time release"],
  },
  {
    id: "VRD-ST-004",
    slug: "block-party-dunk",
    name: "Block Party Dunk",
    category: "street",
    type: "court",
    audience: "hype",
    price: 140,
    compareAtPrice: 160,
    cost: 41,
    colors: [
      { name: "Grape / Mint", hex: "#6a3fa0", accent: "#8ff0c7" },
      { name: "Panda", hex: "#f4f4f4", accent: "#141414" },
    ],
    sizes: SHOE_SIZES,
    soldOutSizes: [],
    lowStockSizes: ["10"],
    limited: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 377,
    description: "A bold, color-blocked low-top inspired by summer block parties.",
    features: ["Color-blocked leather", "Padded tongue", "Rubber cupsole", "Retro branding"],
  },
  {
    id: "VRD-ST-005",
    slug: "voltage-mid",
    name: "Voltage Mid",
    category: "street",
    type: "high-top",
    audience: "hype",
    price: 175,
    cost: 50,
    colors: [{ name: "Chrome / Volt", hex: "#c9ccd1", accent: "#d7f25c" }],
    sizes: SHOE_SIZES,
    soldOutSizes: ["9"],
    lowStockSizes: ["8", "10"],
    limited: true,
    isNew: true,
    rating: 4.6,
    reviewCount: 54,
    description: "A metallic mid-top with a translucent sole. Numbered, limited, and loud.",
    features: ["Metallic leather", "Translucent sole", "Numbered", "Hang tag"],
  },
  {
    id: "VRD-ST-006",
    slug: "drop-logo-hoodie",
    name: "Drop Logo Hoodie",
    category: "street",
    type: "hoodie",
    audience: "hype",
    price: 110,
    cost: 26,
    colors: [
      { name: "Black", hex: "#141414", accent: "#c7ff3d" },
      { name: "Bone", hex: "#e9e2d4", accent: "#b9322b" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: ["M"],
    lowStockSizes: ["L"],
    limited: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 212,
    description: "Oversized heavyweight hoodie with a puff-print logo. Released with every drop.",
    features: ["450gsm cotton", "Puff-print logo", "Oversized fit", "Double-layer hood"],
  },
  {
    id: "VRD-ST-007",
    slug: "graffiti-box-tee",
    name: "Graffiti Box Tee",
    category: "street",
    type: "tee",
    audience: "hype",
    price: 50,
    cost: 11,
    colors: [
      { name: "White", hex: "#f7f7f5", accent: "#6a3fa0" },
      { name: "Black", hex: "#141414", accent: "#ff5a1f" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: [],
    limited: false,
    isNew: false,
    rating: 4.4,
    reviewCount: 490,
    description: "A boxy-fit tee with an artist-designed graffiti print on the back.",
    features: ["Boxy fit", "Artist print", "Heavy cotton jersey", "Ribbed neck"],
  },
  {
    id: "VRD-ST-008",
    slug: "cargo-track-pant",
    name: "Cargo Track Pant",
    category: "street",
    type: "pant",
    audience: "hype",
    price: 95,
    cost: 27,
    colors: [
      { name: "Olive", hex: "#556045", accent: "#141414" },
      { name: "Black", hex: "#141414", accent: "#c7ff3d" },
    ],
    sizes: APPAREL_SIZES,
    soldOutSizes: [],
    lowStockSizes: ["XS"],
    limited: false,
    isNew: false,
    rating: 4.3,
    reviewCount: 167,
    description: "A relaxed track pant with cargo pockets and toggle ankles.",
    features: ["Nylon ripstop", "Cargo pockets", "Toggle ankles", "Elastic waist"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.category, p.type, p.description, ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export const FREE_SHIPPING_THRESHOLD = 100;

export const shippingOptions = [
  { id: "standard", label: "Standard (5–7 business days)", price: 8 },
  { id: "express", label: "Express (2–3 business days)", price: 18 },
  { id: "next-day", label: "Next day", price: 30 },
] as const;

export type ShippingTier = (typeof shippingOptions)[number]["id"];

// Promo codes let you practise `coupon` reporting in GA4.
export const coupons: Record<string, number> = {
  WELCOME10: 0.1,
  DROP20: 0.2,
};
