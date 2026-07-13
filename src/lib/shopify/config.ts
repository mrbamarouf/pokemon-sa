import type { CurrencyCode } from "@/lib/store-schema";

export type ShopifyRuntimeConfig = {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  customerAccountUrl?: string;
  customerAccountLogoutUrl?: string;
  countryCode: "SA";
  currencyCode: CurrencyCode;
};

export const shopifyConfig: ShopifyRuntimeConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? "",
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN ?? "",
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION ?? "2026-07",
  customerAccountUrl: import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_URL,
  customerAccountLogoutUrl: import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL,
  countryCode: "SA",
  currencyCode: "SAR",
};

export const isShopifyConfigured = (config: ShopifyRuntimeConfig = shopifyConfig) =>
  Boolean(config.storeDomain && config.storefrontAccessToken);

export const getShopifyStorefrontEndpoint = (config: ShopifyRuntimeConfig = shopifyConfig) => {
  const domain = config.storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${domain}/api/${config.apiVersion}/graphql.json`;
};

export const getShopifyAccountUrl = (config: ShopifyRuntimeConfig = shopifyConfig) => {
  if (config.customerAccountUrl) return config.customerAccountUrl;
  const domain = config.storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return domain ? `https://${domain}/account` : "";
};

export const getShopifyAccountLogoutUrl = (config: ShopifyRuntimeConfig = shopifyConfig) => {
  if (config.customerAccountLogoutUrl) return config.customerAccountLogoutUrl;
  const accountUrl = getShopifyAccountUrl(config);
  return accountUrl ? `${accountUrl.replace(/\/$/, "")}/logout` : "";
};

export const shopifyCredentialKeys = {
  storeDomain: "VITE_SHOPIFY_STORE_DOMAIN",
  storefrontAccessToken: "VITE_SHOPIFY_STOREFRONT_API_TOKEN",
  apiVersion: "VITE_SHOPIFY_API_VERSION",
  customerAccountUrl: "VITE_SHOPIFY_CUSTOMER_ACCOUNT_URL",
  customerAccountLogoutUrl: "VITE_SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL",
} as const;
