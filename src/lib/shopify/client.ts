import type { JsonValue, ServiceResult } from "@/lib/store-schema";
import { getShopifyStorefrontEndpoint, isShopifyConfigured, shopifyConfig, type ShopifyRuntimeConfig } from "./config";

export type ShopifyStorefrontGraphQLError = {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, JsonValue>;
};

export type ShopifyStorefrontResponse<TData> = {
  data?: TData;
  errors?: ShopifyStorefrontGraphQLError[];
};

export type ShopifyStorefrontRequestOptions<TVariables extends Record<string, unknown> = Record<string, unknown>> = {
  query: string;
  variables?: TVariables;
  config?: ShopifyRuntimeConfig;
};

export const shopifyBackendNotConfigured = <T>(
  message = "Shopify Storefront API is not connected yet.",
): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const storefrontRequest = async <
  TData,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>({
  query,
  variables,
  config = shopifyConfig,
}: ShopifyStorefrontRequestOptions<TVariables>): Promise<ServiceResult<TData>> => {
  if (!isShopifyConfigured(config)) return shopifyBackendNotConfigured<TData>();

  try {
    const response = await fetch(getShopifyStorefrontEndpoint(config), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      return {
        data: null,
        error: {
          code: "unknown",
          message: `Shopify Storefront request failed with status ${response.status}.`,
        },
      };
    }

    const payload = (await response.json()) as ShopifyStorefrontResponse<TData>;
    if (payload.errors?.length) {
      return {
        data: null,
        error: {
          code: "unknown",
          message: payload.errors.map((error) => error.message).join("; "),
          details: payload.errors as JsonValue,
        },
      };
    }

    return { data: payload.data ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        code: "unknown",
        message: error instanceof Error ? error.message : "Unknown Shopify Storefront request failure.",
      },
    };
  }
};
