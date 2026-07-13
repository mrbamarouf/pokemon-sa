import type { ServiceResult } from "@/lib/store-schema";
import type { ShopifyCheckout, ShopifyId } from "@/lib/shopify-types";
import { shopifyBackendNotConfigured } from "./client";

export const createShopifyCheckout = async (cartId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  void cartId;
  return shopifyBackendNotConfigured<ShopifyCheckout>();
};

export const getShopifyCheckout = async (checkoutId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  void checkoutId;
  return { data: null, error: null };
};

export const startCheckoutForCart = async (cartId?: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  if (!cartId) return shopifyBackendNotConfigured<ShopifyCheckout>("A Shopify cart is required before checkout can start.");
  return createShopifyCheckout(cartId);
};
