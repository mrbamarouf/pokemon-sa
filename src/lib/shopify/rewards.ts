import type { LocalizedText, ServiceResult } from "@/lib/store-schema";

export type RewardIconId = "zap" | "gift" | "trophy";

export type MobileReward = {
  code: string;
  title: LocalizedText;
  mission: LocalizedText;
  prompt: LocalizedText;
  icon: RewardIconId;
  character: {
    name: string;
    image: string;
  };
};

export type RewardWheelItem = {
  title: string;
  code: string;
  tone: string;
};

export type RewardQuizQuestion = {
  id: string;
  question: LocalizedText;
  options: string[];
  answer: string;
};

export type RewardMemoryCard = {
  pair: string;
  image: string;
};

export type RewardTypeBattle = {
  opponent: string;
  image: string;
  prompt: LocalizedText;
  options: Array<{
    id: string;
    label: string;
    image: string;
    win: boolean;
  }>;
};

export const rewardArt = {
  pikachu: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
  charizard: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
  blastoise: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
  venusaur: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png",
  dragonite: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png",
  mewtwo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png",
  gengar: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png",
  eevee: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png",
};

export const mobileRewards: MobileReward[] = [
  {
    code: "QUIZ10",
    title: { en: "10% Off", ar: "خصم 10%" },
    mission: { en: "Volt Quiz", ar: "تحدي الإجابة" },
    prompt: { en: "Answer before the meter runs out", ar: "أجب قبل انتهاء عداد الطاقة" },
    icon: "zap",
    character: { name: "Pikachu", image: rewardArt.pikachu },
  },
  {
    code: "GIFT-SA",
    title: { en: "Free Gift", ar: "هدية مجانية" },
    mission: { en: "Lucky Draw", ar: "سحب الحظ" },
    prompt: { en: "Catch the falling prize", ar: "التقط الجائزة وهي تسقط" },
    icon: "gift",
    character: { name: "Eevee", image: rewardArt.eevee },
  },
  {
    code: "CASH25",
    title: { en: "SAR 25 Cashback", ar: "استرداد 25 ر.س" },
    mission: { en: "Speed Battle", ar: "تحدي السرعة" },
    prompt: { en: "Win the trainer round", ar: "اكسب جولة المدرب" },
    icon: "trophy",
    character: { name: "Charizard", image: rewardArt.charizard },
  },
];

export const rewardWheelItems: Record<"en" | "ar", RewardWheelItem[]> = {
  en: [
    { title: "10% Off", code: "QUIZ10", tone: "from-pk-yellow to-amber-400" },
    { title: "Free Gift", code: "GIFT-SA", tone: "from-pk-blue to-cyan-300" },
    { title: "SAR 25 Cashback", code: "CASH25", tone: "from-pk-red to-rose-400" },
    { title: "Jeddah Shipping", code: "JEDDAHSHIP", tone: "from-emerald-400 to-lime-300" },
  ],
  ar: [
    { title: "خصم 10%", code: "QUIZ10", tone: "from-pk-yellow to-amber-400" },
    { title: "هدية مجانية", code: "GIFT-SA", tone: "from-pk-blue to-cyan-300" },
    { title: "استرداد 25 ر.س", code: "CASH25", tone: "from-pk-red to-rose-400" },
    { title: "شحن جدة", code: "JEDDAHSHIP", tone: "from-emerald-400 to-lime-300" },
  ],
};

export const rewardQuizBank: RewardQuizQuestion[] = [
  {
    id: "water-counter",
    question: { en: "Which type has the advantage against Water?", ar: "أي نوع أقوى ضد النوع المائي؟" },
    options: ["Grass", "Fire", "Rock", "Ice"],
    answer: "Grass",
  },
  {
    id: "charmander-evolution",
    question: { en: "Which Pokémon evolves from Charmander?", ar: "ما هو التطور التالي لـ Charmander؟" },
    options: ["Charmeleon", "Dragonite", "Flareon", "Moltres"],
    answer: "Charmeleon",
  },
  {
    id: "genetic-pokemon",
    question: { en: "Which Pokémon is known as the Genetic Pokémon?", ar: "من هو Pokémon المعروف باسم Genetic Pokémon؟" },
    options: ["Mewtwo", "Lucario", "Gengar", "Rayquaza"],
    answer: "Mewtwo",
  },
  {
    id: "catch-item",
    question: { en: "Which item is used to catch wild Pokémon?", ar: "ما الأداة المستخدمة لالتقاط Pokémon؟" },
    options: ["Poké Ball", "Potion", "Rare Candy", "Energy Card"],
    answer: "Poké Ball",
  },
];

export const rewardMemoryPool: RewardMemoryCard[] = [
  { pair: "pikachu", image: rewardArt.pikachu },
  { pair: "charizard", image: rewardArt.charizard },
  { pair: "dragonite", image: rewardArt.dragonite },
  { pair: "gengar", image: rewardArt.gengar },
];

export const rewardTypeBattles: RewardTypeBattle[] = [
  {
    opponent: "Blastoise",
    image: rewardArt.blastoise,
    prompt: { en: "Opponent is a Water type. Choose the best counter.", ar: "الخصم من النوع المائي. اختر أفضل مواجهة." },
    options: [
      { id: "charizard", label: "Charizard", image: rewardArt.charizard, win: false },
      { id: "venusaur", label: "Venusaur", image: rewardArt.venusaur, win: true },
      { id: "mewtwo", label: "Mewtwo", image: rewardArt.mewtwo, win: false },
    ],
  },
  {
    opponent: "Charizard",
    image: rewardArt.charizard,
    prompt: { en: "Opponent is Fire and Flying. Pick the safer battle answer.", ar: "الخصم ناري وطائر. اختر المواجهة الأقوى." },
    options: [
      { id: "blastoise", label: "Blastoise", image: rewardArt.blastoise, win: true },
      { id: "venusaur", label: "Venusaur", image: rewardArt.venusaur, win: false },
      { id: "dragonite", label: "Dragonite", image: rewardArt.dragonite, win: false },
    ],
  },
  {
    opponent: "Mewtwo",
    image: rewardArt.mewtwo,
    prompt: { en: "Opponent is Psychic. Which choice pressures it best?", ar: "الخصم من النوع النفسي. أي اختيار يضغط عليه أكثر؟" },
    options: [
      { id: "gengar", label: "Gengar", image: rewardArt.gengar, win: true },
      { id: "pikachu", label: "Pikachu", image: rewardArt.pikachu, win: false },
      { id: "venusaur", label: "Venusaur", image: rewardArt.venusaur, win: false },
    ],
  },
];

export const getRewards = async (): Promise<ServiceResult<typeof mobileRewards>> => ({
  data: mobileRewards,
  error: null,
});
