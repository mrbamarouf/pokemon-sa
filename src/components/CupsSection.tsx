import { ChangeEvent, CSSProperties, useMemo, useState } from "react";
import { Check, Image as ImageIcon, Palette, Plus, Sparkles, Type, Upload } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useCart } from "@/store/cart";
import logo from "@/assets/logo.png";
import { useLanguage, Language } from "@/context/LanguageContext";

type PrintMode = "character" | "text" | "both";
type CupStyle = {
  id: string;
  name: Record<Language, string>;
  price: number;
  finish: Record<Language, string>;
};

const officialArt = [
  { name: "Pikachu", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
  { name: "Charizard", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" },
  { name: "Dragonite", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png" },
  { name: "Eevee", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png" },
];

const cupStyles: CupStyle[] = [
  { id: "ceramic", name: { en: "Ceramic Mug", ar: "كوب سيراميك" }, price: 189, finish: { en: "Glossy print", ar: "طباعة لامعة" } },
  { id: "travel", name: { en: "Travel Cup", ar: "كوب سفر" }, price: 249, finish: { en: "Thermal sleeve", ar: "غلاف حراري" } },
  { id: "cold", name: { en: "Cold Tumbler", ar: "كوب بارد" }, price: 219, finish: { en: "Clear lid", ar: "غطاء شفاف" } },
];

const cupColors = [
  { name: { en: "White", ar: "أبيض" }, hex: "#f8fafc", shadow: "#dbeafe" },
  { name: { en: "Yellow", ar: "أصفر" }, hex: "#facc15", shadow: "#854d0e" },
  { name: { en: "Electric Blue", ar: "أزرق كهربائي" }, hex: "#38bdf8", shadow: "#075985" },
  { name: { en: "Cherry Red", ar: "أحمر" }, hex: "#ef4444", shadow: "#7f1d1d" },
  { name: { en: "Midnight", ar: "ليلي" }, hex: "#111827", shadow: "#020617" },
];

const printModes: { id: PrintMode; labelKey: string; icon: typeof ImageIcon }[] = [
  { id: "character", labelKey: "image", icon: ImageIcon },
  { id: "text", labelKey: "text", icon: Type },
  { id: "both", labelKey: "both", icon: Sparkles },
];

const modeLabels: Record<PrintMode, Record<Language, string>> = {
  character: { en: "Image", ar: "صورة" },
  text: { en: "Text", ar: "نص" },
  both: { en: "Both", ar: "الاثنين" },
};

export const CupsSection = () => {
  const add = useCart((s) => s.add);
  const { language, t, formatPrice } = useLanguage();
  const [style, setStyle] = useState<CupStyle>(cupStyles[0]);
  const [color, setColor] = useState(cupColors[0]);
  const [mode, setMode] = useState<PrintMode>("both");
  const [art, setArt] = useState(officialArt[0]);
  const [customText, setCustomText] = useState("Catch Your Power");
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadName, setUploadName] = useState("");

  const printImage = uploadPreview || art.image;
  const showsImage = mode === "character" || mode === "both";
  const showsText = mode === "text" || mode === "both";

  const cupNameForLanguage = (targetLanguage: Language) =>
    targetLanguage === "ar" ? `كاس مخصص ${style.name[targetLanguage]}` : `Custom ${style.name[targetLanguage]}`;

  const variantForLanguage = (targetLanguage: Language) => {
    const parts = [style.name[targetLanguage], color.name[targetLanguage], modeLabels[mode][targetLanguage]];
    if (showsImage) parts.push(uploadName || art.name);
    if (showsText && customText.trim()) parts.push(`"${customText.trim()}"`);
    return parts.join(" · ");
  };

  const variant = useMemo(() => variantForLanguage(language), [art.name, color.name, customText, language, mode, showsImage, showsText, style.name, uploadName]);

  const clearUpload = () => {
    setUploadPreview("");
    setUploadName("");
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadPreview(URL.createObjectURL(file));
    setUploadName(file.name);
    if (mode === "text") setMode("both");
  };

  const addCup = () => {
    add({
      id: `cup-${style.id}`,
      name: cupNameForLanguage(language),
      nameByLanguage: { en: cupNameForLanguage("en"), ar: cupNameForLanguage("ar") },
      price: style.price,
      image: showsImage ? printImage : logo,
      variant,
      variantByLanguage: { en: variantForLanguage("en"), ar: variantForLanguage("ar") },
    });
  };

  return (
    <section id="cups" className="relative py-28 bg-gradient-to-b from-background via-pk-blue/10 to-background overflow-hidden">
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-pk-yellow/50 to-transparent" />
      <div className="container">
        <SectionHeader
          eyebrow={t("cupsEyebrow")}
          title={t("cupsTitle")}
          description={t("cupsDescription")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] gap-8 items-start">
          <Reveal>
            <div className="cup-preview-card relative min-h-[560px] rounded-2xl border border-border bg-gradient-card overflow-hidden">
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(hsl(var(--pk-blue)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
              <div className="cup-preview-inner relative h-full min-h-[560px] grid place-items-center px-6 py-12">
                <div className="cup-stage">
                  <div className="cup-shadow" />
                  <div
                    className={`cup-preview cup-preview-${style.id}`}
                    style={
                      {
                        "--cup-color": color.hex,
                        "--cup-shadow": color.shadow,
                      } as CSSProperties
                    }
                  >
                    <div className="cup-print-area">
                      {showsImage && (
                        <img
                          src={printImage}
                          alt={uploadName || `${art.name} print`}
                          className="cup-print-image"
                        />
                      )}
                      {showsText && customText.trim() && (
                        <div className="cup-print-text">{customText.trim()}</div>
                      )}
                    </div>
                    <div className="cup-rim" />
                    <div className="cup-highlight" />
                    {style.id === "ceramic" && <div className="cup-handle" />}
                    {style.id !== "ceramic" && <div className="cup-lid" />}
                  </div>
                </div>

                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-pk-yellow/30 bg-background/55 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-pk-yellow backdrop-blur">
                  <Palette className="h-3.5 w-3.5" />
                  {t("livePreview")}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-5 md:p-6 space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{t("cupStyle")}</div>
                <div className="grid gap-2">
                  {cupStyles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStyle(item)}
                      className={`min-h-16 rounded-xl border px-4 text-left transition-all ${
                        style.id === item.id
                          ? "border-pk-yellow bg-pk-yellow/10"
                          : "border-border bg-muted/30 hover:border-pk-blue"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-display font-bold text-sm">{item.name[language]}</div>
                          <div className="text-xs text-muted-foreground">{item.finish[language]}</div>
                        </div>
                        <div className="font-display font-black text-gradient-gold">{formatPrice(item.price)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{t("color")} · {color.name[language]}</div>
                <div className="flex flex-wrap gap-2">
                  {cupColors.map((item) => (
                    <button
                      key={item.name.en}
                      onClick={() => setColor(item)}
                      aria-label={item.name[language]}
                      className={`h-11 w-11 rounded-full border-2 transition-all ${
                        color.name.en === item.name.en ? "border-pk-yellow scale-110" : "border-border hover:border-pk-blue"
                      }`}
                      style={{ background: item.hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{t("customize")}</div>
                <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-3">
                  {printModes.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setMode(item.id)}
                        className={`h-12 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          mode === item.id
                            ? "border-pk-blue bg-pk-blue text-background"
                            : "border-border bg-muted/30 text-muted-foreground hover:border-pk-blue hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {t(item.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {showsImage && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{t("characterPrint")}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {officialArt.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setArt(item);
                          clearUpload();
                        }}
                        className={`relative aspect-square rounded-xl border bg-muted/30 p-1 transition-all ${
                          !uploadPreview && art.name === item.name ? "border-pk-yellow" : "border-border hover:border-pk-blue"
                        }`}
                        aria-label={item.name}
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
                        {!uploadPreview && art.name === item.name && (
                          <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-pk-yellow text-background grid place-items-center">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-pk-blue/50 bg-pk-blue/10 px-4 text-sm font-semibold text-pk-blue transition hover:border-pk-yellow hover:text-pk-yellow">
                    <Upload className="h-4 w-4" />
                    {uploadName || t("uploadCustomerImage")}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
                  </label>
                </div>
              )}

              {showsText && (
                <div>
                  <label htmlFor="cup-text" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 block">
                    {t("printedText")}
                  </label>
                  <input
                    id="cup-text"
                    value={customText}
                    onChange={(event) => setCustomText(event.target.value)}
                    maxLength={28}
                    className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
                    placeholder={t("textPlaceholder")}
                  />
                </div>
              )}

              <button
                onClick={addCup}
                className="w-full h-12 rounded-full bg-gradient-electric text-background font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 glow-electric hover:scale-[1.02] transition-transform"
              >
                <Plus className="h-4 w-4" />
                {t("addCustomCup")}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
