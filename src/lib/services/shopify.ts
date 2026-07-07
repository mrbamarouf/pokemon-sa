import type { EntityId, ServiceResult } from "../store-schema";
import type {
  ShopifyBuyerIdentity,
  ShopifyCart,
  ShopifyCartLineInput,
  ShopifyCheckout,
  ShopifyCollection,
  ShopifyCollectionQuery,
  ShopifyConnection,
  ShopifyCustomer,
  ShopifyCustomerAccessToken,
  ShopifyId,
  ShopifyOrder,
  ShopifyProduct,
  ShopifyProductQuery,
} from "../shopify-types";

export type ShopifyCustomerSignInInput = {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
};

const backendNotConfigured = <T>(message = "Shopify backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const listShopifyProducts = async (
  query: ShopifyProductQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyProduct>>> => {
  void query;
  return { data: { nodes: [], pageInfo: { hasNextPage: false } }, error: null };
};

export const getShopifyProduct = async (handleOrId: string): Promise<ServiceResult<ShopifyProduct>> => {
  void handleOrId;
  return { data: null, error: null };
};

export const listShopifyCollections = async (
  query: ShopifyCollectionQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyCollection>>> => {
  void query;
  return { data: { nodes: [], pageInfo: { hasNextPage: false } }, error: null };
};

export const getShopifyCollection = async (handleOrId: string): Promise<ServiceResult<ShopifyCollection>> => {
  void handleOrId;
  return { data: null, error: null };
};

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
  return backendNotConfigured<ShopifyCart>();
};

export const addShopifyCartLines = async (
  cartId: ShopifyId,
  lines: ShopifyCartLineInput[],
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lines;
  return backendNotConfigured<ShopifyCart>();
};

export const updateShopifyCartLines = async (
  cartId: ShopifyId,
  lines: Array<ShopifyCartLineInput & { id: ShopifyId }>,
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lines;
  return backendNotConfigured<ShopifyCart>();
};

export const removeShopifyCartLines = async (
  cartId: ShopifyId,
  lineIds: ShopifyId[],
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void lineIds;
  return backendNotConfigured<ShopifyCart>();
};

export const updateShopifyBuyerIdentity = async (
  cartId: ShopifyId,
  buyerIdentity: ShopifyBuyerIdentity,
): Promise<ServiceResult<ShopifyCart>> => {
  void cartId;
  void buyerIdentity;
  return backendNotConfigured<ShopifyCart>();
};

export const createShopifyCheckout = async (cartId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  void cartId;
  return backendNotConfigured<ShopifyCheckout>();
};

export const getShopifyCheckout = async (checkoutId: ShopifyId): Promise<ServiceResult<ShopifyCheckout>> => {
  void checkoutId;
  return { data: null, error: null };
};

export const signInShopifyCustomer = async (
  input: ShopifyCustomerSignInInput,
): Promise<ServiceResult<ShopifyCustomerAccessToken>> => {
  void input;
  return backendNotConfigured<ShopifyCustomerAccessToken>();
};

export const getShopifyCustomer = async (
  accessToken: string,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void accessToken;
  return { data: null, error: null };
};

export const mapPokemonSaProfileToShopifyCustomer = async (
  userId: EntityId,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void userId;
  return backendNotConfigured<ShopifyCustomer>();
};

export const listShopifyCustomerOrders = async (
  accessToken: string,
): Promise<ServiceResult<ShopifyConnection<ShopifyOrder>>> => {
  void accessToken;
  return { data: { nodes: [], pageInfo: { hasNextPage: false } }, error: null };
};

export const getShopifyOrder = async (
  accessToken: string,
  orderId: ShopifyId,
): Promise<ServiceResult<ShopifyOrder>> => {
  void accessToken;
  void orderId;
  return { data: null, error: null };
};
