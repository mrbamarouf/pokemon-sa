import type { LocalizedText, ServiceResult, StoreLanguage } from "@/lib/store-schema";
import type {
  ShopifyBuyerIdentity,
  ShopifyCart,
  ShopifyCartLineInput,
  ShopifyId,
} from "@/lib/shopify-types";
import type { Product } from "./products";
import { shopifyBackendNotConfigured, storefrontRequest } from "./client";
import { isShopifyConfigured } from "./config";

export type CommerceCartItem = {
  id: string;
  name: string;
  nameByLanguage?: LocalizedText;
  price: number;
  image: string;
  variant?: string;
  variantByLanguage?: { en?: string; ar?: string };
  shopifyVariantId?: ShopifyId;
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
  shopifyVariantId: product.shopifyVariantId,
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

const CART_FRAGMENT = `#graphql
fragment PokemonSaCart on Cart {
  id
  checkoutUrl
  totalQuantity
  attributes { key value }
  buyerIdentity {
    email
    phone
    countryCode
    customer { id email phone firstName lastName displayName }
  }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      attributes { key value }
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          sku
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
    }
  }
}`;

const CART_QUERY = `#graphql
${CART_FRAGMENT}
query PokemonSaCart($id: ID!) {
  cart(id: $id) {
    ...PokemonSaCart
  }
}`;

const CART_CREATE_MUTATION = `#graphql
${CART_FRAGMENT}
mutation PokemonSaCartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { ...PokemonSaCart }
    userErrors { field message }
  }
}`;

const CART_LINES_ADD_MUTATION = `#graphql
${CART_FRAGMENT}
mutation PokemonSaCartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...PokemonSaCart }
    userErrors { field message }
  }
}`;

const CART_LINES_UPDATE_MUTATION = `#graphql
${CART_FRAGMENT}
mutation PokemonSaCartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...PokemonSaCart }
    userErrors { field message }
  }
}`;

const CART_LINES_REMOVE_MUTATION = `#graphql
${CART_FRAGMENT}
mutation PokemonSaCartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ...PokemonSaCart }
    userErrors { field message }
  }
}`;

const CART_BUYER_IDENTITY_UPDATE_MUTATION = `#graphql
${CART_FRAGMENT}
mutation PokemonSaCartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart { ...PokemonSaCart }
    userErrors { field message }
  }
}`;

const mapCart = (cart: any): ShopifyCart | null => {
  if (!cart) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity ?? 0,
    attributes: cart.attributes ?? [],
    buyerIdentity: cart.buyerIdentity,
    estimatedCost: cart.cost
      ? {
          subtotalAmount: cart.cost.subtotalAmount,
          totalAmount: cart.cost.totalAmount,
          totalTaxAmount: cart.cost.totalTaxAmount,
        }
      : undefined,
    lines: (cart.lines?.nodes ?? []).map((line: any) => ({
      id: line.id,
      quantity: line.quantity,
      attributes: line.attributes ?? [],
      merchandise: line.merchandise,
      estimatedCost: line.cost
        ? {
            subtotalAmount: line.cost.subtotalAmount,
            totalAmount: line.cost.totalAmount,
          }
        : undefined,
    })),
  };
};

const cartMutationResult = <T extends Record<string, any>>(payload: T | null, key: keyof T): ServiceResult<ShopifyCart> => {
  const result = payload?.[key];
  const userErrors = result?.userErrors ?? [];
  if (userErrors.length) {
    return {
      data: null,
      error: {
        code: "validation_error",
        message: userErrors.map((error: { message: string }) => error.message).join("; "),
        details: userErrors,
      },
    };
  }

  return { data: mapCart(result?.cart), error: null };
};

export const createShopifyCartLinesFromItems = (items: CommerceCartItem[]): ShopifyCartLineInput[] =>
  items
    .filter((item) => item.shopifyVariantId)
    .map((item) => ({
      merchandiseId: item.shopifyVariantId as ShopifyId,
      quantity: item.qty,
      attributes: [
        { key: "pokemon_sa_item_id", value: item.id },
        ...(item.variant ? [{ key: "variant", value: item.variant }] : []),
      ],
    }));

export const getShopifyCart = async (cartId: ShopifyId): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cart: any }>({
    query: CART_QUERY,
    variables: { id: cartId },
  });

  return {
    data: mapCart(response.data?.cart),
    error: response.error,
  };
};

export const createShopifyCart = async (
  lines: ShopifyCartLineInput[] = [],
  buyerIdentity?: ShopifyBuyerIdentity,
): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cartCreate: { cart: any; userErrors: Array<{ field?: string[]; message: string }> } }>({
    query: CART_CREATE_MUTATION,
    variables: { input: { lines, buyerIdentity } },
  });

  if (response.error) return { data: null, error: response.error };
  return cartMutationResult(response.data, "cartCreate");
};

export const addShopifyCartLines = async (
  cartId: ShopifyId,
  lines: ShopifyCartLineInput[],
): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cartLinesAdd: { cart: any; userErrors: Array<{ field?: string[]; message: string }> } }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });

  if (response.error) return { data: null, error: response.error };
  return cartMutationResult(response.data, "cartLinesAdd");
};

export const updateShopifyCartLines = async (
  cartId: ShopifyId,
  lines: Array<ShopifyCartLineInput & { id: ShopifyId }>,
): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cartLinesUpdate: { cart: any; userErrors: Array<{ field?: string[]; message: string }> } }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  });

  if (response.error) return { data: null, error: response.error };
  return cartMutationResult(response.data, "cartLinesUpdate");
};

export const removeShopifyCartLines = async (
  cartId: ShopifyId,
  lineIds: ShopifyId[],
): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cartLinesRemove: { cart: any; userErrors: Array<{ field?: string[]; message: string }> } }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  });

  if (response.error) return { data: null, error: response.error };
  return cartMutationResult(response.data, "cartLinesRemove");
};

export const updateShopifyBuyerIdentity = async (
  cartId: ShopifyId,
  buyerIdentity: ShopifyBuyerIdentity,
): Promise<ServiceResult<ShopifyCart>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<ShopifyCart>();

  const response = await storefrontRequest<{ cartBuyerIdentityUpdate: { cart: any; userErrors: Array<{ field?: string[]; message: string }> } }>({
    query: CART_BUYER_IDENTITY_UPDATE_MUTATION,
    variables: { cartId, buyerIdentity },
  });

  if (response.error) return { data: null, error: response.error };
  return cartMutationResult(response.data, "cartBuyerIdentityUpdate");
};
