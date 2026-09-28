// Scripted visitor generator for the Verdian store.
//
//   npm run traffic                    # visits the live store, sessions based on the hour
//   npm run traffic -- --sessions 3 --headed   # watch 3 visits in a visible browser
//   npm run traffic -- --sessions 3 --always-buy   # test: every non-bouncer buys
//
// Each session opens the store in a real browser (Playwright), so GTM and GA4
// fire exactly as they do for people. Visitors are persistent: their cookies
// and cart are saved, so they return days later as the same GA4 client_id.
//
// Every session is written to a ground-truth log (JSONL) — what really
// happened — to compare later with what GA4 recorded in BigQuery.
//
// Environment:
//   TRAFFIC_BASE_URL   store URL (default https://verdian-store.vercel.app)
//   TRAFFIC_STATE_DIR  where visitors, profiles and logs are kept (default traffic/.state)
//   TRAFFIC_TIMEZONE   the simulated audience's time zone (default America/New_York)

import { chromium, devices, type Browser, type Page } from "playwright";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, rmSync } from "node:fs";
import path from "node:path";
import { products, type Line } from "../lib/catalog";
import {
  archetypes,
  archetypeWeight,
  chance,
  hourlyTraffic,
  pick,
  pickWeighted,
  randInt,
  type Archetype,
  type Device,
  type SourceType,
} from "./archetypes";

// ─── Configuration ─────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const BASE_URL = (process.env.TRAFFIC_BASE_URL ?? "https://verdian-store.vercel.app").replace(/\/$/, "");
const STATE_DIR = process.env.TRAFFIC_STATE_DIR ?? "traffic/.state";
const TIMEZONE = process.env.TRAFFIC_TIMEZONE ?? "America/New_York";
const HEADED = flag("headed");
const CONCURRENCY = Number(option("concurrency") ?? 3);
const DWELL_SCALE = Number(option("dwell-scale") ?? 1); // <1 = faster visits (testing)
const ALWAYS_BUY = flag("always-buy"); // testing: push every non-bouncer through purchase
const BASE_SESSIONS_PER_RUN = 6;
const MAX_VISITORS = 800;
const SESSION_TIMEOUT_MS = 4 * 60_000;

const DEVICE_PROFILES: Record<Device, string[]> = {
  desktop: ["Desktop Chrome", "Desktop Edge", "Desktop Safari"],
  tablet: ["iPad (gen 7)", "Galaxy Tab S4"],
  mobile: ["iPhone 13", "iPhone 12", "Pixel 5", "Galaxy S9+"],
};

const CAMPAIGNS = {
  meta: "fall_launch",
  email: "weekly_edit",
};

// ─── Visitors (persistent across runs) ─────────────────────────────────

type Visitor = {
  visitor_id: string;
  archetype: string;
  device: Device;
  device_profile: string;
  first_seen: string;
  last_seen: string | null;
  visits: number;
  purchases: number;
  client_id: string | null;
};

const visitorsFile = path.join(STATE_DIR, "visitors.json");
const profileDir = path.join(STATE_DIR, "profiles");
const logDir = path.join(STATE_DIR, "logs");

function loadVisitors(): Visitor[] {
  if (!existsSync(visitorsFile)) return [];
  return JSON.parse(readFileSync(visitorsFile, "utf8"));
}

function saveVisitors(visitors: Visitor[]) {
  // Keep the most recently active visitors; forget the oldest.
  const kept = [...visitors]
    .sort((a, b) => (b.last_seen ?? b.first_seen).localeCompare(a.last_seen ?? a.first_seen))
    .slice(0, MAX_VISITORS);
  const keptIds = new Set(kept.map((v) => v.visitor_id));
  for (const v of visitors) {
    if (!keptIds.has(v.visitor_id)) rmSync(profilePath(v), { force: true });
  }
  writeFileSync(visitorsFile, JSON.stringify(kept, null, 1));
}

const profilePath = (v: Visitor) => path.join(profileDir, `${v.visitor_id}.json`);

