import { ChangeEvent, CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Minus,
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
import { keyOf, useCart } from "@/store/cart";
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

type MobileScreen = "home" | "featured" | "cards" | "boosters" | "magnets" | "cups" | "apparel" | "rewards" | "cart";
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

const screenIds: MobileScreen[] = ["home", "featured", "cards", "boosters", "magnets", "cups", "apparel", "rewards", "cart"];

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

const copy: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    featured: "Featured",
    cards: "Cards",
    boosters: "Boosters",
    magnets: "Magnets",
    cups: "Cups",
    apparel: "Apparel",
    rewards: "Game",
    cart: "Cart",
    shop: "Shop",
    buy: "Buy",
    open: "Open",
    homeTitle: "Pokémon shopping, made clear",
    homeLead: "Rare cards, sealed boxes, custom cups, apparel, magnets and daily rewards in one clean mobile store.",
    primaryCta: "Shop featured",
    secondaryCta: "Customize",
    quickCategories: "Quick categories",
    featuredTitle: "Featured products",
    featuredLead: "Start with the items worth checking first.",
    cardsTitle: "Cards",
    cardsLead: "Collector singles with image, price and add action up front.",
    boostersTitle: "Boosters and sealed products",
    boostersLead: "Sealed bundles and boxes arranged for quick comparison.",
    magnetsTitle: "Magnets",
    magnetsLead: "Clean collectible gifts with fast add-to-cart actions.",
    cupsTitle: "Custom cups",
    cupsLead: "Preview the cup first, then adjust style, color, image and text.",
    apparelTitle: "Custom apparel",
    apparelLead: "Choose the garment, color, size and print before adding to cart.",
    rewardsTitle: "Trainer game",
    rewardsLead: "Pick a challenge, play once per day, and reveal a store reward.",
    cartTitle: "Cart",
    cartLead: "Review items, open checkout, or request a rare find.",
    accountReady: "Account ready",
    accountNeeded: "Account needed",
    createAccount: "Create account",
    readyToPlay: "Ready to play",
    gameUsed: "Daily game used",
    chooseChallenge: "Choose challenge",
    playReward: "Play and reveal",
    activeReward: "Reward",
    emptyCart: "Your cart is empty.",
    startShopping: "Start shopping",
    rareConcierge: "Special request",
    languageLabel: "Language",
  },
  ar: {
    home: "الرئيسية",
    featured: "المميز",
    cards: "الكروت",
    boosters: "المختوم",
    magnets: "المغناطيس",
    cups: "الكاسات",
    apparel: "الملابس",
    rewards: "اللعبة",
    cart: "السلة",
    shop: "المتجر",
    buy: "شراء",
    open: "فتح",
    homeTitle: "تسوق Pokémon بوضوح",
    homeLead: "كروت نادرة، بوكسات مختومة، كاسات مخصصة، ملابس، مغناطيس ومكافآت يومية داخل متجر جوال مرتب.",
    primaryCta: "تسوق المميز",
    secondaryCta: "خصص منتجك",
    quickCategories: "الأقسام السريعة",
    featuredTitle: "المنتجات المميزة",
    featuredLead: "ابدأ بالمنتجات الأهم قبل الدخول للأقسام.",
    cardsTitle: "الكروت",
    cardsLead: "كروت جامعين مع الصورة والسعر وزر الإضافة بوضوح.",
    boostersTitle: "البوكسات والمنتجات المختومة",
    boostersLead: "منتجات مختومة مرتبة للمقارنة والشراء بسرعة.",
    magnetsTitle: "المغناطيس",
    magnetsLead: "هدايا قابلة للتجميع مع أزرار إضافة واضحة.",
    cupsTitle: "الكاسات المخصصة",
    cupsLead: "شاهد المعاينة أولًا، ثم اختر النوع واللون والصورة والنص.",
    apparelTitle: "الملابس المخصصة",
    apparelLead: "اختر القطعة واللون والمقاس والطباعة قبل الإضافة للسلة.",
    rewardsTitle: "لعبة المدرب",
    rewardsLead: "اختر تحديًا، العب مرة يوميًا، وافتح مكافأة للمتجر.",
    cartTitle: "السلة",
    cartLead: "راجع المنتجات، افتح الدفع، أو اطلب قطعة نادرة.",
    accountReady: "الحساب جاهز",
    accountNeeded: "الحساب مطلوب",
    createAccount: "إنشاء حساب",
    readyToPlay: "جاهز للعب",
    gameUsed: "تم استخدام لعبة اليوم",
    chooseChallenge: "اختر التحدي",
    playReward: "العب واكشف",
    activeReward: "المكافأة",
    emptyCart: "السلة فارغة الآن.",
    startShopping: "ابدأ التسوق",
    rareConcierge: "طلب خاص",
    languageLabel: "اللغة",
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
    prompt: { en: "Answer before the meter ends", ar: "أجب قبل انتهاء العداد" },
    icon: Zap,
    character: pokemonArt[0],
  },
  {
    code: "GIFT-SA",
    title: { en: "Free Gift", ar: "هدية مجانية" },
    mission: { en: "Gift Catch", ar: "اصطياد الهدية" },
    prompt: { en: "Catch the prize", ar: "التقط الجائزة" },
    icon: Gift,
    character: pokemonArt[4],
  },
  {
    code: "CASH25",
    title: { en: "SAR 25 Cashback", ar: "استرداد 25 ر.س" },
    mission: { en: "Final Battle", ar: "المعركة الأخيرة" },
    prompt: { en: "Win the round", ar: "اكسب الجولة" },
    icon: Trophy,
    character: pokemonArt[1],
  },
];

