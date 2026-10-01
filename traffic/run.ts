// Scripted visitor generator for the Verdian store.
//
//   npm run traffic                    # visits the live store; volume from the acquisition model
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
// Volume, channel mix and campaign names follow the marketing plan's
// acquisition model (traffic/volume.ts → hub/content/acquisition.ts): each
// run sends the sessions the model expects for the time since the last run.
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
  pick,
  pickWeighted,
  randInt,
  type Archetype,
  type Device,
  type SourceType,
} from "./archetypes";
import { creativeLanding, emailCampaign, metaCampaign, sessionsForWindow, sourceWeights } from "./volume";

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
const MAX_VISITORS = 800;
const SESSION_TIMEOUT_MS = 4 * 60_000;

const DEVICE_PROFILES: Record<Device, string[]> = {
  desktop: ["Desktop Chrome", "Desktop Edge", "Desktop Safari"],
  tablet: ["iPad (gen 7)", "Galaxy Tab S4"],
  mobile: ["iPhone 13", "iPhone 12", "Pixel 5", "Galaxy S9+"],
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
const lastRunFile = path.join(STATE_DIR, "last-run.json");
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
  campaign: string | null;
  landingUrl: string;
  referrer: string | undefined;
};

function localHour(date = new Date()): number {
  return Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TIMEZONE }).format(date));
}

function localWeekday(date = new Date()): number {
  const name = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TIMEZONE }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

function lineSlug(line: Line) {
  return line.toLowerCase();
}

function productFor(line: Line | null) {
  const pool = line ? products.filter((p) => p.line === line) : products;
  return pick(pool);
}

function creativeProduct(creative: number) {
  const target = creativeLanding[creative];
  const pool = products.filter((p) => p.model === target.model && (!target.colorway || p.colorway === target.colorway));
  return pick(pool.length > 0 ? pool : products);
}

function planSession(visitors: Visitor[], hour: number, now: Date): SessionPlan {
  // Channel first, from the acquisition model's mix for today; then the kind
  // of person that channel brings.
  const source = pickWeighted(sourceWeights(now, localWeekday(now)));
  const weights = Object.fromEntries(archetypes.map((a) => [a.id, archetypeWeight(a, hour) * (a.sources[source] ?? 0)]));
  const anyone = Object.values(weights).every((w) => w === 0);
  const archetypeId = pickWeighted(anyone ? Object.fromEntries(archetypes.map((a) => [a.id, archetypeWeight(a, hour)])) : weights);
  const archetype = archetypes.find((a) => a.id === archetypeId)!;

  // Direct and newsletter visits are mostly people who've been here before.
  const pool = visitors.filter((v) => v.archetype === archetype.id);
  const pReturning = source === "direct" || source === "email" ? Math.min(0.9, archetype.pReturning * 2) : archetype.pReturning;
  const returning = pool.length > 0 && chance(pReturning);
  const visitor = returning ? pick(pool) : newVisitor(archetype);
  const line = archetype.line ?? pick<Line>(["Classic", "Performance", "Street"]);

  let landingPath = "/";
  let query = "";
  let referrer: string | undefined;
  let creative: number | null = null;
  let campaign: string | null = null;

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
    case "meta_paid": {
      creative = pick(archetype.creatives);
      const meta = metaCampaign(now);
      campaign = meta.campaign;
      // Each creative lands on the product it shows, sometimes on its line page.
      const product = creativeProduct(creative);
      landingPath = chance(0.7) ? `/products/${product.slug}` : `/shop/${lineSlug(product.line)}`;
      query = `?utm_source=meta&utm_medium=paid_social&utm_campaign=${campaign}&utm_content=creative_${creative}&utm_term=${meta.term(archetype.id)}`;
      break;
    }
    case "email":
      campaign = emailCampaign(now);
      query = `?utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}&utm_content=${pick(["hero", "product_grid"])}`;
      landingPath = chance(0.5) ? "/" : `/shop/${lineSlug(line)}`;
      break;
  }

  return { visitor, archetype, isNew: !returning, source, creative, campaign, landingUrl: BASE_URL + landingPath + query, referrer };
}

// ─── Ground-truth log ──────────────────────────────────────────────────

