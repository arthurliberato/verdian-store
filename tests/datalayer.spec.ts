import { expect, test, type Page } from "@playwright/test";

// The data layer must match docs/tracking/TRACKING_PLAN.md. Each test walks part of a shopping
// journey and checks the exact pushes; checkPlanRules then checks the rules every push must follow.

type Entry = Record<string, unknown> & { event?: string; ecommerce?: Ecommerce | null };
type Item = Record<string, unknown> & { item_id: string; price: number; quantity: number };
type Ecommerce = Record<string, unknown> & { currency?: string; value?: number; items?: Item[] };

const ITEM_FIELDS = [
  "item_id", "item_name", "item_brand", "item_category", "item_category2", "item_category3",
  "item_category4", "item_variant", "price", "quantity", "is_markdown",
];

async function dataLayer(page: Page): Promise<Entry[]> {
  return page.evaluate(() => (window.dataLayer ?? []) as Record<string, unknown>[]);
}

// Store events only: GTM's own pushes and the ecommerce clears are left out.
async function events(page: Page): Promise<Entry[]> {
  return (await dataLayer(page)).filter((e) => typeof e.event === "string" && !e.event.startsWith("gtm."));
}

async function names(page: Page) {
  return (await events(page)).map((e) => e.event);
}

async function last(page: Page, name: string): Promise<Entry> {
  await expect.poll(() => names(page)).toContain(name);
  return (await events(page)).filter((e) => e.event === name).at(-1)!;
}

// The rules of §1 and §4, checked on everything pushed so far.
async function checkPlanRules(page: Page) {
  const entries = await dataLayer(page);
  expect(JSON.stringify(entries), "no email addresses in the data layer").not.toContain("@");
  const store = entries.filter((e) => typeof e.event === "string" && !e.event.startsWith("gtm."));
  expect(store[0]?.event, "page_view is the first event").toBe("page_view");
  entries.forEach((entry, i) => {
    if (!entry.event || !entry.ecommerce) return;
    const label = `${entry.event} (#${i})`;
    expect(entries[i - 1], `${label} is preceded by { ecommerce: null }`).toEqual({ ecommerce: null });
    const { currency, value, items = [] } = entry.ecommerce;
    expect(currency, `${label} currency`).toBe("USD");
    expect(items.length, `${label} has items`).toBeGreaterThan(0);
    const total = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    expect(value, `${label} value = Σ price × quantity`).toBe(total);
    for (const item of items) {
      for (const field of ITEM_FIELDS) expect(item, `${label} item ${item.item_id} has ${field}`).toHaveProperty(field);
      expect(item.item_brand).toBe("Verdian");
      expect(Number.isInteger(item.quantity) && item.quantity >= 1, `${label} quantity`).toBe(true);
    }
  });
}

test("home: page_view, promotions and the featured list", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => names(page)).toEqual([
    "page_view", "view_promotion", "view_promotion", "view_promotion", "view_promotion", "view_item_list",
  ]);
  const [pageView, ...rest] = await events(page);
  expect(pageView).toMatchObject({ page_type: "home", page_path: "/" });
  expect(rest.slice(0, 4).map((e) => e.ecommerce?.creative_slot)).toEqual(["home_hero", "home_lines_1", "home_lines_2", "home_lines_3"]);
  const list = rest[4].ecommerce!;
  expect(list).toMatchObject({ item_list_id: "home_featured", item_list_name: "Home — Featured" });
  expect(list.items!.map((i) => i.index)).toEqual(list.items!.map((_, i) => i + 1));
  await checkPlanRules(page);
});

test("hero click: select_promotion, then the product page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Shop Arco/ }).click();
  await expect(page).toHaveURL(/\/products\//);
  expect(await last(page, "select_promotion")).toMatchObject({
    promotion_link: "button",
    ecommerce: { promotion_id: "arco_flagship", creative_slot: "home_hero" },
  });
  const after = (await names(page)).slice((await names(page)).indexOf("select_promotion") + 1);
  await expect.poll(async () => (await names(page)).slice(-3)).toEqual(["page_view", "view_item", "view_item_list"]);
  expect(after[0]).toBe("page_view");
  expect(await last(page, "page_view")).toMatchObject({ page_type: "product" });
  await checkPlanRules(page);
});

