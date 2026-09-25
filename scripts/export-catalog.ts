// Exports the product catalog for loading into BigQuery (dataset: raw_catalog).
//
//   npm run export:catalog
//
// Writes data/bigquery/products.jsonl — newline-delimited JSON, one product per
// line. JSONL (not CSV) because `sizes` is an array: BigQuery loads it as a
// REPEATED STRING column, which you query with UNNEST().
//
// Presentation-only fields (swatch colors, silhouette, tag) are left out.

import { mkdirSync, writeFileSync } from "node:fs";
import { products } from "../lib/catalog";

const rows = products.map((p) => ({
  id: p.id,
  name: p.name,
  model: p.model,
  line: p.line,
  category: p.category,
  subcategory: p.subcategory,
  colorway: p.colorway,
  price: p.price,
  sizes: p.sizes,
  description: p.description,
  image: p.image,
}));

mkdirSync("data/bigquery", { recursive: true });
writeFileSync("data/bigquery/products.jsonl", rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`Wrote ${rows.length} products to data/bigquery/products.jsonl`);
