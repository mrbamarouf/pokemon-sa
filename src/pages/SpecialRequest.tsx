import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Image as ImageIcon, MessageSquare, Package, Plus, Search, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/store/cart";
import logo from "@/assets/logo.png";
import card1 from "@/assets/card-1.jpg";
import boosterBox from "@/assets/booster-box.jpg";
import eliteBox from "@/assets/elite-box.jpg";
import { type Language, translate, useLanguage } from "@/context/LanguageContext";

const featuredArt = [card1, boosterBox, eliteBox];

const requestTypes = [
  { labelKey: "rareCard", icon: Star },
  { labelKey: "sealedBox", icon: Package },
  { labelKey: "gradedSlab", icon: CheckCircle2 },
  { labelKey: "customBundle", icon: Search },
];

const conditions = ["any", "nearMint", "lightlyPlayed", "sealedOnly", "graded8", "graded10"];

const SpecialRequest = () => {
  const add = useCart((s) => s.add);
  const { language, t } = useLanguage();
  const [requestType, setRequestType] = useState(requestTypes[0].labelKey);
  const [itemName, setItemName] = useState("");
  const [budget, setBudget] = useState("");
  const [condition, setCondition] = useState(conditions[0]);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = `${t("specialOrder")} — ${t("brand")}`;
    const desc = t("specialDescription");
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, [t]);

  const requestSummaryForLanguage = (targetLanguage: Language) => {
    const name = itemName.trim() || translate(targetLanguage, "specialOrder");
    const parts = [translate(targetLanguage, requestType), name, translate(targetLanguage, condition)];
    if (budget.trim()) parts.push(`${translate(targetLanguage, "budget")} ${budget.trim()}`);
    if (contact.trim()) parts.push(`${translate(targetLanguage, "contact")} ${contact.trim()}`);
    if (referenceName) parts.push(`${targetLanguage === "ar" ? "مرجع" : "Reference"} ${referenceName}`);
    return parts.join(" · ");
  };

  const requestSummary = useMemo(() => {
    return requestSummaryForLanguage(language);
  }, [budget, condition, contact, itemName, language, referenceName, requestType]);

  const handleReference = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setReferenceName(file.name);
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    add({
      id: `special-${requestType}`,
      name: `${t("specialOrder")} Quote`,
      nameByLanguage: { en: `${translate("en", "specialOrder")} Quote`, ar: `عرض سعر ${translate("ar", "specialOrder")}` },
      price: 0,
      image: logo,
      variant: notes.trim() ? `${requestSummary} · ${notes.trim()}` : requestSummary,
      variantByLanguage: {
        en: notes.trim() ? `${requestSummaryForLanguage("en")} · ${notes.trim()}` : requestSummaryForLanguage("en"),
        ar: notes.trim() ? `${requestSummaryForLanguage("ar")} · ${notes.trim()}` : requestSummaryForLanguage("ar"),
      },
    });
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative min-h-screen overflow-hidden pt-36 md:pt-40">
        <div className="absolute inset-0 bg-gradient-to-b from-pk-blue/10 via-background to-background" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--pk-blue)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pk-yellow)/0.18)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="pointer-events-none absolute inset-0">
          {featuredArt.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute hidden object-contain opacity-60 drop-shadow-[0_0_48px_hsl(var(--pk-blue)/0.35)] lg:block ${
                index === 0
                  ? "left-0 top-36 w-72 -rotate-12"
                  : index === 1
                    ? "right-[-2rem] top-28 w-80 rotate-6"
                    : "bottom-10 left-[8%] w-64 rotate-12"
              }`}
            />
          ))}
        </div>

        <div className="container relative z-10 grid min-h-[calc(100vh-10rem)] grid-cols-1 items-center gap-10 pb-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,520px)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-pk-yellow/40 bg-pk-yellow/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-pk-yellow" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-pk-yellow">{t("specialOrder")}</span>
            </div>
            <h1 className="mt-6 break-words font-display text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              <span className="text-gradient-gold">{t("specialTitle")}</span>
              <br />
              <span className="text-gradient-electric">{t("specialSubtitle")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("specialDescription")}
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[t("rareCards"), t("sealedBoxes"), t("quoteFollowUp")].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-card/55 p-4 text-sm font-semibold text-foreground/85">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-pk-yellow" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submitRequest} className="rounded-2xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">{t("requestDetails")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("requestDetailsSub")}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-pk-yellow" />
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("requestType")}</div>
                <div className="grid grid-cols-2 gap-2">
                  {requestTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.labelKey}
                        type="button"
                        onClick={() => setRequestType(type.labelKey)}
                        className={`min-h-12 rounded-xl border px-3 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                          requestType === type.labelKey
                            ? "border-pk-yellow bg-pk-yellow/10 text-pk-yellow"
                            : "border-border bg-muted/30 text-muted-foreground hover:border-pk-blue hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {t(type.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="item-name" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t("cardOrBoxName")}
                </label>
                <input
                  id="item-name"
                  required
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  placeholder={t("cardOrBoxPlaceholder")}
                  className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="budget" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t("budget")}
                  </label>
                  <input
                    id="budget"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder={t("budgetPlaceholder")}
                    className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
                  />
                </div>

                <div>
                  <label htmlFor="condition" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t("condition")}
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(event) => setCondition(event.target.value)}
                    className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
                  >
                    {conditions.map((item) => (
                      <option key={item} value={item}>{t(item)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t("contact")}
                </label>
                <input
                  id="contact"
                  required
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder={t("contactPlaceholder")}
                  className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition focus:border-pk-yellow"
                />
              </div>

              <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-pk-blue/50 bg-pk-blue/10 px-4 text-sm font-semibold text-pk-blue transition hover:border-pk-yellow hover:text-pk-yellow">
                <ImageIcon className="h-4 w-4" />
                {referenceName || t("uploadReference")}
                <input type="file" accept="image/*" className="sr-only" onChange={handleReference} />
              </label>

              <div>
                <label htmlFor="notes" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {t("notes")}
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={t("notesPlaceholder")}
                  className="min-h-28 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-pk-yellow"
                />
              </div>

              <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-electric font-display text-sm font-bold uppercase tracking-wider text-background glow-electric transition-transform hover:scale-[1.02]">
                <Plus className="h-4 w-4" />
                {t("addSpecialRequest")}
              </button>

              {submitted && (
                <div className="rounded-xl border border-pk-yellow/40 bg-pk-yellow/10 p-3 text-sm text-pk-yellow">
                  {t("requestAdded")}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
      <Footer />
      <CartDrawer />
    </main>
  );
};

export default SpecialRequest;