function newVisitor(archetype: Archetype): Visitor {
  const device = pickWeighted(archetype.devices);
  return {
    visitor_id: `v_${randomUUID().slice(0, 8)}`,
    archetype: archetype.id,
    device,
    device_profile: pick(DEVICE_PROFILES[device]),
    first_seen: new Date().toISOString(),
    last_seen: null,
    visits: 0,
    purchases: 0,
    client_id: null,
  };
}

// ─── Session plan ──────────────────────────────────────────────────────

type SessionPlan = {
  visitor: Visitor;
  archetype: Archetype;
  isNew: boolean;
  source: SourceType;
  creative: number | null;
  landingUrl: string;
  referrer: string | undefined;
};

function localHour(): number {
  return Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TIMEZONE }).format(new Date()));
}

function lineSlug(line: Line) {
  return line.toLowerCase();
}

function productFor(line: Line | null) {
  const pool = line ? products.filter((p) => p.line === line) : products;
  return pick(pool);
}

function planSession(visitors: Visitor[], hour: number): SessionPlan {
  const weights = Object.fromEntries(archetypes.map((a) => [a.id, archetypeWeight(a, hour)]));
  const archetypeId = pickWeighted(weights);
  const archetype = archetypes.find((a) => a.id === archetypeId)!;

  const pool = visitors.filter((v) => v.archetype === archetype.id);
  const returning = pool.length > 0 && chance(archetype.pReturning);
  const visitor = returning ? pick(pool) : newVisitor(archetype);

  // Returning visitors often come straight back (bookmark, typed URL).
  const source: SourceType = returning && chance(0.4) ? "direct" : pickWeighted(archetype.sources);
  const line = archetype.line ?? pick<Line>(["Classic", "Performance", "Street"]);

  let landingPath = "/";
  let query = "";
  let referrer: string | undefined;
  let creative: number | null = null;

  switch (source) {
    case "direct":
      landingPath = "/";
      break;
    case "organic_google":
      referrer = "https://www.google.com/";
      landingPath = pick(["/", `/shop/${lineSlug(line)}`, `/products/${productFor(archetype.line).slug}`]);
      break;
    case "instagram":
      referrer = "https://l.instagram.com/";
      landingPath = chance(0.6) ? `/products/${productFor(archetype.line).slug}` : `/shop/${lineSlug(line)}`;
      break;
    case "meta_paid":
      creative = pick(archetype.creatives);
      query = `?utm_source=meta&utm_medium=paid_social&utm_campaign=${CAMPAIGNS.meta}&utm_content=creative_${creative}`;
      landingPath = chance(0.5) ? `/products/${productFor(archetype.line).slug}` : `/shop/${lineSlug(line)}`;
      break;
    case "email":
      query = `?utm_source=newsletter&utm_medium=email&utm_campaign=${CAMPAIGNS.email}`;
      landingPath = chance(0.5) ? "/" : `/shop/${lineSlug(line)}`;
      break;
  }

  return { visitor, archetype, isNew: !returning, source, creative, landingUrl: BASE_URL + landingPath + query, referrer };
}

// ─── Ground-truth log ──────────────────────────────────────────────────

type Action = { t: string; type: string; path?: string; item_id?: string; size?: string; quantity?: number };

type SessionLog = {
  session_key: string;
  visitor_id: string;
  archetype: string;
  visit_number: number;
  is_new_visitor: boolean;
  device: Device;
  device_profile: string;
  source: SourceType;
  creative: number | null;
  landing_url: string;
  referrer: string | null;
  started_at: string;
  ended_at: string;
  client_id: string | null;
  outcome: "bounce" | "browse" | "add_to_cart" | "checkout" | "purchase" | "error";
  transaction_id: string | null;
  value: number | null;
  actions: Action[];
  error?: string;
};

function writeLog(entry: SessionLog) {
  const file = path.join(logDir, `${entry.started_at.slice(0, 10)}.jsonl`);
  appendFileSync(file, JSON.stringify(entry) + "\n");
}

