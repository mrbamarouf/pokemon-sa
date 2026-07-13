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
  inventory?: number;
  specs: Record<Language, string[]>;
  colors?: { name: LocalizedText; hex: string }[];
  sizes?: string[];
};

const tcg = (set: string, number: string) => `https://images.pokemontcg.io/${set}/${number}_hires.png`;
const pokemon = (id: string) => `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
const shopifyCdn = (path: string) => `https://cdn.shopify.com/${path}`;
const bigCommerceImage = (path: string) => `https://cdn11.bigcommerce.com/${path}`;

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
    id: "swsh7-215",
    category: "cards",
    name: { en: "Umbreon VMAX — Evolving Skies", ar: "أمبريون VMAX — Evolving Skies" },
    subtitle: { en: "Rare Rainbow · #215/203", ar: "Rare Rainbow · رقم 215/203" },
    description: {
      en: "Umbreon VMAX from Sword & Shield—Evolving Skies, one of the most desired modern collector singles. The product uses the authentic Pokémon TCG card scan for clear artwork and card-number inspection.",
      ar: "كرت Umbreon VMAX من Sword & Shield—Evolving Skies، من أشهر كروت الجامعين الحديثة. يستخدم المنتج صورة Pokémon TCG الحقيقية للكرت حتى تظهر الرسمة ورقم الكرت بوضوح.",
    },
    price: 9999,
    image: tcg("swsh7", "215"),
    gallery: [tcg("swsh7", "215")],
    badge: { en: "Collector Chase", ar: "كرت مطارد للجامعين" },
    inventory: 10,
    specs: {
      en: ["Evolving Skies #215/203", "Umbreon VMAX", "Rare Rainbow", "Authentic high-resolution Pokémon TCG scan", "Sleeved and protected before shipping"],
      ar: ["Evolving Skies رقم 215/203", "Umbreon VMAX", "Rare Rainbow", "صورة Pokémon TCG حقيقية عالية الدقة", "تغليف بسليف وحماية قبل الشحن"],
    },
  },
  {
    id: "swsh7-218",
    category: "cards",
    name: { en: "Rayquaza VMAX — Evolving Skies", ar: "رايكوازا VMAX — Evolving Skies" },
    subtitle: { en: "Rare Rainbow · #218/203", ar: "Rare Rainbow · رقم 218/203" },
    description: {
      en: "Rayquaza VMAX from Evolving Skies with a premium collector presentation and a real Pokémon TCG scan for accurate artwork, rarity and set details.",
      ar: "كرت Rayquaza VMAX من Evolving Skies بتقديم مناسب للجامعين وصورة Pokémon TCG حقيقية توضح الرسمة والندرة ومعلومات المجموعة.",
    },
    price: 4799,
    image: tcg("swsh7", "218"),
    gallery: [tcg("swsh7", "218")],
    inventory: 10,
    specs: {
      en: ["Evolving Skies #218/203", "Rayquaza VMAX", "Rare Rainbow", "Real high-resolution card scan", "Collector-safe sleeve packaging"],
      ar: ["Evolving Skies رقم 218/203", "Rayquaza VMAX", "Rare Rainbow", "صورة حقيقية عالية الدقة للكرت", "تغليف آمن بسليف للجامعين"],
    },
  },
  {
    id: "swsh12-186",
    category: "cards",
    name: { en: "Lugia V — Silver Tempest", ar: "لوجيا V — Silver Tempest" },
    subtitle: { en: "Rare Ultra · #186/195", ar: "Rare Ultra · رقم 186/195" },
    description: {
      en: "Lugia V from Sword & Shield—Silver Tempest, a standout legendary single with a real card scan and collector-ready product details.",
      ar: "كرت Lugia V من Sword & Shield—Silver Tempest، كرت أسطوري مميز بصورة حقيقية وتفاصيل مناسبة للجامعين.",
    },
    price: 999,
    image: tcg("swsh12", "186"),
    gallery: [tcg("swsh12", "186")],
    inventory: 10,
    specs: {
      en: ["Silver Tempest #186/195", "Lugia V", "Rare Ultra", "Authentic Pokémon TCG card scan", "Sleeved and protected before shipping"],
      ar: ["Silver Tempest رقم 186/195", "Lugia V", "Rare Ultra", "صورة Pokémon TCG حقيقية", "تغليف بسليف وحماية قبل الشحن"],
    },
  },
  {
    id: "swsh12pt5gg-gg69",
    category: "cards",
    name: { en: "Giratina VSTAR — Crown Zenith", ar: "جيراتينا VSTAR — Crown Zenith" },
    subtitle: { en: "Galarian Gallery · Rare Secret", ar: "Galarian Gallery · Rare Secret" },
    description: {
      en: "Giratina VSTAR from Crown Zenith Galarian Gallery, featuring dramatic full-art styling and a real high-resolution card image for collector inspection.",
      ar: "كرت Giratina VSTAR من Crown Zenith Galarian Gallery برسمة كاملة درامية وصورة حقيقية عالية الدقة لمعاينة الجامعين.",
    },
    price: 699,
    image: tcg("swsh12pt5gg", "GG69"),
    gallery: [tcg("swsh12pt5gg", "GG69")],
    inventory: 10,
    specs: {
      en: ["Crown Zenith Galarian Gallery #GG69", "Giratina VSTAR", "Rare Secret", "Real high-resolution Pokémon TCG scan", "Protected collector packaging"],
      ar: ["Crown Zenith Galarian Gallery رقم GG69", "Giratina VSTAR", "Rare Secret", "صورة Pokémon TCG حقيقية عالية الدقة", "تغليف حماية للجامعين"],
    },
  },
  {
    id: "swsh12pt5gg-gg44",
    category: "cards",
    name: { en: "Mewtwo VSTAR — Crown Zenith", ar: "ميوتو VSTAR — Crown Zenith" },
    subtitle: { en: "Galarian Gallery · Rare Holo VSTAR", ar: "Galarian Gallery · Rare Holo VSTAR" },
    description: {
      en: "Mewtwo VSTAR from Crown Zenith Galarian Gallery, presented as a premium modern single with authentic card imagery and clear set information.",
      ar: "كرت Mewtwo VSTAR من Crown Zenith Galarian Gallery، مقدم ككرت حديث فاخر بصورة حقيقية ومعلومات مجموعة واضحة.",
    },
    price: 349,
    image: tcg("swsh12pt5gg", "GG44"),
    gallery: [tcg("swsh12pt5gg", "GG44")],
    inventory: 10,
    specs: {
      en: ["Crown Zenith Galarian Gallery #GG44", "Mewtwo VSTAR", "Rare Holo VSTAR", "Authentic card scan", "Sleeved for shipping"],
      ar: ["Crown Zenith Galarian Gallery رقم GG44", "Mewtwo VSTAR", "Rare Holo VSTAR", "صورة حقيقية للكرت", "تغليف بسليف للشحن"],
    },
  },
  {
    id: "swsh12pt5gg-gg30",
    category: "cards",
    name: { en: "Pikachu — Crown Zenith", ar: "بيكاتشو — Crown Zenith" },
    subtitle: { en: "Galarian Gallery · Trainer Gallery Rare Holo", ar: "Galarian Gallery · Trainer Gallery Rare Holo" },
    description: {
      en: "Pikachu from Crown Zenith Galarian Gallery, a bright collector single with authentic Pokémon TCG card imagery and gift-ready appeal.",
      ar: "كرت Pikachu من Crown Zenith Galarian Gallery، كرت جميل للجامعين بصورة Pokémon TCG حقيقية ومناسب للإهداء.",
    },
    price: 179,
    image: tcg("swsh12pt5gg", "GG30"),
    gallery: [tcg("swsh12pt5gg", "GG30")],
    inventory: 10,
    specs: {
      en: ["Crown Zenith Galarian Gallery #GG30", "Pikachu", "Trainer Gallery Rare Holo", "Real card scan", "Sleeved collector packaging"],
      ar: ["Crown Zenith Galarian Gallery رقم GG30", "Pikachu", "Trainer Gallery Rare Holo", "صورة حقيقية للكرت", "تغليف بسليف للجامعين"],
    },
  },
  {
    id: "swsh8-271",
    category: "cards",
    name: { en: "Gengar VMAX — Fusion Strike", ar: "جينجار VMAX — Fusion Strike" },
    subtitle: { en: "Rare Rainbow · #271/264", ar: "Rare Rainbow · رقم 271/264" },
    description: {
      en: "Gengar VMAX from Fusion Strike with authentic high-resolution card imagery, ideal for collectors who want a bold modern chase single.",
      ar: "كرت Gengar VMAX من Fusion Strike بصورة حقيقية عالية الدقة، مناسب للجامعين الباحثين عن كرت حديث ومميز.",
    },
    price: 599,
    image: tcg("swsh8", "271"),
    gallery: [tcg("swsh8", "271")],
    inventory: 10,
    specs: {
      en: ["Fusion Strike #271/264", "Gengar VMAX", "Rare Rainbow", "Real high-resolution scan", "Protected before shipping"],
      ar: ["Fusion Strike رقم 271/264", "Gengar VMAX", "Rare Rainbow", "صورة حقيقية عالية الدقة", "تغليف حماية قبل الشحن"],
    },
  },
  {
    id: "sv3-228",
    category: "cards",
    name: { en: "Charizard ex — Obsidian Flames", ar: "تشارزارد ex — Obsidian Flames" },
    subtitle: { en: "Hyper Rare · #228/197", ar: "Hyper Rare · رقم 228/197" },
    description: {
      en: "Charizard ex from Scarlet & Violet—Obsidian Flames, a Hyper Rare modern Charizard single with a real card scan for quick collector review.",
      ar: "كرت Charizard ex من Scarlet & Violet—Obsidian Flames بندرة Hyper Rare، بصورة حقيقية تساعد الجامع على معاينة الكرت بسرعة.",
    },
    price: 249,
    image: tcg("sv3", "228"),
    gallery: [tcg("sv3", "228")],
    inventory: 10,
    specs: {
      en: ["Obsidian Flames #228/197", "Charizard ex", "Hyper Rare", "Authentic Pokémon TCG scan", "Sleeved and protected"],
      ar: ["Obsidian Flames رقم 228/197", "Charizard ex", "Hyper Rare", "صورة Pokémon TCG حقيقية", "تغليف بسليف وحماية"],
    },
  },
  {
    id: "sv2-269",
    category: "cards",
    name: { en: "Iono — Paldea Evolved", ar: "أيونو — Paldea Evolved" },
    subtitle: { en: "Special Illustration Rare · #269/193", ar: "Special Illustration Rare · رقم 269/193" },
    description: {
      en: "Iono from Paldea Evolved, a Special Illustration Rare trainer card with authentic card artwork and premium collector positioning.",
      ar: "كرت Iono من Paldea Evolved بندرة Special Illustration Rare، بصورة كرت حقيقية وتقديم فاخر للجامعين.",
    },
    price: 799,
    image: tcg("sv2", "269"),
    gallery: [tcg("sv2", "269")],
    inventory: 10,
    specs: {
      en: ["Paldea Evolved #269/193", "Trainer card", "Special Illustration Rare", "Real high-resolution card scan", "Collector-safe packaging"],
      ar: ["Paldea Evolved رقم 269/193", "كرت Trainer", "Special Illustration Rare", "صورة حقيقية عالية الدقة", "تغليف آمن للجامعين"],
    },
  },
  {
    id: "sv3pt5-205",
    category: "cards",
    name: { en: "Mew ex — 151", ar: "ميو ex — 151" },
    subtitle: { en: "Hyper Rare · #205/165", ar: "Hyper Rare · رقم 205/165" },
    description: {
      en: "Mew ex from Scarlet & Violet—151, a Hyper Rare card from the Kanto-focused special set with authentic product imagery.",
      ar: "كرت Mew ex من Scarlet & Violet—151 بندرة Hyper Rare من مجموعة كانتو الخاصة، مع صورة منتج حقيقية للكرت.",
    },
    price: 199,
    image: tcg("sv3pt5", "205"),
    gallery: [tcg("sv3pt5", "205")],
    inventory: 10,
    specs: {
      en: ["Scarlet & Violet—151 #205/165", "Mew ex", "Hyper Rare", "Authentic high-resolution scan", "Protected collector packaging"],
      ar: ["Scarlet & Violet—151 رقم 205/165", "Mew ex", "Hyper Rare", "صورة حقيقية عالية الدقة", "تغليف حماية للجامعين"],
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
    id: "box-sv151-etb",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—151 Elite Trainer Box", ar: "Pokémon TCG: Scarlet & Violet—151 Elite Trainer Box" },
    subtitle: { en: "9 packs · Snorlax promo · sleeves", ar: "9 بوسترات · برومو Snorlax · سليفات" },
    description: {
      en: "A sealed Scarlet & Violet—151 Elite Trainer Box focused on the original Kanto roster, with booster packs, Snorlax promo card, sleeves and collector accessories.",
      ar: "بوكس Scarlet & Violet—151 Elite Trainer Box مختوم يركز على شخصيات كانتو الأصلية، مع بوسترات وكرت Snorlax برومو وسليفات وملحقات للجامعين.",
    },
    price: 399,
    image: shopifyCdn("s/files/1/0579/9008/6787/files/snorlaxetb.png?v=1773519135"),
    gallery: [
      shopifyCdn("s/files/1/0579/9008/6787/files/snorlaxetb.png?v=1773519135"),
      shopifyCdn("s/files/1/0240/2713/6052/files/503313_in_1000x1000_d521b1a2-9521-41c3-9e18-e27557b0dbe3.jpg?v=1762270081"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "9 Scarlet & Violet—151 booster packs", "Full-art foil promo card featuring Snorlax", "65 card sleeves and Energy cards", "Player guide, dice, markers, dividers and code card"],
      ar: ["مختوم من المصنع", "9 بوسترات Scarlet & Violet—151", "كرت برومو Full-Art Foil لشخصية Snorlax", "65 سليف وكروت Energy", "دليل لاعب ونرد ومؤشرات وفواصل وكود رقمي"],
    },
  },
  {
    id: "box-paldean-fates-etb",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Paldean Fates Elite Trainer Box", ar: "Pokémon TCG: Scarlet & Violet—Paldean Fates Elite Trainer Box" },
    subtitle: { en: "9 packs · Shiny Mimikyu promo", ar: "9 بوسترات · برومو Shiny Mimikyu" },
    description: {
      en: "A sealed Paldean Fates Elite Trainer Box for collectors chasing Shiny Pokémon, including booster packs, a Shiny Mimikyu promo and ETB accessories.",
      ar: "بوكس Paldean Fates Elite Trainer Box مختوم لعشاق Pokémon اللامعة، مع بوسترات وكرت Shiny Mimikyu برومو وملحقات ETB.",
    },
    price: 349,
    image: bigCommerceImage("s-a0ebd/products/7982/images/21682/pokemon-scarlet-and-violet-paldean-fates-elite-trainer-box__05296.1703009079.1280.1280.jpg?c=2"),
    gallery: [bigCommerceImage("s-a0ebd/products/7982/images/21682/pokemon-scarlet-and-violet-paldean-fates-elite-trainer-box__05296.1703009079.1280.1280.jpg?c=2")],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "9 Scarlet & Violet—Paldean Fates booster packs", "Full-art foil promo card featuring Shiny Mimikyu", "Card sleeves, Energy cards, guide, dice and markers", "Collector storage box with dividers"],
      ar: ["مختوم من المصنع", "9 بوسترات Scarlet & Violet—Paldean Fates", "كرت برومو Full-Art Foil لشخصية Shiny Mimikyu", "سليفات وكروت Energy ودليل ونرد ومؤشرات", "بوكس تخزين للجامعين مع فواصل"],
    },
  },
  {
    id: "box-prismatic-evolutions-etb",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Prismatic Evolutions Elite Trainer Box", ar: "Pokémon TCG: Scarlet & Violet—Prismatic Evolutions Elite Trainer Box" },
    subtitle: { en: "9 packs · Eevee promo · sleeves", ar: "9 بوسترات · برومو Eevee · سليفات" },
    description: {
      en: "A sealed Prismatic Evolutions Elite Trainer Box celebrating Eevee and its Evolutions, with booster packs, Eevee promo card and premium ETB accessories.",
      ar: "بوكس Prismatic Evolutions Elite Trainer Box مختوم يحتفي بشخصية Eevee وتطوراتها، مع بوسترات وكرت Eevee برومو وملحقات ETB فاخرة.",
    },
    price: 599,
    image: shopifyCdn("s/files/1/0668/6051/5626/files/b37d6bea25e23d965f4d592ce212f769.png?v=1738268969"),
    gallery: [
      shopifyCdn("s/files/1/0668/6051/5626/files/b37d6bea25e23d965f4d592ce212f769.png?v=1738268969"),
      shopifyCdn("s/files/1/0668/6051/5626/files/a5accd5fb2165a6665be65543a9f63a5.png?v=1738268969"),
      shopifyCdn("s/files/1/0668/6051/5626/files/55ad57304aac68234d1e935172f0b256.png?v=1738268969"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "9 Scarlet & Violet—Prismatic Evolutions booster packs", "Full-art foil promo card featuring Eevee", "Eevee-themed sleeves and Energy cards", "Guide, dice, markers, dividers and code card"],
      ar: ["مختوم من المصنع", "9 بوسترات Scarlet & Violet—Prismatic Evolutions", "كرت برومو Full-Art Foil لشخصية Eevee", "سليفات بطابع Eevee وكروت Energy", "دليل ونرد ومؤشرات وفواصل وكود رقمي"],
    },
  },
  {
    id: "box-surging-sparks-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Surging Sparks Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Surging Sparks Booster Display Box" },
    subtitle: { en: "36 booster packs · sealed display", ar: "36 بوستر · ديسبلاي مختوم" },
    description: {
      en: "A sealed Surging Sparks booster display box with 36 booster packs, built for opening sessions, store testing and sealed product collectors.",
      ar: "بوكس Surging Sparks Booster Display مختوم يحتوي على 36 بوستر، مناسب لجلسات الفتح وتجربة المتجر والجامعين للمنتجات المختومة.",
    },
    price: 799,
    image: shopifyCdn("s/files/1/0922/3959/3797/files/Surging-Sparks-BB-1.png?v=1744882179"),
    gallery: [
      shopifyCdn("s/files/1/0922/3959/3797/files/Surging-Sparks-BB-1.png?v=1744882179"),
      shopifyCdn("s/files/1/0922/3959/3797/files/Surging-Sparks-BB-2.png?v=1744882179"),
      shopifyCdn("s/files/1/0922/3959/3797/files/SurgingSparksBoosterBox.jpg?v=1744882179"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Surging Sparks booster packs", "Each pack contains 10 cards and 1 Basic Energy", "Sealed display box for collectors or opening events"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Surging Sparks", "كل بوستر يحتوي على 10 كروت وBasic Energy", "بوكس ديسبلاي مختوم للجامعين أو جلسات الفتح"],
    },
  },
  {
    id: "box-stellar-crown-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Stellar Crown Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Stellar Crown Booster Display Box" },
    subtitle: { en: "36 booster packs · sealed display", ar: "36 بوستر · ديسبلاي مختوم" },
    description: {
      en: "A factory-sealed Stellar Crown booster display box with 36 packs from the Terastal-themed Scarlet & Violet expansion.",
      ar: "بوكس Stellar Crown Booster Display مختوم من المصنع يحتوي على 36 بوستر من توسعة Scarlet & Violet بطابع Terastal.",
    },
    price: 649,
    image: shopifyCdn("s/files/1/0706/6855/0422/files/P9507_699-42279_01.jpg?v=1722734668"),
    gallery: [
      shopifyCdn("s/files/1/0706/6855/0422/files/P9507_699-42279_01.jpg?v=1722734668"),
      shopifyCdn("s/files/1/0706/6855/0422/files/P9507_699-42279_02.jpg?v=1722734668"),
      shopifyCdn("s/files/1/0706/6855/0422/files/P9507_699-42279_03.jpg?v=1722734668"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Stellar Crown booster packs", "Each pack contains 10 cards and 1 Basic Energy", "Display box suitable for sealed collecting"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Stellar Crown", "كل بوستر يحتوي على 10 كروت وBasic Energy", "بوكس ديسبلاي مناسب للاحتفاظ مختوم"],
    },
  },
  {
    id: "box-temporal-forces-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Temporal Forces Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Temporal Forces Booster Display Box" },
    subtitle: { en: "36 booster packs · sealed display", ar: "36 بوستر · ديسبلاي مختوم" },
    description: {
      en: "A sealed Temporal Forces booster display box with 36 packs, featuring Ancient and Future Pokémon from the Scarlet & Violet era.",
      ar: "بوكس Temporal Forces Booster Display مختوم يحتوي على 36 بوستر، ويضم شخصيات Ancient وFuture من حقبة Scarlet & Violet.",
    },
    price: 649,
    image: shopifyCdn("s/files/1/0706/6855/0422/files/P9504_699-86981_01.jpg?v=1709669029"),
    gallery: [
      shopifyCdn("s/files/1/0706/6855/0422/files/P9504_699-86981_01.jpg?v=1709669029"),
      shopifyCdn("s/files/1/0706/6855/0422/files/P9504_699-86981_02.jpg?v=1709669029"),
      shopifyCdn("s/files/1/0706/6855/0422/files/P9504_699-86981_03.jpg?v=1709669029"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Temporal Forces booster packs", "Each pack contains 10 cards and 1 Basic Energy", "Ancient and Future Pokémon theme"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Temporal Forces", "كل بوستر يحتوي على 10 كروت وBasic Energy", "بطابع Ancient وFuture Pokémon"],
    },
  },
  {
    id: "box-obsidian-flames-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Obsidian Flames Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Obsidian Flames Booster Display Box" },
    subtitle: { en: "36 booster packs · sealed display", ar: "36 بوستر · ديسبلاي مختوم" },
    description: {
      en: "A sealed Obsidian Flames booster display box with 36 packs and a Charizard-led expansion theme for collectors and opening sessions.",
      ar: "بوكس Obsidian Flames Booster Display مختوم يحتوي على 36 بوستر، بطابع توسعة يقودها Charizard للجامعين وجلسات الفتح.",
    },
    price: 749,
    image: shopifyCdn("s/files/1/0644/5983/3515/files/55.jpg?v=1717420320"),
    gallery: [
      shopifyCdn("s/files/1/0644/5983/3515/files/55.jpg?v=1717420320"),
      shopifyCdn("s/files/1/0644/5983/3515/files/56.jpg?v=1717420320"),
      shopifyCdn("s/files/1/0644/5983/3515/files/57.jpg?v=1717420320"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Obsidian Flames booster packs", "Each pack contains 10 cards and 1 Basic Energy", "Charizard-focused expansion appeal"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Obsidian Flames", "كل بوستر يحتوي على 10 كروت وBasic Energy", "توسعة جذابة لمحبي Charizard"],
    },
  },
  {
    id: "box-journey-together-enhanced-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Journey Together Enhanced Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Journey Together Enhanced Booster Display Box" },
    subtitle: { en: "36 packs · N's Reshiram promo", ar: "36 بوستر · برومو N's Reshiram" },
    description: {
      en: "A sealed Journey Together enhanced booster display with 36 booster packs and a promo card featuring N's Reshiram.",
      ar: "بوكس Journey Together Enhanced Booster Display مختوم يحتوي على 36 بوستر وكرت برومو لشخصية N's Reshiram.",
    },
    price: 799,
    image: shopifyCdn("s/files/1/0922/6928/1571/files/P10344_10-10125-102_01.jpg?v=1757502714"),
    gallery: [
      shopifyCdn("s/files/1/0922/6928/1571/files/P10344_10-10125-102_01.jpg?v=1757502714"),
      shopifyCdn("s/files/1/0311/6433/4213/files/P10344_10-10125-102_01_jpg.png?v=1737330675"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Journey Together booster packs", "Includes 1 promo card featuring N's Reshiram", "Enhanced display format for sealed collectors"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Journey Together", "يشمل كرت برومو لشخصية N's Reshiram", "إصدار Enhanced Display مناسب للجامعين"],
    },
  },
  {
    id: "box-destined-rivals-booster-display",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Destined Rivals Booster Display Box", ar: "Pokémon TCG: Scarlet & Violet—Destined Rivals Booster Display Box" },
    subtitle: { en: "36 booster packs · sealed display", ar: "36 بوستر · ديسبلاي مختوم" },
    description: {
      en: "A sealed Destined Rivals booster display box with 36 packs, focused on Trainer Pokémon rivalries and high-energy Scarlet & Violet collecting.",
      ar: "بوكس Destined Rivals Booster Display مختوم يحتوي على 36 بوستر، بطابع Trainer Pokémon والمنافسات ضمن Scarlet & Violet.",
    },
    price: 799,
    image: shopifyCdn("s/files/1/0530/0243/6801/files/Pokemon_TCG_Scarlet_Violet_Destined_Rivals_Booster_Box_R.png?v=1757726696"),
    gallery: [
      shopifyCdn("s/files/1/0530/0243/6801/files/Pokemon_TCG_Scarlet_Violet_Destined_Rivals_Booster_Box_R.png?v=1757726696"),
      shopifyCdn("s/files/1/0530/0243/6801/files/Pokemon_TCG_Scarlet_Violet_Destined_Rivals_Booster_Box.png?v=1757726696"),
      shopifyCdn("s/files/1/0530/0243/6801/files/Pokemon_TCG_Scarlet_Violet_Destined_Rivals_Booster_Box_F.png?v=1757726696"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "36 Scarlet & Violet—Destined Rivals booster packs", "Each pack contains 10 cards and 1 Basic Energy", "Trainer Pokémon rivalry theme"],
      ar: ["مختوم من المصنع", "36 بوستر Scarlet & Violet—Destined Rivals", "كل بوستر يحتوي على 10 كروت وBasic Energy", "بطابع منافسات Trainer Pokémon"],
    },
  },
  {
    id: "box-shrouded-fable-etb",
    category: "boosters",
    name: { en: "Pokémon TCG: Scarlet & Violet—Shrouded Fable Elite Trainer Box", ar: "Pokémon TCG: Scarlet & Violet—Shrouded Fable Elite Trainer Box" },
    subtitle: { en: "9 packs · Pecharunt promo", ar: "9 بوسترات · برومو Pecharunt" },
    description: {
      en: "A sealed Shrouded Fable Elite Trainer Box with booster packs, a Pecharunt promo card and accessories themed around the expansion's featured Pokémon.",
      ar: "بوكس Shrouded Fable Elite Trainer Box مختوم يحتوي على بوسترات وكرت Pecharunt برومو وملحقات بطابع شخصيات التوسعة.",
    },
    price: 329,
    image: shopifyCdn("s/files/1/0865/2816/4189/files/Shrouded-Fable-Elite-Trainer-Box.webp?v=1719147641"),
    gallery: [
      shopifyCdn("s/files/1/0865/2816/4189/files/Shrouded-Fable-Elite-Trainer-Box.webp?v=1719147641"),
      shopifyCdn("s/files/1/0865/2816/4189/files/Scarlet-Violet-Pokemon-TCG-04.webp?v=1719147641"),
    ],
    inventory: 10,
    specs: {
      en: ["Factory sealed", "9 Scarlet & Violet—Shrouded Fable booster packs", "Full-art foil promo card featuring Pecharunt", "Sleeves, Energy cards, guide, dice and markers", "Collector storage box with dividers"],
      ar: ["مختوم من المصنع", "9 بوسترات Scarlet & Violet—Shrouded Fable", "كرت برومو Full-Art Foil لشخصية Pecharunt", "سليفات وكروت Energy ودليل ونرد ومؤشرات", "بوكس تخزين للجامعين مع فواصل"],
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
