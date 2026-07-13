import type { LocalizedText, ServiceResult, StoreLanguage } from "@/lib/store-schema";
import type {
  ShopifyBuyerIdentity,
  ShopifyCart,
  ShopifyCartLineInput,
  ShopifyId,
} from "@/lib/shopify-types";
import type { Product } from "./products";
import { shopifyBackendNotConfigured } from "./client";

export type CommerceCartItem = {
  id: string;
  name: string;
  nameByLanguage?: LocalizedText;
  price: number;
  image: string;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
  qty: number;
};

export const createCartItemKey = (item: { id: string; variant?: string }) => `${item.id}__${item.variant ?? ""}`;

export const calculateCartItemCount = (items: CommerceCartItem[]) => items.reduce((total, item) => total + item.qty, 0);

export const calculateCartSubtotal = (items: CommerceCartItem[]) =>
  items.reduce((total, item) => total + item.qty * item.price, 0);

export const createProductCartItem = ({
  product,
  language,
  variant,
  variantByLanguage,
  image,
}: {
  product: Product;
  language: StoreLanguage;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
  image?: string;
}): Omit<CommerceCartItem, "qty"> => ({
  id: product.id,
  name: product.name[language],
  nameByLanguage: product.name,
  price: product.price,
  image: image ?? product.image,
  variant,
  variantByLanguage,
});

export const createCustomCartItem = ({
  id,
  name,
  language,
  price,
  image,
  variant,
  variantByLanguage,
}: {
  id: string;
  name: LocalizedText;
  language: StoreLanguage;
  price: number;
  image: string;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
}): Omit<CommerceCartItem, "qty"> => ({
  id,
  name: name[language],
  nameByLanguage: name,
  price,
  image,
  variant,
  variantByLanguage,
});

export const createSpecialRequestCartItem = ({
  id,
  language,
  name,
  image,
  variant,
  variantByLanguage,
}: {
  id: string;
  language: StoreLanguage;
  name: LocalizedText;
  image: string;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
}): Omit<CommerceCartItem, "qty"> => ({
  id,
  name: name[language],
  nameByLanguage: name,
  price: 0,
  image,
  variant,
  variantByLanguage,
});

export const getShopifyCart = async (cartId: ShopifyId): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  return { data: null, error: null };
};

export const createShopifyCart = async (
  lines: ShopifyCartLineInput[] = [],
  buyerIdentity?: ShopifyBuyerIdentity,
): Promise<ServiceResult<ShopifyCart>> => {
  void lines;
  void buyerIdentity;
  return shopifyBackendNotConfigured<ShopifyCart>();
};

export const addShopifyCartLines = async (
  cartId: ShopifyId,
  lines: ShopifyCartLineInput[],
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lines;
  return shopifyBackendNotConfigured<ShopifyCart>();
};

export const updateShopifyCartLines = async (
  cartId: ShopifyId,
  lines: Array<ShopifyCartLineInput & { id: ShopifyId }>,
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lines;
  return shopifyBackendNotConfigured<ShopifyCart>();
};

export const removeShopifyCartLines = async (
  cartId: ShopifyId,
  lineIds: ShopifyId[],
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lineIds;
  return shopifyBackendNotConfigured<ShopifyCart>();
};

export const updateShopifyBuyerIdentity = async (
  cartId: ShopifyId,
  buyerIdentity: ShopifyBuyerIdentity,
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void buyerIdentity;
  return shopifyBackendNotConfigured<ShopifyCart>();
};
