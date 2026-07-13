import type { LocalizedText, ServiceResult } from "@/lib/store-schema";
import type { ShopifyCollection, ShopifyCollectionQuery, ShopifyConnection } from "@/lib/shopify-types";
import { storefrontRequest } from "./client";
import { isShopifyConfigured } from "./config";
import { type ProductCategory } from "./products";

export type CommerceCollectionId = "featured" | ProductCategory | "cups" | "custom-apparel" | "custom-cups" | "rewards";

export type CommerceCollection = {
  id: CommerceCollectionId;
  handle: string;
  title: LocalizedText;
  productCount: number;
};

export const commerceCollections: CommerceCollection[] = [
  { id: "featured", handle: "featured", title: { en: "Featured", ar: "المميز" }, productCount: 0 },
  { id: "cards", handle: "cards", title: { en: "Cards", ar: "الكروت" }, productCount: 0 },
  { id: "boosters", handle: "boosters", title: { en: "Boosters", ar: "البوكسات" }, productCount: 0 },
  { id: "magnets", handle: "magnets", title: { en: "Magnets", ar: "المغناطيس" }, productCount: 0 },
  { id: "apparel", handle: "apparel", title: { en: "Ready apparel", ar: "الملابس الجاهزة" }, productCount: 0 },
  { id: "cups", handle: "cups", title: { en: "Cups", ar: "الكاسات" }, productCount: 3 },
  { id: "custom-apparel", handle: "custom-apparel", title: { en: "Apparel design", ar: "تصميم الملابس" }, productCount: 2 },
  { id: "custom-cups", handle: "custom-cups", title: { en: "Cup design", ar: "تصميم الكوب" }, productCount: 3 },
  { id: "rewards", handle: "rewards", title: { en: "Rewards", ar: "المكافآت" }, productCount: 4 },
];

export const getCommerceCollections = () => commerceCollections;

export const getCommerceCollection = (idOrHandle: string) =>
  commerceCollections.find((collection) => collection.id === idOrHandle || collection.handle === idOrHandle);

type StorefrontCollectionsResponse = {
  collections: ShopifyConnection<ShopifyCollection>;
};

type StorefrontCollectionResponse = {
  collection: ShopifyCollection | null;
};

const STOREFRONT_COLLECTIONS_QUERY = `#graphql
query PokemonSaCollections($first: Int!, $after: String, $query: String) {
  collections(first: $first, after: $after, query: $query) {
    nodes {
      id
      handle
      title
      description
      updatedAt
      image { url altText width height }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const STOREFRONT_COLLECTION_BY_HANDLE_QUERY = `#graphql
query PokemonSaCollection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    updatedAt
    image { url altText width height }
  }
}`;

export const listShopifyCollections = async (
  query: ShopifyCollectionQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyCollection>>> => {
  if (!isShopifyConfigured()) {
    return {
      data: null,
      error: { code: "backend_not_configured", message: "Shopify Storefront API is not configured." },
    };
  }

  const response = await storefrontRequest<StorefrontCollectionsResponse>({
    query: STOREFRONT_COLLECTIONS_QUERY,
    variables: {
      first: query.first ?? 50,
      after: query.after,
      query: query.query,
    },
  });

  return {
    data: response.data?.collections ?? null,
    error: response.error,
  };
};

export const getShopifyCollection = async (handleOrId: string): Promise<ServiceResult<ShopifyCollection>> => {
  if (!isShopifyConfigured()) {
    return {
      data: null,
      error: { code: "backend_not_configured", message: "Shopify Storefront API is not configured." },
    };
  }

  const response = await storefrontRequest<StorefrontCollectionResponse>({
    query: STOREFRONT_COLLECTION_BY_HANDLE_QUERY,
    variables: { handle: handleOrId },
  });

  return {
    data: response.data?.collection ?? null,
    error: response.error,
  };
};
