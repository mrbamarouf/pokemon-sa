import type { CustomerAddress, EntityId, ServiceResult, UserProfile } from "../store-schema";
import { fetchShopifyCustomerSession, type ShopifyCustomerAccount, type ShopifyCustomerAddress } from "../shopify/customer";

const backendNotConfigured = <T>(message = "Profile write operations require Shopify Customer Account mutations."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

const now = () => new Date().toISOString();

const mapAccountToProfile = (account: ShopifyCustomerAccount): UserProfile => ({
  id: account.id,
  fullName: account.name,
  phone: account.phone || "",
  email: account.email,
  preferredLanguage: "ar",
  defaultAddressId: account.defaultAddress?.id,
  createdAt: now(),
  updatedAt: now(),
});

const mapAddress = (userId: EntityId, address: ShopifyCustomerAddress, isDefault: boolean): CustomerAddress => ({
  id: address.id,
  userId,
  recipientName: address.name || [address.firstName, address.lastName].filter(Boolean).join(" "),
  phone: address.phone || address.phoneNumber || "",
  country: "SA",
  city: address.city || "",
  district: address.province,
  street: [address.address1, address.address2].filter(Boolean).join(", "),
  postalCode: address.zip,
  isDefault,
  createdAt: now(),
  updatedAt: now(),
});

export const getProfile = async (userId: EntityId): Promise<ServiceResult<UserProfile>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  if (!account || account.id !== userId) return { data: null, error: null };
  return { data: mapAccountToProfile(account), error: null };
};

export const upsertProfile = async (profile: UserProfile): Promise<ServiceResult<UserProfile>> => {
  void profile;
  return backendNotConfigured<UserProfile>();
};

export const listAddresses = async (userId: EntityId): Promise<ServiceResult<CustomerAddress[]>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  if (!account || account.id !== userId) return { data: [], error: null };
  return {
    data: account.addresses.map((address) => mapAddress(account.id, address, address.id === account.defaultAddress?.id)),
    error: null,
  };
};

export const upsertAddress = async (address: CustomerAddress): Promise<ServiceResult<CustomerAddress>> => {
  void address;
  return backendNotConfigured<CustomerAddress>();
};

export const deleteAddress = async (addressId: EntityId): Promise<ServiceResult<null>> => {
  void addressId;
  return backendNotConfigured<null>();
};
