import { Gamepad2, Grid2X2, Home, ShoppingBag, UserRound, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { type Language, useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/store/cart";

type MobileNavItem = {
  id: "home" | "categories" | "cart" | "games" | "account";
  to: string;
  icon: LucideIcon;
  label: Record<Language, string>;
};

const navItems: MobileNavItem[] = [
  { id: "home", to: "/#top", icon: Home, label: { en: "Home", ar: "الرئيسية" } },
  { id: "categories", to: "/#categories", icon: Grid2X2, label: { en: "Categories", ar: "الأقسام" } },
  { id: "cart", to: "/#cart", icon: ShoppingBag, label: { en: "Cart", ar: "السلة" } },
  { id: "games", to: "/#game", icon: Gamepad2, label: { en: "Games", ar: "الألعاب" } },
  { id: "account", to: "/#account", icon: UserRound, label: { en: "Account", ar: "الحساب" } },
];

const categoryHashes = new Set(["#categories", "#products", "#featured", "#cards", "#boosters", "#magnets", "#cups", "#cup", "#apparel", "#ready-apparel"]);

const activeNavFor = (pathname: string, hash: string): MobileNavItem["id"] => {
  if (pathname.startsWith("/product") || pathname === "/special-request") return "categories";
  if (hash === "#cart" || hash === "#checkout") return "cart";
  if (hash === "#game" || hash === "#games" || hash === "#rewards") return "games";
  if (hash === "#account" || hash === "#profile") return "account";
  if (categoryHashes.has(hash)) return "categories";
  return "home";
};

export const MobileBottomNav = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const cartCount = useCart((state) => state.items.reduce((sum, item) => sum + item.qty, 0));
  const activeId = activeNavFor(location.pathname, location.hash);

  return (
    <nav className="mobile-global-tabbar" aria-label={t("shop")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <Link key={item.id} to={item.to} aria-current={isActive ? "page" : undefined}>
            <Icon className="h-4 w-4" />
            <span>{item.label[language]}</span>
            {item.id === "cart" && cartCount > 0 && <small>{cartCount}</small>}
          </Link>
        );
      })}
    </nav>
  );
};
