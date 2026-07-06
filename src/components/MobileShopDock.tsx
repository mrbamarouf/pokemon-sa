import { CupSoda, Gamepad2, Magnet, Package, Shirt, Sparkles } from "lucide-react";
import { productsByCategory } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";
import { skipSplashIntroOnNextLoad } from "@/components/SplashIntro";

const items = [
  { href: "#cards", labelKey: "cards", icon: Sparkles, count: productsByCategory("cards").length },
  { href: "#boosters", labelKey: "boosters", icon: Package, count: productsByCategory("boosters").length },
  { href: "#magnets", labelKey: "magnets", icon: Magnet, count: productsByCategory("magnets").length },
  { href: "#cups", labelKey: "cups", icon: CupSoda, count: 3 },
  { href: "#apparel", labelKey: "apparel", icon: Shirt, count: productsByCategory("apparel").length },
  { href: "#game", labelKey: "game", icon: Gamepad2, count: 4 },
];

export const MobileShopDock = () => {
  const { t } = useLanguage();

  return (
    <nav className="mobile-shop-dock" aria-label={t("shop")}>
      <div className="mobile-shop-dock-track">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href} onClick={skipSplashIntroOnNextLoad} className="mobile-shop-dock-item">
              <span className="mobile-shop-dock-icon">
                <Icon className="h-4 w-4" />
              </span>
              <span className="mobile-shop-dock-label">{t(item.labelKey)}</span>
              <span className="mobile-shop-dock-count">{item.count}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
