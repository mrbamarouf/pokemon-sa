import type { ServiceResult, UserProfile } from "../store-schema";
import {
  fetchShopifyCustomerSession,
  startShopifyCustomerAccountLogin,
  startShopifyCustomerAccountLogout,
  type ShopifyCustomerAccount,
} from "../shopify/customer";

export type AuthSession = {
  user: UserProfile;
  provider: "shopify_customer_accounts";
};

export type SignInRequest = {
  email?: string;
  phone?: string;
  redirectTo?: string;
};

const mapAccountToProfile = (account: ShopifyCustomerAccount): UserProfile => {
  const now = new Date().toISOString();
  return {
    id: account.id,
    fullName: account.name,
    phone: account.phone || "",
    email: account.email,
    preferredLanguage: "ar",
    defaultAddressId: account.defaultAddress?.id,
    createdAt: now,
    updatedAt: now,
  };
};

export const getCurrentSession = async (): Promise<ServiceResult<AuthSession>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  return {
    data: account ? { user: mapAccountToProfile(account), provider: "shopify_customer_accounts" } : null,
    error: null,
  };
};

export const getCurrentUser = async (): Promise<ServiceResult<UserProfile>> => {
  const session = await getCurrentSession();
  return { data: session.data?.user ?? null, error: session.error };
};

export const signInWithOtp = async (request: SignInRequest): Promise<ServiceResult<AuthSession>> => {
  void request;
  startShopifyCustomerAccountLogin({ returnTo: request.redirectTo });
  return { data: null, error: null };
};

export const signOut = async (): Promise<ServiceResult<null>> => {
  startShopifyCustomerAccountLogout();
  return { data: null, error: null };
};