test("product page: sizes, add to cart and colorways", async ({ page }) => {
  await page.goto("/products/arco-chalk-forest");
  expect((await last(page, "view_item")).ecommerce!.items![0]).toMatchObject({
    item_id: "VRD-ARC-CHALK-FOREST", item_category: "footwear", item_category2: "Classic",
    item_category4: "Arco", item_variant: "Chalk Forest", quantity: 1, is_markdown: false,
  });
  const sizes = page.locator("fieldset button");
  await sizes.nth(2).click();
  await sizes.nth(2).click(); // same size again: no new event
  await sizes.nth(4).click();
  await expect.poll(async () => (await names(page)).filter((n) => n === "select_size").length).toBe(2);
  const size = await sizes.nth(4).innerText();
  expect(await last(page, "select_size")).toMatchObject({
    product_id: "VRD-ARC-CHALK-FOREST", product_model: "Arco", product_size: size, in_stock: true,
  });
  expect((await last(page, "select_size")).ecommerce, "select_size is not an ecommerce event").toBeUndefined();

  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  const added = await last(page, "add_to_cart");
  expect(added).toMatchObject({ cart_location: "product_page", ecommerce: { value: 280 } });
  expect(added.ecommerce!.items![0]).toMatchObject({ item_size: size, quantity: 2 });

  await page.locator('ul[aria-label="Colorways"] a:not([aria-current])').first().click();
  await expect.poll(async () => (await names(page)).slice(-3)).toEqual(["page_view", "view_item", "view_item_list"]);
  const swatch = await last(page, "select_item");
  expect(swatch.ecommerce).toMatchObject({ item_list_id: "pdp_colorways", item_list_name: "Other colorways" });
  expect(swatch.ecommerce!.items![0].index).toBeGreaterThan(0);
  await checkPlanRules(page);
});

test("line page: list with filter, select_item with position", async ({ page }) => {
  await page.goto("/shop/street?type=Eco+Capsule");
  const filtered = await last(page, "view_item_list");
  expect(filtered).toMatchObject({ list_filter: "Eco Capsule", ecommerce: { item_list_id: "line_street", item_list_name: "Street line" } });
  await page.locator('nav[aria-label="Filter by type"] a').first().click();
  await expect.poll(async () => (await events(page)).filter((e) => e.event === "view_item_list").length).toBe(2);
  expect(await last(page, "view_item_list")).toMatchObject({ list_filter: "all" });
  expect((await events(page)).at(-2)?.event, "the filter change is a page_view first").toBe("page_view");
  await page.locator('a.group[href^="/products/"]').nth(2).click();
  await expect(page).toHaveURL(/\/products\//);
  expect((await last(page, "select_item")).ecommerce!.items![0]).toMatchObject({ index: 3, item_list_id: "line_street" });
  await checkPlanRules(page);
});

// Seeds the stored cart before any page script runs, once per test: the store saves its own
// cart on load, so seeding after a page has loaded can be overwritten.
async function cartWithTwoLines(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("test_cart_seeded")) return;
    sessionStorage.setItem("test_cart_seeded", "1");
    localStorage.setItem(
      "verdian_cart",
      JSON.stringify([
        { productId: "VRD-ARC-CHALK-FOREST", size: "9", quantity: 1 },
        { productId: "VRD-ARC-CHALK", size: "10", quantity: 2 },
      ]),
    );
  });
}