type Action = {
  t: string;
  type: string;
  path?: string;
  item_id?: string;
  size?: string;
  quantity?: number;
  /** Product list clicked from (home_featured, line_{slug}, pdp_related) and position from 1. */
  list?: string;
  index?: number;
  /** Promotion clicked (promotion_id). */
  promotion?: string;
  /** Checkout field that failed, and why. */
  field?: string;
  reason?: string;
  /** How far an abandoned checkout got: "contact" or "shipping". */
  stage?: string;
};
type Logger = (type: string, extra?: Omit<Action, "t" | "type">) => void;

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
  campaign: string | null;
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

/** The product list a grid on this page is (docs/tracking/TRACKING_PLAN.md). */
function listFor(pathname: string): string | undefined {
  if (pathname === "/") return "home_featured";
  if (pathname.startsWith("/shop/")) return `line_${pathname.split("/")[2]}`;
  if (pathname.startsWith("/products/")) return "pdp_related";
  return undefined;
}

/** Opens a product from a link on the page; returns what was clicked (list position or promotion). */
async function openProduct(page: Page, preferLine: Line | null): Promise<Omit<Action, "t" | "type"> | null> {
  // Exclude the page we're on (its own colorway swatch links here too).
  const here = new URL(page.url()).pathname;
  const hrefs = await page.locator('main a[href^="/products/"]').evaluateAll(
    (els, current) => els.map((e) => e.getAttribute("href")!).filter((h) => h && h !== current),
    here,
  );
  if (hrefs.length === 0) return null;
  const preferred = preferLine ? hrefs.filter((h) => slugToProduct.get(h.split("/")[2])?.line === preferLine) : [];
  const href = pick(preferred.length > 0 && chance(0.8) ? preferred : hrefs);
  const link = page.locator(`main a[href="${href}"]`).first();
  const clicked = await link.evaluate((a) => {
    const promotion = a.getAttribute("data-promotion");
    if (promotion) return { promotion };
    if (!a.classList.contains("group")) return {};
    const cards = Array.from(a.closest("div.grid")?.querySelectorAll(":scope > a.group") ?? []);
    return { index: cards.indexOf(a) + 1 };
  });
  const list = clicked.index ? listFor(here) : undefined;
  await navigate(page, link);
  return { item_id: slugToProduct.get(href.split("/")[2])?.id, ...clicked, ...(list ? { list } : {}) };
}

/** Clicks a promotion on the home page (hero or line tile). */
async function openPromotion(page: Page): Promise<string | null> {
  const links = page.locator("main a[data-promotion]");
  const n = await links.count();
  if (n === 0) return null;
  const link = links.nth(randInt(0, n - 1));
  const promotion = await link.getAttribute("data-promotion");
  await navigate(page, link);
  return promotion;
}