const screenToHash = (screen: MobileScreen) => (screen === "home" ? "#top" : screen === "rewards" ? "#game" : `#${screen}`);

const hashToScreen = (hash: string): MobileScreen => {
  const value = hash.replace("#", "");
  if (!value || value === "top") return "home";
  if (value === "game") return "rewards";
  return screenIds.includes(value as MobileScreen) ? (value as MobileScreen) : "home";
};

const ScreenTitle = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="clean-screen-title">
    <div className="clean-screen-icon">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  </div>
);

const ProductRow = ({ product, compact = false }: { product: Product; compact?: boolean }) => {
  const add = useCart((state) => state.add);
  const { language, t, formatPrice } = useLanguage();

  return (
    <article className={`clean-product-row ${compact ? "is-compact" : ""}`}>
      <Link to={`/product/${product.id}`} className="clean-product-media" aria-label={product.name[language]}>
        {product.badge && <span>{product.badge[language]}</span>}
        <img src={product.image} alt={product.name[language]} loading="lazy" />
      </Link>
      <div className="clean-product-content">
        <small>{product.subtitle[language]}</small>
        <Link to={`/product/${product.id}`} className="clean-product-title">
          {product.name[language]}
        </Link>
        <div className="clean-product-action">
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

export const MobileStoreApp = () => {
  const { language, t, formatPrice, toggleLanguage } = useLanguage();
  const add = useCart((state) => state.add);
  const remove = useCart((state) => state.remove);
  const cartItems = useCart((state) => state.items);
  const setCartOpen = useCart((state) => state.setOpen);
  const { account, openAccount, canPlayGame, remainingGameLock, consumeGameChance } = useAccount();
  const c = copy[language];
  const [activeScreen, setActiveScreen] = useState<MobileScreen>(() => (typeof window === "undefined" ? "home" : hashToScreen(window.location.hash)));
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
  const [selectedReward, setSelectedReward] = useState(rewards[0]);
  const [unlockedReward, setUnlockedReward] = useState(rewards[0]);
  const viewportRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const garmentPrintImage = garmentUpload || garmentCharacter.image;
  const cupPrintImage = cupUpload || cupArt.image;
  const showsCupImage = cupMode === "character" || cupMode === "both";
  const showsCupText = cupMode === "text" || cupMode === "both";

  const featured = useMemo(() => {
    const selected = [products.find((item) => item.featured), cards[0], boosters[0], magnets[0], apparel[0]].filter(Boolean);
    return selected as Product[];
  }, []);

  const navItems = useMemo(
    () => [
      { id: "home" as const, label: c.home, icon: Home },
      { id: "featured" as const, label: c.featured, icon: Star },
      { id: "cards" as const, label: c.cards, icon: Sparkles },
      { id: "boosters" as const, label: c.boosters, icon: Package },
      { id: "magnets" as const, label: c.magnets, icon: Magnet },
      { id: "cups" as const, label: c.cups, icon: CupSoda },
      { id: "apparel" as const, label: c.apparel, icon: Shirt },
      { id: "rewards" as const, label: c.rewards, icon: Gamepad2 },
      { id: "cart" as const, label: c.cart, icon: ShoppingBag },
    ],
    [c],
  );

  const navigateTo = useCallback((screen: MobileScreen) => {
    setActiveScreen(screen);
    const hash = screenToHash(screen);
    if (typeof window !== "undefined" && window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
  }, []);

  useEffect(() => {
    const syncScreen = () => setActiveScreen(hashToScreen(window.location.hash));
    window.addEventListener("hashchange", syncScreen);
    window.addEventListener("popstate", syncScreen);
    return () => {
      window.removeEventListener("hashchange", syncScreen);
      window.removeEventListener("popstate", syncScreen);
    };
  }, []);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeScreen]);

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

  const playReward = (reward = selectedReward) => {
    setSelectedReward(reward);
    if (!account) {
      openAccount();
      return;
    }
    if (consumeGameChance(reward.code)) setUnlockedReward(reward);
  };

  const renderHome = () => (
    <section className="clean-screen clean-home-screen">
      <div className="clean-hero-card">
        <div className="clean-hero-copy">
          <img src={logo} alt="Pokémon SA" />
          <h1>{c.homeTitle}</h1>
          <p>{c.homeLead}</p>
        </div>
        <div className="clean-hero-character" aria-hidden="true">
          <img src={pokemonArt[0].image} alt="" />
        </div>
        <div className="clean-hero-actions">
          <button type="button" onClick={() => navigateTo("featured")}>
            <Star className="h-4 w-4" />
            {c.primaryCta}
          </button>
          <button type="button" onClick={() => navigateTo("cups")}>
            <CupSoda className="h-4 w-4" />
            {c.secondaryCta}
          </button>
        </div>
      </div>

      <div className="clean-home-summary">
        <button type="button" onClick={() => navigateTo("cart")}>
          <ShoppingBag className="h-4 w-4" />
          <span>{cartCount}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </button>
        <button type="button" onClick={openAccount}>
          <UserRound className="h-4 w-4" />
          <span>{account ? c.accountReady : c.accountNeeded}</span>
          <strong>{account ? account.name : c.createAccount}</strong>
        </button>
      </div>

      <div className="clean-section-block">
        <div className="clean-block-heading">
          <h2>{c.quickCategories}</h2>
        </div>
        <div className="clean-category-grid">
          {navItems
            .filter((item) => item.id !== "home" && item.id !== "cart")
            .map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" onClick={() => navigateTo(item.id)}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              );
            })}
          <Link to="/special-request">
            <Search className="h-5 w-5" />
            <span>{c.rareConcierge}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="clean-section-block">
        <div className="clean-block-heading">
          <h2>{c.featuredTitle}</h2>
          <button type="button" onClick={() => navigateTo("featured")}>{c.open}</button>
        </div>
        <div className="clean-list">
          {featured.slice(0, 2).map((product) => (
            <ProductRow key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );

  const renderProductScreen = (screen: MobileScreen, icon: LucideIcon, title: string, lead: string, items: Product[], compact = false) => (
    <section className={`clean-screen clean-products-screen clean-products-${screen}`}>
      <ScreenTitle icon={icon} title={title} description={lead} />
      <div className={screen === "magnets" ? "clean-magnet-grid" : "clean-list"}>
        {items.map((product) => (
          <ProductRow key={product.id} product={product} compact={compact || screen === "magnets"} />
        ))}
      </div>
    </section>
  );

  const renderCups = () => (
    <section className="clean-screen clean-studio-screen">
      <ScreenTitle icon={CupSoda} title={c.cupsTitle} description={c.cupsLead} />
      <div className="clean-studio-card">
        <div className="clean-cup-preview">
          <div
            className={`clean-cup clean-cup-${cupStyle.id}`}
            style={{ "--cup-color": cupColor.hex, "--cup-shadow": cupColor.shadow } as CSSProperties}
          >
            <div className="clean-cup-print">
              {showsCupImage && <img src={cupPrintImage} alt={cupUpload || cupArt.name} />}
              {showsCupText && cupText.trim() && <span>{cupText.trim()}</span>}
            </div>
          </div>
          <div className="clean-preview-meta">
            <strong>{cupStyle.name[language]}</strong>
            <span>{cupColor.name[language]} · {formatPrice(cupStyle.price)}</span>
          </div>
        </div>
        <div className="clean-controls">
          <div className="clean-choice-grid">
            {cupStyles.map((style) => (
              <button key={style.id} type="button" onClick={() => setCupStyle(style)} aria-pressed={cupStyle.id === style.id}>
                <strong>{style.name[language]}</strong>
                <span>{style.finish[language]}</span>
              </button>
            ))}
          </div>
          <div className="clean-swatch-row">
            {cupColors.map((color) => (
              <button
                key={color.name.en}
                type="button"
                onClick={() => setCupColor(color)}
                aria-label={color.name[language]}
                aria-pressed={cupColor.name.en === color.name.en}
                style={{ background: color.hex }}
              />
            ))}
          </div>
          <div className="clean-mode-grid">
            {(["character", "text", "both"] as CupMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => setCupMode(mode)} aria-pressed={cupMode === mode}>
                {mode === "text" ? <Type className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                {cupModeLabels[mode][language]}
              </button>
            ))}
          </div>
          {showsCupImage && (
            <div className="clean-character-row">
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
            <label className="clean-field">
              <span>{t("printedText")}</span>
              <input value={cupText} onChange={(event) => setCupText(event.target.value)} maxLength={28} placeholder={t("textPlaceholder")} />
            </label>
          )}
          <button type="button" className="clean-primary-action" onClick={addCustomCup}>
            <Plus className="h-4 w-4" />
            {t("addCustomCup")}
          </button>
        </div>
      </div>
    </section>
  );

  const renderApparel = () => (
    <section className="clean-screen clean-studio-screen">
      <ScreenTitle icon={Shirt} title={c.apparelTitle} description={c.apparelLead} />
      <div className="clean-studio-card">
        <div className="clean-apparel-preview">
          <img src={garmentStyle.mockups[garmentColor.id] ?? garmentStyle.mockups.clean} alt={garmentStyle.name[language]} />
          <div className={`clean-apparel-print clean-apparel-print-${garmentStyle.id}`}>
            <img src={garmentPrintImage} alt={garmentUpload || garmentCharacter.name} />
            {garmentText.trim() && <span>{garmentText.trim()}</span>}
          </div>
          <div className="clean-preview-meta">
            <strong>{garmentStyle.name[language]}</strong>
            <span>{garmentSize} · {garmentColor.name[language]} · {formatPrice(garmentStyle.price)}</span>
          </div>
        </div>
        <div className="clean-controls">
          <div className="clean-choice-grid is-two">
            {garmentStyles.map((style) => (
              <button key={style.id} type="button" onClick={() => setGarmentStyle(style)} aria-pressed={garmentStyle.id === style.id}>
                <strong>{style.name[language]}</strong>
                <span>{formatPrice(style.price)}</span>
              </button>
            ))}
          </div>
          <div className="clean-size-grid">
            {apparelSizes.map((size) => (
              <button key={size} type="button" onClick={() => setGarmentSize(size)} aria-pressed={garmentSize === size}>
                {size}
              </button>
            ))}
          </div>
          <div className="clean-swatch-row">
            {garmentColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setGarmentColor(color)}
                aria-label={color.name[language]}
                aria-pressed={garmentColor.id === color.id}
                style={{ background: color.hex }}
              />
            ))}
          </div>
          <div className="clean-character-row">
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
          <label className="clean-field">
            <span>{t("printedText")}</span>
            <input value={garmentText} onChange={(event) => setGarmentText(event.target.value)} maxLength={24} placeholder={t("textPlaceholder")} />
          </label>
          <button type="button" className="clean-primary-action" onClick={addCustomGarment}>
            <Plus className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>
      <div className="clean-list">
        {[...tees, ...hoodies].map((product) => (
          <ProductRow key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );

  const renderRewards = () => {
    const SelectedIcon = selectedReward.icon;
    return (
      <section className="clean-screen clean-game-screen">
        <ScreenTitle icon={Gamepad2} title={c.rewardsTitle} description={c.rewardsLead} />
        <div className="clean-game-card">
          <div className="clean-game-stage">
            <img src={selectedReward.character.image} alt="" aria-hidden="true" />
            <div className="clean-game-status">
              <SelectedIcon className="h-5 w-5" />
              <span>{account ? (canPlayGame ? c.readyToPlay : `${c.gameUsed} · ${remainingGameLock}`) : c.createAccount}</span>
            </div>
            <h2>{selectedReward.mission[language]}</h2>
            <p>{selectedReward.prompt[language]}</p>
            <div className="clean-reward-code">
              <span>{c.activeReward}</span>
              <strong>{unlockedReward.title[language]}</strong>
              <code>{account && !canPlayGame ? unlockedReward.code : "???"}</code>
            </div>
          </div>
          <div className="clean-game-options">
            <span>{c.chooseChallenge}</span>
            {rewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <button key={reward.code} type="button" onClick={() => setSelectedReward(reward)} aria-pressed={selectedReward.code === reward.code}>
                  <Icon className="h-4 w-4" />
                  <strong>{reward.mission[language]}</strong>
                  <small>{reward.title[language]}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className="clean-primary-action" onClick={() => playReward()}>
            <Gamepad2 className="h-4 w-4" />
            {account ? c.playReward : c.createAccount}
          </button>
        </div>
      </section>
    );
  };

  const renderCart = () => (
    <section className="clean-screen clean-cart-screen">
      <ScreenTitle icon={ShoppingBag} title={c.cartTitle} description={c.cartLead} />
      <div className="clean-cart-card">
        {cartItems.length === 0 ? (
          <div className="clean-empty-cart">
            <ShoppingBag className="h-8 w-8" />
            <strong>{c.emptyCart}</strong>
            <button type="button" onClick={() => navigateTo("featured")}>{c.startShopping}</button>
          </div>
        ) : (
          <div className="clean-cart-list">
            {cartItems.map((item) => {
              const title = item.nameByLanguage?.[language] ?? item.name;
              const variant = item.variantByLanguage?.[language] ?? item.variant;
              return (
                <article key={keyOf(item)} className="clean-cart-item">
                  <img src={item.image} alt={title} />
                  <div>
                    <strong>{title}</strong>
                    {variant && <span>{variant}</span>}
                    <small>{item.qty} × {formatPrice(item.price)}</small>
                  </div>
                  <button type="button" onClick={() => remove(keyOf(item))} aria-label="Remove item">
                    <Minus className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
        <div className="clean-cart-total">
          <span>{t("total")}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </div>
        <button type="button" className="clean-primary-action" onClick={() => setCartOpen(true)}>
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 ? t("checkout") : t("cart")}
        </button>
      </div>
      <Link to="/special-request" className="clean-concierge-link">
        <Search className="h-5 w-5" />
        <div>
          <strong>{c.rareConcierge}</strong>
          <span>{t("specialDescription")}</span>
        </div>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );

  return (
    <div className="mobile-store-app clean-mobile-app">
      <header className="clean-mobile-header">
        <button type="button" onClick={openAccount} aria-label={t("account")}>
          <UserRound className="h-5 w-5" />
        </button>
        <button type="button" className="clean-mobile-logo" onClick={() => navigateTo("home")} aria-label={t("brand")}>
          <img src={logo} alt="Pokémon SA" />
        </button>
        <div className="clean-header-actions">
          <button type="button" onClick={toggleLanguage} aria-label={c.languageLabel}>
            <Globe2 className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => navigateTo("cart")} aria-label={t("cart")} className="clean-cart-button">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="clean-mobile-viewport" ref={viewportRef} aria-label={navItems.find((item) => item.id === activeScreen)?.label}>
        {activeScreen === "home" && renderHome()}
        {activeScreen === "featured" && (
          <section className="clean-screen clean-products-screen">
            <ScreenTitle icon={Star} title={c.featuredTitle} description={c.featuredLead} />
            <div className="clean-list">
              {featured.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        {activeScreen === "cards" && renderProductScreen("cards", Sparkles, c.cardsTitle, c.cardsLead, cards)}
        {activeScreen === "boosters" && renderProductScreen("boosters", Package, c.boostersTitle, c.boostersLead, boosters)}
        {activeScreen === "magnets" && renderProductScreen("magnets", Magnet, c.magnetsTitle, c.magnetsLead, magnets, true)}
        {activeScreen === "cups" && renderCups()}
        {activeScreen === "apparel" && renderApparel()}
        {activeScreen === "rewards" && renderRewards()}
        {activeScreen === "cart" && renderCart()}
      </main>

      <nav className="clean-mobile-nav" aria-label={c.shop}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              data-screen={item.id}
              onClick={() => navigateTo(item.id)}
              aria-current={activeScreen === item.id ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
