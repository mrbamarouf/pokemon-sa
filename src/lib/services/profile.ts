import type { CustomerAddress, EntityId, ServiceResult, UserProfile } from "../store-schema";

const backendNotConfigured = <T>(message = "Profile backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const getProfile = async (userId: EntityId): Promise<ServiceResult<UserProfile>> => {
  void userId;
  return { data: null, error: null };
};

export const upsertProfile = async (profile: UserProfile): Promise<ServiceResult<UserProfile>> => {
  void profile;
  return backendNotConfigured<UserProfile>();
};

export const listAddresses = async (userId: EntityId): Promise<ServiceResult<CustomerAddress[]>> => {
  void userId;
  return { data: [], error: null };
};

export const upsertAddress = async (address: CustomerAddress): Promise<ServiceResult<CustomerAddress>> => {
  void address;
  return backendNotConfigured<CustomerAddress>();
};

export const deleteAddress = async (addressId: EntityId): Promise<ServiceResult<null>> => {
  void addressId;
  return backendNotConfigured<null>();
};
