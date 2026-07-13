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
import type { LocalizedText, ServiceResult } from "@/lib/store-schema";

export type CustomColorId = "black" | "white" | "blue" | "red" | "yellow";
export type GarmentId = "tee" | "hoodie";
export type CupMode = "character" | "text" | "both";

export type PokemonArtwork = {
  name: string;
  image: string;
};

export type CustomColor = {
  id: CustomColorId;
  name: LocalizedText;
  hex: string;
};

export type GarmentStyle = {
  id: GarmentId;
  name: LocalizedText;
  price: number;
  mockups: Record<CustomColorId | "clean", string>;
};

export type CupStyle = {
  id: string;
  name: LocalizedText;
  price: number;
  finish: LocalizedText;
};

export type CupColor = {
  name: LocalizedText;
  hex: string;
  shadow: string;
};

export type SizeGuideRow = {
  size: string;
  chest: string;
  length: string;
  shoulder: string;
};

export const pokemonArt: PokemonArtwork[] = [
  { name: "Pikachu", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
  { name: "Charizard", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" },
  { name: "Mewtwo", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png" },
  { name: "Rayquaza", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/384.png" },
  { name: "Eevee", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png" },
  { name: "Gengar", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png" },
  { name: "Lucario", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/448.png" },
  { name: "Dragonite", image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png" },
];

export const cupArtwork: PokemonArtwork[] = [pokemonArt[0], pokemonArt[1], pokemonArt[7], pokemonArt[4]];

export const garmentStyles: GarmentStyle[] = [
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

export const garmentColors: CustomColor[] = [
  { id: "black", name: { en: "Black", ar: "أسود" }, hex: "#0a0a0a" },
  { id: "white", name: { en: "White", ar: "أبيض" }, hex: "#f8fafc" },
  { id: "blue", name: { en: "Electric Blue", ar: "أزرق كهربائي" }, hex: "#2563eb" },
  { id: "red", name: { en: "Trainer Red", ar: "أحمر المدرب" }, hex: "#dc2626" },
  { id: "yellow", name: { en: "Volt Yellow", ar: "أصفر كهربائي" }, hex: "#facc15" },
];

export const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const apparelSizeGuide: SizeGuideRow[] = [
  { size: "XS", chest: "48 cm", length: "66 cm", shoulder: "43 cm" },
  { size: "S", chest: "51 cm", length: "69 cm", shoulder: "45 cm" },
  { size: "M", chest: "54 cm", length: "72 cm", shoulder: "47 cm" },
  { size: "L", chest: "57 cm", length: "75 cm", shoulder: "49 cm" },
  { size: "XL", chest: "61 cm", length: "78 cm", shoulder: "52 cm" },
  { size: "XXL", chest: "65 cm", length: "81 cm", shoulder: "55 cm" },
];

export const cupStyles: CupStyle[] = [
  { id: "ceramic", name: { en: "Ceramic Mug", ar: "كوب سيراميك" }, price: 189, finish: { en: "Glossy print", ar: "طباعة لامعة" } },
  { id: "travel", name: { en: "Travel Cup", ar: "كوب سفر" }, price: 249, finish: { en: "Thermal sleeve", ar: "غلاف حراري" } },
  { id: "cold", name: { en: "Cold Tumbler", ar: "كوب بارد" }, price: 219, finish: { en: "Clear lid", ar: "غطاء شفاف" } },
];

export const cupColors: CupColor[] = [
  { name: { en: "White", ar: "أبيض" }, hex: "#f8fafc", shadow: "#dbeafe" },
  { name: { en: "Yellow", ar: "أصفر" }, hex: "#facc15", shadow: "#854d0e" },
  { name: { en: "Electric Blue", ar: "أزرق كهربائي" }, hex: "#38bdf8", shadow: "#075985" },
  { name: { en: "Cherry Red", ar: "أحمر" }, hex: "#ef4444", shadow: "#7f1d1d" },
  { name: { en: "Midnight", ar: "ليلي" }, hex: "#111827", shadow: "#020617" },
];

export const cupModeLabels: Record<CupMode, LocalizedText> = {
  character: { en: "Image", ar: "صورة" },
  text: { en: "Text", ar: "نص" },
  both: { en: "Both", ar: "الاثنين" },
};

export const getCustomizationCatalog = async (): Promise<
  ServiceResult<{
    pokemonArt: PokemonArtwork[];
    cupArtwork: PokemonArtwork[];
    garmentStyles: GarmentStyle[];
    garmentColors: CustomColor[];
    apparelSizes: string[];
    apparelSizeGuide: SizeGuideRow[];
    cupStyles: CupStyle[];
    cupColors: CupColor[];
  }>
> => ({
  data: { pokemonArt, cupArtwork, garmentStyles, garmentColors, apparelSizes, apparelSizeGuide, cupStyles, cupColors },
  error: null,
});