/** Clicks a size button without adding to cart: size demand that doesn't convert. */
async function trySize(page: Page): Promise<string | null> {
  const sizes = page.locator("fieldset button:not([aria-pressed='true'])");
  const n = await sizes.count();
  if (n === 0) return null;
  const button = sizes.nth(randInt(0, n - 1));
  const size = (await button.textContent())?.trim() ?? null;
  await button.click();
  return size;
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

async function addToCart(page: Page, log: Logger): Promise<Omit<Action, "t" | "type"> | null> {
  if (!page.url().includes("/products/")) return null;
  // Some visitors try a size or two before settling.
  const tries = chance(0.35) ? randInt(1, 2) : 0;
  for (let i = 0; i < tries; i++) {
    const tried = await trySize(page);
    if (tried) log("select_size", { size: tried });
    await page.waitForTimeout(randInt(800, 2500) * DWELL_SCALE);
  }
  const sizes = page.locator("fieldset button");
  let size: string | undefined;
  const n = await sizes.count();
  if (n > 0) {
    const button = sizes.nth(randInt(0, n - 1));
    size = (await button.textContent())?.trim();
    if ((await button.getAttribute("aria-pressed")) !== "true") log("select_size", { size });
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

type Shopper = { first: string; last: string; city: string; zip: string };

function newShopper(): Shopper {
  const [city, zip] = pick(CITIES);
  return { first: pick(FIRST_NAMES), last: pick(LAST_NAMES), city, zip };
}

const emailOf = (s: Shopper) => `${s.first}.${s.last}.${randInt(100, 999)}@example.com`.toLowerCase();

async function fillContact(page: Page, s: Shopper) {
  await page.fill("#name", `${s.first} ${s.last}`);
  await page.waitForTimeout(randInt(1000, 3000) * DWELL_SCALE);
  await page.fill("#email", emailOf(s));
}

async function fillShipping(page: Page, s: Shopper) {
  await page.fill("#street", `${randInt(10, 999)} ${pick(["Oak", "Maple", "Pine", "Cedar", "Elm"])} St`);
  await page.waitForTimeout(randInt(1000, 3000) * DWELL_SCALE);
  await page.fill("#city", s.city);
  await page.fill("#postalCode", s.zip);
}

/** Clicks "Place order" while the form is incomplete; logs the fields the browser rejects. */
async function submitTooEarly(page: Page, log: Logger) {
  const invalid = await page.locator("form[aria-label='Checkout'] :is(input, select):invalid").evaluateAll((els) =>
    els.map((e) => {
      const input = e as HTMLInputElement;
      return { field: input.name, reason: input.validity.valueMissing ? "missing" : "invalid" };
    }),
  );
  await page.getByRole("button", { name: /Place order/ }).click();
  for (const f of invalid) log("checkout_error", { field: f.field === "postalCode" ? "postal_code" : f.field, reason: f.reason });
}

/** Fills checkout step by step, sometimes with mistakes first, and places the order. */
async function placeOrder(page: Page, log: Logger) {
  const shopper = newShopper();
  if (chance(0.06)) {
    // Typo in the email: the browser rejects it, the visitor fixes it.
    await page.fill("#name", `${shopper.first} ${shopper.last}`);
    await page.fill("#email", `${shopper.first}.${shopper.last}.example.com`.toLowerCase());
    await submitTooEarly(page, log);
    await page.waitForTimeout(randInt(2000, 5000) * DWELL_SCALE);
  }
  await fillContact(page, shopper);
  if (chance(0.12)) {
    // Tries to place the order before entering the address.
    await submitTooEarly(page, log);
    await page.waitForTimeout(randInt(2000, 5000) * DWELL_SCALE);
  }
  await fillShipping(page, shopper);
  await page.waitForTimeout(randInt(2000, 6000) * DWELL_SCALE);
  await page.getByRole("button", { name: /Place order/ }).click();
  await page.waitForURL("**/checkout/confirmation", { timeout: 20_000 });
  await page.getByRole("heading", { name: /^Thank you/ }).waitFor({ timeout: 10_000 });
  const order = await page.evaluate(() => JSON.parse(sessionStorage.getItem("verdian_last_order") ?? "null"));
  return order ? { transaction_id: order.id as string, value: order.total as number } : null;
}

/** Leaves checkout partway: after the contact details, or after a complete address. */
async function abandonCheckout(page: Page): Promise<string> {
  const shopper = newShopper();
  if (chance(0.5)) {
    if (chance(0.6)) await fillContact(page, shopper);
    return "contact";
  }
  await fillContact(page, shopper);
  await fillShipping(page, shopper);
  await page.waitForTimeout(randInt(3000, 10000) * DWELL_SCALE);
  return "shipping";
}

/** Sometimes changes the cart before checking out. Returns false if the cart ends up empty. */
async function editCart(page: Page, log: Logger): Promise<boolean> {
  const increase = page.getByRole("button", { name: /Increase quantity of/ });
  const decrease = page.getByRole("button", { name: /Decrease quantity of/ });
  const remove = page.getByRole("button", { name: "Remove" });
  if (chance(0.12) && (await increase.count()) > 0) {
    await increase.first().click();
    log("cart_increase");
    await page.waitForTimeout(randInt(1000, 3000) * DWELL_SCALE);
  }
  if (chance(0.08) && (await decrease.count()) > 0) {
    await decrease.first().click();
    log("cart_decrease");
    await page.waitForTimeout(randInt(1000, 3000) * DWELL_SCALE);
  }
  if (chance(0.1) && (await remove.count()) > 1) {
    await remove.last().click();
    log("cart_remove");
    await page.waitForTimeout(randInt(1000, 3000) * DWELL_SCALE);
  }
  return (await page.locator('main a[href="/checkout"]').count()) > 0;
}

/** Newsletter sign-up in the footer. The address is made up and never leaves the browser. */
async function signUpNewsletter(page: Page): Promise<boolean> {
  const input = page.getByPlaceholder("Email address");
  if ((await input.count()) === 0) return false;
  await input.scrollIntoViewIfNeeded();
  await input.fill(emailOf(newShopper()));
  await page.getByRole("button", { name: "Sign up" }).click();
  return true;
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
  const log: Logger = (type, extra = {}) =>
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
    campaign: plan.campaign,
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
      const onHome = new URL(page.url()).pathname === "/";
      const step = pickWeighted({
        product: 0.5,
        line: 0.2,
        promotion: onHome ? 0.25 : 0,
        colorway: onProduct ? 0.15 : 0,
        size: onProduct ? 0.12 : 0,
        filter: onShop ? 0.15 : 0,
      });
      let done: string | null = null;
      let extra: Omit<Action, "t" | "type"> = {};
      if (step === "product") {
        const opened = await openProduct(page, archetype.line);
        if (opened) [done, extra] = ["open_product", opened];
      }
      if (step === "promotion") {
        const promotion = await openPromotion(page);
        if (promotion) [done, extra] = ["select_promotion", { promotion }];
      }
      if (step === "colorway" && (await switchColorway(page))) done = "switch_colorway";
      if (step === "size") {
        const size = await trySize(page);
        if (size) [done, extra] = ["select_size", { size }];
      }
      if (step === "filter" && (await applyFilter(page))) done = "apply_filter";
      if (!done) {
        await openLine(page, archetype.line ?? pick<Line>(["Classic", "Performance", "Street"]));
        done = "open_line";
      }
      log(done, extra);
      await dwell(page, archetype.dwell);
    }

    // Add to cart (open a product first if needed)
    if (pages > 0 && chance(ALWAYS_BUY ? 1 : Math.min(1, archetype.pAddToCart * boost))) {
      if (!page.url().includes("/products/")) {
        let opened = await openProduct(page, archetype.line);
        if (!opened) await openLine(page, archetype.line ?? "Classic");
        if (!page.url().includes("/products/")) opened = await openProduct(page, archetype.line);
        log("open_product", opened ?? {});
        await dwell(page, archetype.dwell);
      }
      const added = await addToCart(page, log);
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
      const stillFull = await editCart(page, log);
      if (stillFull) {
        await navigate(page, page.locator('main a[href="/checkout"]').first());
        log("begin_checkout");
        entry.outcome = "checkout";
        await dwell(page, [5, 15]);

        if (chance(ALWAYS_BUY ? 1 : Math.min(1, archetype.pPurchase * boost))) {
          const order = await placeOrder(page, log);
          if (order) {
            log("purchase");
            entry.outcome = "purchase";
            entry.transaction_id = order.transaction_id;
            entry.value = order.value;
            visitor.purchases += 1;
            await dwell(page, [3, 8]);
          }
        } else {
          log("abandon_checkout", { stage: await abandonCheckout(page) });
        }
      }
    }

    // Newsletter: an occasional sign-up from people who aren't subscribers already.
    if (pages > 0 && plan.source !== "email" && chance(0.04) && (await signUpNewsletter(page))) log("newsletter_signup");
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

  const now = new Date();
  const hour = localHour(now);
  // Sessions for the time since the last run, as the acquisition model expects.
  const lastRun = existsSync(lastRunFile) ? new Date(JSON.parse(readFileSync(lastRunFile, "utf8")).at) : new Date(now.getTime() - 3_600_000);
  const sessions = Number(option("sessions") ?? sessionsForWindow(lastRun, now, localHour));
  const visitors = loadVisitors();
  const minutes = Math.round((now.getTime() - lastRun.getTime()) / 60_000);
  console.log(`${sessions} sessions → ${BASE_URL} (local hour ${hour}, ${TIMEZONE}; ${minutes} min since last run); ${visitors.length} known visitors`);
  if (!option("sessions")) writeFileSync(lastRunFile, JSON.stringify({ at: now.toISOString() }));

  // Plan every session first so two parallel sessions never share a visitor.
  const plans: SessionPlan[] = [];
  const busy = new Set<string>();
  for (let i = 0; i < sessions; i++) {
    let plan = planSession(visitors, hour, now);
    for (let tries = 0; busy.has(plan.visitor.visitor_id) && tries < 5; tries++) plan = planSession(visitors, hour, now);
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
