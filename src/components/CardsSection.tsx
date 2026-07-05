import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/store/cart";
import { Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { productsByCategory } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

const cards = productsByCategory("cards");

export const CardsSection = () => {
  const add = useCart((s) => s.add);
  const { language, t, formatPrice } = useLanguage();
  return (
    <section id="cards" className="mobile-showcase-section relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow={t("cardsEyebrow")}
          title={t("cardsTitle")}
          description={t("cardsDescription")}
        />
        <div className="mobile-product-rail grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 80} className="mobile-snap-item">
                <div className="mobile-product-card group card-hover relative rounded-2xl bg-gradient-card border border-border overflow-hidden">
                  <Link to={`/product/${c.id}`} className="relative block aspect-[3/4] overflow-hidden bg-black">
                    <img
                      src={c.image}
                      alt={c.name[language]}
                      width={768}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-pk-yellow/90 text-background text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> {c.badge?.[language]}
                  </div>
                </Link>
                <div className="p-5 space-y-3">
                  <Link to={`/product/${c.id}`} className="flex min-h-11 items-center font-display text-lg font-bold leading-tight transition-colors hover:text-pk-yellow">
                    {c.name[language]}
                  </Link>
                  <Link to={`/product/${c.id}`} className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-wider text-pk-blue transition-colors hover:text-pk-yellow">
                    {t("viewDetails")}
                  </Link>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-2xl font-display font-black text-gradient-gold">{formatPrice(c.price)}</span>
                    <button
                      onClick={() => add({ id: c.id, name: c.name[language], nameByLanguage: c.name, price: c.price, image: c.image })}
                      className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-pk-blue px-4 text-xs font-bold uppercase tracking-wider text-background transition-all hover:glow-electric sm:w-auto"
                    >
                      <Plus className="h-4 w-4" /> {t("add")}
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
