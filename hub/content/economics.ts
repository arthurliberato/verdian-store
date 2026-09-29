// Unit economics: what each model costs Verdian to make and land in the
// warehouse. None of this is in GA4 — it's the business context behind the
// plans (why the CEO pushes the Arco franchise, why the care kit gets its own
// email). Later loaded into BigQuery as `raw_finance.unit_costs`, joined on
// the model code in the item_id (VRD-{CODE}-{COLORWAY}).

export type UnitCost = {
  code: string;
  model: string;
  line: "Classic" | "Performance" | "Street";
  category: "footwear" | "apparel" | "accessories";
  price: number;
  /** Landed cost: factory price + freight + duties, per unit (USD). */
  cost: number;
  note?: string;
};

export const unitCosts: UnitCost[] = [
  // Footwear
  { code: "ARC", model: "Arco", line: "Classic", category: "footwear", price: 140, cost: 36, note: "Arco platform: shared cupsole and last, tooling paid once" },
  { code: "SND", model: "Senda", line: "Classic", category: "footwear", price: 150, cost: 52, note: "Suede upper" },
  { code: "CLM", model: "Calma", line: "Classic", category: "footwear", price: 110, cost: 34 },
  { code: "PLT", model: "Plata", line: "Classic", category: "footwear", price: 130, cost: 44 },
  { code: "RAZ", model: "Raíz", line: "Classic", category: "footwear", price: 190, cost: 82, note: "Full-grain leather, welted construction" },
  { code: "PUL", model: "Pulso", line: "Performance", category: "footwear", price: 160, cost: 58 },
  { code: "CIM", model: "Cima", line: "Performance", category: "footwear", price: 180, cost: 70 },
  { code: "IMP", model: "Impulso", line: "Performance", category: "footwear", price: 130, cost: 47 },
  { code: "VNT", model: "Viento", line: "Performance", category: "footwear", price: 240, cost: 108, note: "Carbon plate" },
  { code: "CMP", model: "Campo", line: "Performance", category: "footwear", price: 150, cost: 55 },
  { code: "AMU", model: "Arco Muta", line: "Street", category: "footwear", price: 190, cost: 42, note: "Arco platform at a Street price" },
  { code: "SNL", model: "Senda Low", line: "Street", category: "footwear", price: 160, cost: 50, note: "Shares the Senda last" },
  { code: "BRU", model: "Bruma", line: "Street", category: "footwear", price: 200, cost: 78 },
  { code: "FSC", model: "Fosco", line: "Street", category: "footwear", price: 180, cost: 72 },
  { code: "ECO", model: "Eco", line: "Street", category: "footwear", price: 150, cost: 61, note: "Recycled materials cost more" },
  // Apparel
  { code: "TEE", model: "Essential Tee", line: "Classic", category: "apparel", price: 60, cost: 14 },
  { code: "PKT", model: "Heavyweight Pocket Tee", line: "Classic", category: "apparel", price: 70, cost: 18 },
  { code: "HOD", model: "Loopback Hoodie", line: "Classic", category: "apparel", price: 120, cost: 34 },
  { code: "CRW", model: "Crewneck Sweatshirt", line: "Classic", category: "apparel", price: 110, cost: 31 },
  { code: "TRP", model: "Track Pant", line: "Classic", category: "apparel", price: 110, cost: 33 },
  { code: "TRJ", model: "Track Jacket", line: "Classic", category: "apparel", price: 140, cost: 46 },
  { code: "PRJ", model: "Pulso Running Jacket", line: "Performance", category: "apparel", price: 180, cost: 64 },
  { code: "PRT", model: "Pulso Run Tee", line: "Performance", category: "apparel", price: 70, cost: 19 },
  { code: "TSH", model: "Training Short 7\"", line: "Performance", category: "apparel", price: 75, cost: 21 },
  { code: "CSJ", model: "Cima Shell Jacket", line: "Performance", category: "apparel", price: 220, cost: 88 },
  { code: "ITT", model: "Impulso Training Tight", line: "Performance", category: "apparel", price: 90, cost: 27 },
  { code: "HZM", model: "Half-Zip Midlayer", line: "Performance", category: "apparel", price: 140, cost: 45 },
  { code: "BRH", model: "Bruma Oversized Hoodie", line: "Street", category: "apparel", price: 190, cost: 52 },
  { code: "FNJ", model: "Fosco Nylon Jacket", line: "Street", category: "apparel", price: 260, cost: 96 },
  { code: "MCP", model: "Muta Cargo Pant", line: "Street", category: "apparel", price: 180, cost: 58 },
  { code: "ERT", model: "Eco Recycled Tee", line: "Street", category: "apparel", price: 65, cost: 20 },
  { code: "SGT", model: "Senda Low Graphic Tee", line: "Street", category: "apparel", price: 70, cost: 17 },
  // Accessories
  { code: "SCK", model: "Crew Sock 3-Pack", line: "Classic", category: "accessories", price: 60, cost: 11 },
  { code: "RSK", model: "Pulso Run Sock 3-Pack", line: "Performance", category: "accessories", price: 60, cost: 13 },
  { code: "CAP", model: "Six-Panel Cap", line: "Classic", category: "accessories", price: 60, cost: 12 },
  { code: "RCP", model: "Pulso Running Cap", line: "Performance", category: "accessories", price: 65, cost: 15 },
  { code: "TOT", model: "Canvas Tote", line: "Classic", category: "accessories", price: 80, cost: 16 },
  { code: "BPK", model: "Everyday Backpack", line: "Classic", category: "accessories", price: 140, cost: 48 },
  { code: "XBD", model: "Bruma Crossbody Bag", line: "Street", category: "accessories", price: 90, cost: 27 },
  { code: "KIT", model: "Sneaker Care Kit", line: "Classic", category: "accessories", price: 60, cost: 9, note: "Tomás's cross-sell" },
  { code: "BLK", model: "Wool Throw Blanket", line: "Classic", category: "accessories", price: 90, cost: 38 },
];

/** Costs per order and per return that aren't tied to a model. */
export const orderCosts = {
  shippingPerOrder: 8.5,
  packagingPerOrder: 1.2,
  paymentFeeRate: 0.029,
  paymentFeeFixed: 0.3,
  returnRate: { footwear: 0.16, apparel: 0.09, accessories: 0.04 },
  returnShipping: 9,
  resellableShare: 0.85,
};

export const grossMargin = (u: UnitCost) => (u.price - u.cost) / u.price;
