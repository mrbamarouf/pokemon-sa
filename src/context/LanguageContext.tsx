import { createContext, startTransition, type ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  dir: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    brand: "Pokémon SA",
    tagline: "Catch Your Power",
    cards: "Cards",
    boosters: "Boosters",
    magnets: "Magnets",
    cups: "Cups",
    apparel: "Apparel",
    game: "Game",
    specialOrder: "Special Order",
    cart: "Your Cart",
    account: "Account",
    checkoutNeedsAccount: "Create an account to continue checkout. Address and payment come next.",
    checkoutReady: "Account ready. Address and payment details come next.",
    checkout: "Checkout",
    total: "Total",
    emptyCart: "Your cart is empty. Go catch some power.",
    add: "Add",
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    details: "Details",
    quantity: "Qty",
    color: "Color",
    size: "Size",
    condition: "Condition",
    specifications: "Specifications",
    productStory: "Product Story",
    backToShop: "Back to Shop",
    homeTitle: "Pokémon SA — Catch Your Power",
    metaDescription: "Premium Pokémon cards, booster boxes, magnets, apparel, custom cups and special orders from Jeddah, Saudi Arabia.",
    heroCopy: "Trading cards, sealed boosters, apparel, magnets and custom printed cups for trainers who want every piece to feel collectible.",
    sealedDrops: "Sealed Drops",
    customPrintStudio: "Custom Print Studio",
    shopTheDrop: "Shop the Drop",
    customizeCups: "Customize Cups",
    cardsEyebrow: "Individual Cards",
    cardsTitle: "Real Singles Worth Hunting",
    cardsDescription: "Iconic Pokémon TCG singles with high-resolution card scans ready for collectors.",
    boostersEyebrow: "Booster Packs & Boxes",
    boostersTitle: "Sealed Products With Real Packaging",
    boostersDescription: "Booster bundles and Elite Trainer Boxes shown with real retail packaging photography.",
    bestValue: "Best Value",
    sealed: "Sealed",
    magnetsEyebrow: "Fridge Magnets",
    magnetsTitle: "Stick The Squad",
    magnetsDescription: "Die-cut, glossy and built to last. Show your roster on every surface in the house.",
    cupsEyebrow: "Printed Cups",
    cupsTitle: "Customize Your Cup",
    cupsDescription: "Choose a cup, pick the color, then print an official Pokémon character, your own text, or both together.",
    livePreview: "Live Preview",
    cupStyle: "Cup Style",
    customize: "Customize",
    image: "Image",
    text: "Text",
    both: "Both",
    characterPrint: "Character Print",
    uploadCustomerImage: "Upload Customer Image",
    printedText: "Printed Text",
    textPlaceholder: "Trainer name or short phrase",
    addCustomCup: "Add Custom Cup",
    teesEyebrow: "Apparel · T-Shirts",
    teesTitle: "Wear The Element",
    teesDescription: "Heavyweight cotton, screen-printed, made for trainers.",
    hoodiesEyebrow: "Apparel · Hoodies",
    hoodiesTitle: "Power In Layers",
    hoodiesDescription: "Premium fleece, double-stitched. Battle-ready warmth.",
    customApparelEyebrow: "Custom Apparel",
    customApparelTitle: "Create A Character Print",
    customApparelDescription: "Pick a T-shirt or hoodie, choose a Pokémon character, add text or upload a reference image.",
    gameEyebrow: "Trainer Game",
    gameTitle: "Spin For A Reward",
    gameDescription: "Play once, reveal a store reward, and use the code with your order.",
    spin: "Spin",
    spinning: "Spinning...",
    rewardReady: "Reward Ready",
    playAgain: "Play Again",
    rewardNote: "Show this code at checkout or include it in your order notes.",
    specialTitle: "Hunt A Rare",
    specialSubtitle: "Find With Us",
    specialDescription: "Looking for a specific sealed box, rare card, graded slab or collector bundle? Send the request and we add it as a quote order for follow-up.",
    requestDetails: "Request Details",
    requestDetailsSub: "Tell us exactly what to hunt.",
    requestType: "Request Type",
    rareCard: "Rare Card",
    sealedBox: "Sealed Box",
    gradedSlab: "Graded Slab",
    customBundle: "Custom Bundle",
    cardOrBoxName: "Card or Box Name",
    cardOrBoxPlaceholder: "Example: Prismatic Evolutions ETB, Charizard Base Set...",
    budget: "Budget",
    budgetPlaceholder: "SAR 1,500 max",
    any: "Any",
    nearMint: "Near Mint",
    lightlyPlayed: "Lightly Played",
    sealedOnly: "Sealed only",
    graded8: "Graded 8+",
    graded10: "Graded 10",
    contactPlaceholder: "WhatsApp, email, or Instagram",
    uploadReference: "Upload reference image",
    notes: "Notes",
    notesPlaceholder: "Set, language, grading preference, deadline, or any details...",
    addSpecialRequest: "Add Special Request",
    requestAdded: "Request added. It will appear in the cart as a quote item with your details.",
    rareCards: "Rare cards",
    sealedBoxes: "Sealed boxes",
    quoteFollowUp: "Quote follow-up",
    footerJoin: "Join The Trainers",
    footerJoinCopy: "Drop alerts, restocks and first dibs on holo singles — straight to your inbox.",
    subscribe: "Subscribe",
    emailPlaceholder: "trainer@pokemonsa.sa",
    footerDescription: "Jeddah's premium destination for Pokémon trading cards, sealed product, custom cups and lifestyle gear.",
    shop: "Shop",
    support: "Support",
    legal: "Legal",
    shipping: "Shipping",
    returns: "Returns",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    accessibility: "Accessibility",
    location: "Jeddah · Kingdom of Saudi Arabia",
    rights: "All trademarks are property of their respective owners.",
    language: "العربية",
    notFound: "Oops! Page not found",
    returnHome: "Return to Home",
  },
  ar: {
    brand: "Pokémon SA",
    tagline: "Catch Your Power",
    cards: "كروت نادرة",
    boosters: "بوكسات مختومة",
    magnets: "مغناطيس",
    cups: "كاسات مخصصة",
    apparel: "ملابس",
    game: "الألعاب",
    specialOrder: "طلب خاص",
    cart: "السلة",
    account: "الحساب",
    checkoutNeedsAccount: "أنشئ حسابك أولًا لإكمال الطلب. العنوان والدفع في الخطوة التالية.",
    checkoutReady: "الحساب جاهز. العنوان والدفع في الخطوة التالية.",
    checkout: "إتمام الطلب",
    total: "الإجمالي",
    emptyCart: "السلة فارغة الآن. اختر منتجك المفضل وابدأ مجموعتك.",
    add: "إضافة",
    addToCart: "إضافة إلى السلة",
    viewDetails: "تفاصيل المنتج",
    details: "تفاصيل المنتج",
    quantity: "الكمية",
    color: "اللون",
    size: "المقاس",
    condition: "الحالة",
    specifications: "المواصفات",
    productStory: "قصة المنتج",
    backToShop: "العودة للمتجر",
    homeTitle: "Pokémon SA — Catch Your Power",
    metaDescription: "متجر Pokémon SA في جدة للكروت، البوكسات، المغناطيس، الملابس، الكاسات المخصصة والطلبات الخاصة.",
    heroCopy: "وجهة فاخرة لعشاق Pokémon في السعودية: كروت نادرة، بوكسات مختومة، منتجات مخصصة، وتجربة متجر مصممة للجامعين.",
    sealedDrops: "منتجات أصلية مختومة",
    customPrintStudio: "استوديو التخصيص",
    shopTheDrop: "استكشف المنتجات",
    customizeCups: "خصص كاسك",
    cardsEyebrow: "كروت فردية أصلية",
    cardsTitle: "كروت Pokémon للجامعين الجادين",
    cardsDescription: "صور حقيقية عالية الدقة، وصف واضح، وتجربة شراء مرتبة لهواة Pokémon TCG.",
    boostersEyebrow: "بوسترات وبوكسات",
    boostersTitle: "منتجات مختومة بصور واقعية",
    boostersDescription: "بوستر باندل وElite Trainer Boxes بصور منتجات حقيقية وتجربة عرض فاخرة.",
    bestValue: "الأفضل قيمة",
    sealed: "مختوم",
    magnetsEyebrow: "مغناطيس الثلاجة",
    magnetsTitle: "اعرض فريقك المفضل",
    magnetsDescription: "مغناطيس بتصاميم شخصيات Pokémon الرسمية، مناسب للثلاجة، المكتب، والهدايا.",
    cupsEyebrow: "كاسات مطبوعة",
    cupsTitle: "صمم كاسك الخاص",
    cupsDescription: "اختر نوع الكاس واللون، ثم أضف شخصية Pokémon رسمية، نصك الخاص، أو الاثنين معًا.",
    livePreview: "معاينة مباشرة",
    cupStyle: "نوع الكاس",
    customize: "التخصيص",
    image: "صورة",
    text: "نص",
    both: "الاثنين",
    characterPrint: "طباعة الشخصية",
    uploadCustomerImage: "ارفع صورة العميل",
    printedText: "النص المطبوع",
    textPlaceholder: "اسم المدرب أو عبارة قصيرة",
    addCustomCup: "إضافة الكاس",
    teesEyebrow: "ملابس · تيشيرتات",
    teesTitle: "ارتدِ الطاقة",
    teesDescription: "قطن ثقيل وطباعة ممتازة لعشاق Pokémon.",
    hoodiesEyebrow: "ملابس · هوديز",
    hoodiesTitle: "دفء بطابع Pokémon",
    hoodiesDescription: "هوديز فاخرة ومريحة بتفاصيل قوية.",
    customApparelEyebrow: "ملابس مخصصة",
    customApparelTitle: "صمم طبعة شخصيتك",
    customApparelDescription: "اختر تيشيرت أو هودي، حدد شخصية Pokémon، أضف نصًا أو ارفع صورة مرجعية.",
    gameEyebrow: "منطقة تحديات Pokémon",
    gameTitle: "العب وافتح مكافأتك",
    gameDescription: "أربع ألعاب قصيرة بتصميم مختلف: كويز مؤقت، عجلة جوائز، ذاكرة، وتحدي نوع. اربح خصمًا، هدية، أو استردادًا.",
    spin: "لف العجلة",
    spinning: "جاري اللف...",
    rewardReady: "تم فتح المكافأة",
    playAgain: "العب مرة ثانية",
    rewardNote: "استخدم الكود عند الدفع أو اكتبه في ملاحظات الطلب.",
    specialTitle: "تدور على شيء نادر؟",
    specialSubtitle: "نجيبه لك",
    specialDescription: "لو تبحث عن بوكس معين، كرت نادر، كرت مقيم أو باندل خاص، أرسل التفاصيل وسنضيفه كطلب تسعير للمتابعة.",
    requestDetails: "تفاصيل الطلب",
    requestDetailsSub: "اكتب لنا الشيء اللي تبغاه بالضبط.",
    requestType: "نوع الطلب",
    rareCard: "كرت نادر",
    sealedBox: "بوكس مختوم",
    gradedSlab: "كرت مقيم",
    customBundle: "باندل خاص",
    cardOrBoxName: "اسم الكرت أو البوكس",
    cardOrBoxPlaceholder: "مثال: Prismatic Evolutions ETB أو Charizard Base Set...",
    budget: "الميزانية",
    budgetPlaceholder: "حد أقصى 1500 ر.س",
    any: "أي حالة",
    nearMint: "شبه جديد",
    lightlyPlayed: "مستخدم خفيف",
    sealedOnly: "مختوم فقط",
    graded8: "تقييم 8+",
    graded10: "تقييم 10",
    contact: "طريقة التواصل",
    contactPlaceholder: "واتساب، إيميل، أو إنستغرام",
    uploadReference: "ارفع صورة مرجعية",
    notes: "ملاحظات",
    notesPlaceholder: "الإصدار، اللغة، التقييم المطلوب، الموعد، أو أي تفاصيل...",
    addSpecialRequest: "إضافة الطلب الخاص",
    requestAdded: "تمت إضافة الطلب. سيظهر في السلة كطلب تسعير مع التفاصيل.",
    rareCards: "كروت نادرة",
    sealedBoxes: "بوكسات مختومة",
    quoteFollowUp: "متابعة عرض السعر",
    footerJoin: "انضم للمدربين",
    footerJoinCopy: "تنبيهات الإصدارات والريستوك وأول وصول للكروت النادرة مباشرة لبريدك.",
    subscribe: "اشتراك",
    emailPlaceholder: "trainer@pokemonsa.sa",
    footerDescription: "وجهة جدة الفاخرة لكروت Pokémon، البوكسات المختومة، المنتجات المخصصة، وتجربة الجامعين.",
    shop: "المتجر",
    support: "الدعم",
    legal: "قانوني",
    shipping: "الشحن",
    returns: "الاسترجاع",
    faq: "الأسئلة",
    privacy: "الخصوصية",
    terms: "الشروط",
    cookies: "الكوكيز",
    accessibility: "إتاحة الوصول",
    location: "جدة · المملكة العربية السعودية",
    rights: "جميع العلامات التجارية ملك لأصحابها.",
    language: "English",
    notFound: "الصفحة غير موجودة",
    returnHome: "العودة للرئيسية",
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const normalizeLanguage = (value: string | null): Language => (value === "ar" ? "ar" : "en");

export const translate = (language: Language, key: string) => translations[language][key] || translations.en[key] || key;

let pendingScrollPosition: { x: number; y: number } | null = null;

const captureScrollPosition = () => {
  if (typeof window === "undefined") return;
  pendingScrollPosition = { x: window.scrollX, y: window.scrollY };
};

const restoreScrollPosition = ({ x, y }: { x: number; y: number }) => {
  const restore = () => window.scrollTo(x, y);
  restore();
  window.requestAnimationFrame(() => {
    restore();
    window.requestAnimationFrame(restore);
    window.setTimeout(restore, 120);
    window.setTimeout(restore, 320);
    window.setTimeout(restore, 700);
  });
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return normalizeLanguage(window.localStorage.getItem("language"));
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    window.localStorage.setItem("language", language);

    if (pendingScrollPosition) {
      const position = pendingScrollPosition;
      pendingScrollPosition = null;
      restoreScrollPosition(position);
    }
  }, [dir, language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    captureScrollPosition();
    startTransition(() => {
      setLanguageState(nextLanguage);
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    captureScrollPosition();
    startTransition(() => {
      setLanguageState((current) => (current === "en" ? "ar" : "en"));
    });
  }, []);

  const t = useCallback((key: string) => translate(language, key), [language]);

  const formatPrice = useCallback(
    (price: number) => (language === "ar" ? `${price.toLocaleString()} ر.س` : `SAR ${price.toLocaleString()}`),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir,
      setLanguage,
      toggleLanguage,
      t,
      formatPrice,
    }),
    [dir, formatPrice, language, setLanguage, t, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
