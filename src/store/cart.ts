import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  nameByLanguage?: { en: string; ar: string };
  price: number;
  image: string;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  total: () => number;
};

const keyOf = (i: { id: string; variant?: string }) => `${i.id}__${i.variant ?? ""}`;

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  add: (item) =>
    set((s) => {
      const k = keyOf(item);
      const existing = s.items.find((i) => keyOf(i) === k);
      if (existing) {
        return { items: s.items.map((i) => (keyOf(i) === k ? { ...i, qty: i.qty + 1 } : i)), isOpen: true };
      }
      return { items: [...s.items, { ...item, qty: 1 }], isOpen: true };
    }),
  remove: (key) => set((s) => ({ items: s.items.filter((i) => keyOf(i) !== key) })),
  clear: () => set({ items: [] }),
  setOpen: (v) => set({ isOpen: v }),
  count: () => get().items.reduce((a, b) => a + b.qty, 0),
  total: () => get().items.reduce((a, b) => a + b.qty * b.price, 0),
}));

export { keyOf };
