import type { CartItem, EntityId, ServiceResult } from "../store-schema";

const backendNotConfigured = <T>(message = "Cart backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const getCartItems = async (userId: EntityId): Promise<ServiceResult<CartItem[]>> => {
  void userId;
  return { data: [], error: null };
};

export const syncCartItems = async (userId: EntityId, items: CartItem[]): Promise<ServiceResult<CartItem[]>> => {
  void userId;
  void items;
  return backendNotConfigured<CartItem[]>();
};

export const upsertCartItem = async (item: CartItem): Promise<ServiceResult<CartItem>> => {
  void item;
  return backendNotConfigured<CartItem>();
};

export const removeCartItem = async (userId: EntityId, itemId: EntityId): Promise<ServiceResult<null>> => {
  void userId;
  void itemId;
  return backendNotConfigured<null>();
};

export const clearCart = async (userId: EntityId): Promise<ServiceResult<null>> => {
  void userId;
  return backendNotConfigured<null>();
};
