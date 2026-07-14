import type { EntityId, ServiceResult } from "@/lib/store-schema";
import type {
  ShopifyCustomer,
  ShopifyCustomerAccessToken,
  ShopifyMailingAddress,
  ShopifyMailingAddressInput,
  ShopifyMoney,
} from "@/lib/shopify-types";
import { shopifyBackendNotConfigured } from "./client";

export type CustomerRewardLock = {
  playedAt: number;
  reward?: string;
};

export type ShopifyCustomerAddress = ShopifyMailingAddress & {
  formatted?: string[];
  formattedArea?: string;
  phoneNumber?: string;
  territoryCode?: string;
  zoneCode?: string;
};

export type ShopifyCustomerOrderLine = {
  id: string;
  name?: string;
  title?: string;
  quantity: number;
  variantTitle?: string;
  vendor?: string;
  image?: {
    url: string;
    altText?: string;
  };
  price?: ShopifyMoney;
  totalPrice?: ShopifyMoney;
};

export type ShopifyCustomerOrder = {
  id: string;
  name?: string;
  number?: number;
  processedAt?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  statusPageUrl?: string;
  totalPrice?: ShopifyMoney;
  subtotal?: ShopifyMoney;
  totalShipping?: ShopifyMoney;
  totalTax?: ShopifyMoney;
  shippingAddress?: ShopifyCustomerAddress;
  lineItems?: {
    nodes?: ShopifyCustomerOrderLine[];
  };
};

export type ShopifyCustomerAccount = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  defaultAddress?: ShopifyCustomerAddress | null;
  addresses: ShopifyCustomerAddress[];
  orders: ShopifyCustomerOrder[];
};

export type CustomerSessionPayload = {
  authenticated: boolean;
  account: ShopifyCustomerAccount | null;
  configured?: boolean;
  error?: string;
};

export type ShopifyCustomerSignInInput = {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
};

export type CartBuyerIdentityPayload = {
  attached: boolean;
  configured?: boolean;
  cartId?: string;
  checkoutUrl?: string;
  error?: string | null;
};

export const LEGACY_ACCOUNT_STORAGE_KEY = "pokemon-sa-account";
export const GAME_LOCKS_STORAGE_KEY = "pokemon-sa-game-locks";
export const REWARD_LOCK_WINDOW_MS = 24 * 60 * 60 * 1000;

export const cleanCustomerIdentifier = (value: string) => value.replace(/[^A-Za-z0-9:+@._-]/g, "");

export const formatRewardLockRemaining = (ms: number) => {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const clearLegacyLocalCustomerAccount = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LEGACY_ACCOUNT_STORAGE_KEY);
};

const safeReturnTo = () => {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
};

export const fetchShopifyCustomerSession = async (): Promise<ServiceResult<CustomerSessionPayload>> => {
  try {
    const response = await fetch("/api/shopify/customer/session", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return { data: { authenticated: false, account: null, configured: false, error: "session_unavailable" }, error: null };
    }
    return { data: (await response.json()) as CustomerSessionPayload, error: null };
  } catch {
    return { data: { authenticated: false, account: null, configured: false, error: "session_unavailable" }, error: null };
  }
};

export const startShopifyCustomerAccountLogin = (options?: { returnTo?: string; language?: string }) => {
  if (typeof window === "undefined") return;
  const url = new URL("/api/shopify/customer/login", window.location.origin);
  url.searchParams.set("return_to", options?.returnTo || safeReturnTo());
  if (options?.language) url.searchParams.set("locale", options.language);
  window.location.assign(url.toString());
};

export const startShopifyCustomerAccountRegister = startShopifyCustomerAccountLogin;

export const startShopifyCustomerAccountLogout = () => {
  if (typeof window === "undefined") return;
  clearLegacyLocalCustomerAccount();
  window.location.assign("/api/shopify/customer/logout");
};

export const attachAuthenticatedCustomerToCart = async (cartId: string): Promise<ServiceResult<CartBuyerIdentityPayload>> => {
  try {
    const response = await fetch("/api/shopify/customer/cart-buyer-identity", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId }),
    });
    if (!response.ok) {
      return { data: { attached: false, error: "buyer_identity_unavailable" }, error: null };
    }
    return { data: (await response.json()) as CartBuyerIdentityPayload, error: null };
  } catch {
    return { data: { attached: false, error: "buyer_identity_unavailable" }, error: null };
  }
};

export const readRewardLocks = (): Record<string, CustomerRewardLock> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GAME_LOCKS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CustomerRewardLock>) : {};
  } catch {
    return {};
  }
};

export const writeRewardLocks = (locks: Record<string, CustomerRewardLock>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GAME_LOCKS_STORAGE_KEY, JSON.stringify(locks));
};

export const signInShopifyCustomer = async (
  input: ShopifyCustomerSignInInput,
): Promise<ServiceResult<ShopifyCustomerAccessToken>> => {
  startShopifyCustomerAccountLogin({ returnTo: safeReturnTo() });
  void input;
  return shopifyBackendNotConfigured<ShopifyCustomerAccessToken>("Shopify Customer Accounts authentication redirects to Shopify.");
};

export const getShopifyCustomer = async (): Promise<ServiceResult<ShopifyCustomer>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  if (!account) return { data: null, error: null };
  return {
    data: {
      id: account.id,
      email: account.email,
      phone: account.phone,
      firstName: account.firstName,
      lastName: account.lastName,
      displayName: account.name,
      defaultAddress: account.defaultAddress || undefined,
      addresses: account.addresses,
    },
    error: null,
  };
};

export const createShopifyCustomerAddress = async (
  customerAccessToken: string,
  address: ShopifyMailingAddressInput,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void customerAccessToken;
  void address;
  return shopifyBackendNotConfigured<ShopifyCustomer>("Address management requires Shopify Customer Account mutations.");
};

export const mapPokemonSaProfileToShopifyCustomer = async (
  userId: EntityId,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void userId;
  return getShopifyCustomer();
};

export const getCustomerWishlist = async (customerAccessToken?: string): Promise<ServiceResult<string[]>> => {
  void customerAccessToken;
  return { data: [], error: null };
};

export const updateCustomerWishlist = async (
  customerAccessToken: string | undefined,
  productIds: string[],
): Promise<ServiceResult<string[]>> => {
  void customerAccessToken;
  void productIds;
  return shopifyBackendNotConfigured<string[]>("Wishlist backend is not connected yet.");
};
