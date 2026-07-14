import { LogOut, Mail, MapPin, Package, ShieldCheck, User, X } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { useLanguage } from "@/context/LanguageContext";

const text = {
  en: {
    title: "Trainer Account",
    subtitle: "Sign in securely with Shopify to view your profile, saved addresses, order history, and checkout faster.",
    signIn: "Sign in with email",
    logout: "Logout",
    active: "Shopify account active",
    secure: "Shopify sends a one-time verification code to your email.",
    profile: "Profile",
    addresses: "Saved addresses",
    orders: "Orders",
    noAddresses: "No saved addresses yet",
    noOrders: "No orders yet",
    loading: "Checking Shopify session...",
  },
  ar: {
    title: "حساب المدرب",
    subtitle: "سجّل دخولك بأمان عبر Shopify لعرض الملف الشخصي والعناوين المحفوظة والطلبات وتسريع الدفع.",
    signIn: "تسجيل الدخول بالإيميل",
    logout: "تسجيل خروج",
    active: "حساب Shopify مفعل",
    secure: "يرسل Shopify رمز تحقق لمرة واحدة إلى بريدك الإلكتروني.",
    profile: "الملف الشخصي",
    addresses: "العناوين المحفوظة",
    orders: "الطلبات",
    noAddresses: "لا توجد عناوين محفوظة بعد",
    noOrders: "لا توجد طلبات بعد",
    loading: "جاري التحقق من جلسة Shopify...",
  },
};

export const AccountModal = () => {
  const { account, isAccountLoading, isAccountOpen, closeAccount, saveAccount, logout } = useAccount();
  const { language, dir } = useLanguage();
  const copy = text[language];
  const defaultAddress = account?.defaultAddress || account?.addresses[0];
  const addressText = defaultAddress?.formatted?.join(", ") || defaultAddress?.formattedArea || defaultAddress?.city || "";

  if (!isAccountOpen) return null;

  return (
    <div className="account-modal fixed inset-0 z-[90] grid place-items-center bg-background/80 p-4 backdrop-blur-xl">
      <div className="account-modal-panel w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_0_80px_hsl(var(--pk-blue)/0.18)]" dir={dir}>
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pk-yellow/35 bg-pk-yellow/10 px-3 py-1 text-xs font-bold text-pk-yellow">
              <User className="h-3.5 w-3.5" />
              {account ? copy.active : copy.title}
            </div>
            <h2 className="mt-4 font-display text-3xl font-black text-gradient-gold">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.subtitle}</p>
          </div>
          <button onClick={closeAccount} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border hover:border-pk-yellow" aria-label="Close account modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {isAccountLoading ? (
            <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">{copy.loading}</div>
          ) : account ? (
            <>
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  {copy.profile}
                </span>
                <p className="font-display text-xl font-black text-foreground">{account.name}</p>
                {account.email && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {account.email}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {copy.addresses}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground">{addressText || copy.noAddresses}</p>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {copy.orders}
                  </span>
                  <p className="font-display text-xl font-black text-foreground">{account.orders.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{account.orders[0]?.name || copy.noOrders}</p>
                </div>
              </div>

              {account.orders.length > 0 && (
                <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                  {account.orders.map((order) => (
                    <a
                      key={order.id}
                      href={order.statusPageUrl || "#"}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm hover:border-pk-yellow"
                      target={order.statusPageUrl ? "_blank" : undefined}
                      rel={order.statusPageUrl ? "noreferrer" : undefined}
                    >
                      <span className="font-bold text-foreground">{order.name || `#${order.number}`}</span>
                      <span className="text-muted-foreground">
                        {order.totalPrice ? `${Number(order.totalPrice.amount).toLocaleString(language === "ar" ? "ar-SA" : "en-US")} ${order.totalPrice.currencyCode}` : ""}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              <button type="button" onClick={logout} className="h-12 w-full rounded-full border border-border px-6 text-sm font-bold text-muted-foreground hover:border-pk-yellow hover:text-pk-yellow">
                <span className="inline-flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  {copy.logout}
                </span>
              </button>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
                <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pk-yellow">
                  <ShieldCheck className="h-4 w-4" />
                  Shopify Customer Accounts
                </span>
                {copy.secure}
              </div>

              <button onClick={() => saveAccount()} className="h-12 w-full rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric">
                {copy.signIn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
