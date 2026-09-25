"use client";

// Three-step checkout. Each step maps to a GA4 recommended event:
//   (page load)          begin_checkout
//   1 Shipping → next    add_shipping_info  (shipping_tier)
//   2 Payment  → next    add_payment_info   (payment_type)
//   3 Review   → place   → /checkout/confirmation fires `purchase`

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { coupons, formatPrice, shippingOptions, type ShippingTier } from "@/lib/catalog";
import { CURRENCY, track, type GA4Item } from "@/lib/analytics";
import { useStore } from "@/lib/store";
import { LAST_ORDER_KEY, computeTotals, newTransactionId, type PlacedOrder } from "@/lib/order";
import { cartItems } from "./CartView";

const paymentMethods = [
  { id: "card", label: "Credit or debit card" },
  { id: "paypal", label: "PayPal" },
  { id: "apple_pay", label: "Apple Pay" },
] as const;

type Step = 1 | 2 | 3;

export function CheckoutView() {
  const router = useRouter();
  const { ready, cart, cartSubtotal, user, signIn, clearCart } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [shippingTier, setShippingTier] = useState<ShippingTier>("standard");
  const [paymentType, setPaymentType] = useState<string>("card");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const begun = useRef(false);

  const totals = computeTotals(cartSubtotal, shippingTier, coupon);

  function currentItems(): GA4Item[] {
    return cartItems(cart).map((i) => (coupon ? { ...i, coupon } : i));
  }

  function ecommerce(extra: Record<string, unknown> = {}) {
    return {
      currency: CURRENCY,
      value: totals.value,
      ...(coupon ? { coupon } : {}),
      ...extra,
      items: currentItems(),
    };
  }

  // Prefill for signed-in members.
  useEffect(() => {
    if (!user) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setEmail((e) => e || user.email);
    setFirstName((f) => f || user.firstName);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  // begin_checkout — once per visit to the checkout page.
  useEffect(() => {
    if (!ready || begun.current || cart.length === 0) return;
    begun.current = true;
    track("begin_checkout", { checkout_type: user ? "member" : "guest", ecommerce: ecommerce() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const valid = code in coupons;
    // Custom event: GA4 has no recommended "apply coupon" event.
    track("apply_coupon", { coupon: code, coupon_valid: valid });
    if (valid) {
      setCoupon(code);
      setCouponMessage(`${code} applied: ${Math.round(coupons[code] * 100)}% off`);
    } else {
      setCouponMessage("That code isn't valid.");
    }
  }

  async function submitShipping(e: React.FormEvent) {
    e.preventDefault();
    if (createAccount && !user) await signIn(email, firstName, "checkout");
    track("add_shipping_info", { ecommerce: ecommerce({ shipping_tier: shippingTier }) });
    setStep(2);
  }

  function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    track("add_payment_info", { ecommerce: ecommerce({ payment_type: paymentType }) });
    setStep(3);
  }

  function placeOrder() {
    setPlacing(true);
    const order: PlacedOrder = {
      transactionId: newTransactionId(),
      placedAt: new Date().toISOString(),
      email,
      firstName,
      userId: user?.userId ?? null,
      shippingTier,
      paymentType,
      coupon,
      totals,
      items: currentItems(),
    };
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {}
    clearCart();
    // `purchase` is fired by the confirmation page (see ConfirmationView).
    router.push("/checkout/confirmation");
  }

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">Loading…</div>;

  if (cart.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-black tracking-tight">Your bag is empty</h1>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-black px-7 py-3.5 font-semibold text-white">Start shopping</Link>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-forest";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
        <ol className="mt-6 flex gap-2 text-sm" aria-label="Checkout steps">
          {["Shipping", "Payment", "Review"].map((label, i) => (
            <li
              key={label}
              aria-current={step === i + 1 ? "step" : undefined}
              className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-black text-white" : step > i + 1 ? "bg-forest text-white" : "bg-stone-100"}`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <form onSubmit={submitShipping} className="mt-8 space-y-4" aria-label="Shipping details">
            <h2 className="text-xl font-bold">Contact</h2>
            <div>
              <label htmlFor="co-email" className="text-sm font-medium">Email</label>
              <input id="co-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            </div>
            {!user && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                Create a Verdian account for faster checkout next time
              </label>
            )}
            <h2 className="pt-4 text-xl font-bold">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-first" className="text-sm font-medium">First name</label>
                <input id="co-first" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="co-last" className="text-sm font-medium">Last name</label>
                <input id="co-last" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={input} />
              </div>
            </div>
            <div>
              <label htmlFor="co-address" className="text-sm font-medium">Address</label>
              <input id="co-address" required value={address} onChange={(e) => setAddress(e.target.value)} className={input} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-city" className="text-sm font-medium">City</label>
                <input id="co-city" required value={city} onChange={(e) => setCity(e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="co-zip" className="text-sm font-medium">ZIP code</label>
                <input id="co-zip" required value={zip} onChange={(e) => setZip(e.target.value)} className={input} />
              </div>
            </div>
            <fieldset className="pt-4">
              <legend className="text-xl font-bold">Delivery</legend>
              <div className="mt-3 space-y-2">
                {shippingOptions.map((o) => {
                  const price = computeTotals(cartSubtotal, o.id, coupon).shipping;
                  return (
                    <label key={o.id} className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${shippingTier === o.id ? "border-black" : "border-stone-300"}`}>
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={o.id} checked={shippingTier === o.id} onChange={() => setShippingTier(o.id)} />
                        {o.label}
                      </span>
                      <span className="font-medium">{price === 0 ? "Free" : formatPrice(price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <button type="submit" className="w-full rounded-full bg-black py-4 font-semibold text-white hover:bg-forest">Continue to payment</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitPayment} className="mt-8 space-y-4" aria-label="Payment method">
            <fieldset>
              <legend className="text-xl font-bold">Payment method</legend>
              <p className="mt-1 text-sm text-stone-500">Demo store: no payment details are collected.</p>
              <div className="mt-3 space-y-2">
                {paymentMethods.map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${paymentType === m.id ? "border-black" : "border-stone-300"}`}>
                    <input type="radio" name="payment" value={m.id} checked={paymentType === m.id} onChange={() => setPaymentType(m.id)} />
                    {m.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-stone-300 px-6 py-4 font-semibold">Back</button>
              <button type="submit" className="flex-1 rounded-full bg-black py-4 font-semibold text-white hover:bg-forest">Review order</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold">Review your order</h2>
            <dl className="grid gap-3 rounded-xl bg-stone-50 p-5 text-sm sm:grid-cols-2">
              <div><dt className="text-stone-500">Ship to</dt><dd>{firstName} {lastName}, {address}, {city} {zip}</dd></div>
              <div><dt className="text-stone-500">Email</dt><dd>{email}</dd></div>
              <div><dt className="text-stone-500">Delivery</dt><dd>{shippingOptions.find((o) => o.id === shippingTier)?.label}</dd></div>
              <div><dt className="text-stone-500">Payment</dt><dd>{paymentMethods.find((m) => m.id === paymentType)?.label}</dd></div>
            </dl>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-stone-300 px-6 py-4 font-semibold">Back</button>
              <button type="button" onClick={placeOrder} disabled={placing} className="flex-1 rounded-full bg-black py-4 font-semibold text-white hover:bg-forest disabled:bg-stone-400">
                {placing ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-2xl bg-stone-100 p-6">
        <h2 className="text-lg font-bold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {currentItems().map((i) => (
            <li key={`${i.item_id}-${i.item_variant}-${i.item_size}`} className="flex justify-between gap-4">
              <span>
                {i.item_name} <span className="text-stone-500">· {i.item_variant} · {i.item_size} × {i.quantity}</span>
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        {step < 3 && (
          <form onSubmit={applyCoupon} className="mt-5 flex gap-2" aria-label="Promo code">
            <label htmlFor="co-coupon" className="sr-only">Promo code</label>
            <input id="co-coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Promo code" className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm uppercase" />
            <button type="submit" className="rounded-lg bg-black px-4 text-sm font-semibold text-white">Apply</button>
          </form>
        )}
        {couponMessage && <p className="mt-2 text-sm">{couponMessage}</p>}
        <dl className="mt-5 space-y-2 border-t border-stone-300 pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
          {totals.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount ({coupon})</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
          <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
          <div className="flex justify-between border-t border-stone-300 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