// ─── Browser actions ───────────────────────────────────────────────────

const slugToProduct = new Map(products.map((p) => [p.slug, p]));

async function dwell(page: Page, range: [number, number]) {
  const seconds = range[0] + Math.random() * (range[1] - range[0]);
  await page.waitForTimeout(seconds * 1000 * DWELL_SCALE);
}

/** Click a link and wait for the client-side navigation to land. */
async function navigate(page: Page, link: ReturnType<Page["locator"]>) {
  const before = page.url();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForURL((url) => url.toString() !== before, { timeout: 15_000 });
  await page.waitForLoadState("domcontentloaded");
}

const currentPath = (page: Page) => new URL(page.url()).pathname + new URL(page.url()).search;

async function openLine(page: Page, line: Line) {
  // Clicking the line you're already on wouldn't navigate — pick another line.
  const target = currentPath(page) === `/shop/${lineSlug(line)}`
    ? pick((["Classic", "Performance", "Street"] as Line[]).filter((l) => l !== line))
    : line;
  const link = page.locator(`a[href="/shop/${lineSlug(target)}"]`).filter({ visible: true }).first();
  await navigate(page, link);
}

async function openProduct(page: Page, preferLine: Line | null) {
  // Exclude the page we're on (its own colorway swatch links here too).
  const here = new URL(page.url()).pathname;
  const hrefs = await page.locator('main a[href^="/products/"]').evaluateAll(
    (els, current) => els.map((e) => e.getAttribute("href")!).filter((h) => h && h !== current),
    here,
  );
  if (hrefs.length === 0) return false;
  const preferred = preferLine ? hrefs.filter((h) => slugToProduct.get(h.split("/")[2])?.line === preferLine) : [];
  const href = pick(preferred.length > 0 && chance(0.8) ? preferred : hrefs);
  await navigate(page, page.locator(`main a[href="${href}"]`).first());
  return true;
}

async function switchColorway(page: Page) {
  const others = page.locator('ul[aria-label="Colorways"] a:not([aria-current])');
  const n = await others.count();
  if (n === 0) return false;
  await navigate(page, others.nth(randInt(0, n - 1)));
  return true;
}

async function applyFilter(page: Page) {
  const chips = page.locator('nav[aria-label="Filter by type"] a:not([aria-current])');
  const n = await chips.count();
  if (n === 0) return false;
  await navigate(page, chips.nth(randInt(0, n - 1)));
  return true;
}

async function addToCart(page: Page): Promise<Omit<Action, "t" | "type"> | null> {
  if (!page.url().includes("/products/")) return null;
  const sizes = page.locator("fieldset button");
  let size: string | undefined;
  const n = await sizes.count();
  if (n > 0) {
    const button = sizes.nth(randInt(0, n - 1));
    size = (await button.textContent())?.trim();
    await button.click();
  }
  let quantity = 1;
  if (chance(0.1)) {
    await page.getByRole("button", { name: "Increase quantity" }).click();
    quantity = 2;
  }
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("status").filter({ hasText: "Added to your cart" }).waitFor({ timeout: 10_000 });
  const slug = new URL(page.url()).pathname.split("/")[2];
  return { item_id: slugToProduct.get(slug)?.id, size, quantity };
}

async function cartCount(page: Page): Promise<number> {
  const label = await page.locator('header a[href="/cart"]').first().getAttribute("aria-label");
  return Number(label?.match(/\d+/)?.[0] ?? 0);
}

const FIRST_NAMES = ["Ana", "James", "Maria", "David", "Linda", "Kevin", "Sofia", "Robert", "Emma", "Luis", "Grace", "Tyler"];
const LAST_NAMES = ["Smith", "Garcia", "Johnson", "Lee", "Brown", "Martinez", "Davis", "Wilson", "Clark", "Lopez"];
const CITIES = [
  ["Boston", "02116"], ["Chicago", "60614"], ["Austin", "78701"], ["Denver", "80202"],
  ["Seattle", "98101"], ["Miami", "33130"], ["Portland", "97205"], ["Atlanta", "30303"],
];

