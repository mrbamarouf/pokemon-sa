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

type MobileScreen = "home" | "featured" | "cards" | "boosters" | "magnets" | "cups" | "apparel" | "rewards" | "cart" | "profile";
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

const screenIds: MobileScreen[] = ["home", "featured", "cards", "boosters", "magnets", "cups", "apparel", "rewards", "cart", "profile"];

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
    home: "Home",
    featured: "Featured",
    cards: "Cards",
    boosters: "Boosters",
    magnets: "Magnets",
    cups: "Cup Studio",
    apparel: "Apparel",
    rewards: "Rewards",
    cart: "Cart",
    profile: "Profile",
    enter: "Enter",
    buy: "Buy",
    openProduct: "Open",
    homeEyebrow: "Official mobile store",
    homeTitle: "Enter the Pokémon SA universe",
    homeLead: "Rare cards, sealed drops, custom gear and daily trainer games arranged as fast app destinations.",
    shopNow: "Shop now",
    customizeNow: "Customize",
    todayDrop: "Today’s drop",
    stageMap: "Store map",
    quickBuy: "Quick buy",
    trainerStatus: "Trainer status",
    featuredTitle: "Launch Pad",
    featuredCopy: "The strongest products first, with price and action visible before you scroll.",
    cardsTitle: "Card Store",
    cardsCopy: "Singles presented like a collector binder: scan, compare, buy.",
    boostersTitle: "Sealed Store",
    boostersCopy: "Booster bundles and boxes feel like a sealed product drop.",
    magnetsTitle: "Sticker Board",
    magnetsCopy: "Small collectibles with playful tap targets and fast gifting actions.",
    cupTitle: "Cup Workshop",
    cupCopy: "Preview first, controls second. Build the cup like a creative station.",
    apparelTitle: "Apparel Studio",
    apparelCopy: "Configure the product first, then add it like a premium apparel app.",
    rewardsTitle: "Trainer Arcade",
    rewardsCopy: "Choose a mini-game, play once per day, then reveal your reward.",
    cartTitle: "Checkout Deck",
    cartCopy: "Review the order, open checkout, or ask us to hunt something rare.",
    profileTitle: "Trainer Profile",
    profileCopy: "Account, language, reward lock and concierge access in one place.",
    startGame: "Start game",
    chooseGame: "Choose your mini-game",
    locked: "Daily game used",
    readyToPlay: "Ready to play",
    createAccount: "Create trainer account",
    activeReward: "Active reward",
    unlockReward: "Play & reveal",
    emptyCartTitle: "Cart is waiting",
    emptyCartCopy: "Start from Cards, Boosters or a custom studio.",
    specialRequest: "Rare hunt concierge",
    accountReady: "Account ready",
    accountMissing: "Account needed",
    languageSwitch: "Language",
  },
  ar: {
    home: "الرئيسية",
    featured: "المميز",
    cards: "الكروت",
    boosters: "المختوم",
    magnets: "المغناطيس",
    cups: "استوديو الكاسات",
    apparel: "الملابس",
    rewards: "اللعبة",
    cart: "السلة",
    profile: "الملف",
    enter: "ادخل",
    buy: "شراء",
    openProduct: "فتح",
    homeEyebrow: "تجربة المتجر على الجوال",
    homeTitle: "ادخل عالم Pokémon SA",
    homeLead: "كروت نادرة، منتجات مختومة، تخصيص سريع، وألعاب يومية داخل وجهات واضحة وسريعة.",
    shopNow: "تسوق الآن",
    customizeNow: "خصص",
    todayDrop: "إصدار اليوم",
    stageMap: "خريطة المتجر",
    quickBuy: "شراء سريع",
    trainerStatus: "حالة المدرب",
    featuredTitle: "منصة البداية",
    featuredCopy: "أقوى المنتجات أولًا، مع السعر والإجراء واضحين قبل التمرير.",
    cardsTitle: "متجر الكروت",
    cardsCopy: "كروت فردية بأسلوب ألبوم جامعين: شاهد، قارن، واشترِ.",
    boostersTitle: "متجر المختوم",
    boostersCopy: "بوسترات وبوكسات تظهر كإصدارات مختومة جاهزة.",
    magnetsTitle: "لوحة الملصقات",
    magnetsCopy: "قطع صغيرة مرحة وسهلة الإهداء والشراء.",
    cupTitle: "ورشة الكاسات",
    cupCopy: "المعاينة أولًا، ثم الإعدادات. صمم الكاس كأنك في ورشة إبداع.",
    apparelTitle: "استوديو الملابس",
    apparelCopy: "كوّن المنتج أولًا ثم أضفه للسلة بأسلوب تطبيق ملابس فاخر.",
    rewardsTitle: "أركيد المدربين",
    rewardsCopy: "اختر لعبة قصيرة، العب مرة يوميًا، ثم اكشف مكافأتك.",
    cartTitle: "منصة الدفع",
    cartCopy: "راجع الطلب، افتح الدفع، أو اطلب منا البحث عن قطعة نادرة.",
    profileTitle: "ملف المدرب",
    profileCopy: "الحساب، اللغة، حالة المكافأة، وخدمة الطلبات الخاصة في مكان واحد.",
    startGame: "ابدأ اللعبة",
    chooseGame: "اختر لعبتك",
    locked: "تم استخدام لعبة اليوم",
    readyToPlay: "جاهز للعب",
    createAccount: "إنشاء حساب مدرب",
    activeReward: "المكافأة الحالية",
    unlockReward: "العب واكشف",
    emptyCartTitle: "السلة بانتظارك",
    emptyCartCopy: "ابدأ من الكروت، المنتجات المختومة، أو استوديو التخصيص.",
    specialRequest: "خدمة البحث عن النادر",
    accountReady: "الحساب جاهز",
    accountMissing: "الحساب مطلوب",
    languageSwitch: "اللغة",
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
    prompt: { en: "Answer before the meter runs out", ar: "أجب قبل انتهاء عداد الطاقة" },
    icon: Zap,
    character: pokemonArt[0],
  },
  {
    code: "GIFT-SA",
    title: { en: "Free Gift", ar: "هدية مجانية" },
    mission: { en: "Gift Catch", ar: "اصطياد الهدية" },
    prompt: { en: "Catch the falling prize", ar: "التقط الجائزة وهي تسقط" },
    icon: Gift,
    character: pokemonArt[4],
  },
  {
    code: "CASH25",
    title: { en: "SAR 25 Cashback", ar: "استرداد 25 ر.س" },
    mission: { en: "Final Battle", ar: "المعركة الأخيرة" },
    prompt: { en: "Win the final trainer round", ar: "اكسب جولة المدرب الأخيرة" },
    icon: Trophy,
    character: pokemonArt[1],
  },
];

