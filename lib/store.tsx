"use client";

// Client-side store state: cart, wishlist, and signed-in user.
// Persisted in localStorage so it survives reloads (and agent sessions that
// come back later, which matters for multi-session purchase journeys).

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, type Product } from "./catalog";
import { itemsValue, toGA4Item, track, CURRENCY } from "./analytics";

export type CartLine = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

export type User = {
  userId: string; // sent to GA4 as user_id
  email: string;
  firstName: string;
};

/** Which product list the shopper came from (for item list attribution). */
export type ListContext = { listId?: string; listName?: string; index?: number };

type StoreState = {
  ready: boolean;
  cart: CartLine[];
  wishlist: string[];
  user: User | null;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, color: string, size: string, quantity?: number, list?: ListContext) => void;
  updateQuantity: (line: CartLine, quantity: number) => void;
  removeFromCart: (line: CartLine) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product, listName?: string) => void;
  signIn: (email: string, firstName: string, method: "email" | "checkout") => Promise<void>;
  signOut: () => void;
};

const StoreContext = createContext<StoreState | null>(null);

const KEYS = { cart: "verdian_cart", wishlist: "verdian_wishlist", user: "verdian_user" };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode) — state just won't persist
  }
}

/**
 * Derive a stable, non-PII user_id from an email.
 * GA4's terms forbid sending personal data (like an email) as user_id,
 * so we hash it. Same email → same user_id on every device and session,
 * which is what makes cross-device identity stitching possible.
 */
async function hashUserId(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `u_${hex.slice(0, 16)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Hydrate from localStorage after mount (the server has no localStorage).
    /* eslint-disable react-hooks/set-state-in-effect */
    setCart(load(KEYS.cart, []));
    setWishlist(load(KEYS.wishlist, []));
    setUser(load(KEYS.user, null));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (ready) save(KEYS.cart, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) save(KEYS.wishlist, wishlist);
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) save(KEYS.user, user);
  }, [user, ready]);

  const addToCart = useCallback((product: Product, color: string, size: string, quantity = 1, list: ListContext = {}) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.color === color && l.size === size);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { productId: product.id, color, size, quantity }];
    });
    const items = [toGA4Item(product, { color, size, quantity, ...list })];
    track("add_to_cart", { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } });
  }, []);

  const removeFromCart = useCallback((line: CartLine) => {
    const product = getProductById(line.productId);
    setCart((prev) => prev.filter((l) => l !== line));
    if (product) {
      const items = [toGA4Item(product, { color: line.color, size: line.size, quantity: line.quantity })];
      track("remove_from_cart", { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } });
    }
  }, []);

  const updateQuantity = useCallback(
    (line: CartLine, quantity: number) => {
      const product = getProductById(line.productId);
      if (!product) return;
      if (quantity <= 0) return removeFromCart(line);
      const delta = quantity - line.quantity;
      setCart((prev) => prev.map((l) => (l === line ? { ...l, quantity } : l)));
      // A quantity change is reported as add_to_cart / remove_from_cart of the difference.
      const items = [toGA4Item(product, { color: line.color, size: line.size, quantity: Math.abs(delta) })];
      track(delta > 0 ? "add_to_cart" : "remove_from_cart", {
        ecommerce: { currency: CURRENCY, value: itemsValue(items), items },
      });
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (product: Product, listName?: string) => {
      const adding = !wishlist.includes(product.id);
      setWishlist((prev) => (adding ? [...prev, product.id] : prev.filter((id) => id !== product.id)));
      if (adding) {
        const items = [toGA4Item(product, { listName })];
        track("add_to_wishlist", { ecommerce: { currency: CURRENCY, value: product.price, items } });
      }
    },
    [wishlist],
  );

  const signIn = useCallback(async (email: string, firstName: string, method: "email" | "checkout") => {
    const userId = await hashUserId(email);
    setUser({ userId, email, firstName });
    // Setting user_id on the dataLayer lets the GA4 tag in GTM pick it up.
    track("login", { method, user_id: userId });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    track("logout", { user_id: null });
  }, []);

  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of cart) {
      const p = getProductById(line.productId);
      if (!p) continue;
      count += line.quantity;
      subtotal += p.price * line.quantity;
    }
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart]);

  const value = useMemo<StoreState>(
    () => ({
      ready,
      cart,
      wishlist,
      user,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      signIn,
      signOut,
    }),
    [ready, cart, wishlist, user, cartCount, cartSubtotal, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist, signIn, signOut],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
