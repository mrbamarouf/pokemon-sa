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
    <section id="cards" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow={t("cardsEyebrow")}
          title={t("cardsTitle")}
          description={t("cardsDescription")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
                <div className="group card-hover relative rounded-2xl bg-gradient-card border border-border overflow-hidden">
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
                  <Link to={`/product/${c.id}`} className="block font-display font-bold text-lg leading-tight hover:text-pk-yellow transition-colors">
                    {c.name[language]}
                  </Link>
                  <Link to={`/product/${c.id}`} className="text-xs font-bold uppercase tracking-wider text-pk-blue hover:text-pk-yellow transition-colors">
                    {t("viewDetails")}
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-black text-gradient-gold">{formatPrice(c.price)}</span>
                    <button
                      onClick={() => add({ id: c.id, name: c.name[language], price: c.price, image: c.image })}
                      className="h-10 px-4 rounded-full bg-pk-blue text-background text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:glow-electric transition-all"
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