async function placeOrder(page: Page) {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const [city, zip] = pick(CITIES);
  await page.fill("#name", `${first} ${last}`);
  await page.fill("#email", `${first}.${last}.${randInt(100, 999)}@example.com`.toLowerCase());
  await page.fill("#street", `${randInt(10, 999)} ${pick(["Oak", "Maple", "Pine", "Cedar", "Elm"])} St`);
  await page.fill("#city", city);
  await page.fill("#postalCode", zip);
  await page.getByRole("button", { name: /Place order/ }).click();
  await page.waitForURL("**/checkout/confirmation", { timeout: 20_000 });
  await page.getByRole("heading", { name: /^Thank you/ }).waitFor({ timeout: 10_000 });
  const order = await page.evaluate(() => JSON.parse(sessionStorage.getItem("verdian_last_order") ?? "null"));
  return order ? { transaction_id: order.id as string, value: order.total as number } : null;
}

/** GA4 client_id from the _ga cookie ("GA1.1.123456789.1700000000" → "123456789.1700000000"). */
async function readClientId(page: Page): Promise<string | null> {
  const cookies = await page.context().cookies();
  const ga = cookies.find((c) => c.name === "_ga");
  return ga ? ga.value.split(".").slice(2).join(".") : null;
}

// ─── One session ───────────────────────────────────────────────────────

