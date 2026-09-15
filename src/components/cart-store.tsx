"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  unitPrice: number | null;
  quantity: number;
  options: Record<string, string>;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const LS_KEY = "dma_cart_v1";

function makeKey(productId: string, options: Record<string, string>) {
  const o = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`)
    .join("|");
  return `${productId}::${o}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Hydratation initiale depuis localStorage (client uniquement) —
    // pas d'effet requis, donc pas de setState synchrone dans un effet.
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce(
      (s, i) => s + (i.unitPrice ?? 0) * i.quantity,
      0,
    );
    return {
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      add: (input) => {
        const key = makeKey(input.productId, input.options ?? {});
        setItems((prev) => {
          const found = prev.find((p) => p.key === key);
          if (found) {
            return prev.map((p) =>
              p.key === key
                ? { ...p, quantity: p.quantity + (input.quantity ?? 1) }
                : p,
            );
          }
          return [
            ...prev,
            {
              key,
              productId: input.productId,
              slug: input.slug,
              name: input.name,
              image: input.image,
              unitPrice: input.unitPrice,
              quantity: input.quantity ?? 1,
              options: input.options ?? {},
            },
          ];
        });
      },
      remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
      setQty: (key, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.key !== key)
            : prev.map((p) => (p.key === key ? { ...p, quantity: qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
