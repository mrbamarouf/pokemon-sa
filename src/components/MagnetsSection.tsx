import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/store/cart";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { productsByCategory } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

const magnets = productsByCategory("magnets");
const tones = ["from-pk-yellow/25 via-background to-pk-blue/15", "from-pk-red/25 via-background to-pk-blue/20", "from-pk-blue/25 via-background to-pk-yellow/20"];

export const MagnetsSection = () => {
  const add = useCart((s) => s.add);
  const { language, t, formatPrice } = useLanguage();
  return (
    <section id="magnets" className="mobile-showcase-section relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow={t("magnetsEyebrow")}
          title={t("magnetsTitle")}
          description={t("magnetsDescription")}
        />
        <div className="mobile-product-rail mobile-magnet-rail grid grid-cols-1 md:grid-cols-3 gap-6">
          {magnets.map((m, i) => (
            <Reveal key={m.id} delay={i * 100} className="mobile-snap-item">
              <div className="mobile-product-card group relative rounded-2xl overflow-hidden border border-border bg-gradient-card card-hover">
                <Link to={`/product/${m.id}`} className={`relative block aspect-[4/5] overflow-hidden bg-gradient-to-br ${tones[i]}`}>
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(hsl(var(--pk-blue)/0.35)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.22)_1px,transparent_1px)] [background-size:36px_36px]" />
                  {m.gallery.length > 2 ? (
                    <div className="relative z-10 grid h-full grid-cols-2 place-items-center gap-2 p-8">
                      {m.gallery.slice(0, 4).map((src, index) => (
                        <img
                          key={src}
                          src={src}
                          alt={`${m.name[language]} ${index + 1}`}
                          width={360}
                          height={360}
                          loading="lazy"
                          className="h-28 w-28 object-contain drop-shadow-[0_14px_22px_hsl(0_0%_0%/0.45)] transition-transform duration-700 group-hover:scale-110 md:h-32 md:w-32"
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={m.image}
                      alt={m.name[language]}
                      width={720}
                      height={720}
                      loading="lazy"
                      className="relative z-10 h-full w-full object-contain p-10 drop-shadow-[0_22px_28px_hsl(0_0%_0%/0.45)] transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-x-8 bottom-8 h-10 rounded-full bg-black/40 blur-xl" />
                </Link>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <Link to={`/product/${m.id}`} className="flex min-h-11 items-center font-display text-base font-bold leading-tight transition-colors hover:text-pk-yellow">
                      {m.name[language]}
                    </Link>
                    <div>
                      <Link to={`/product/${m.id}`} className="inline-flex min-h-11 items-center text-[10px] font-bold uppercase tracking-wider text-pk-blue transition-colors hover:text-pk-yellow">
                        {t("viewDetails")}
                      </Link>
                    </div>
                    <span className="text-xl font-display font-black text-gradient-gold">{formatPrice(m.price)}</span>
                  </div>
                  <button
                    onClick={() => add({ id: m.id, name: m.name[language], nameByLanguage: m.name, price: m.price, image: m.image })}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pk-blue text-background transition-all hover:glow-electric"
                    aria-label={t("addToCart")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
