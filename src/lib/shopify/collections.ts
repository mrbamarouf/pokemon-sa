import type { LocalizedText, ServiceResult } from "@/lib/store-schema";
import type { ShopifyCollection, ShopifyCollectionQuery, ShopifyConnection } from "@/lib/shopify-types";
import {
  getFeaturedProducts,
  getProductCatalog,
  productsByCategory,
  type ProductCategory,
  mapLocalProductToShopifyProduct,
} from "./products";

export type CommerceCollectionId = "featured" | ProductCategory | "cups" | "custom-apparel" | "custom-cups" | "rewards";

export type CommerceCollection = {
  id: CommerceCollectionId;
  handle: string;
  title: LocalizedText;
  productCount: number;
};

export const commerceCollections: CommerceCollection[] = [
  { id: "featured", handle: "featured", title: { en: "Featured", ar: "المميز" }, productCount: getFeaturedProducts().length },
  { id: "cards", handle: "cards", title: { en: "Cards", ar: "الكروت" }, productCount: productsByCategory("cards").length },
  { id: "boosters", handle: "boosters", title: { en: "Boosters", ar: "البوكسات" }, productCount: productsByCategory("boosters").length },
  { id: "magnets", handle: "magnets", title: { en: "Magnets", ar: "المغناطيس" }, productCount: productsByCategory("magnets").length },
  { id: "apparel", handle: "ready-apparel", title: { en: "Ready apparel", ar: "الملابس الجاهزة" }, productCount: productsByCategory("apparel").length },
  { id: "cups", handle: "cups", title: { en: "Cups", ar: "الكاسات" }, productCount: 3 },
  { id: "custom-apparel", handle: "custom-apparel", title: { en: "Apparel design", ar: "تصميم الملابس" }, productCount: 2 },
  { id: "custom-cups", handle: "custom-cups", title: { en: "Cup design", ar: "تصميم الكوب" }, productCount: 3 },
  { id: "rewards", handle: "rewards", title: { en: "Rewards", ar: "المكافآت" }, productCount: 4 },
];

export const getCommerceCollections = () => commerceCollections;

export const getCommerceCollection = (idOrHandle: string) =>
  commerceCollections.find((collection) => collection.id === idOrHandle || collection.handle === idOrHandle);

export const listShopifyCollections = async (
  query: ShopifyCollectionQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyCollection>>> => {
  void query;
  return {
    data: {
      nodes: commerceCollections.map((collection) => ({
        id: collection.id,
        handle: collection.handle,
        title: collection.title.en,
        localizedTitle: collection.title,
        products: getProductCatalog()
          .filter((product) => collection.id === "featured" ? Boolean(product.featured) : product.category === collection.id)
          .map(mapLocalProductToShopifyProduct),
      })),
      pageInfo: { hasNextPage: false },
    },
    error: null,
  };
};

export const getShopifyCollection = async (handleOrId: string): Promise<ServiceResult<ShopifyCollection>> => {
  const collection = getCommerceCollection(handleOrId);
  return {
    data: collection
      ? {
          id: collection.id,
          handle: collection.handle,
          title: collection.title.en,
          localizedTitle: collection.title,
        }
      : null,
    error: null,
  };
};
