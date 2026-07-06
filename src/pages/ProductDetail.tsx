import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, PackageCheck, Plus, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { useLanguage } from "@/context/LanguageContext";
import { getProduct, products } from "@/data/products";
import { useCart } from "@/store/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProduct(id);
  const { language, t, formatPrice } = useLanguage();
  const add = useCart((s) => s.add);
  const [activeImage, setActiveImage] = useState(product?.gallery[0] || product?.image || "");
  const [color, setColor] = useState(product?.colors?.[0]);
  const [size, setSize] = useState(product?.sizes?.[2] || product?.sizes?.[0] || "");

  useEffect(() => {
    if (!product) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    setActiveImage(product.gallery[0] || product.image);
    setColor(product.colors?.[0]);
    setSize(product.sizes?.[2] || product.sizes?.[0] || "");
  }, [product]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name[language]} — Pokémon SA`;
  }, [language, product]);

  const variantForLanguage = (targetLanguage: typeof language) => {
    const parts = [];
    if (color) parts.push(color.name[targetLanguage]);
    if (size) parts.push(size);
    return parts.join(" · ") || undefined;
  };

  const variant = useMemo(() => variantForLanguage(language), [color, language, size]);

  if (!product) return <Navigate to="/" replace />;

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  const fallbackRelated = related.length ? related : products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <main className="product-page min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="product-detail-hero relative overflow-hidden pt-36 md:pt-44">
        <div className="absolute inset-0 bg-gradient-to-b from-pk-blue/10 via-background to-background" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--pk-blue)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.18)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="container relative z-10 pb-24">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-pk-yellow">
            <BackIcon className="h-4 w-4" />
            {t("backToShop")}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.7fr)]">
            <div className="product-gallery-card rounded-2xl border border-border bg-gradient-card p-4 shadow-[0_0_80px_hsl(var(--pk-blue)/0.12)] md:p-6">
              <div className="product-hero-image relative aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_35%,hsl(var(--pk-blue)/0.22),hsl(0_0%_0%/0.72)_58%)]">
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--pk-blue)/0.28)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
                <img src={activeImage} alt={product.name[language]} className="relative z-10 h-full w-full object-contain p-6 drop-shadow-[0_24px_42px_hsl(0_0%_0%/0.55)]" />
                {product.badge && (
                  <div className="absolute left-4 top-4 rounded-full bg-pk-yellow px-3 py-1 text-xs font-black uppercase tracking-wider text-background">
                    {product.badge[language]}
                  </div>
                )}
              </div>
              <div className="product-thumbnail-grid mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((image) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(image)}
                    className={`aspect-square rounded-xl border bg-muted/40 p-2 transition ${
                      activeImage === image ? "border-pk-yellow" : "border-border hover:border-pk-blue"
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-info-card rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl md:p-6">
              <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-pk-yellow">{t(product.category)}</div>
              <h1 className="mt-4 break-words font-display text-3xl font-black leading-tight sm:text-4xl md:text-5xl">{product.name[language]}</h1>
              <p className="mt-3 text-lg text-muted-foreground">{product.subtitle[language]}</p>
              <div className="mt-5 text-4xl font-display font-black text-gradient-gold">{formatPrice(product.price)}</div>
              <p className="mt-5 leading-relaxed text-foreground/80">{product.description[language]}</p>

              <div className="mt-6 space-y-5">
                {product.colors && (
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {t("color")} · {color?.name[language]}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((item) => (
                        <button
                          key={item.name.en}
                          onClick={() => setColor(item)}
                          aria-label={item.name[language]}
                          className={`h-11 w-11 rounded-full border-2 transition ${
                            color?.name.en === item.name.en ? "border-pk-yellow scale-110" : "border-border hover:border-pk-blue"
                          }`}
                          style={{ background: item.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && (
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {t("size")} · {size}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSize(item)}
                          className={`h-11 min-w-12 rounded-md border px-3 text-xs font-bold transition ${
                            size === item ? "border-pk-yellow bg-pk-yellow text-background" : "border-border text-muted-foreground hover:border-pk-yellow hover:text-pk-yellow"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  add({
                    id: product.id,
                    name: product.name[language],
                    nameByLanguage: product.name,
                    price: product.price,
                    image: product.image,
                    variant,
                    variantByLanguage: { en: variantForLanguage("en"), ar: variantForLanguage("ar") },
                  })
                }
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric transition-transform hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                {t("addToCart")}
              </button>

              <div className="product-trust-grid mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mb-2 h-5 w-5 text-pk-yellow" />
                  {language === "ar" ? "صور حقيقية ووصف واضح" : "Real imagery and clear details"}
                </div>
                <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
                  <Truck className="mb-2 h-5 w-5 text-pk-blue" />
                  {t("location")}
                </div>
                <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
                  <PackageCheck className="mb-2 h-5 w-5 text-pk-yellow" />
                  {language === "ar" ? "تغليف مناسب للجامعين" : "Collector-ready packaging"}
                </div>
              </div>
            </div>
          </div>

          <div className="product-info-panels mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="font-display text-2xl font-bold text-gradient-gold">{t("productStory")}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{product.description[language]}</p>
              <div className="mt-5 rounded-xl border border-pk-blue/30 bg-pk-blue/10 p-4">
                <Sparkles className="mb-2 h-5 w-5 text-pk-blue" />
                <p className="text-sm leading-relaxed text-foreground/80">
                  {language === "ar"
                    ? "تم ترتيب صفحة المنتج عشان العميل يشوف الصورة، السعر، الحالة، المواصفات، وطريقة التغليف بدون أي تشويش."
                    : "This product page is structured so buyers can review imagery, price, condition notes, specifications and packaging details without friction."}
                </p>
              </div>
            </section>
            <section className="rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="font-display text-2xl font-bold text-gradient-gold">{t("specifications")}</h2>
              <ul className="mt-4 space-y-3">
                {product.specs[language].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-pk-yellow" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-pk-blue">
                  {language === "ar" ? "منتجات مقترحة" : "Recommended"}
                </div>
                <h2 className="mt-2 font-display text-3xl font-black text-gradient-gold">
                  {language === "ar" ? "قد يعجبك أيضًا" : "You May Also Like"}
                </h2>
              </div>
              <Link to="/#cards" className="inline-flex min-h-11 items-center text-sm font-bold text-pk-yellow hover:text-pk-blue">
                {t("backToShop")}
              </Link>
            </div>
            <div className="mobile-product-rail product-related-rail grid grid-cols-1 gap-5 md:grid-cols-3">
              {fallbackRelated.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="mobile-snap-item mobile-product-card group overflow-hidden rounded-2xl border border-border bg-gradient-card transition hover:-translate-y-1 hover:border-pk-yellow"
                >
                  <div className="mobile-card-media aspect-[4/3] bg-black/55">
                    <img src={item.image} alt={item.name[language]} className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mobile-card-body p-5">
                    <div className="mobile-card-title font-display text-lg font-bold group-hover:text-pk-yellow">{item.name[language]}</div>
                    <div className="mobile-card-price mt-2 text-xl font-display font-black text-gradient-gold">{formatPrice(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
      <Footer />
      <CartDrawer />
    </main>
  );
};

export default ProductDetail;
