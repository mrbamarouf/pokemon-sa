import type { CurrencyCode } from "@/lib/store-schema";

export type ShopifyRuntimeConfig = {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  countryCode: "SA";
  currencyCode: CurrencyCode;
};

export const shopifyConfig: ShopifyRuntimeConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? "",
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN ?? "",
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION ?? "2026-07",
  countryCode: "SA",
  currencyCode: "SAR",
};

export const isShopifyConfigured = (config: ShopifyRuntimeConfig = shopifyConfig) =>
  Boolean(config.storeDomain && config.storefrontAccessToken);

export const getShopifyStorefrontEndpoint = (config: ShopifyRuntimeConfig = shopifyConfig) => {
  const domain = config.storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${domain}/api/${config.apiVersion}/graphql.json`;
};

export const shopifyCredentialKeys = {
  storeDomain: "VITE_SHOPIFY_STORE_DOMAIN",
  storefrontAccessToken: "VITE_SHOPIFY_STOREFRONT_API_TOKEN",
  apiVersion: "VITE_SHOPIFY_API_VERSION",
} as const;
