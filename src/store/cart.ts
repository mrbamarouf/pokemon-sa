import { create } from "zustand";
import {
  calculateCartItemCount,
  calculateCartSubtotal,
  createShopifyCart,
  createShopifyCartLinesFromItems,
  createCartItemKey,
  type CommerceCartItem,
} from "@/lib/shopify/cart";

export type CartItem = CommerceCartItem;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  syncError?: string;
  shopifyCartId?: string;
  checkoutUrl?: string;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (key: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
  setOpen: (v: boolean) => void;
  count: () => number;
  total: () => number;
};

const keyOf = createCartItemKey;

const syncShopifyCart = async (items: CartItem[], set: (partial: Partial<CartState>) => void) => {
  const lines = createShopifyCartLinesFromItems(items);
  if (!lines.length) {
    set({ shopifyCartId: undefined, checkoutUrl: undefined, syncError: undefined, isSyncing: false });
    return;
  }

  set({ isSyncing: true, syncError: undefined });
  const result = await createShopifyCart(lines);
  set({
    isSyncing: false,
    shopifyCartId: result.data?.id,
    checkoutUrl: result.data?.checkoutUrl,
    syncError: result.error?.message,
  });
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isSyncing: false,
  add: (item) => {
    let nextItems: CartItem[] = [];
    set((s) => {
      const k = keyOf(item);
      const existing = s.items.find((i) => keyOf(i) === k);
      if (existing) {
        nextItems = s.items.map((i) => (keyOf(i) === k ? { ...i, qty: i.qty + 1 } : i));
        return { items: nextItems, isOpen: true };
      }
      nextItems = [...s.items, { ...item, qty: 1 }];
      return { items: nextItems, isOpen: true };
    });
    void syncShopifyCart(nextItems, set);
  },
  remove: (key) => {
    let nextItems: CartItem[] = [];
    set((s) => {
      nextItems = s.items.filter((i) => keyOf(i) !== key);
      return { items: nextItems };
    });
    void syncShopifyCart(nextItems, set);
  },
  clear: () => {
    set({ items: [], shopifyCartId: undefined, checkoutUrl: undefined, syncError: undefined });
  },
  checkout: async () => {
    const state = get();
    let checkoutUrl = state.checkoutUrl;
    if (!checkoutUrl && state.items.length > 0) {
      await syncShopifyCart(state.items, set);
      checkoutUrl = get().checkoutUrl;
    }
    if (checkoutUrl && typeof window !== "undefined") {
      window.location.assign(checkoutUrl);
    }
  },
  setOpen: (v) => set({ isOpen: v }),
  count: () => calculateCartItemCount(get().items),
  total: () => calculateCartSubtotal(get().items),
}));

export { keyOf };