const screenToHash = (screen: MobileScreen) => (screen === "home" ? "#top" : screen === "rewards" ? "#game" : `#${screen}`);

const hashToScreen = (hash: string): MobileScreen => {
  const next = hash.replace("#", "");
  if (!next || next === "top") return "home";
  if (next === "game") return "rewards";
  return screenIds.includes(next as MobileScreen) ? (next as MobileScreen) : "home";
};

const ProductActionCard = ({ product, variant = "standard" }: { product: Product; variant?: "standard" | "binder" | "drop" | "sticker" }) => {
  const add = useCart((state) => state.add);
  const { language, t, formatPrice } = useLanguage();

  return (
    <article className={`mobile-app-product-card mobile-app-product-card--${variant}`}>
      <Link to={`/product/${product.id}`} className="mobile-app-product-media" aria-label={product.name[language]}>
        {product.badge && <span>{product.badge[language]}</span>}
        <img src={product.image} alt={product.name[language]} loading="lazy" />
      </Link>
      <div className="mobile-app-product-info">
        <small>{product.subtitle[language]}</small>
        <Link to={`/product/${product.id}`}>{product.name[language]}</Link>
        <div className="mobile-app-product-buy">
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

const ScreenIntro = ({
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
  <div className="mobile-app-screen-intro">
    <div className="mobile-app-screen-icon">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  </div>
);

export const MobileStoreApp = () => {
  const { language, t, formatPrice, toggleLanguage } = useLanguage();
  const add = useCart((state) => state.add);
  const remove = useCart((state) => state.remove);
  const cartItems = useCart((state) => state.items);
  const setCartOpen = useCart((state) => state.setOpen);
  const { account, openAccount, canPlayGame, remainingGameLock, consumeGameChance } = useAccount();
  const copy = mobileCopy[language];
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
  const railRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const featured = useMemo(() => {
    const selected = [products.find((item) => item.featured), cards[0], boosters[0], magnets[0], apparel[0]].filter(Boolean);
    return selected as Product[];
  }, []);

  const destinations = useMemo(
    () => [
      { id: "home" as const, label: copy.home, short: copy.home, icon: Home, accent: "#facc15", theme: "home" },
      { id: "featured" as const, label: copy.featured, short: copy.featured, icon: Star, accent: "#facc15", theme: "featured" },
      { id: "cards" as const, label: copy.cards, short: copy.cards, icon: Sparkles, accent: "#60a5fa", theme: "cards" },
      { id: "boosters" as const, label: copy.boosters, short: copy.boosters, icon: Package, accent: "#f87171", theme: "boosters" },
      { id: "magnets" as const, label: copy.magnets, short: copy.magnets, icon: Magnet, accent: "#34d399", theme: "magnets" },
      { id: "cups" as const, label: copy.cups, short: copy.cups, icon: CupSoda, accent: "#38bdf8", theme: "cups" },
      { id: "apparel" as const, label: copy.apparel, short: copy.apparel, icon: Shirt, accent: "#c084fc", theme: "apparel" },
      { id: "rewards" as const, label: copy.rewards, short: copy.rewards, icon: Gamepad2, accent: "#fb7185", theme: "rewards" },
      { id: "cart" as const, label: copy.cart, short: copy.cart, icon: ShoppingBag, accent: "#facc15", theme: "cart" },
      { id: "profile" as const, label: copy.profile, short: copy.profile, icon: UserRound, accent: "#93c5fd", theme: "profile" },
    ],
    [copy],
  );

  const currentDestination = destinations.find((destination) => destination.id === activeScreen) ?? destinations[0];
  const bottomDestinations = destinations.filter((destination) => ["home", "cards", "cups", "rewards", "cart", "profile"].includes(destination.id));
  const garmentPrintImage = garmentUpload || garmentCharacter.image;
  const cupPrintImage = cupUpload || cupArt.image;
  const showsCupImage = cupMode === "character" || cupMode === "both";
  const showsCupText = cupMode === "text" || cupMode === "both";

  const navigateTo = useCallback((screen: MobileScreen) => {
    setActiveScreen(screen);
    const nextHash = screenToHash(screen);
    if (typeof window !== "undefined" && window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => setActiveScreen(hashToScreen(window.location.hash));
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({ top: 0, behavior: "auto" });
      railRef.current?.querySelector(`[data-screen="${activeScreen}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }, [activeScreen]);

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

  const playReward = (reward: (typeof rewards)[number]) => {
    setSelectedReward(reward);
    if (!account) {
      openAccount();
      return;
    }
    if (consumeGameChance(reward.code)) setUnlockedReward(reward);
  };

  const renderHome = () => (
    <section className="mobile-app-screen mobile-app-home-screen" aria-label={copy.homeTitle}>
      <div className="mobile-app-hero">
        <div className="mobile-app-hero-world" aria-hidden="true">
          <img src={pokemonArt[1].image} alt="" />
          <img src={pokemonArt[3].image} alt="" />
          <img src={pokemonArt[0].image} alt="" />
          <span />
          <span />
        </div>
        <div className="mobile-app-hero-copy">
          <img src={logo} alt="Pokémon SA" />
          <span>{copy.homeEyebrow}</span>
          <h1>{copy.homeTitle}</h1>
          <p>{copy.homeLead}</p>
        </div>
        <div className="mobile-app-hero-actions">
          <button type="button" onClick={() => navigateTo("featured")}>
            <Zap className="h-4 w-4" />
            {copy.shopNow}
          </button>
          <button type="button" onClick={() => navigateTo("cups")}>
            <CupSoda className="h-4 w-4" />
            {copy.customizeNow}
          </button>
        </div>
      </div>

      <div className="mobile-app-status-grid">
        <button type="button" onClick={() => navigateTo("featured")}>
          <small>{copy.todayDrop}</small>
          <strong>{featured[0]?.name[language]}</strong>
          <span>{featured[0] ? formatPrice(featured[0].price) : copy.quickBuy}</span>
        </button>
        <button type="button" onClick={() => navigateTo("profile")}>
          <small>{copy.trainerStatus}</small>
          <strong>{account ? copy.accountReady : copy.accountMissing}</strong>
          <span>{account ? account.name : copy.createAccount}</span>
        </button>
      </div>

      <div className="mobile-app-map">
        <div className="mobile-app-map-title">
          <span>{copy.stageMap}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <div className="mobile-app-map-grid">
          {destinations
            .filter((destination) => destination.id !== "home")
            .map((destination) => {
              const Icon = destination.icon;
              return (
                <button
                  type="button"
                  key={destination.id}
                  onClick={() => navigateTo(destination.id)}
                  className={`mobile-app-map-card mobile-app-map-card--${destination.theme}`}
                >
                  <Icon className="h-5 w-5" />
                  <strong>{destination.label}</strong>
                  <span>{copy.enter}</span>
                </button>
              );
            })}
        </div>
      </div>
    </section>
  );

  const renderFeatured = () => (
    <section className="mobile-app-screen mobile-app-featured-screen">
      <ScreenIntro icon={Star} eyebrow={copy.todayDrop} title={copy.featuredTitle} description={copy.featuredCopy} />
      <div className="mobile-app-feature-spotlight">
        {featured[0] && (
          <>
            <Link to={`/product/${featured[0].id}`}>
              <img src={featured[0].image} alt={featured[0].name[language]} />
            </Link>
            <div>
              <span>{featured[0].subtitle[language]}</span>
              <h2>{featured[0].name[language]}</h2>
              <strong>{formatPrice(featured[0].price)}</strong>
              <button
                type="button"
                onClick={() =>
                  add({
                    id: featured[0].id,
                    name: featured[0].name[language],
                    nameByLanguage: featured[0].name,
                    price: featured[0].price,
                    image: featured[0].image,
                  })
                }
              >
                <Plus className="h-4 w-4" />
                {t("addToCart")}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="mobile-app-drop-feed">
        {featured.slice(1).map((product, index) => (
          <Link to={`/product/${product.id}`} key={product.id} className="mobile-app-feed-row">
            <span>{String(index + 2).padStart(2, "0")}</span>
            <img src={product.image} alt={product.name[language]} loading="lazy" />
            <div>
              <small>{product.subtitle[language]}</small>
              <strong>{product.name[language]}</strong>
              <em>{formatPrice(product.price)}</em>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  );

  const renderCards = () => (
    <section className="mobile-app-screen mobile-app-cards-screen">
      <ScreenIntro icon={Sparkles} eyebrow={copy.cards} title={copy.cardsTitle} description={copy.cardsCopy} />
      <div className="mobile-app-binder">
        {cards.map((product) => (
          <ProductActionCard key={product.id} product={product} variant="binder" />
        ))}
      </div>
    </section>
  );

  const renderBoosters = () => (
    <section className="mobile-app-screen mobile-app-boosters-screen">
      <ScreenIntro icon={Package} eyebrow={copy.boosters} title={copy.boostersTitle} description={copy.boostersCopy} />
      <div className="mobile-app-sealed-hero">
        <Package className="h-5 w-5" />
        <span>{t("sealedDrops")}</span>
        <strong>{boosters.length} {copy.boosters}</strong>
      </div>
      <div className="mobile-app-sealed-list">
        {boosters.map((product) => (
          <ProductActionCard key={product.id} product={product} variant="drop" />
        ))}
      </div>
    </section>
  );

  const renderMagnets = () => (
    <section className="mobile-app-screen mobile-app-magnets-screen">
      <ScreenIntro icon={Magnet} eyebrow={copy.magnets} title={copy.magnetsTitle} description={copy.magnetsCopy} />
      <div className="mobile-app-sticker-wall">
        {magnets.map((product) => (
          <ProductActionCard key={product.id} product={product} variant="sticker" />
        ))}
      </div>
    </section>
  );

  const renderCups = () => (
    <section className="mobile-app-screen mobile-app-cups-screen">
      <ScreenIntro icon={CupSoda} eyebrow={copy.cups} title={copy.cupTitle} description={copy.cupCopy} />
      <div className="mobile-app-studio mobile-app-cup-studio">
        <div className="mobile-app-cup-stage">
          <div
            className={`mobile-app-cup mobile-app-cup-${cupStyle.id}`}
            style={{ "--cup-color": cupColor.hex, "--cup-shadow": cupColor.shadow } as CSSProperties}
          >
            <div className="mobile-app-cup-print">
              {showsCupImage && <img src={cupPrintImage} alt={cupUpload || cupArt.name} />}
              {showsCupText && cupText.trim() && <span>{cupText.trim()}</span>}
            </div>
          </div>
          <div className="mobile-app-studio-summary">
            <strong>{cupStyle.name[language]}</strong>
            <span>{cupColor.name[language]} · {formatPrice(cupStyle.price)}</span>
          </div>
        </div>

        <div className="mobile-app-control-panel">
          <div className="mobile-app-choice-row">
            {cupStyles.map((item) => (
              <button key={item.id} type="button" onClick={() => setCupStyle(item)} aria-pressed={cupStyle.id === item.id}>
                <strong>{item.name[language]}</strong>
                <span>{item.finish[language]}</span>
              </button>
            ))}
          </div>
          <div className="mobile-app-swatches">
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
          <div className="mobile-app-mode-grid">
            {(["character", "text", "both"] as CupMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => setCupMode(mode)} aria-pressed={cupMode === mode}>
                {mode === "text" ? <Type className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                {cupModeLabels[mode][language]}
              </button>
            ))}
          </div>
          {showsCupImage && (
            <div className="mobile-app-character-strip">
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
            <label className="mobile-app-field">
              <span>{t("printedText")}</span>
              <input value={cupText} onChange={(event) => setCupText(event.target.value)} maxLength={28} placeholder={t("textPlaceholder")} />
            </label>
          )}
          <button type="button" className="mobile-app-primary-action" onClick={addCustomCup}>
            <Plus className="h-4 w-4" />
            {t("addCustomCup")}
          </button>
        </div>
      </div>
    </section>
  );

  const renderApparel = () => (
    <section className="mobile-app-screen mobile-app-apparel-screen">
      <ScreenIntro icon={Shirt} eyebrow={copy.apparel} title={copy.apparelTitle} description={copy.apparelCopy} />
      <div className="mobile-app-studio mobile-app-apparel-studio">
        <div className="mobile-app-apparel-stage">
          <img src={garmentStyle.mockups[garmentColor.id] ?? garmentStyle.mockups.clean} alt={garmentStyle.name[language]} />
          <div className={`mobile-app-apparel-print mobile-app-apparel-print-${garmentStyle.id}`}>
            <img src={garmentPrintImage} alt={garmentUpload || garmentCharacter.name} />
            {garmentText.trim() && <span>{garmentText.trim()}</span>}
          </div>
          <div className="mobile-app-studio-summary">
            <strong>{garmentStyle.name[language]}</strong>
            <span>{garmentSize} · {garmentColor.name[language]} · {formatPrice(garmentStyle.price)}</span>
          </div>
        </div>

        <div className="mobile-app-control-panel">
          <div className="mobile-app-choice-row">
            {garmentStyles.map((item) => (
              <button key={item.id} type="button" onClick={() => setGarmentStyle(item)} aria-pressed={garmentStyle.id === item.id}>
                <strong>{item.name[language]}</strong>
                <span>{formatPrice(item.price)}</span>
              </button>
            ))}
          </div>
          <div className="mobile-app-size-grid">
            {apparelSizes.map((item) => (
              <button key={item} type="button" onClick={() => setGarmentSize(item)} aria-pressed={garmentSize === item}>
                {item}
              </button>
            ))}
          </div>
          <div className="mobile-app-swatches">
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
          <div className="mobile-app-character-strip">
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
          <label className="mobile-app-field">
            <span>{t("printedText")}</span>
            <input value={garmentText} onChange={(event) => setGarmentText(event.target.value)} maxLength={24} placeholder={t("textPlaceholder")} />
          </label>
          <button type="button" className="mobile-app-primary-action" onClick={addCustomGarment}>
            <ImageIcon className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>
      <div className="mobile-app-horizontal-rail" aria-label={t("apparel")}>
        {[...tees, ...hoodies].map((product) => (
          <ProductActionCard key={product.id} product={product} variant="standard" />
        ))}
      </div>
    </section>
  );

  const renderRewards = () => {
    const SelectedIcon = selectedReward.icon;
    return (
      <section className="mobile-app-screen mobile-app-rewards-screen">
        <ScreenIntro icon={Gamepad2} eyebrow={copy.rewards} title={copy.rewardsTitle} description={copy.rewardsCopy} />
        <div className="mobile-app-game-cabinet">
          <div className="mobile-app-game-screen">
            <div className="mobile-app-game-scene" aria-hidden="true">
              <img src={selectedReward.character.image} alt="" />
              <span />
              <span />
              <span />
            </div>
            <div className="mobile-app-game-hud">
              <SelectedIcon className="h-5 w-5" />
              <span>{account ? (canPlayGame ? copy.readyToPlay : `${copy.locked} · ${remainingGameLock}`) : copy.createAccount}</span>
            </div>
            <strong>{selectedReward.mission[language]}</strong>
            <p>{selectedReward.prompt[language]}</p>
            <div className="mobile-app-reward-meter">
              <span />
              <span />
              <span />
            </div>
            <div className="mobile-app-prize-readout">
              <small>{copy.activeReward}</small>
              <strong>{unlockedReward.title[language]}</strong>
              <code>{account && !canPlayGame ? unlockedReward.code : "???-??"}</code>
            </div>
          </div>
          <div className="mobile-app-game-select">
            <span>{copy.chooseGame}</span>
            {rewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <button key={reward.code} type="button" onClick={() => playReward(reward)} aria-pressed={selectedReward.code === reward.code}>
                  <Icon className="h-5 w-5" />
                  <strong>{reward.mission[language]}</strong>
                  <small>{reward.prompt[language]}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className="mobile-app-primary-action" onClick={() => playReward(selectedReward)}>
            <Gamepad2 className="h-4 w-4" />
            {account ? copy.unlockReward : copy.createAccount}
          </button>
        </div>
      </section>
    );
  };

  const renderCart = () => (
    <section className="mobile-app-screen mobile-app-cart-screen">
      <ScreenIntro icon={ShoppingBag} eyebrow={copy.cart} title={copy.cartTitle} description={copy.cartCopy} />
      <div className="mobile-app-cart-panel">
        {cartItems.length === 0 ? (
          <div className="mobile-app-empty-cart">
            <ShoppingBag className="h-7 w-7" />
            <strong>{copy.emptyCartTitle}</strong>
            <p>{copy.emptyCartCopy}</p>
            <button type="button" onClick={() => navigateTo("cards")}>
              {copy.shopNow}
            </button>
          </div>
        ) : (
          <div className="mobile-app-cart-list">
            {cartItems.map((item) => {
              const title = item.nameByLanguage?.[language] ?? item.name;
              const variant = item.variantByLanguage?.[language] ?? item.variant;
              return (
                <article key={keyOf(item)} className="mobile-app-cart-item">
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
        <div className="mobile-app-cart-total">
          <span>{t("total")}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </div>
        <button type="button" className="mobile-app-primary-action" onClick={() => setCartOpen(true)}>
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 ? t("checkout") : t("cart")}
        </button>
      </div>
      <Link to="/special-request" className="mobile-app-concierge-card">
        <Search className="h-5 w-5" />
        <div>
          <strong>{copy.specialRequest}</strong>
          <p>{t("specialDescription")}</p>
        </div>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );

  const renderProfile = () => (
    <section className="mobile-app-screen mobile-app-profile-screen">
      <ScreenIntro icon={UserRound} eyebrow={copy.profile} title={copy.profileTitle} description={copy.profileCopy} />
      <div className="mobile-app-profile-card">
        <div className="mobile-app-profile-avatar">
          <UserRound className="h-7 w-7" />
        </div>
        <div>
          <span>{copy.trainerStatus}</span>
          <strong>{account ? account.name : copy.accountMissing}</strong>
          <p>{account ? account.phone : copy.createAccount}</p>
        </div>
        <button type="button" onClick={openAccount}>
          <BadgeCheck className="h-4 w-4" />
          {account ? t("account") : copy.createAccount}
        </button>
      </div>
      <div className="mobile-app-profile-actions">
        <button type="button" onClick={toggleLanguage}>
          <Globe2 className="h-5 w-5" />
          <span>{copy.languageSwitch}</span>
          <strong>{t("language")}</strong>
        </button>
        <button type="button" onClick={() => navigateTo("rewards")}>
          <Gamepad2 className="h-5 w-5" />
          <span>{copy.activeReward}</span>
          <strong>{account && !canPlayGame ? remainingGameLock : copy.readyToPlay}</strong>
        </button>
        <Link to="/special-request">
          <MessageSquare className="h-5 w-5" />
          <span>{copy.specialRequest}</span>
          <strong>{t("specialOrder")}</strong>
        </Link>
      </div>
    </section>
  );

  return (
    <div
      className={`mobile-store-app mobile-app-shell mobile-app-shell--${currentDestination.theme}`}
      style={{ "--screen-accent": currentDestination.accent } as CSSProperties}
    >
      <header className="mobile-app-header">
        <button type="button" onClick={openAccount} aria-label={t("account")}>
          <UserRound className="h-5 w-5" />
        </button>
        <button type="button" className="mobile-app-logo" onClick={() => navigateTo("home")} aria-label={t("brand")}>
          <img src={logo} alt="Pokémon SA" />
        </button>
        <div className="mobile-app-header-actions">
          <button type="button" onClick={toggleLanguage} aria-label="Toggle language">
            <Globe2 className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => navigateTo("cart")} aria-label={t("cart")} className="mobile-app-cart-button">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>

      <nav className="mobile-app-destination-rail" aria-label={copy.stageMap} ref={railRef}>
        {destinations.map((destination) => {
          const Icon = destination.icon;
          return (
            <button
              key={destination.id}
              type="button"
              data-screen={destination.id}
              onClick={() => navigateTo(destination.id)}
              aria-current={activeScreen === destination.id ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{destination.label}</span>
            </button>
          );
        })}
      </nav>

      <main ref={viewportRef} className="mobile-app-viewport" aria-label={currentDestination.label}>
        {activeScreen === "home" && renderHome()}
        {activeScreen === "featured" && renderFeatured()}
        {activeScreen === "cards" && renderCards()}
        {activeScreen === "boosters" && renderBoosters()}
        {activeScreen === "magnets" && renderMagnets()}
        {activeScreen === "cups" && renderCups()}
        {activeScreen === "apparel" && renderApparel()}
        {activeScreen === "rewards" && renderRewards()}
        {activeScreen === "cart" && renderCart()}
        {activeScreen === "profile" && renderProfile()}
      </main>

      <nav className="mobile-app-tabbar" aria-label={t("shop")}>
        {bottomDestinations.map((destination) => {
          const Icon = destination.icon;
          return (
            <button
              key={destination.id}
              type="button"
              data-tab-screen={destination.id}
              onClick={() => navigateTo(destination.id)}
              aria-current={activeScreen === destination.id ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{destination.short}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
