import { Language } from "@/context/LanguageContext";
import t1 from "@/assets/tshirt-1.jpg";
import t2 from "@/assets/tshirt-2.jpg";
import h1 from "@/assets/hoodie-1.jpg";
import h2 from "@/assets/hoodie-2.jpg";

type LocalizedText = Record<Language, string>;

export type Product = {
  id: string;
  category: "cards" | "boosters" | "magnets" | "apparel";
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
  gallery: string[];
  badge?: LocalizedText;
  featured?: boolean;
  specs: Record<Language, string[]>;
  colors?: { name: LocalizedText; hex: string }[];
  sizes?: string[];
};

const tcg = (set: string, number: string) => `https://images.pokemontcg.io/${set}/${number}_hires.png`;
const pokemon = (id: string) => `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;

export const products: Product[] = [
  {
    id: "base1-4",
    category: "cards",
    name: { en: "Charizard — Base Set", ar: "تشارزارد — Base Set" },
    subtitle: { en: "Rare Holo", ar: "هولو نادر" },
    description: {
      en: "The legendary Base Set Charizard in a clean collector presentation. This page uses a real high-resolution Pokémon TCG card scan so buyers can inspect the artwork, rarity and display value before ordering.",
      ar: "تشارزارد من Base Set، واحد من أشهر كروت Pokémon TCG. الصفحة تستخدم صورة حقيقية عالية الدقة للكرت حتى يقدر العميل يشوف التصميم والندرة وقيمة العرض قبل الطلب.",
    },
    price: 3499,
    image: tcg("base1", "4"),
    gallery: [tcg("base1", "4"), pokemon("006"), tcg("basep", "1")],
    badge: { en: "Rare Holo", ar: "هولو نادر" },
    specs: {
      en: ["Base Set #4/102", "Rare Holo collector single", "High-resolution real card scan", "Sleeved and protected before shipping"],
      ar: ["Base Set رقم 4/102", "كرت Rare Holo للجامعين", "صورة حقيقية عالية الدقة", "يتم تغليفه بسليف وحماية قبل الشحن"],
    },
  },
  {
    id: "base1-2",
    category: "cards",
    name: { en: "Blastoise — Base Set", ar: "بلاستويز — Base Set" },
    subtitle: { en: "Rare Holo", ar: "هولو نادر" },
    description: {
      en: "Blastoise from the original Base Set, presented with a real TCG scan and a detailed collector-focused description for premium buyers.",
      ar: "بلاستويز من مجموعة Base Set الأصلية، مع صورة TCG حقيقية ووصف مرتب يناسب الجامعين والعملاء الجادين.",
    },
    price: 2199,
    image: tcg("base1", "2"),
    gallery: [tcg("base1", "2"), pokemon("009"), tcg("basep", "2")],
    badge: { en: "Rare Holo", ar: "هولو نادر" },
    specs: {
      en: ["Base Set #2/102", "Rare Holo water starter", "Real card scan", "Protected collector packaging"],
      ar: ["Base Set رقم 2/102", "Rare Holo من البدايات المائية", "صورة حقيقية للكرت", "تغليف حماية للجامعين"],
    },
  },
  {
    id: "base1-15",
    category: "cards",
    name: { en: "Venusaur — Base Set", ar: "فينوسور — Base Set" },
    subtitle: { en: "Rare Holo", ar: "هولو نادر" },
    description: {
      en: "A classic Venusaur holo for collectors completing the original starter trio. The detail page highlights condition expectations, packaging and display value.",
      ar: "فينوسور هولو كلاسيكي للجامعين اللي يكملون ثلاثي البدايات الأصلي. صفحة المنتج توضح الحالة المتوقعة، التغليف، وقيمة العرض.",
    },
    price: 1999,
    image: tcg("base1", "15"),
    gallery: [tcg("base1", "15"), pokemon("003"), tcg("basep", "13")],
    badge: { en: "Rare Holo", ar: "هولو نادر" },
    specs: {
      en: ["Base Set #15/102", "Rare Holo grass starter", "Real card scan", "Display and binder ready"],
      ar: ["Base Set رقم 15/102", "Rare Holo من البدايات العشبية", "صورة حقيقية للكرت", "جاهز للألبوم أو العرض"],
    },
  },
  {
    id: "swsh4-25",
    category: "cards",
    name: { en: "Charizard — Vivid Voltage", ar: "تشارزارد — Vivid Voltage" },
    subtitle: { en: "Rare", ar: "نادر" },
    description: {
      en: "A modern Charizard single from Sword & Shield with a real card scan and a clear product page for quick purchase decisions.",
      ar: "كرت تشارزارد حديث من Sword & Shield، بصورة حقيقية ووصف واضح يساعد العميل يقرر بسرعة.",
    },
    price: 149,
    image: tcg("swsh4", "25"),
    gallery: [tcg("swsh4", "25"), pokemon("006"), tcg("swsh4", "25")],
    badge: { en: "Rare", ar: "نادر" },
    specs: {
      en: ["Sword & Shield era", "Modern Charizard single", "Real card scan", "Secure sleeve packaging"],
      ar: ["من حقبة Sword & Shield", "كرت تشارزارد حديث", "صورة حقيقية للكرت", "تغليف بسليف آمن"],
    },
  },
  {
    id: "b1",
    category: "boosters",
    name: { en: "Journey Together Booster Bundle", ar: "Journey Together Booster Bundle" },
    subtitle: { en: "6 booster packs · sealed bundle", ar: "6 بوستر · باندل مختوم" },
    description: {
      en: "A real Journey Together Booster Bundle product photo with six sealed packs from the Scarlet & Violet expansion. Built for collectors who want sealed product with clean packaging.",
      ar: "صورة حقيقية لباندل Journey Together يحتوي على 6 بوسترات مختومة من Scarlet & Violet. مناسب للفتح، الإهداء، أو العرض ضمن المجموعة.",
    },
    price: 799,
    image: "https://tcgplayer-cdn.tcgplayer.com/product/610953_in_1000x1000.jpg",
    gallery: [
      "https://tcgplayer-cdn.tcgplayer.com/product/610953_in_1000x1000.jpg",
      "https://tcgplayer-cdn.tcgplayer.com/product/610953_200w.jpg",
      pokemon("571"),
    ],
    specs: {
      en: ["Factory sealed", "6 booster packs", "Real retail packaging image", "Suitable for opening or sealed collecting"],
      ar: ["مختوم من المصنع", "6 بوسترات", "صورة تغليف حقيقية", "مناسب للفتح أو الاحتفاظ مختوم"],
    },
  },
  {
    id: "b2",
    category: "boosters",
    name: { en: "Journey Together Elite Trainer Box", ar: "Journey Together Elite Trainer Box" },
    subtitle: { en: "9 packs · promo · sleeves · dice", ar: "9 بوستر · برومو · سليفات · نرد" },
    description: {
      en: "A premium Elite Trainer Box with real retail packaging photography, booster packs, sleeves, dice and collector storage accessories.",
      ar: "Elite Trainer Box فاخر بصورة تغليف حقيقية، يحتوي بوسترات وسليفات ونرد وملحقات تخزين للجامعين.",
    },
    price: 1499,
    image: "https://tcgplayer-cdn.tcgplayer.com/product/610930_in_1000x1000.jpg",
    gallery: [
      "https://tcgplayer-cdn.tcgplayer.com/product/610930_in_1000x1000.jpg",
      "https://tcgplayer-cdn.tcgplayer.com/product/610930_200w.jpg",
      "https://tcgplayer-cdn.tcgplayer.com/product/610953_in_1000x1000.jpg",
    ],
    badge: { en: "Best Value", ar: "الأفضل قيمة" },
    featured: true,
    specs: {
      en: ["Factory sealed", "9 booster packs", "Sleeves, dice and markers included", "Premium collector storage box"],
      ar: ["مختوم من المصنع", "9 بوسترات", "يشمل سليفات ونرد ومؤشرات", "بوكس تخزين فاخر للجامعين"],
    },
  },
  {
    id: "b3",
    category: "boosters",
    name: { en: "Destined Rivals Elite Trainer Box", ar: "Destined Rivals Elite Trainer Box" },
    subtitle: { en: "9 packs · collector box · accessories", ar: "9 بوستر · بوكس جامعين · ملحقات" },
    description: {
      en: "A sealed Destined Rivals Elite Trainer Box with official-style product photography and a detailed accessory list for serious collectors.",
      ar: "Destined Rivals Elite Trainer Box مختوم بصورة منتج واقعية وقائمة ملحقات واضحة للجامعين.",
    },
    price: 1899,
    image: "https://tcgplayer-cdn.tcgplayer.com/product/624676_in_1000x1000.jpg",
    gallery: [
      "https://tcgplayer-cdn.tcgplayer.com/product/624676_in_1000x1000.jpg",
      "https://tcgplayer-cdn.tcgplayer.com/product/624676_200w.jpg",
      "https://tcgplayer-cdn.tcgplayer.com/product/610930_in_1000x1000.jpg",
    ],
    specs: {
      en: ["Factory sealed", "9 booster packs", "Collector box and dividers", "Accessories included"],
      ar: ["مختوم من المصنع", "9 بوسترات", "بوكس جامعين مع فواصل", "ملحقات مرفقة"],
    },
  },
  {
    id: "mg1",
    category: "magnets",
    name: { en: "Spark Mouse Magnet", ar: "مغناطيس بيكاتشو" },
    subtitle: { en: "Glossy die-cut magnet", ar: "مغناطيس لامع بقص مخصص" },
    description: {
      en: "A Pikachu character magnet concept using official character artwork, designed as a glossy die-cut print for fridges, lockers and desk boards.",
      ar: "مغناطيس بيكاتشو باستخدام تصميم الشخصية الرسمي، مطبوع بقص مخصص ولمعة مناسبة للثلاجة والمكتب.",
    },
    price: 79,
    image: pokemon("025"),
    gallery: [pokemon("025"), pokemon("172"), pokemon("026")],
    specs: {
      en: ["Official Pikachu artwork", "Gloss die-cut finish", "Lightweight magnet", "Gift-ready packaging"],
      ar: ["تصميم بيكاتشو الرسمي", "تشطيب لامع بقص مخصص", "مغناطيس خفيف", "تغليف مناسب للإهداء"],
    },
  },
  {
    id: "mg2",
    category: "magnets",
    name: { en: "Eevee Squad Magnet", ar: "مغناطيس إيفي" },
    subtitle: { en: "Official character artwork magnet", ar: "مغناطيس بتصميم الشخصية الرسمي" },
    description: {
      en: "A clean Eevee magnet design using official character art, made for fans who prefer cute starter-style collectibles.",
      ar: "تصميم مغناطيس إيفي باستخدام صورة الشخصية الرسمية، مناسب لعشاق القطع اللطيفة والقابلة للتجميع.",
    },
    price: 59,
    image: pokemon("133"),
    gallery: [pokemon("133"), pokemon("134"), pokemon("135"), pokemon("136")],
    specs: {
      en: ["Official Eevee artwork", "Gloss finish", "Compact collector size", "Strong fridge presence"],
      ar: ["تصميم إيفي الرسمي", "تشطيب لامع", "حجم عملي للجامعين", "واضح على الثلاجة"],
    },
  },
  {
    id: "mg3",
    category: "magnets",
    name: { en: "Starter Set — 12 Magnets", ar: "مجموعة البدايات — 12 مغناطيس" },
    subtitle: { en: "Starter character magnet pack", ar: "مجموعة مغناطيس لشخصيات البداية" },
    description: {
      en: "A starter-themed magnet collection using official Pokémon character art for a full roster display.",
      ar: "مجموعة مغناطيس لشخصيات البداية باستخدام التصاميم الرسمية، مناسبة لعرض فريق كامل.",
    },
    price: 249,
    image: pokemon("004"),
    gallery: [pokemon("001"), pokemon("004"), pokemon("007"), pokemon("025")],
    specs: {
      en: ["12-piece set", "Official starter character artwork", "Glossy finish", "Gift packaging"],
      ar: ["مجموعة 12 قطعة", "تصاميم رسمية لشخصيات البداية", "تشطيب لامع", "تغليف مناسب للإهداء"],
    },
  },
  {
    id: "t1",
    category: "apparel",
    name: { en: "Volt Bolt Tee", ar: "تيشيرت Volt Bolt" },
    subtitle: { en: "Heavyweight cotton tee", ar: "تيشيرت قطن ثقيل" },
    description: {
      en: "A heavyweight cotton tee with bold electric artwork and a clean streetwear fit.",
      ar: "تيشيرت قطن ثقيل بطباعة كهربائية واضحة وقصة مريحة.",
    },
    price: 449,
    image: t1,
    gallery: [t1, t2, h1],
    colors: [
      { name: { en: "Black", ar: "أسود" }, hex: "#0a0a0a" },
      { name: { en: "Yellow", ar: "أصفر" }, hex: "#facc15" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    specs: {
      en: ["Heavyweight cotton", "Screen printed", "Regular fit", "Made for daily wear"],
      ar: ["قطن ثقيل", "طباعة سكرين", "قصة عادية", "مناسب للاستخدام اليومي"],
    },
  },
  {
    id: "t2",
    category: "apparel",
    name: { en: "Classic Ball Tee", ar: "تيشيرت الكرة الكلاسيكية" },
    subtitle: { en: "Graphic collector tee", ar: "تيشيرت جرافيك للجامعين" },
    description: {
      en: "A classic ball graphic tee for a minimal collector look.",
      ar: "تيشيرت بجرافيك الكرة الكلاسيكية لمظهر بسيط وواضح.",
    },
    price: 449,
    image: t2,
    gallery: [t2, t1, h2],
    colors: [
      { name: { en: "Navy", ar: "كحلي" }, hex: "#0b1437" },
      { name: { en: "Red", ar: "أحمر" }, hex: "#dc2626" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    specs: {
      en: ["Heavyweight cotton", "Graphic front print", "Soft hand feel", "Everyday fit"],
      ar: ["قطن ثقيل", "طباعة أمامية", "ملمس ناعم", "قصة يومية"],
    },
  },
  {
    id: "h1",
    category: "apparel",
    name: { en: "Volt Bolt Hoodie", ar: "هودي Volt Bolt" },
    subtitle: { en: "Premium fleece hoodie", ar: "هودي فليس فاخر" },
    description: {
      en: "A warm fleece hoodie with electric trainer styling and reinforced seams.",
      ar: "هودي فليس دافئ بطابع كهربائي وخياطة قوية.",
    },
    price: 899,
    image: h1,
    gallery: [h1, h2, t1],
    colors: [
      { name: { en: "Black", ar: "أسود" }, hex: "#0a0a0a" },
      { name: { en: "Charcoal", ar: "فحمي" }, hex: "#374151" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    specs: {
      en: ["Premium fleece", "Double stitched", "Kangaroo pocket", "Warm daily layer"],
      ar: ["فليس فاخر", "خياطة مزدوجة", "جيب أمامي", "طبقة دافئة يومية"],
    },
  },
  {
    id: "h2",
    category: "apparel",
    name: { en: "Trainer Zip Hoodie", ar: "هودي Trainer Zip" },
    subtitle: { en: "Zip hoodie for trainers", ar: "هودي بسحاب للمدربين" },
    description: {
      en: "A premium zip hoodie for trainers who want comfort with a collector identity.",
      ar: "هودي بسحاب مريح لهوية جامعين واضحة.",
    },
    price: 999,
    image: h2,
    gallery: [h2, h1, t2],
    colors: [
      { name: { en: "Charcoal", ar: "فحمي" }, hex: "#374151" },
      { name: { en: "Black", ar: "أسود" }, hex: "#0a0a0a" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    specs: {
      en: ["Premium fleece", "Full zip", "Double stitched", "Layered trainer fit"],
      ar: ["فليس فاخر", "سحاب كامل", "خياطة مزدوجة", "مناسب للبس اليومي"],
    },
  },
];

export const getProduct = (id?: string) => products.find((product) => product.id === id);

export const productsByCategory = (category: Product["category"]) => products.filter((product) => product.category === category);
