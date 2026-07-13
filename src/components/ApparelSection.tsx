import { ChangeEvent, useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/store/cart";
import { createCustomCartItem, createProductCartItem } from "@/lib/shopify/cart";
import { Check, Image as ImageIcon, Palette, Plus, Ruler, Sparkles, Type, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductVariantIdForOptions, Product } from "@/lib/shopify/products";
import {
  apparelSizes,
  apparelSizeGuide as sizeGuide,
  garmentColors as customColors,
  garmentStyles as customStyles,
  pokemonArt as characterArt,
} from "@/lib/shopify/customization";
import { Language, useLanguage } from "@/context/LanguageContext";
import { useCommerce } from "@/context/CommerceContext";

const customText: Record<Language, Record<string, string>> = {
  en: {
    eyebrow: "Apparel Studio",
    title: "Build Your Own Trainer Fit",
    description: "Pick a garment, choose a character, add text or upload a reference image for a custom print request.",
    style: "Garment",
    character: "Character print",
    upload: "Upload reference image",
    printedText: "Printed text",
    placeholder: "Trainer name or short line",
    preview: "Live apparel preview",
    size: "Size",
    sizeGuide: "Size Guide",
    chest: "Chest",
    length: "Length",
    shoulder: "Shoulder",
    add: "Add Custom Apparel",
  },
  ar: {
    eyebrow: "استوديو الملابس",
    title: "صمم لبسك بطابع Pokémon",
    description: "اختر تيشيرت أو هودي، حدد الشخصية، أضف نصًا، أو ارفع صورة مرجعية للطباعة المخصصة.",
    style: "نوع القطعة",
    character: "طباعة الشخصية",
    upload: "رفع صورة مرجعية",
    printedText: "النص المطبوع",
    placeholder: "اسم المدرب أو عبارة قصيرة",
    preview: "معاينة مباشرة للملابس",
    size: "المقاس",
    sizeGuide: "دليل القياسات",
    chest: "الصدر",
    length: "الطول",
    shoulder: "الكتف",
    add: "إضافة الملابس المخصصة",
  },
};

const SizeGuidePanel = ({ copy }: { copy: Record<string, string> }) => (
  <div className="size-guide-panel rounded-2xl border border-border bg-card/60 p-4">
    <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-gradient-gold">
      <Ruler className="h-5 w-5 text-pk-yellow" />
      {copy.sizeGuide}
    </div>
    <div className="size-guide-table overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-4 bg-muted/50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>{copy.size}</span>
        <span>{copy.chest}</span>
        <span>{copy.length}</span>
        <span>{copy.shoulder}</span>
      </div>
      {sizeGuide.map((row) => (
        <div key={row.size} className="grid grid-cols-4 border-t border-border px-3 py-2 text-xs text-foreground/85">
          <span className="font-bold text-pk-yellow">{row.size}</span>
          <span>{row.chest}</span>
          <span>{row.length}</span>
          <span>{row.shoulder}</span>
        </div>
      ))}
    </div>
  </div>
);

const ApparelCard = ({ item }: { item: Product }) => {
  const { language, t, formatPrice } = useLanguage();
  const [size, setSize] = useState(item.sizes?.[2] || "M");
  const [color, setColor] = useState(item.colors?.[0]);
  const add = useCart((s) => s.add);
  const variantByLanguage = {
    en: `${color?.name.en ?? ""} · ${size}`,
    ar: `${color?.name.ar ?? ""} · ${size}`,
  };

  return (
    <div className="mobile-product-card mobile-apparel-card group relative rounded-2xl overflow-hidden border border-border bg-gradient-card card-hover">
      <Link to={`/product/${item.id}`} className="mobile-card-media relative block aspect-square overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.name[language]}
          width={1024}
          height={1024}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="mobile-card-body p-5 space-y-4">
        <div className="mobile-card-heading flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${item.id}`} className="mobile-card-title flex min-h-11 items-center font-display text-lg font-bold leading-tight transition-colors hover:text-pk-yellow">
              {item.name[language]}
            </Link>
            <Link to={`/product/${item.id}`} className="mobile-card-details inline-flex min-h-11 items-center text-[10px] font-bold uppercase tracking-wider text-pk-blue transition-colors hover:text-pk-yellow">
              {t("viewDetails")}
            </Link>
          </div>
          <span className="mobile-card-price text-xl font-display font-black text-gradient-gold whitespace-nowrap">{formatPrice(item.price)}</span>
        </div>

        {item.colors && (
        <div className="mobile-card-options">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{t("color")} · {color?.name[language]}</div>
          <div className="flex gap-2">
            {item.colors.map((c) => (
              <button
                key={c.name.en}
                onClick={() => setColor(c)}
                aria-label={c.name[language]}
                className={`h-11 w-11 rounded-full border-2 transition-all ${
                  color?.name.en === c.name.en ? "border-pk-yellow scale-110" : "border-border"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
        )}

        {item.sizes && (
        <div className="mobile-card-options">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{t("size")} · {size}</div>
          <div className="flex flex-wrap gap-1.5">
            {item.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-11 min-w-11 rounded-md border px-3 text-xs font-bold transition-all ${
                  size === s
                    ? "bg-pk-yellow text-background border-pk-yellow"
                    : "border-border text-muted-foreground hover:border-pk-yellow hover:text-pk-yellow"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        )}

        <button
          onClick={() =>
            add(createProductCartItem({
              product: item,
              language,
              variant: variantByLanguage[language],
              variantByLanguage,
              shopifyVariantId: getProductVariantIdForOptions(item, { Color: color?.name.en, Size: size }),
            }))
          }
          className="mobile-card-cta w-full h-11 rounded-full bg-pk-blue text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:glow-electric transition-all"
        >
          <Plus className="h-4 w-4" /> {t("addToCart")}
        </button>
      </div>
    </div>
  );
};

const CustomApparelStudio = () => {
  const add = useCart((s) => s.add);
  const { getProduct } = useCommerce();
  const { language, t, formatPrice } = useLanguage();
  const copy = customText[language];
  const [style, setStyle] = useState(customStyles[0]);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(customColors[0]);
  const [character, setCharacter] = useState(characterArt[0]);
  const [text, setText] = useState("Pokémon SA");
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadName, setUploadName] = useState("");

  const printImage = uploadPreview || character.image;
  const shopifyCustomProduct = getProduct(`custom-apparel-${style.id}`);

  const variantForLanguage = (targetLanguage: Language) => {
    const parts = [style.name[targetLanguage], size, color.name[targetLanguage], uploadName || character.name];
    if (text.trim()) parts.push(`"${text.trim()}"`);
    return parts.join(" · ");
  };

  const variant = useMemo(() => variantForLanguage(language), [character.name, color.name, language, size, style.name, text, uploadName]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadPreview(URL.createObjectURL(file));
    setUploadName(file.name);
  };

  return (
    <div className="custom-apparel-studio-grid grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
      <Reveal>
        <div className="apparel-preview-card relative min-h-[620px] overflow-hidden rounded-2xl border border-border bg-gradient-card">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(hsl(var(--pk-blue)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="apparel-preview-inner relative grid min-h-[620px] place-items-center p-8">
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-pk-yellow/30 bg-background/55 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-pk-yellow backdrop-blur">
              <Palette className="h-3.5 w-3.5" />
              {copy.preview}
            </div>
            <div className={`apparel-mockup-stage apparel-mockup-stage-${style.id}`}>
              <div className="apparel-mockup-frame">
                <img
                  src={style.mockups[color.id] ?? style.mockups.clean}
                  alt={style.name[language]}
                  className="apparel-mockup-image"
                />
              </div>
              <div className={`apparel-mockup-print apparel-mockup-print-${style.id}`}>
                <img src={printImage} alt={uploadName || character.name} className="apparel-print-image" />
                {text.trim() && <div className="apparel-print-text">{text.trim()}</div>}
              </div>
            </div>
            <div className="apparel-preview-summary absolute bottom-5 left-5 right-5 grid gap-3 rounded-2xl border border-border bg-background/72 p-4 backdrop-blur-xl sm:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{copy.style}</div>
                <div className="mt-1 font-display font-bold">{style.name[language]}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{copy.size}</div>
                <div className="mt-1 font-display font-bold text-pk-yellow">{size}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("color")}</div>
                <div className="mt-1 font-display font-bold">{color.name[language]}</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="apparel-controls-card rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-xl md:p-6">
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-pk-blue">{copy.eyebrow}</div>
            <h3 className="mt-2 font-display text-3xl font-black text-gradient-gold">{copy.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{copy.style}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {customStyles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStyle(item)}
                    className={`min-h-14 rounded-xl border px-4 text-start transition ${
                      style.id === item.id ? "border-pk-yellow bg-pk-yellow/10" : "border-border bg-muted/30 hover:border-pk-blue"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display font-bold">{item.name[language]}</span>
                      <span className="font-display font-black text-gradient-gold">{formatPrice(item.price)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {copy.size} · {size}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {apparelSizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`h-11 rounded-md border text-xs font-bold transition ${
                      size === item ? "border-pk-yellow bg-pk-yellow text-background" : "border-border text-muted-foreground hover:border-pk-yellow hover:text-pk-yellow"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {t("color")} · {color.name[language]}
              </div>
              <div className="flex flex-wrap gap-2">
                {customColors.map((item) => (
                  <button
                    key={item.name.en}
                    onClick={() => setColor(item)}
                    aria-label={item.name[language]}
                    className={`h-11 w-11 rounded-full border-2 transition ${color.name.en === item.name.en ? "scale-110 border-pk-yellow" : "border-border"}`}
                    style={{ background: item.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{copy.character}</div>
              <div className="apparel-character-grid grid grid-cols-4 gap-2">
                {characterArt.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setCharacter(item);
                      setUploadPreview("");
                      setUploadName("");
                    }}
                    className={`relative aspect-square rounded-xl border bg-muted/30 p-1 transition ${!uploadPreview && character.name === item.name ? "border-pk-yellow" : "border-border hover:border-pk-blue"}`}
                  >
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    {!uploadPreview && character.name === item.name && (
                      <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-pk-yellow text-background">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-pk-blue/50 bg-pk-blue/10 px-4 text-sm font-semibold text-pk-blue transition hover:border-pk-yellow hover:text-pk-yellow">
                <Upload className="h-4 w-4" />
                {uploadName || copy.upload}
                <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
              </label>
            </div>

            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <Type className="h-4 w-4" />
                {copy.printedText}
              </span>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={24}
                placeholder={copy.placeholder}
                className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
              />
            </label>

            <button
              onClick={() =>
                add(createCustomCartItem({
                  id: `custom-apparel-${style.id}`,
                  name: style.name,
                  language,
                  price: style.price,
                  image: printImage,
                  variant,
                  variantByLanguage: { en: variantForLanguage("en"), ar: variantForLanguage("ar") },
                  shopifyVariantId: shopifyCustomProduct?.shopifyVariantId,
                }))
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric transition-transform hover:scale-[1.02]"
            >
              <ImageIcon className="h-4 w-4" />
              {copy.add}
            </button>

            <SizeGuidePanel copy={copy} />
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export const ApparelSection = () => {
  const { t, language } = useLanguage();
  const { productsByCategory } = useCommerce();
  const copy = customText[language];
  const apparel = productsByCategory("apparel");
  const tees = apparel.filter((item) => item.id.startsWith("t"));
  const hoodies = apparel.filter((item) => item.id.startsWith("h"));
  return (
    <section id="apparel" className="mobile-showcase-section relative py-28 bg-gradient-to-b from-background via-pk-yellow/5 to-background">
      <div className="container space-y-20">
        <div>
          <SectionHeader eyebrow={t("teesEyebrow")} title={t("teesTitle")} description={t("teesDescription")} />
          <div className="mobile-product-rail mobile-apparel-rail grid grid-cols-1 md:grid-cols-2 gap-6">
            {tees.map((t, i) => (
              <Reveal key={t.id} delay={i * 100} className="mobile-snap-item">
                <ApparelCard item={t} />
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader eyebrow={t("hoodiesEyebrow")} title={t("hoodiesTitle")} description={t("hoodiesDescription")} />
          <div className="mobile-product-rail mobile-apparel-rail grid grid-cols-1 md:grid-cols-2 gap-6">
            {hoodies.map((h, i) => (
              <Reveal key={h.id} delay={i * 100} className="mobile-snap-item">
                <ApparelCard item={h} />
              </Reveal>
            ))}
          </div>
          <div className="mt-6">
            <SizeGuidePanel copy={copy} />
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow={t("customApparelEyebrow")}
            title={t("customApparelTitle")}
            description={t("customApparelDescription")}
          />
          <CustomApparelStudio />
        </div>
      </div>
    </section>
  );
};