test("cart: view_cart and edits", async ({ page }) => {
  await cartWithTwoLines(page);
  await page.goto("/cart");
  const viewed = await last(page, "view_cart");
  expect(viewed.ecommerce).toMatchObject({ value: 420 });
  expect(viewed.ecommerce!.items!.map((i) => [i.item_id, i.item_size, i.quantity])).toEqual([
    ["VRD-ARC-CHALK-FOREST", "9", 1],
    ["VRD-ARC-CHALK", "10", 2],
  ]);
  await page.getByRole("button", { name: /Increase quantity of/ }).first().click();
  expect(await last(page, "add_to_cart")).toMatchObject({ cart_location: "cart", ecommerce: { value: 140 } });
  await page.getByRole("button", { name: /Decrease quantity of/ }).first().click();
  expect((await last(page, "remove_from_cart")).ecommerce!.items![0]).toMatchObject({ quantity: 1, item_size: "9" });
  await page.getByRole("button", { name: "Remove" }).last().click();
  await expect.poll(async () => (await names(page)).filter((n) => n === "remove_from_cart").length).toBe(2);
  expect((await last(page, "remove_from_cart")).ecommerce!.items![0]).toMatchObject({ item_id: "VRD-ARC-CHALK", quantity: 2 });
  await checkPlanRules(page);
});

test("empty cart: no view_cart", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  expect(await names(page)).toEqual(["page_view"]);
  expect(await last(page, "page_view")).toMatchObject({ page_type: "cart" });
});

test("checkout: errors, shipping, payment and one purchase", async ({ page }) => {
  await cartWithTwoLines(page);
  await page.goto("/checkout");
  expect((await last(page, "begin_checkout")).ecommerce).toMatchObject({ value: 420 });

  await page.getByRole("button", { name: /Place order/ }).click();
  await expect.poll(async () => (await names(page)).filter((n) => n === "checkout_error").length).toBe(5);
  expect((await events(page)).filter((e) => e.event === "checkout_error").map((e) => e.checkout_field)).toEqual([
    "name", "email", "street", "city", "postal_code",
  ]);
  await page.fill("#name", "Test Person");
  await page.fill("#email", "not-an-email");
  await page.getByRole("button", { name: /Place order/ }).click();
  expect(await last(page, "checkout_error")).toMatchObject({ checkout_field: "postal_code", error_reason: "missing" });
  expect((await events(page)).some((e) => e.checkout_field === "email" && e.error_reason === "invalid")).toBe(true);

  await page.fill("#email", "test@example.com");
  await page.fill("#street", "1 Main St");
  await page.fill("#city", "Springfield");
  expect(await names(page)).not.toContain("add_shipping_info");
  await page.fill("#postalCode", "12345");
  expect(await last(page, "add_shipping_info")).toMatchObject({ ecommerce: { shipping_tier: "free_standard", value: 420 } });
  await page.fill("#city", "Shelbyville");
  expect((await names(page)).filter((n) => n === "add_shipping_info"), "add_shipping_info once per checkout").toHaveLength(1);

  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("heading", { name: /^Thank you/ })).toBeVisible();
  expect(await last(page, "add_payment_info")).toMatchObject({ ecommerce: { payment_type: "demo", value: 420 } });
  const purchase = await last(page, "purchase");
  expect(purchase.ecommerce).toMatchObject({ value: 420, shipping: 0, tax: 0 });
  expect(String(purchase.ecommerce!.transaction_id)).toMatch(/^VRD-/);
  expect(purchase.ecommerce!.items!.map((i) => i.item_size)).toEqual(["9", "10"]);
  expect(await last(page, "page_view")).toMatchObject({ page_type: "confirmation" });
  await checkPlanRules(page);

  await page.reload();
  await expect(page.getByRole("heading", { name: /^Thank you/ })).toBeVisible();
  expect(await names(page), "purchase is not sent again on reload").not.toContain("purchase");
});

test("newsletter: signup_location, never the address", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Email address").fill("someone@example.com");
  await page.getByRole("button", { name: "Sign up" }).click();
  expect(await last(page, "newsletter_signup")).toEqual({ event: "newsletter_signup", signup_location: "footer" });
  await checkPlanRules(page);
});

test("404: page_type not_found, even on a product URL", async ({ page }) => {
  await page.goto("/products/no-such-shoe");
  await expect(page.getByRole("heading", { name: /couldn.t find that page/ })).toBeVisible();
  expect(await last(page, "page_view")).toMatchObject({ page_type: "not_found", page_path: "/products/no-such-shoe" });
  expect(await names(page)).toEqual(["page_view"]);
});
