import { ChangeEvent, CSSProperties, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  CupSoda,
  Gamepad2,
  Gift,
  Globe2,
  Home,
  Image as ImageIcon,
  type LucideIcon,
  Magnet,
  MessageSquare,
  Package,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Type,
  Upload,
  UserRound,
  Zap,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Product, products, productsByCategory } from "@/data/products";
import { Language, useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/store/cart";
import { useAccount } from "@/context/AccountContext";
import teeBlack from "@/assets/custom-tee-black.jpg";
import teeBlue from "@/assets/custom-tee-blue.jpg";
import teeClean from "@/assets/custom-tee-clean.jpg";
import teeRed from "@/assets/custom-tee-red.jpg";
import teeWhite from "@/assets/custom-tee-white.jpg";
import teeYellow from "@/assets/custom-tee-yellow.jpg";
import hoodieBlack from "@/assets/custom-hoodie-black.jpg";
import hoodieBlue from "@/assets/custom-hoodie-blue.jpg";
import hoodieClean from "@/assets/custom-hoodie-clean.jpg";
import hoodieRed from "@/assets/custom-hoodie-red.jpg";
import hoodieWhite from "@/assets/custom-hoodie-white.jpg";
import hoodieYellow from "@/assets/custom-hoodie-yellow.jpg";

type CustomColorId = "black" | "white" | "blue" | "red" | "yellow";
type GarmentId = "tee" | "hoodie";
type CupMode = "character" | "text" | "both";

type CustomColor = {
  id: CustomColorId;
  name: Record<Language, string>;
  hex: string;
};

type GarmentStyle = {
  id: GarmentId;
  name: Record<Language, string>;
  price: number;
  mockups: Record<CustomColorId | "clean", string>;
};

type CupStyle = {
  id: string;
  name: Record<Language, string>;
  price: number;
  finish: Record<Language, string>;
};

const cards = productsByCategory("cards");
const boosters = productsByCategory("boosters");
const magnets = productsByCategory("magnets");
const apparel = productsByCategory("apparel");
const tees = apparel.filter((item) => item.id.startsWith("t"));
const hoodies = apparel.filter((item) => item.id.startsWith("h"));

const pokemonArt = [
  { name: "Pikachu", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
  { name: "Charizard", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" },
  { name: "Mewtwo", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png" },
  { name: "Rayquaza", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/384.png" },
  { name: "Eevee", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png" },
  { name: "Gengar", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png" },
  { name: "Lucario", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/448.png" },
  { name: "Dragonite", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png" },
];

const garmentStyles: GarmentStyle[] = [
  {
    id: "tee",
    name: { en: "Custom T-Shirt", ar: "تيشيرت مخصص" },
    price: 499,
    mockups: { black: teeBlack, white: teeWhite, blue: teeBlue, red: teeRed, yellow: teeYellow, clean: teeClean },
  },
  {
    id: "hoodie",
    name: { en: "Custom Hoodie", ar: "هودي مخصص" },
    price: 999,
    mockups: { black: hoodieBlack, white: hoodieWhite, blue: hoodieBlue, red: hoodieRed, yellow: hoodieYellow, clean: hoodieClean },
  },
];

const garmentColors: CustomColor[] = [
  { id: "black", name: { en: "Black", ar: "أسود" }, hex: "#0a0a0a" },
  { id: "white", name: { en: "White", ar: "أبيض" }, hex: "#f8fafc" },
  { id: "blue", name: { en: "Electric Blue", ar: "أزرق كهربائي" }, hex: "#2563eb" },
  { id: "red", name: { en: "Trainer Red", ar: "أحمر المدرب" }, hex: "#dc2626" },
  { id: "yellow", name: { en: "Volt Yellow", ar: "أصفر كهربائي" }, hex: "#facc15" },
];

const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];

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

const mobileCopy: Record<Language, Record<string, string>> = {
  en: {
    appHome: "Home",
    featured: "Featured",
    collections: "Collections",
    sealedStore: "Sealed Store",
    cardStore: "Card Store",
    magnetPlay: "Magnet Play",
    customization: "Customization",
    rewards: "Rewards",
    checkout: "Checkout",
    enter: "Enter",
    buy: "Buy",
    openProduct: "Open Product",
    appIntro: "Enter the Pokémon SA world: rare cards, sealed drops, custom gear, quick games and special hunts.",
    featuredCopy: "Start with the strongest products before choosing a category.",
    collectionCopy: "Singles appear like a collector vault: image, name, price and buy action immediately.",
    sealedCopy: "Sealed products are arranged like a drop board with pack count, price and action first.",
    magnetCopy: "Small collectible gifts in a playful sticker board.",
    cupWorkshop: "Cup Workshop",
    apparelStudio: "Apparel Studio",
    rewardsCopy: "Play one quick challenge, unlock a code, then finish the order.",
    gameArenaTitle: "Trainer Mini Game",
    gameArenaCopy: "Choose a challenge, play your daily round, then reveal the prize code.",
    checkoutCopy: "Review the cart, create an account, or ask us to hunt a rare item.",
    concierge: "Concierge",
    trainerAccount: "Trainer Account",
    readyToPlay: "Ready to play",
    locked: "Daily reward used",
    chooseReward: "Choose a challenge",
    unlockReward: "Unlock Reward",
  },
  ar: {
    appHome: "الرئيسية",
    featured: "المميز",
    collections: "المجموعات",
    sealedStore: "المختوم",
    cardStore: "متجر الكروت",
    magnetPlay: "المغناطيس",
    customization: "التخصيص",
    rewards: "المكافآت",
    checkout: "الدفع",
    enter: "ادخل",
    buy: "شراء",
    openProduct: "فتح المنتج",
    appIntro: "ادخل عالم Pokémon SA: كروت نادرة، منتجات مختومة، تخصيص سريع، ألعاب قصيرة وطلبات خاصة.",
    featuredCopy: "ابدأ بأقوى المنتجات قبل اختيار المنطقة المناسبة.",
    collectionCopy: "الكروت تظهر كخزنة جامعين: صورة، اسم، سعر، وزر شراء مباشرة.",
    sealedCopy: "المنتجات المختومة مرتبة كإصدارات جاهزة مع السعر والإجراء أولًا.",
    magnetCopy: "هدايا صغيرة قابلة للتجميع داخل لوحة مرحة.",
    cupWorkshop: "ورشة الكاسات",
    apparelStudio: "استوديو الملابس",
    rewardsCopy: "العب تحديًا سريعًا، افتح كودًا، ثم أكمل الطلب.",
    gameArenaTitle: "لعبة المدرب السريعة",
    gameArenaCopy: "اختر تحديًا، العب جولتك اليومية، ثم اكشف كود الجائزة.",
    checkoutCopy: "راجع السلة، أنشئ حسابك، أو اطلب منا البحث عن قطعة نادرة.",
    concierge: "كونسيرج",
    trainerAccount: "حساب المدرب",
    readyToPlay: "جاهز للعب",
    locked: "تم استخدام مكافأة اليوم",
    chooseReward: "اختر التحدي",
    unlockReward: "فتح المكافأة",
  },
};

const cupModeLabels: Record<CupMode, Record<Language, string>> = {
  character: { en: "Image", ar: "صورة" },
  text: { en: "Text", ar: "نص" },
  both: { en: "Both", ar: "الاثنين" },
};

const rewards = [
  {
    code: "QUIZ10",
    title: { en: "10% Off", ar: "خصم 10%" },
    mission: { en: "Volt Quiz", ar: "اختبار البرق" },
    prompt: { en: "Answer fast", ar: "أجب بسرعة" },
    icon: Zap,
  },
  {
    code: "GIFT-SA",
    title: { en: "Free Gift", ar: "هدية مجانية" },
    mission: { en: "Gift Catch", ar: "اصطياد الهدية" },
    prompt: { en: "Catch the prize", ar: "التقط الجائزة" },
    icon: Gift,
  },
  {
    code: "CASH25",
    title: { en: "SAR 25 Cashback", ar: "استرداد 25 ر.س" },
    mission: { en: "Final Battle", ar: "المعركة الأخيرة" },
    prompt: { en: "Win the round", ar: "اكسب الجولة" },
    icon: Trophy,
  },
];

const MobileProductAction = ({ product, compact = false }: { product: Product; compact?: boolean }) => {
  const add = useCart((state) => state.add);
  const { language, t, formatPrice } = useLanguage();

  return (
    <article className={`mobile-native-product ${compact ? "is-compact" : ""}`}>
      <Link to={`/product/${product.id}`} className="mobile-native-product-media">
        <img src={product.image} alt={product.name[language]} loading="lazy" />
      </Link>
      <div className="mobile-native-product-info">
        <span className="mobile-native-product-kicker">{product.subtitle[language]}</span>
        <Link to={`/product/${product.id}`} className="mobile-native-product-title">
          {product.name[language]}
        </Link>
        <div className="mobile-native-product-row">
          <strong>{formatPrice(product.price)}</strong>
          <button
            type="button"
            onClick={() =>
              add({
                id: product.id,
                name: product.name[language],
                nameByLanguage: product.name,
                price: product.price,
                image: product.image,
              })
            }
          >
            <Plus className="h-4 w-4" />
            {t("add")}
          </button>
        </div>
      </div>
    </article>
  );
};

const ChapterHeading = ({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="mobile-native-heading">
    <div className="mobile-native-heading-orb">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

export const MobileStoreApp = () => {
  const { language, t, formatPrice, toggleLanguage } = useLanguage();
  const add = useCart((state) => state.add);
  const count = useCart((state) => state.count);
  const total = useCart((state) => state.total);
  const setCartOpen = useCart((state) => state.setOpen);
  const { account, openAccount, canPlayGame, remainingGameLock, consumeGameChance } = useAccount();
  const c = mobileCopy[language];
  const [garmentStyle, setGarmentStyle] = useState(garmentStyles[0]);
  const [garmentColor, setGarmentColor] = useState(garmentColors[0]);
  const [garmentSize, setGarmentSize] = useState("M");
  const [garmentCharacter, setGarmentCharacter] = useState(pokemonArt[0]);
  const [garmentText, setGarmentText] = useState("Pokémon SA");
  const [garmentUpload, setGarmentUpload] = useState("");
  const [cupStyle, setCupStyle] = useState(cupStyles[0]);
  const [cupColor, setCupColor] = useState(cupColors[0]);
  const [cupMode, setCupMode] = useState<CupMode>("both");
  const [cupArt, setCupArt] = useState(pokemonArt[0]);
  const [cupText, setCupText] = useState("Catch Your Power");
  const [cupUpload, setCupUpload] = useState("");
  const [unlockedReward, setUnlockedReward] = useState(rewards[0]);
  const [activeDestination, setActiveDestination] = useState("#top");

  const featured = useMemo(() => {
    const selected = [products.find((item) => item.featured), cards[0], boosters[0], apparel[0]].filter(Boolean);
    return selected as Product[];
  }, []);

  const garmentPrintImage = garmentUpload || garmentCharacter.image;
  const cupPrintImage = cupUpload || cupArt.image;
  const showsCupImage = cupMode === "character" || cupMode === "both";
  const showsCupText = cupMode === "text" || cupMode === "both";

  const garmentVariantFor = (targetLanguage: Language) => {
    const parts = [garmentStyle.name[targetLanguage], garmentSize, garmentColor.name[targetLanguage], garmentUpload ? "Custom image" : garmentCharacter.name];
    if (garmentText.trim()) parts.push(`"${garmentText.trim()}"`);
    return parts.join(" · ");
  };

  const cupNameFor = (targetLanguage: Language) =>
    targetLanguage === "ar" ? `كاس مخصص ${cupStyle.name[targetLanguage]}` : `Custom ${cupStyle.name[targetLanguage]}`;

  const cupVariantFor = (targetLanguage: Language) => {
    const parts = [cupStyle.name[targetLanguage], cupColor.name[targetLanguage], cupModeLabels[cupMode][targetLanguage]];
    if (showsCupImage) parts.push(cupUpload ? "Custom image" : cupArt.name);
    if (showsCupText && cupText.trim()) parts.push(`"${cupText.trim()}"`);
    return parts.join(" · ");
  };

  const uploadGarment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setGarmentUpload(URL.createObjectURL(file));
  };

  const uploadCup = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCupUpload(URL.createObjectURL(file));
    if (cupMode === "text") setCupMode("both");
  };

  const addCustomGarment = () => {
    add({
      id: `custom-apparel-${garmentStyle.id}`,
      name: garmentStyle.name[language],
      nameByLanguage: garmentStyle.name,
      price: garmentStyle.price,
      image: garmentPrintImage,
      variant: garmentVariantFor(language),
      variantByLanguage: { en: garmentVariantFor("en"), ar: garmentVariantFor("ar") },
    });
  };

  const addCustomCup = () => {
    add({
      id: `cup-${cupStyle.id}`,
      name: cupNameFor(language),
      nameByLanguage: { en: cupNameFor("en"), ar: cupNameFor("ar") },
      price: cupStyle.price,
      image: showsCupImage ? cupPrintImage : logo,
      variant: cupVariantFor(language),
      variantByLanguage: { en: cupVariantFor("en"), ar: cupVariantFor("ar") },
    });
  };

  const unlockReward = (reward: (typeof rewards)[number]) => {
    if (!account) {
      openAccount();
      return;
    }
    if (consumeGameChance(reward.code)) setUnlockedReward(reward);
  };

  const destinations = useMemo(
    () => [
      { href: "#top", label: c.appHome, icon: Home },
      { href: "#featured", label: c.featured, icon: Star },
      { href: "#cards", label: t("cards"), icon: Sparkles },
      { href: "#boosters", label: t("boosters"), icon: Package },
      { href: "#cups", label: t("cups"), icon: CupSoda },
      { href: "#game", label: t("game"), icon: Gamepad2 },
      { href: "#checkout", label: c.checkout, icon: ShoppingBag },
    ],
    [c, t],
  );

  useEffect(() => {
    const sections = destinations.map((item) => document.getElementById(item.href.slice(1))).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveDestination(`#${visible.target.id}`);
      },
      { rootMargin: "-34% 0px -52% 0px", threshold: [0.08, 0.24, 0.42, 0.65] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [destinations]);

  useEffect(() => {
    const alignHash = () => {
      if (!window.location.hash) return;
      const targetId = window.decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ block: "start", behavior: "auto" });
    };

    alignHash();
    const timers = [120, 650, 1400, 3600].map((delay) => window.setTimeout(alignHash, delay));
    window.addEventListener("hashchange", alignHash);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("hashchange", alignHash);
    };
  }, []);

  return (
    <div className="mobile-store-app">
      <header className="mobile-native-header">
        <button type="button" onClick={openAccount} aria-label={t("account")}>
          <UserRound className="h-5 w-5" />
        </button>
        <a href="#top" className="mobile-native-logo" aria-label={t("brand")}>
          <img src={logo} alt="Pokémon SA" />
        </a>
        <div className="mobile-native-header-actions">
          <button type="button" onClick={toggleLanguage} aria-label="Toggle language">
            <Globe2 className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setCartOpen(true)} aria-label={t("cart")} className="mobile-native-cart-button">
            <ShoppingBag className="h-5 w-5" />
            {count() > 0 && <span>{count()}</span>}
          </button>
        </div>
      </header>

      <section id="top" className="mobile-native-hero">
        <div className="mobile-native-hero-sky" aria-hidden="true">
          <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" alt="" />
          <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/384.png" alt="" />
          <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" alt="" />
        </div>
        <div className="mobile-native-hero-portal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mobile-native-hero-panel">
          <img src={logo} alt="Pokémon SA" />
          <h1>{t("brand")}</h1>
          <p>{c.appIntro}</p>
          <div className="mobile-native-hero-actions">
            <a href="#featured">{t("shopTheDrop")}</a>
            <a href="#cups">{t("customizeCups")}</a>
          </div>
        </div>
        <div className="mobile-native-map">
          {[
            { href: "#cards", label: c.cardStore, icon: Sparkles },
            { href: "#boosters", label: c.sealedStore, icon: Package },
            { href: "#apparel", label: c.apparelStudio, icon: Shirt },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a href={item.href} key={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </div>
      </section>

      <section id="featured" className="mobile-native-chapter mobile-native-featured">
        <ChapterHeading icon={Star} eyebrow={c.featured} title={t("bestValue")} description={c.featuredCopy} />
        <div className="mobile-native-feature-stack">
          {featured.map((item, index) => (
            <Link to={`/product/${item.id}`} className="mobile-native-feature-card" key={item.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <img src={item.image} alt={item.name[language]} loading="lazy" />
              <div>
                <small>{item.subtitle[language]}</small>
                <strong>{item.name[language]}</strong>
                <em>{formatPrice(item.price)}</em>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </section>

      <section id="cards" className="mobile-native-chapter mobile-native-card-store">
        <ChapterHeading icon={Sparkles} eyebrow={c.cardStore} title={t("cardsTitle")} description={c.collectionCopy} />
        <div className="mobile-native-card-vault">
          {cards.map((item, index) => (
            <MobileProductAction key={item.id} product={item} compact={index > 0} />
          ))}
        </div>
      </section>

      <section id="boosters" className="mobile-native-chapter mobile-native-sealed-store">
        <ChapterHeading icon={Package} eyebrow={c.sealedStore} title={t("boostersTitle")} description={c.sealedCopy} />
        <div className="mobile-native-drop-board">
          {boosters.map((item) => (
            <MobileProductAction key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section id="magnets" className="mobile-native-chapter mobile-native-magnet-play">
        <ChapterHeading icon={Magnet} eyebrow={c.magnetPlay} title={t("magnetsTitle")} description={c.magnetCopy} />
        <div className="mobile-native-sticker-board">
          {magnets.map((item) => (
            <article key={item.id} className="mobile-native-sticker">
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name[language]} loading="lazy" />
              </Link>
              <strong>{item.name[language]}</strong>
              <span>{formatPrice(item.price)}</span>
              <button
                type="button"
                onClick={() =>
                  add({
                    id: item.id,
                    name: item.name[language],
                    nameByLanguage: item.name,
                    price: item.price,
                    image: item.image,
                  })
                }
              >
                <Plus className="h-4 w-4" />
                {t("add")}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="cups" className="mobile-native-chapter mobile-native-workshop">
        <ChapterHeading icon={CupSoda} eyebrow={c.cupWorkshop} title={t("cupsTitle")} description={t("cupsDescription")} />
        <div className="mobile-native-cup-preview">
          <div className="mobile-native-cup-stage">
            <div
              className={`mobile-native-cup mobile-native-cup-${cupStyle.id}`}
              style={{ "--cup-color": cupColor.hex, "--cup-shadow": cupColor.shadow } as CSSProperties}
            >
              <div className="mobile-native-cup-print">
                {showsCupImage && <img src={cupPrintImage} alt={cupUpload || cupArt.name} />}
                {showsCupText && cupText.trim() && <span>{cupText.trim()}</span>}
              </div>
            </div>
          </div>
          <div className="mobile-native-cup-summary">
            <strong>{cupStyle.name[language]}</strong>
            <span>{formatPrice(cupStyle.price)}</span>
          </div>
        </div>
        <div className="mobile-native-control-sheet">
          <div className="mobile-native-segment">
            {cupStyles.map((item) => (
              <button key={item.id} type="button" onClick={() => setCupStyle(item)} aria-pressed={cupStyle.id === item.id}>
                <span>{item.name[language]}</span>
                <small>{item.finish[language]}</small>
              </button>
            ))}
          </div>
          <div className="mobile-native-swatches">
            {cupColors.map((item) => (
              <button
                key={item.name.en}
                type="button"
                onClick={() => setCupColor(item)}
                aria-label={item.name[language]}
                aria-pressed={cupColor.name.en === item.name.en}
                style={{ background: item.hex }}
              />
            ))}
          </div>
          <div className="mobile-native-mode-grid">
            {(["character", "text", "both"] as CupMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => setCupMode(mode)} aria-pressed={cupMode === mode}>
                {cupModeLabels[mode][language]}
              </button>
            ))}
          </div>
          {showsCupImage && (
            <div className="mobile-native-character-strip">
              {pokemonArt.slice(0, 6).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setCupArt(item);
                    setCupUpload("");
                  }}
                  aria-pressed={!cupUpload && cupArt.name === item.name}
                >
                  <img src={item.image} alt={item.name} />
                </button>
              ))}
              <label>
                <Upload className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={uploadCup} />
              </label>
            </div>
          )}
          {showsCupText && (
            <label className="mobile-native-field">
              <span>{t("printedText")}</span>
              <input value={cupText} onChange={(event) => setCupText(event.target.value)} maxLength={28} placeholder={t("textPlaceholder")} />
            </label>
          )}
          <button type="button" className="mobile-native-primary-action" onClick={addCustomCup}>
            <Plus className="h-4 w-4" />
            {t("addCustomCup")}
          </button>
        </div>
      </section>

      <section id="apparel" className="mobile-native-chapter mobile-native-apparel">
        <ChapterHeading icon={Shirt} eyebrow={c.apparelStudio} title={t("customApparelTitle")} description={t("customApparelDescription")} />
        <div className="mobile-native-apparel-preview">
          <div className="mobile-native-apparel-stage">
            <img src={garmentStyle.mockups[garmentColor.id] ?? garmentStyle.mockups.clean} alt={garmentStyle.name[language]} />
            <div className={`mobile-native-apparel-print mobile-native-apparel-print-${garmentStyle.id}`}>
              <img src={garmentPrintImage} alt={garmentUpload || garmentCharacter.name} />
              {garmentText.trim() && <span>{garmentText.trim()}</span>}
            </div>
          </div>
          <div className="mobile-native-apparel-summary">
            <strong>{garmentStyle.name[language]}</strong>
            <span>{garmentSize} · {garmentColor.name[language]} · {formatPrice(garmentStyle.price)}</span>
          </div>
        </div>
        <div className="mobile-native-control-sheet">
          <div className="mobile-native-segment">
            {garmentStyles.map((item) => (
              <button key={item.id} type="button" onClick={() => setGarmentStyle(item)} aria-pressed={garmentStyle.id === item.id}>
                <span>{item.name[language]}</span>
                <small>{formatPrice(item.price)}</small>
              </button>
            ))}
          </div>
          <div className="mobile-native-size-grid">
            {apparelSizes.map((item) => (
              <button key={item} type="button" onClick={() => setGarmentSize(item)} aria-pressed={garmentSize === item}>
                {item}
              </button>
            ))}
          </div>
          <div className="mobile-native-swatches">
            {garmentColors.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGarmentColor(item)}
                aria-label={item.name[language]}
                aria-pressed={garmentColor.id === item.id}
                style={{ background: item.hex }}
              />
            ))}
          </div>
          <div className="mobile-native-character-strip">
            {pokemonArt.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setGarmentCharacter(item);
                  setGarmentUpload("");
                }}
                aria-pressed={!garmentUpload && garmentCharacter.name === item.name}
              >
                <img src={item.image} alt={item.name} />
              </button>
            ))}
            <label>
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" onChange={uploadGarment} />
            </label>
          </div>
          <label className="mobile-native-field">
            <span>{t("printedText")}</span>
            <input value={garmentText} onChange={(event) => setGarmentText(event.target.value)} maxLength={24} placeholder={t("textPlaceholder")} />
          </label>
          <button type="button" className="mobile-native-primary-action" onClick={addCustomGarment}>
            <ImageIcon className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
        <div className="mobile-native-apparel-products">
          {[...tees, ...hoodies].map((item) => (
            <MobileProductAction key={item.id} product={item} compact />
          ))}
        </div>
      </section>

      <section id="game" className="mobile-native-chapter mobile-native-rewards">
        <ChapterHeading icon={Gamepad2} eyebrow={c.rewards} title={c.gameArenaTitle} description={c.gameArenaCopy} />
        <div className="mobile-native-arcade">
          <div className="mobile-native-arcade-screen">
            <div className="mobile-native-game-scene" aria-hidden="true">
              <img src={pokemonArt[0].image} alt="" />
              <span />
              <span />
              <span />
            </div>
            <div className="mobile-native-game-status">
              <Gamepad2 className="h-5 w-5" />
              <span>{account ? (canPlayGame ? c.readyToPlay : `${c.locked} · ${remainingGameLock}`) : c.trainerAccount}</span>
            </div>
            <strong>{unlockedReward.mission[language]}</strong>
            <p>{unlockedReward.prompt[language]}</p>
            <div className="mobile-native-prize-chip">
              <Trophy className="h-4 w-4" />
              <span>{unlockedReward.title[language]}</span>
              <code>{unlockedReward.code}</code>
            </div>
          </div>
          <div className="mobile-native-reward-grid">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <button key={reward.code} type="button" onClick={() => unlockReward(reward)}>
                  <Icon className="h-5 w-5" />
                  <span>{reward.mission[language]}</span>
                  <small>{reward.prompt[language]}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className="mobile-native-primary-action" onClick={account ? undefined : openAccount}>
            <BadgeCheck className="h-4 w-4" />
            {account ? c.chooseReward : c.trainerAccount}
          </button>
        </div>
      </section>

      <section id="checkout" className="mobile-native-chapter mobile-native-checkout">
        <ChapterHeading icon={ShoppingBag} eyebrow={c.checkout} title={t("cart")} description={c.checkoutCopy} />
        <div className="mobile-native-checkout-card">
          <div>
            <span>{t("total")}</span>
            <strong>{formatPrice(total())}</strong>
          </div>
          <button type="button" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-4 w-4" />
            {count() > 0 ? t("checkout") : t("cart")}
          </button>
        </div>
        <div className="mobile-native-concierge">
          <div>
            <Search className="h-5 w-5" />
            <strong>{c.concierge}</strong>
            <p>{t("specialDescription")}</p>
          </div>
          <Link to="/special-request">
            <MessageSquare className="h-4 w-4" />
            {t("specialOrder")}
          </Link>
        </div>
      </section>

      <footer className="mobile-native-footer">
        <img src={logo} alt="Pokémon SA" />
        <p>{t("footerDescription")}</p>
      </footer>

      <nav className="mobile-native-tabbar" aria-label={t("shop")}>
        {destinations.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href} className={activeDestination === item.href ? "is-active" : undefined}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};
