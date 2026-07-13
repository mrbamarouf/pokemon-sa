import type { ServiceResult } from "@/lib/store-schema";
import type { ShopifyCheckout, ShopifyId } from "@/lib/shopify-types";
import { shopifyBackendNotConfigured } from "./client";
import { getShopifyCart } from "./cart";

export const createShopifyCheckout = async (cartId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  const cart = await getShopifyCart(cartId);
  if (!cart.data) return { data: null, error: cart.error ?? shopifyBackendNotConfigured<ShopifyCheckout>().error };

  return {
    data: {
      id: cart.data.checkoutUrl ?? cart.data.id,
      cartId: cart.data.id,
      webUrl: cart.data.checkoutUrl ?? "",
      ready: Boolean(cart.data.checkoutUrl),
      requiresShipping: true,
      totalPrice: cart.data.estimatedCost?.totalAmount,
      subtotalPrice: cart.data.estimatedCost?.subtotalAmount,
      taxPrice: cart.data.estimatedCost?.totalTaxAmount,
    },
    error: null,
  };
};

export const getShopifyCheckout = async (checkoutId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  void checkoutId;
  return { data: null, error: null };
};

export const startCheckoutForCart = async (cartId?: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  if (!cartId) return shopifyBackendNotConfigured<ShopifyCheckout>("A Shopify cart is required before checkout can start.");
  return createShopifyCheckout(cartId);
};
