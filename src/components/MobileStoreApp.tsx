import { ChangeEvent, CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  CupSoda,
  Gamepad2,
  Gift,
  Globe2,
  Grid2X2,
  Heart,
  Home,
  Image as ImageIcon,
  type LucideIcon,
  Magnet,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Truck,
  Type,
  Upload,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";
import logo from "@/assets/logo.png";
import {
  apparelSizes,
  cupColors,
  cupModeLabels,
  cupStyles,
  garmentColors,
  garmentStyles,
  pokemonArt,
  type CupMode,
} from "@/lib/shopify/customization";
import { mobileRewards, type RewardIconId } from "@/lib/shopify/rewards";
import { Language, useLanguage } from "@/context/LanguageContext";
import { useCommerce } from "@/context/CommerceContext";
import { keyOf, useCart } from "@/store/cart";
import { createCustomCartItem, createProductCartItem } from "@/lib/shopify/cart";
import { useAccount } from "@/context/AccountContext";
import { getProductVariantIdForOptions, type Product } from "@/lib/shopify/products";

type MobileScreen = "home" | "categories" | "products" | "detail" | "cart" | "games" | "account" | "cup" | "apparel" | "checkout";
type ShopCategoryId = "all" | "featured" | Product["category"];
type ProductOptionColor = NonNullable<Product["colors"]>[number];

type LocalizedText = Record<Language, string>;

const screenIds: MobileScreen[] = ["home", "categories", "products", "detail", "cart", "games", "account", "cup", "apparel", "checkout"];
const destinationScreens: MobileScreen[] = ["home", "categories", "products", "cup", "apparel", "cart", "checkout", "games", "account"];
const bottomScreens: MobileScreen[] = ["home", "categories", "cart", "games", "account"];

const categoryLabels: Record<ShopCategoryId, LocalizedText> = {
  all: { en: "All products", ar: "كل المنتجات" },
  featured: { en: "Featured", ar: "المميز" },
  cards: { en: "Cards", ar: "الكروت" },
  boosters: { en: "Boosters", ar: "البوكسات" },
  magnets: { en: "Magnets", ar: "المغناطيس" },
  apparel: { en: "Ready apparel", ar: "الملابس الجاهزة" },
};

const screenMeta: Record<MobileScreen, { label: LocalizedText; icon: LucideIcon; accent: string; theme: string }> = {
  home: { label: { en: "Home", ar: "الرئيسية" }, icon: Home, accent: "#facc15", theme: "home" },
  categories: { label: { en: "Categories", ar: "الأقسام" }, icon: Grid2X2, accent: "#60a5fa", theme: "categories" },
  products: { label: { en: "Products", ar: "المنتجات" }, icon: Package, accent: "#facc15", theme: "products" },
  detail: { label: { en: "Product Detail", ar: "تفاصيل المنتج" }, icon: Sparkles, accent: "#facc15", theme: "detail" },
  cart: { label: { en: "Cart", ar: "السلة" }, icon: ShoppingBag, accent: "#facc15", theme: "cart" },
  games: { label: { en: "Games", ar: "الألعاب" }, icon: Gamepad2, accent: "#fb7185", theme: "games" },
  account: { label: { en: "Account", ar: "الحساب" }, icon: UserRound, accent: "#93c5fd", theme: "account" },
  cup: { label: { en: "Custom Cup", ar: "تصميم كوب" }, icon: CupSoda, accent: "#38bdf8", theme: "cup" },
  apparel: { label: { en: "Custom Apparel", ar: "تصميم ملابس" }, icon: Shirt, accent: "#c084fc", theme: "apparel" },
  checkout: { label: { en: "Checkout", ar: "إتمام الطلب" }, icon: CreditCard, accent: "#34d399", theme: "checkout" },
};

const mobileCopy = {
  en: {
    homeEyebrow: "Mobile app experience",
    homeTitle: "Pokémon SA Store",
    homeLead: "Shop cards, sealed products, magnets, custom cups, apparel and daily trainer games from clear mobile screens.",
    shopNow: "Shop products",
    browseCategories: "Browse categories",
    featuredProducts: "Featured products",
    popularServices: "Services",
    categoriesTitle: "Clear store sections",
    categoriesLead: "Choose one section, then browse a focused product screen with price and add action visible.",
    productsTitle: "Products",
    productsLead: "Browse by category, open details, or add quickly to your cart.",
    detailLead: "Inspect the image, price, options and collector notes before adding to cart.",
    cartTitle: "Cart",
    cartLead: "Review your items before checkout.",
    gamesTitle: "Trainer games",
    gamesLead: "Play once per day and reveal a store reward.",
    accountTitle: "Account",
    accountLead: "Your trainer profile, language, rewards and support links.",
    cupTitle: "Custom cup",
    cupLead: "Choose the cup, color, image and text from one clear studio screen.",
    apparelTitle: "Custom apparel",
    apparelLead: "Pick garment, size, color, character and printed text.",
    checkoutTitle: "Checkout",
    checkoutLead: "Confirm address, shipping, payment and total.",
    all: "All",
    open: "Open",
    viewDetails: "View details",
    add: "Add",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    checkout: "Checkout",
    payNow: "Pay now",
    emptyCartTitle: "Cart is empty",
    emptyCartCopy: "Start from products or a custom studio.",
    continueShopping: "Continue shopping",
    accountReady: "Account ready",
    accountMissing: "Account needed",
    createAccount: "Create account",
    quickAccess: "Quick access",
    categoryCount: "items",
    customCupService: "Cup design",
    customCupDesc: "Upload image, add text and preview the cup.",
    customApparelService: "Apparel design",
    customApparelDesc: "Build a T-shirt or hoodie with character print.",
    specialRequest: "Special request",
    specialRequestDesc: "Ask us to find a rare product.",
    recommended: "Recommended",
    specifications: "Specifications",
    trusted: "Authentic product presentation",
    packaging: "Collector-safe packaging",
    delivery: "Saudi delivery",
    quantity: "Quantity",
    chooseCategory: "Choose category",
    cupStyle: "Cup style",
    printedText: "Printed text",
    uploadImage: "Upload image",
    chooseGame: "Choose game",
    readyToPlay: "Ready to play",
    locked: "Daily game used",
    activeReward: "Reward",
    playReveal: "Play and reveal",
    language: "Language",
    orders: "My orders",
    addresses: "Addresses",
    payments: "Payment methods",
    favorites: "Favorites",
    coupons: "Coupons",
    settings: "Settings",
    logout: "Log out",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    shippingAddress: "Shipping address",
    shippingMethod: "Shipping method",
    paymentMethod: "Payment method",
    expressShipping: "Express shipping, 2 to 3 days",
    madaVisa: "Mada / Visa",
    orderReady: "Ready to place order",
    orderReadyCopy: "All checkout steps are visible before payment.",
    startCheckout: "Start checkout",
  },
  ar: {
    homeEyebrow: "تجربة تطبيق جوال",
    homeTitle: "متجر Pokémon SA",
    homeLead: "تسوق البطاقات، المنتجات المختومة، المغناطيس، الكاسات المخصصة، الملابس، وألعاب المدربين من شاشات واضحة.",
    shopNow: "تسوق المنتجات",
    browseCategories: "تصفح الأقسام",
    featuredProducts: "منتجات مميزة",
    popularServices: "الخدمات",
    categoriesTitle: "أقسام المتجر بوضوح",
    categoriesLead: "اختر القسم، ثم انتقل لشاشة منتجات مركزة فيها السعر وزر الإضافة واضحين.",
    productsTitle: "المنتجات",
    productsLead: "تصفح حسب القسم، افتح التفاصيل، أو أضف المنتج للسلة بسرعة.",
    detailLead: "راجع الصورة والسعر والخيارات وملاحظات التجميع قبل الإضافة للسلة.",
    cartTitle: "السلة",
    cartLead: "راجع المنتجات قبل إتمام الطلب.",
    gamesTitle: "ألعاب المدرب",
    gamesLead: "العب مرة يوميًا واكشف مكافأة للمتجر.",
    accountTitle: "الحساب",
    accountLead: "ملف المدرب، اللغة، المكافآت وروابط الدعم.",
    cupTitle: "تصميم كوب خاص",
    cupLead: "اختر نوع الكوب واللون والصورة والنص من شاشة استوديو واضحة.",
    apparelTitle: "تصميم ملابس خاصة",
    apparelLead: "اختر القطعة والمقاس واللون والشخصية والنص المطبوع.",
    checkoutTitle: "إتمام الطلب",
    checkoutLead: "أكد العنوان والشحن والدفع والإجمالي.",
    all: "الكل",
    open: "فتح",
    viewDetails: "عرض التفاصيل",
    add: "إضافة",
    addToCart: "أضف إلى السلة",
    buyNow: "اشتر الآن",
    checkout: "إتمام الطلب",
    payNow: "ادفع الآن",
    emptyCartTitle: "السلة فارغة",
    emptyCartCopy: "ابدأ من المنتجات أو من إحدى شاشات التخصيص.",
    continueShopping: "متابعة التسوق",
    accountReady: "الحساب جاهز",
    accountMissing: "الحساب مطلوب",
    createAccount: "إنشاء حساب",
    quickAccess: "وصول سريع",
    categoryCount: "منتجات",
    customCupService: "تصميم الكوب",
    customCupDesc: "ارفع صورة، أضف نصًا، وشاهد المعاينة.",
    customApparelService: "تصميم الملابس",
    customApparelDesc: "صمم تيشيرت أو هودي بطباعة شخصية.",
    specialRequest: "طلب خاص",
    specialRequestDesc: "نبحث لك عن منتج نادر.",
    recommended: "مقترح لك",
    specifications: "المواصفات",
    trusted: "عرض منتج موثوق",
    packaging: "تغليف مناسب للجامعين",
    delivery: "توصيل داخل السعودية",
    quantity: "الكمية",
    chooseCategory: "اختر القسم",
    cupStyle: "نوع الكوب",
    printedText: "النص المطبوع",
    uploadImage: "رفع صورة",
    chooseGame: "اختر اللعبة",
    readyToPlay: "جاهز للعب",
    locked: "تم استخدام لعبة اليوم",
    activeReward: "المكافأة",
    playReveal: "العب واكشف",
    language: "اللغة",
    orders: "طلباتي",
    addresses: "العناوين",
    payments: "طرق الدفع",
    favorites: "المفضلة",
    coupons: "الكوبونات",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    free: "مجاني",
    total: "الإجمالي",
    shippingAddress: "عنوان الشحن",
    shippingMethod: "طريقة الشحن",
    paymentMethod: "طريقة الدفع",
    expressShipping: "شحن سريع خلال 2 إلى 3 أيام",
    madaVisa: "مدى / فيزا",
    orderReady: "جاهز لإرسال الطلب",
    orderReadyCopy: "كل خطوات الدفع واضحة قبل التأكيد.",
    startCheckout: "ابدأ الدفع",
  },
} as const;

const rewardIconMap: Record<RewardIconId, LucideIcon> = {
  zap: Zap,
  gift: Gift,
  trophy: Trophy,
};

const rewards = mobileRewards.map((reward) => ({ ...reward, icon: rewardIconMap[reward.icon] }));

const hashToScreen = (hash: string): MobileScreen => {
  const value = hash.replace("#", "");
  if (!value || value === "top") return "home";
  if (value === "products" || value === "featured" || value === "cards" || value === "boosters" || value === "magnets" || value === "ready-apparel") return "products";
  if (value === "cups") return "cup";
  if (value === "rewards" || value === "game") return "games";
  if (value === "profile") return "account";
  return screenIds.includes(value as MobileScreen) ? (value as MobileScreen) : "home";
};

const screenToHash = (screen: MobileScreen) => (screen === "home" ? "#top" : screen === "games" ? "#game" : `#${screen}`);

const hashForProductCategory = (category: ShopCategoryId) => {
  if (category === "all") return "#products";
  if (category === "apparel") return "#ready-apparel";
  return `#${category}`;
};

const categoryFromHash = (hash: string): ShopCategoryId => {
  const value = hash.replace("#", "");
  if (value === "featured" || value === "cards" || value === "boosters" || value === "magnets") return value;
  if (value === "ready-apparel") return "apparel";
  return "all";
};

const parentScreenFor = (screen: MobileScreen): MobileScreen => {
  if (screen === "detail") return "products";
  if (screen === "checkout") return "cart";
  if (screen === "cup" || screen === "apparel" || screen === "products") return "categories";
  return "home";
};

const isBottomActive = (tab: MobileScreen, screen: MobileScreen) => {
  if (tab === screen) return true;
  if (tab === "categories") return screen === "products" || screen === "detail" || screen === "cup" || screen === "apparel";
  if (tab === "cart") return screen === "checkout";
  return false;
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
  const {
    products,
    productsByCategory,
    getFeaturedProducts,
    getProductsForCategory,
    getRelatedProducts,
    getProduct,
  } = useCommerce();
  const cards = productsByCategory("cards");
  const boosters = productsByCategory("boosters");
  const magnets = productsByCategory("magnets");
  const apparelProducts = productsByCategory("apparel");
  const add = useCart((state) => state.add);
  const remove = useCart((state) => state.remove);
  const checkout = useCart((state) => state.checkout);
  const cartItems = useCart((state) => state.items);
  const setCartOpen = useCart((state) => state.setOpen);
  const { account, openAccount, canPlayGame, remainingGameLock, consumeGameChance, logout } = useAccount();
  const copy = mobileCopy[language];
  const [activeScreen, setActiveScreen] = useState<MobileScreen>(() => (typeof window === "undefined" ? "home" : hashToScreen(window.location.hash)));
  const [selectedCategory, setSelectedCategory] = useState<ShopCategoryId>(() => (typeof window === "undefined" ? "all" : categoryFromHash(window.location.hash)));
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => products[0]);
  const [detailImage, setDetailImage] = useState(products[0].gallery[0] || products[0].image);
  const [detailColor, setDetailColor] = useState<ProductOptionColor | undefined>(products[0].colors?.[0]);
  const [detailSize, setDetailSize] = useState(products[0].sizes?.[2] || products[0].sizes?.[0] || "");
  const [detailQty, setDetailQty] = useState(1);
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

  const currentMeta = screenMeta[activeScreen];
  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shippingTotal = cartTotal > 0 ? 0 : 0;
  const orderTotal = cartTotal + shippingTotal;
  const garmentPrintImage = garmentUpload || garmentCharacter.image;
  const cupPrintImage = cupUpload || cupArt.image;
  const showsCupImage = cupMode === "character" || cupMode === "both";
  const showsCupText = cupMode === "text" || cupMode === "both";

  const featured = useMemo(() => getFeaturedProducts(), [getFeaturedProducts]);

  const filteredProducts = useMemo(
    () => getProductsForCategory(selectedCategory),
    [getProductsForCategory, selectedCategory],
  );

  const categories = useMemo(
    () => [
      { id: "all" as const, icon: Package, image: featured[0]?.image ?? products[0].image, count: products.length, accent: "#facc15" },
      { id: "featured" as const, icon: Star, image: featured[0]?.image ?? products[0].image, count: featured.length, accent: "#facc15" },
      { id: "cards" as const, icon: Sparkles, image: cards[0]?.image ?? products[0].image, count: cards.length, accent: "#60a5fa" },
      { id: "boosters" as const, icon: Package, image: boosters[0]?.image ?? products[0].image, count: boosters.length, accent: "#f87171" },
      { id: "magnets" as const, icon: Magnet, image: magnets[0]?.image ?? products[0].image, count: magnets.length, accent: "#34d399" },
      { id: "apparel" as const, icon: Shirt, image: apparelProducts[0]?.image ?? products[0].image, count: apparelProducts.length, accent: "#c084fc" },
    ],
    [apparelProducts.length, apparelProducts, boosters.length, boosters, cards.length, cards, featured, magnets.length, magnets, products.length, products],
  );

  const navigateTo = useCallback((screen: MobileScreen) => {
    setActiveScreen(screen);
    const nextHash = screenToHash(screen);
    if (typeof window !== "undefined" && window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, []);

  const openProducts = useCallback(
    (category: ShopCategoryId) => {
      setSelectedCategory(category);
      setActiveScreen("products");
      const nextHash = hashForProductCategory(category);
      if (typeof window !== "undefined" && window.location.hash !== nextHash) {
        window.history.pushState(null, "", nextHash);
      }
    },
    [],
  );

  const openProductDetail = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setDetailImage(product.gallery[0] || product.image);
      setDetailColor(product.colors?.[0]);
      setDetailSize(product.sizes?.[2] || product.sizes?.[0] || "");
      setDetailQty(1);
      navigateTo("detail");
    },
    [navigateTo],
  );

  useEffect(() => {
    const currentProduct = products.find((product) => product.id === selectedProduct.id);
    if (currentProduct && currentProduct !== selectedProduct) {
      setSelectedProduct(currentProduct);
    } else if (!currentProduct && products[0]) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct.id]);

  useEffect(() => {
    setDetailImage(selectedProduct.gallery[0] || selectedProduct.image);
    setDetailColor(selectedProduct.colors?.[0]);
    setDetailSize(selectedProduct.sizes?.[2] || selectedProduct.sizes?.[0] || "");
  }, [selectedProduct]);

  useEffect(() => {
    const syncFromHash = () => {
      const nextScreen = hashToScreen(window.location.hash);
      setActiveScreen(nextScreen);
      const hashCategory = categoryFromHash(window.location.hash);
      if (nextScreen === "products") setSelectedCategory(hashCategory);
    };
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

  const addProductToCart = (
    product: Product,
    variant?: string,
    variantByLanguage?: { en?: string; ar?: string },
    image = product.image,
    shopifyVariantId = product.shopifyVariantId,
  ) => {
    add(createProductCartItem({
      product,
      language,
      image,
      variant,
      variantByLanguage,
      shopifyVariantId,
    }));
    setCartOpen(false);
  };

  const detailVariantFor = (targetLanguage: Language) => {
    const parts = [];
    if (detailColor) parts.push(detailColor.name[targetLanguage]);
    if (detailSize) parts.push(detailSize);
    return parts.join(" · ") || undefined;
  };

  const addDetailProduct = (nextScreen: MobileScreen = "cart") => {
    const shopifyVariantId = getProductVariantIdForOptions(selectedProduct, {
      Color: detailColor?.name.en,
      Size: detailSize,
    });
    for (let index = 0; index < detailQty; index += 1) {
      addProductToCart(
        selectedProduct,
        detailVariantFor(language),
        { en: detailVariantFor("en"), ar: detailVariantFor("ar") },
        selectedProduct.image,
        shopifyVariantId,
      );
    }
    navigateTo(nextScreen);
  };

  const garmentVariantFor = (targetLanguage: Language) => {
    const parts = [garmentStyle.name[targetLanguage], garmentSize, garmentColor.name[targetLanguage], garmentUpload ? "Custom image" : garmentCharacter.name];
    if (garmentText.trim()) parts.push(`"${garmentText.trim()}"`);
    return parts.join(" · ");
  };

  const cupNameFor = (targetLanguage: Language) =>
    targetLanguage === "ar" ? `كوب مخصص ${cupStyle.name[targetLanguage]}` : `Custom ${cupStyle.name[targetLanguage]}`;

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
    const shopifyCustomProduct = getProduct(`custom-apparel-${garmentStyle.id}`);
    add(createCustomCartItem({
      id: `custom-apparel-${garmentStyle.id}`,
      name: garmentStyle.name,
      language,
      price: garmentStyle.price,
      image: garmentPrintImage,
      variant: garmentVariantFor(language),
      variantByLanguage: { en: garmentVariantFor("en"), ar: garmentVariantFor("ar") },
      shopifyVariantId: shopifyCustomProduct?.shopifyVariantId,
    }));
    setCartOpen(false);
    navigateTo("cart");
  };

  const addCustomCup = () => {
    const shopifyCupProduct = getProduct(`custom-cup-${cupStyle.id}`);
    add(createCustomCartItem({
      id: `cup-${cupStyle.id}`,
      name: { en: cupNameFor("en"), ar: cupNameFor("ar") },
      language,
      price: cupStyle.price,
      image: showsCupImage ? cupPrintImage : logo,
      variant: cupVariantFor(language),
      variantByLanguage: { en: cupVariantFor("en"), ar: cupVariantFor("ar") },
      shopifyVariantId: shopifyCupProduct?.shopifyVariantId,
    }));
    setCartOpen(false);
    navigateTo("cart");
  };

  const playReward = (reward = selectedReward) => {
    setSelectedReward(reward);
    if (!account) {
      openAccount();
      return;
    }
    if (consumeGameChance(reward.code)) setUnlockedReward(reward);
  };

  const renderProductCard = (product: Product, variant: "standard" | "binder" | "drop" | "sticker" = "standard") => (
    <article key={product.id} className={`mobile-app-product-card mobile-app-product-card--${variant}`}>
      <button type="button" className="mobile-app-product-media" onClick={() => openProductDetail(product)} aria-label={product.name[language]}>
        {product.badge && <span>{product.badge[language]}</span>}
        <img src={product.image} alt={product.name[language]} loading="lazy" />
      </button>
      <div className="mobile-app-product-info">
        <small>{product.subtitle[language]}</small>
        <button type="button" className="mobile-app-product-title-button" onClick={() => openProductDetail(product)}>
          {product.name[language]}
        </button>
        <div className="mobile-app-product-buy">
          <strong>{formatPrice(product.price)}</strong>
          <button type="button" onClick={() => addProductToCart(product)}>
            <Plus className="h-4 w-4" />
            {copy.add}
          </button>
        </div>
      </div>
    </article>
  );

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
          <button type="button" onClick={() => openProducts("all")}>
            <Zap className="h-4 w-4" />
            {copy.shopNow}
          </button>
          <button type="button" onClick={() => navigateTo("categories")}>
            <Grid2X2 className="h-4 w-4" />
            {copy.browseCategories}
          </button>
        </div>
      </div>

      <div className="mobile-app-status-grid">
        <button type="button" onClick={() => navigateTo("cart")}>
          <small>{screenMeta.cart.label[language]}</small>
          <strong>{cartCount > 0 ? `${cartCount} ${t("quantity")}` : copy.emptyCartTitle}</strong>
          <span>{formatPrice(cartTotal)}</span>
        </button>
        <button type="button" onClick={() => navigateTo("account")}>
          <small>{copy.accountTitle}</small>
          <strong>{account ? copy.accountReady : copy.accountMissing}</strong>
          <span>{account ? account.name : copy.createAccount}</span>
        </button>
      </div>

      <div className="mobile-app-section">
        <div className="mobile-app-section-heading">
          <span>{copy.featuredProducts}</span>
          <button type="button" onClick={() => openProducts("all")}>{copy.open}</button>
        </div>
        <div className="mobile-app-horizontal-rail">
          {featured.map((product) => renderProductCard(product, product.category === "magnets" ? "sticker" : "standard"))}
        </div>
      </div>

      <div className="mobile-app-map">
        <div className="mobile-app-map-title">
          <span>{copy.popularServices}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <div className="mobile-app-map-grid">
          <button type="button" onClick={() => navigateTo("cup")} className="mobile-app-map-card mobile-app-map-card--cup">
            <CupSoda className="h-5 w-5" />
            <strong>{copy.customCupService}</strong>
            <span>{copy.customCupDesc}</span>
          </button>
          <button type="button" onClick={() => navigateTo("apparel")} className="mobile-app-map-card mobile-app-map-card--apparel">
            <Shirt className="h-5 w-5" />
            <strong>{copy.customApparelService}</strong>
            <span>{copy.customApparelDesc}</span>
          </button>
          <button type="button" onClick={() => navigateTo("games")} className="mobile-app-map-card mobile-app-map-card--games">
            <Gamepad2 className="h-5 w-5" />
            <strong>{copy.gamesTitle}</strong>
            <span>{copy.gamesLead}</span>
          </button>
          <Link to="/special-request" className="mobile-app-map-card mobile-app-map-card--request">
            <Search className="h-5 w-5" />
            <strong>{copy.specialRequest}</strong>
            <span>{copy.specialRequestDesc}</span>
          </Link>
        </div>
      </div>
    </section>
  );

  const renderCategories = () => (
    <section className="mobile-app-screen mobile-app-categories-screen">
      <ScreenIntro icon={Grid2X2} eyebrow={copy.quickAccess} title={copy.categoriesTitle} description={copy.categoriesLead} />
      <div className="mobile-app-category-list">
        {(["featured", "cards", "boosters", "magnets"] as ShopCategoryId[]).map((categoryId) => {
          const category = categories.find((item) => item.id === categoryId);
          if (!category) return null;
          const Icon = category.icon;
          return (
            <button
              key={categoryId}
              type="button"
              className="mobile-app-category-card"
              style={{ "--category-accent": category.accent } as CSSProperties}
              onClick={() => openProducts(categoryId)}
            >
              <div>
                <Icon className="h-5 w-5" />
                <strong>{categoryLabels[categoryId][language]}</strong>
                <span>{category.count} {copy.categoryCount}</span>
              </div>
              <img src={category.image} alt="" aria-hidden="true" loading="lazy" />
              <ChevronRight className="h-4 w-4" />
            </button>
          );
        })}
        <button type="button" className="mobile-app-category-card" style={{ "--category-accent": "#38bdf8" } as CSSProperties} onClick={() => navigateTo("cup")}>
          <div>
            <CupSoda className="h-5 w-5" />
            <strong>{language === "ar" ? "الكاسات" : "Cups"}</strong>
            <span>{copy.customCupDesc}</span>
          </div>
          <img src={pokemonArt[0].image} alt="" aria-hidden="true" loading="lazy" />
          <ChevronRight className="h-4 w-4" />
        </button>
        {(() => {
          const category = categories.find((item) => item.id === "apparel");
          if (!category) return null;
          return (
            <button type="button" className="mobile-app-category-card" style={{ "--category-accent": category.accent } as CSSProperties} onClick={() => openProducts("apparel")}>
              <div>
                <Shirt className="h-5 w-5" />
                <strong>{categoryLabels.apparel[language]}</strong>
                <span>{category.count} {copy.categoryCount}</span>
              </div>
              <img src={category.image} alt="" aria-hidden="true" loading="lazy" />
              <ChevronRight className="h-4 w-4" />
            </button>
          );
        })()}
        <button type="button" className="mobile-app-category-card" style={{ "--category-accent": "#c084fc" } as CSSProperties} onClick={() => navigateTo("apparel")}>
          <div>
            <Shirt className="h-5 w-5" />
            <strong>{copy.customApparelService}</strong>
            <span>{copy.customApparelDesc}</span>
          </div>
          <img src={garmentStyles[0].mockups.clean} alt="" aria-hidden="true" loading="lazy" />
          <ChevronRight className="h-4 w-4" />
        </button>
        <button type="button" className="mobile-app-category-card" style={{ "--category-accent": "#38bdf8" } as CSSProperties} onClick={() => navigateTo("cup")}>
          <div>
            <CupSoda className="h-5 w-5" />
            <strong>{copy.customCupService}</strong>
            <span>{copy.customCupDesc}</span>
          </div>
          <img src={pokemonArt[4].image} alt="" aria-hidden="true" loading="lazy" />
          <ChevronRight className="h-4 w-4" />
        </button>
        <Link to="/special-request" className="mobile-app-category-card" style={{ "--category-accent": "#f97316" } as CSSProperties}>
          <div>
            <MessageSquare className="h-5 w-5" />
            <strong>{language === "ar" ? "طلب خاص / الكونسيرج" : "Special request / Concierge"}</strong>
            <span>{copy.specialRequestDesc}</span>
          </div>
          <img src={logo} alt="" aria-hidden="true" loading="lazy" />
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );

  const renderProducts = () => (
    <section className="mobile-app-screen mobile-app-products-screen">
      <ScreenIntro icon={Package} eyebrow={categoryLabels[selectedCategory][language]} title={copy.productsTitle} description={copy.productsLead} />
      <div className="mobile-app-category-tabs" aria-label={copy.chooseCategory}>
        {categories.map((category) => (
          <button key={category.id} type="button" onClick={() => openProducts(category.id)} aria-pressed={selectedCategory === category.id}>
            {categoryLabels[category.id][language]}
          </button>
        ))}
      </div>
      <div className={selectedCategory === "magnets" ? "mobile-app-sticker-wall" : "mobile-app-product-list"}>
        {filteredProducts.map((product) => renderProductCard(product, selectedCategory === "magnets" ? "sticker" : product.category === "cards" ? "binder" : "standard"))}
      </div>
    </section>
  );

  const renderDetail = () => {
    const related = getRelatedProducts(selectedProduct, 4);
    return (
      <section className="mobile-app-screen mobile-app-detail-screen">
        <ScreenIntro icon={Sparkles} eyebrow={screenMeta.detail.label[language]} title={selectedProduct.name[language]} description={copy.detailLead} />
        <div className="mobile-app-detail-panel">
          <div className="mobile-app-detail-gallery">
            <div className="mobile-app-detail-media">
              {selectedProduct.badge && <span>{selectedProduct.badge[language]}</span>}
              <img src={detailImage} alt={selectedProduct.name[language]} />
              <button type="button" aria-label={copy.favorites}>
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="mobile-app-detail-thumbs">
              {selectedProduct.gallery.map((image) => (
                <button key={image} type="button" onClick={() => setDetailImage(image)} aria-pressed={detailImage === image}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-app-detail-card">
            <small>{t(selectedProduct.category)}</small>
            <h2>{selectedProduct.name[language]}</h2>
            <p>{selectedProduct.subtitle[language]}</p>
            <strong>{formatPrice(selectedProduct.price)}</strong>
            {selectedProduct.colors && (
              <div className="mobile-app-option-block">
                <span>{t("color")} · {detailColor?.name[language]}</span>
                <div className="mobile-app-swatches">
                  {selectedProduct.colors.map((item) => (
                    <button
                      key={item.name.en}
                      type="button"
                      onClick={() => setDetailColor(item)}
                      aria-label={item.name[language]}
                      aria-pressed={detailColor?.name.en === item.name.en}
                      style={{ background: item.hex }}
                    />
                  ))}
                </div>
              </div>
            )}
            {selectedProduct.sizes && (
              <div className="mobile-app-option-block">
                <span>{t("size")} · {detailSize}</span>
                <div className="mobile-app-size-grid">
                  {selectedProduct.sizes.map((item) => (
                    <button key={item} type="button" onClick={() => setDetailSize(item)} aria-pressed={detailSize === item}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mobile-app-quantity-row">
              <span>{copy.quantity}</span>
              <div className="mobile-app-quantity-stepper">
                <button type="button" onClick={() => setDetailQty((value) => Math.max(1, value - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <strong>{detailQty}</strong>
                <button type="button" onClick={() => setDetailQty((value) => Math.min(9, value + 1))}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mobile-app-detail-actions">
              <button type="button" className="mobile-app-primary-action" onClick={() => addDetailProduct("cart")}>
                <ShoppingBag className="h-4 w-4" />
                {copy.addToCart}
              </button>
              <button type="button" onClick={() => addDetailProduct("checkout")}>
                <CreditCard className="h-4 w-4" />
                {copy.buyNow}
              </button>
            </div>
          </div>
        </div>

        <div className="mobile-app-trust-grid">
          <div>
            <ShieldCheck className="h-5 w-5" />
            <span>{copy.trusted}</span>
          </div>
          <div>
            <Truck className="h-5 w-5" />
            <span>{copy.delivery}</span>
          </div>
          <div>
            <CheckCircle2 className="h-5 w-5" />
            <span>{copy.packaging}</span>
          </div>
        </div>

        <div className="mobile-app-detail-specs">
          <h2>{copy.specifications}</h2>
          <ul>
            {selectedProduct.specs[language].map((item) => (
              <li key={item}>
                <CheckCircle2 className="h-4 w-4" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {related.length > 0 && (
          <div className="mobile-app-section">
            <div className="mobile-app-section-heading">
              <span>{copy.recommended}</span>
            </div>
            <div className="mobile-app-horizontal-rail">
              {related.map((product) => renderProductCard(product, product.category === "cards" ? "binder" : "standard"))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderCup = () => (
    <section className="mobile-app-screen mobile-app-cups-screen">
      <ScreenIntro icon={CupSoda} eyebrow={screenMeta.cup.label[language]} title={copy.cupTitle} description={copy.cupLead} />
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
              <label aria-label={copy.uploadImage}>
                <Upload className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={uploadCup} />
              </label>
            </div>
          )}
          {showsCupText && (
            <label className="mobile-app-field">
              <span>{copy.printedText}</span>
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
      <ScreenIntro icon={Shirt} eyebrow={screenMeta.apparel.label[language]} title={copy.apparelTitle} description={copy.apparelLead} />
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
            <label aria-label={copy.uploadImage}>
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" onChange={uploadGarment} />
            </label>
          </div>
          <label className="mobile-app-field">
            <span>{copy.printedText}</span>
            <input value={garmentText} onChange={(event) => setGarmentText(event.target.value)} maxLength={24} placeholder={t("textPlaceholder")} />
          </label>
          <button type="button" className="mobile-app-primary-action" onClick={addCustomGarment}>
            <Plus className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>
    </section>
  );

  const renderGames = () => {
    const SelectedIcon = selectedReward.icon;
    return (
      <section className="mobile-app-screen mobile-app-rewards-screen">
        <ScreenIntro icon={Gamepad2} eyebrow={screenMeta.games.label[language]} title={copy.gamesTitle} description={copy.gamesLead} />
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
                <button key={reward.code} type="button" onClick={() => setSelectedReward(reward)} aria-pressed={selectedReward.code === reward.code}>
                  <Icon className="h-5 w-5" />
                  <strong>{reward.mission[language]}</strong>
                  <small>{reward.prompt[language]}</small>
                </button>
              );
            })}
          </div>
          <button type="button" className="mobile-app-primary-action" onClick={() => playReward()}>
            <Gamepad2 className="h-4 w-4" />
            {account ? copy.playReveal : copy.createAccount}
          </button>
        </div>
      </section>
    );
  };

  const renderCart = () => (
    <section className="mobile-app-screen mobile-app-cart-screen">
      <ScreenIntro icon={ShoppingBag} eyebrow={screenMeta.cart.label[language]} title={copy.cartTitle} description={copy.cartLead} />
      <div className="mobile-app-cart-panel">
        {cartItems.length === 0 ? (
          <div className="mobile-app-empty-cart">
            <ShoppingBag className="h-7 w-7" />
            <strong>{copy.emptyCartTitle}</strong>
            <p>{copy.emptyCartCopy}</p>
            <button type="button" onClick={() => openProducts("all")}>
              {copy.continueShopping}
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
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
        <div className="mobile-app-cart-total">
          <span>{copy.total}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </div>
        <button type="button" className="mobile-app-primary-action" onClick={() => navigateTo("checkout")} disabled={cartItems.length === 0}>
          <CreditCard className="h-4 w-4" />
          {copy.checkout}
        </button>
      </div>
      <Link to="/special-request" className="mobile-app-concierge-card">
        <Search className="h-5 w-5" />
        <div>
          <strong>{copy.specialRequest}</strong>
          <p>{copy.specialRequestDesc}</p>
        </div>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </section>
  );

  const renderCheckout = () => (
    <section className="mobile-app-screen mobile-app-checkout-screen">
      <ScreenIntro icon={CreditCard} eyebrow={screenMeta.checkout.label[language]} title={copy.checkoutTitle} description={copy.checkoutLead} />
      {cartItems.length === 0 ? (
        <div className="mobile-app-empty-cart">
          <ShoppingBag className="h-7 w-7" />
          <strong>{copy.emptyCartTitle}</strong>
          <p>{copy.emptyCartCopy}</p>
          <button type="button" onClick={() => openProducts("all")}>{copy.continueShopping}</button>
        </div>
      ) : (
        <>
          <div className="mobile-app-checkout-progress" aria-label={copy.checkoutTitle}>
            {[copy.cartTitle, copy.shipping, copy.paymentMethod, copy.orderReady].map((item, index) => (
              <div key={item} className={index === 3 ? "is-current" : ""}>
                <span>{index + 1}</span>
                <small>{item}</small>
              </div>
            ))}
          </div>
          <div className="mobile-app-checkout-stack">
            <section className="mobile-app-checkout-card">
              <MapPin className="h-5 w-5" />
              <div>
                <span>{copy.shippingAddress}</span>
                <strong>{account ? account.name : copy.accountMissing}</strong>
                <p>{account ? `${account.phone} · ${t("location")}` : copy.createAccount}</p>
              </div>
              <button type="button" onClick={openAccount}>{account ? copy.open : copy.createAccount}</button>
            </section>
            <section className="mobile-app-checkout-card">
              <Truck className="h-5 w-5" />
              <div>
                <span>{copy.shippingMethod}</span>
                <strong>{copy.expressShipping}</strong>
                <p>{copy.free}</p>
              </div>
            </section>
            <section className="mobile-app-checkout-card">
              <WalletCards className="h-5 w-5" />
              <div>
                <span>{copy.paymentMethod}</span>
                <strong>{copy.madaVisa}</strong>
                <p>{copy.orderReadyCopy}</p>
              </div>
            </section>
          </div>
          <div className="mobile-app-order-summary">
            <div>
              <span>{copy.subtotal}</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <div>
              <span>{copy.shipping}</span>
              <strong>{copy.free}</strong>
            </div>
            <div>
              <span>{copy.total}</span>
              <strong>{formatPrice(orderTotal)}</strong>
            </div>
            <button type="button" className="mobile-app-primary-action" onClick={() => void checkout()}>
              <CreditCard className="h-4 w-4" />
              {copy.payNow}
            </button>
          </div>
        </>
      )}
    </section>
  );

  const renderAccount = () => (
    <section className="mobile-app-screen mobile-app-profile-screen">
      <ScreenIntro icon={UserRound} eyebrow={screenMeta.account.label[language]} title={copy.accountTitle} description={copy.accountLead} />
      <div className="mobile-app-profile-card">
        <div className="mobile-app-profile-avatar">
          <UserRound className="h-7 w-7" />
        </div>
        <div>
          <span>{copy.accountTitle}</span>
          <strong>{account ? account.name : copy.accountMissing}</strong>
          <p>{account ? account.phone : copy.createAccount}</p>
        </div>
        <button type="button" onClick={openAccount}>
          <BadgeCheck className="h-4 w-4" />
          {account ? t("account") : copy.createAccount}
        </button>
      </div>
      <div className="mobile-app-profile-actions">
        <button type="button" onClick={() => navigateTo("cart")}>
          <ShoppingBag className="h-5 w-5" />
          <span>{copy.orders}</span>
          <strong>{cartCount > 0 ? `${cartCount} ${screenMeta.cart.label[language]}` : copy.emptyCartTitle}</strong>
        </button>
        <button type="button" onClick={() => navigateTo("games")}>
          <Gamepad2 className="h-5 w-5" />
          <span>{copy.activeReward}</span>
          <strong>{account && !canPlayGame ? remainingGameLock : copy.readyToPlay}</strong>
        </button>
        <button type="button" onClick={toggleLanguage}>
          <Globe2 className="h-5 w-5" />
          <span>{copy.language}</span>
          <strong>{t("language")}</strong>
        </button>
        <Link to="/special-request">
          <MessageSquare className="h-5 w-5" />
          <span>{copy.specialRequest}</span>
          <strong>{copy.specialRequestDesc}</strong>
        </Link>
        <button type="button" onClick={openAccount}>
          <MapPin className="h-5 w-5" />
          <span>{copy.addresses}</span>
          <strong>{account ? t("location") : copy.createAccount}</strong>
        </button>
        <button type="button" onClick={() => account && logout()}>
          <ShieldCheck className="h-5 w-5" />
          <span>{copy.settings}</span>
          <strong>{account ? copy.logout : copy.createAccount}</strong>
        </button>
      </div>
    </section>
  );

  return (
    <div
      className={`mobile-store-app mobile-app-shell mobile-app-shell--${currentMeta.theme}`}
      style={{ "--screen-accent": currentMeta.accent } as CSSProperties}
    >
      <header className="mobile-app-header">
        <button
          type="button"
          onClick={() => (activeScreen === "home" ? navigateTo("account") : navigateTo(parentScreenFor(activeScreen)))}
          aria-label={activeScreen === "home" ? screenMeta.account.label[language] : t("backToShop")}
        >
          {activeScreen === "home" ? <UserRound className="h-5 w-5" /> : <BackIcon className="h-5 w-5" />}
        </button>
        <button type="button" className="mobile-app-logo" onClick={() => navigateTo("home")} aria-label={t("brand")}>
          <img src={logo} alt="Pokémon SA" />
        </button>
        <div className="mobile-app-header-actions">
          <button type="button" onClick={toggleLanguage} aria-label={copy.language}>
            <Globe2 className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => navigateTo("cart")} aria-label={screenMeta.cart.label[language]} className="mobile-app-cart-button">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>

      <nav className="mobile-app-destination-rail" aria-label={copy.quickAccess} ref={railRef}>
        {destinationScreens.map((screen) => {
          const meta = screenMeta[screen];
          const Icon = meta.icon;
          return (
            <button
              key={screen}
              type="button"
              data-screen={screen}
              onClick={() => navigateTo(screen)}
              aria-current={activeScreen === screen ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{meta.label[language]}</span>
            </button>
          );
        })}
      </nav>

      <main ref={viewportRef} className="mobile-app-viewport" aria-label={currentMeta.label[language]}>
        {activeScreen === "home" && renderHome()}
        {activeScreen === "categories" && renderCategories()}
        {activeScreen === "products" && renderProducts()}
        {activeScreen === "detail" && renderDetail()}
        {activeScreen === "cup" && renderCup()}
        {activeScreen === "apparel" && renderApparel()}
        {activeScreen === "cart" && renderCart()}
        {activeScreen === "checkout" && renderCheckout()}
        {activeScreen === "games" && renderGames()}
        {activeScreen === "account" && renderAccount()}
      </main>

      <nav className="mobile-app-tabbar" aria-label={t("shop")}>
        {bottomScreens.map((screen) => {
          const meta = screenMeta[screen];
          const Icon = meta.icon;
          return (
            <button
              key={screen}
              type="button"
              data-tab-screen={screen}
              onClick={() => navigateTo(screen)}
              aria-current={isBottomActive(screen, activeScreen) ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{meta.label[language]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
