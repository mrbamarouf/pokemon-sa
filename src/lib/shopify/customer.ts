import type { EntityId, ServiceResult } from "@/lib/store-schema";
import type {
  ShopifyCustomer,
  ShopifyCustomerAccessToken,
  ShopifyMailingAddressInput,
} from "@/lib/shopify-types";
import { shopifyBackendNotConfigured } from "./client";

export type LocalCustomerAccount = {
  name: string;
  phone: string;
  email?: string;
};

export type CustomerRewardLock = {
  playedAt: number;
  reward?: string;
};

export type ShopifyCustomerSignInInput = {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
};

export const ACCOUNT_STORAGE_KEY = "pokemon-sa-account";
export const GAME_LOCKS_STORAGE_KEY = "pokemon-sa-game-locks";
export const REWARD_LOCK_WINDOW_MS = 24 * 60 * 60 * 1000;

export const cleanCustomerPhone = (phone: string) => phone.replace(/[^\d+]/g, "");

export const formatRewardLockRemaining = (ms: number) => {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const readLocalCustomerAccount = (): LocalCustomerAccount | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalCustomerAccount) : null;
  } catch {
    return null;
  }
};

export const writeLocalCustomerAccount = (account: LocalCustomerAccount) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
};

export const clearLocalCustomerAccount = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
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
  void input;
  return shopifyBackendNotConfigured<ShopifyCustomerAccessToken>();
};

export const getShopifyCustomer = async (accessToken: string): Promise<ServiceResult<ShopifyCustomer>> => {
  void accessToken;
  return { data: null, error: null };
};

export const createShopifyCustomerAddress = async (
  customerAccessToken: string,
  address: ShopifyMailingAddressInput,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void customerAccessToken;
  void address;
  return shopifyBackendNotConfigured<ShopifyCustomer>();
};

export const mapPokemonSaProfileToShopifyCustomer = async (
  userId: EntityId,
): Promise<ServiceResult<ShopifyCustomer>> => {
  void userId;
  return shopifyBackendNotConfigured<ShopifyCustomer>();
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
