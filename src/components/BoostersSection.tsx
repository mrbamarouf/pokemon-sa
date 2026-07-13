import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/store/cart";
import { createProductCartItem } from "@/lib/shopify/cart";
import { Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { productsByCategory } from "@/lib/shopify/products";
import { useLanguage } from "@/context/LanguageContext";

const boosters = productsByCategory("boosters");

export const BoostersSection = () => {
  const add = useCart((s) => s.add);
  const { language, t, formatPrice } = useLanguage();
  return (
    <section id="boosters" className="mobile-showcase-section relative py-28 bg-gradient-to-b from-background via-pk-blue/5 to-background">
      <div className="container">
        <SectionHeader
          eyebrow={t("boostersEyebrow")}
          title={t("boostersTitle")}
          description={t("boostersDescription")}
        />
        <div className="mobile-product-rail mobile-booster-rail grid grid-cols-1 lg:grid-cols-3 gap-6">
          {boosters.map((b, i) => (
            <Reveal key={b.id} delay={i * 100} className="mobile-snap-item">
              <div
                className={`mobile-product-card group relative rounded-2xl overflow-hidden border ${
                  b.featured ? "border-pk-yellow/60 lg:scale-105" : "border-border"
                } bg-gradient-card card-hover`}
              >
                {b.featured && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-gold text-background text-[10px] font-black uppercase tracking-wider">
                    {t("bestValue")}
                  </div>
                )}
                <Link to={`/product/${b.id}`} className="mobile-card-media relative block aspect-square bg-black overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.name[language]}
                    width={1024}
                    height={1024}
                    loading="lazy"
                  className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                </Link>
                <div className="mobile-card-body p-6 space-y-4 -mt-12 relative">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Package className="h-3 w-3" /> {t("sealed")}
                  </div>
                  <Link to={`/product/${b.id}`} className="mobile-card-title flex min-h-11 items-center font-display text-2xl font-bold leading-tight transition-colors hover:text-pk-yellow">
                    {b.name[language]}
                  </Link>
                  <p className="mobile-card-subtitle text-sm text-muted-foreground">{b.subtitle[language]}</p>
                  <Link to={`/product/${b.id}`} className="mobile-card-details inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-wider text-pk-blue transition-colors hover:text-pk-yellow">
                    {t("viewDetails")}
                  </Link>
                  <div className="mobile-card-action-row flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="mobile-card-price text-3xl font-display font-black text-gradient-gold">{formatPrice(b.price)}</span>
                    <button
                      onClick={() => add(createProductCartItem({ product: b, language }))}
                      className="mobile-card-cta flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-pk-yellow px-5 text-xs font-bold uppercase tracking-wider text-background transition-all hover:glow-yellow sm:w-auto"
                    >
                      <Plus className="h-4 w-4" /> {t("addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
