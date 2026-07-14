import { useCart, keyOf } from "@/store/cart";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAccount } from "@/context/AccountContext";

export const CartDrawer = () => {
  const { items, isOpen, setOpen, remove, total, checkout } = useCart();
  const { language, t, formatPrice } = useLanguage();
  const { account, openAccount } = useAccount();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`cart-drawer-backdrop fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`cart-drawer fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-500 ${
          isOpen ? "cart-drawer-open translate-x-0" : "cart-drawer-closed translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-pk-yellow" /> {t("cart")}
          </h3>
          <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-40" />
              {t("emptyCart")}
            </div>
          )}
          {items.map((i) => {
            const itemName = i.nameByLanguage?.[language] || i.name;
            const itemVariant = i.variantByLanguage?.[language] || i.variant;

            return (
              <div key={keyOf(i)} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                <img src={i.image} alt={itemName} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{itemName}</div>
                  {itemVariant && <div className="text-xs text-muted-foreground">{itemVariant}</div>}
                  <div className="text-sm text-pk-yellow font-bold mt-1">
                    {formatPrice(i.price)} · ×{i.qty}
                  </div>
                </div>
                <button
                  onClick={() => remove(keyOf(i))}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:bg-destructive/20 hover:text-destructive"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-5 space-y-4 bg-background">
          <button
            onClick={openAccount}
            className={`w-full rounded-xl border p-3 text-start text-sm transition ${
              account ? "border-pk-yellow/40 bg-pk-yellow/10 text-pk-yellow" : "border-border bg-muted/30 text-muted-foreground hover:border-pk-yellow"
            }`}
          >
            {account ? `${t("checkoutReady")} · ${account.email || account.name}` : t("checkoutNeedsAccount")}
          </button>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">{t("total")}</span>
            <span className="text-2xl font-display font-black text-gradient-gold">{formatPrice(total())}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              void checkout();
            }}
            className="w-full h-12 rounded-full bg-gradient-electric text-background font-display font-bold uppercase tracking-wider text-sm disabled:opacity-40 hover:scale-[1.02] transition-transform glow-electric"
          >
            {t("checkout")}
          </button>
        </div>
      </aside>
    </>
  );
};