async function runSession(browser: Browser, plan: SessionPlan): Promise<SessionLog> {
  const { visitor, archetype } = plan;
  const storage = profilePath(visitor);
  const context = await browser.newContext({
    ...devices[visitor.device_profile],
    storageState: existsSync(storage) ? storage : undefined,
    timezoneId: TIMEZONE,
    locale: "en-US",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);

  const actions: Action[] = [];
  const log = (type: string, extra: Omit<Action, "t" | "type"> = {}) =>
    actions.push({ t: new Date().toISOString(), type, path: currentPath(page), ...extra });

  const entry: SessionLog = {
    session_key: randomUUID(),
    visitor_id: visitor.visitor_id,
    archetype: archetype.id,
    visit_number: visitor.visits + 1,
    is_new_visitor: plan.isNew,
    device: visitor.device,
    device_profile: visitor.device_profile,
    source: plan.source,
    creative: plan.creative,
    landing_url: plan.landingUrl,
    referrer: plan.referrer ?? null,
    started_at: new Date().toISOString(),
    ended_at: "",
    client_id: null,
    outcome: "bounce",
    transaction_id: null,
    value: null,
    actions,
  };

  const boost = visitor.visits >= 1 ? archetype.returningBoost : 1;

  try {
    await page.goto(plan.landingUrl, { referer: plan.referrer, waitUntil: "domcontentloaded" });
    log("land");
    await dwell(page, archetype.dwell);

    // Browse
    const pages = randInt(archetype.pages[0], archetype.pages[1]);
    if (pages > 0) entry.outcome = "browse";
    for (let i = 0; i < pages; i++) {
      const onProduct = page.url().includes("/products/");
      const onShop = page.url().includes("/shop/");
      const step = pickWeighted({
        product: 0.5,
        line: 0.2,
        colorway: onProduct ? 0.15 : 0,
        filter: onShop ? 0.15 : 0,
      });
      let done: string | null = null;
      if (step === "product" && (await openProduct(page, archetype.line))) done = "open_product";
      if (step === "colorway" && (await switchColorway(page))) done = "switch_colorway";
      if (step === "filter" && (await applyFilter(page))) done = "apply_filter";
      if (!done) {
        await openLine(page, archetype.line ?? pick<Line>(["Classic", "Performance", "Street"]));
        done = "open_line";
      }
      log(done);
      await dwell(page, archetype.dwell);
    }

    // Add to cart (open a product first if needed)
    if (pages > 0 && chance(ALWAYS_BUY ? 1 : Math.min(1, archetype.pAddToCart * boost))) {
      if (!page.url().includes("/products/")) {
        if (!(await openProduct(page, archetype.line))) await openLine(page, archetype.line ?? "Classic");
        if (!page.url().includes("/products/")) await openProduct(page, archetype.line);
        log("open_product");
        await dwell(page, archetype.dwell);
      }
      const added = await addToCart(page);
      if (added) {
        log("add_to_cart", added);
        entry.outcome = "add_to_cart";
        await dwell(page, [2, 6]);
      }
    }

    // Checkout — also possible for returning visitors whose cart kept items
    if (pages > 0 && (await cartCount(page)) > 0 && chance(ALWAYS_BUY ? 1 : Math.min(1, archetype.pCheckout * boost))) {
      await navigate(page, page.locator('header a[href="/cart"]').first());
      log("view_cart");
      await dwell(page, [3, 10]);
      await navigate(page, page.locator('main a[href="/checkout"]').first());
      log("begin_checkout");
      entry.outcome = "checkout";
      await dwell(page, [5, 15]);

      if (chance(ALWAYS_BUY ? 1 : Math.min(1, archetype.pPurchase * boost))) {
        const order = await placeOrder(page);
        if (order) {
          log("purchase");
          entry.outcome = "purchase";
          entry.transaction_id = order.transaction_id;
          entry.value = order.value;
          visitor.purchases += 1;
          await dwell(page, [3, 8]);
        }
      } else {
        log("abandon_checkout");
      }
    }
    log("leave");
  } catch (err) {
    entry.outcome = "error";
    entry.error = err instanceof Error ? err.message.split("\n")[0] : String(err);
  } finally {
    entry.client_id = await readClientId(page).catch(() => null);
    entry.ended_at = new Date().toISOString();
    visitor.visits += 1;
    visitor.last_seen = entry.ended_at;
    visitor.client_id = entry.client_id ?? visitor.client_id;
    await context.storageState({ path: storage }).catch(() => {});
    await context.close();
  }
  return entry;
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(profileDir, { recursive: true });
  mkdirSync(logDir, { recursive: true });

  const hour = localHour();
  const sessions = Number(option("sessions") ?? Math.max(1, Math.round(BASE_SESSIONS_PER_RUN * hourlyTraffic[hour] * (0.7 + Math.random() * 0.6))));
  const visitors = loadVisitors();
  console.log(`${sessions} sessions → ${BASE_URL} (local hour ${hour}, ${TIMEZONE}); ${visitors.length} known visitors`);

  // Plan every session first so two parallel sessions never share a visitor.
  const plans: SessionPlan[] = [];
  const busy = new Set<string>();
  for (let i = 0; i < sessions; i++) {
    let plan = planSession(visitors, hour);
    for (let tries = 0; busy.has(plan.visitor.visitor_id) && tries < 5; tries++) plan = planSession(visitors, hour);
    if (busy.has(plan.visitor.visitor_id)) continue;
    busy.add(plan.visitor.visitor_id);
    if (plan.isNew) visitors.push(plan.visitor);
    plans.push(plan);
  }

  const browser = await chromium.launch({ headless: !HEADED });
  const queue = [...plans];
  const worker = async () => {
    for (let plan = queue.shift(); plan; plan = queue.shift()) {
      const current = plan;
      const result = await Promise.race([
        runSession(browser, current),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), SESSION_TIMEOUT_MS)),
      ]);
      if (!result) {
        console.log(`  ${current.visitor.visitor_id} timed out`);
        continue;
      }
      writeLog(result);
      console.log(
        `  ${result.visitor_id} ${result.archetype.padEnd(14)} visit ${result.visit_number} ${result.device.padEnd(7)} ${result.source.padEnd(14)} → ${result.outcome}${result.value ? ` $${result.value}` : ""}${result.error ? ` (${result.error})` : ""}`,
      );
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, plans.length) }, worker));
  await browser.close();
  saveVisitors(visitors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
