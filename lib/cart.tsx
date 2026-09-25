"use client";

// Cart state, persisted in localStorage.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, type Product } from "./catalog";

export type CartLine = { productId: string; size: string; quantity: number };

type CartState = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, size: string, quantity: number) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "verdian_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((product: Product, size: string, quantity: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.size === size);
      if (existing) return prev.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l));
      return [...prev, { productId: product.id, size, quantity }];
    });
  }, []);

  const remove = useCallback((productId: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
  }, []);

  const setQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) return remove(productId, size);
      setLines((prev) => prev.map((l) => (l.productId === productId && l.size === size ? { ...l, quantity } : l)));
    },
    [remove],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    let count = 0;
    let subtotal = 0;
    for (const l of lines) {
      const p = getProductById(l.productId);
      if (!p) continue;
      count += l.quantity;
      subtotal += p.price * l.quantity;
    }
    return { ready, lines, count, subtotal, add, setQuantity, remove, clear };
  }, [ready, lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
