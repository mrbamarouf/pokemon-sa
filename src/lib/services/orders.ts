import type {
  Coupon,
  CustomApparelDesign,
  CustomCupDesign,
  EntityId,
  Order,
  Reward,
  ServiceResult,
  SpecialRequest,
} from "../store-schema";

export type CreateOrderInput = Omit<Order, "id" | "orderNumber" | "status" | "createdAt" | "updatedAt">;

const backendNotConfigured = <T>(message = "Orders backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const listOrders = async (userId: EntityId): Promise<ServiceResult<Order[]>> => {
  void userId;
  return { data: [], error: null };
};

export const getOrder = async (orderId: EntityId): Promise<ServiceResult<Order>> => {
  void orderId;
  return { data: null, error: null };
};

export const createOrder = async (input: CreateOrderInput): Promise<ServiceResult<Order>> => {
  void input;
  return backendNotConfigured<Order>();
};

export const saveCustomCupDesign = async (design: CustomCupDesign): Promise<ServiceResult<CustomCupDesign>> => {
  void design;
  return backendNotConfigured<CustomCupDesign>();
};

export const saveCustomApparelDesign = async (design: CustomApparelDesign): Promise<ServiceResult<CustomApparelDesign>> => {
  void design;
  return backendNotConfigured<CustomApparelDesign>();
};

export const submitSpecialRequest = async (request: SpecialRequest): Promise<ServiceResult<SpecialRequest>> => {
  void request;
  return backendNotConfigured<SpecialRequest>();
};

export const validateCoupon = async (code: string): Promise<ServiceResult<Coupon>> => {
  void code;
  return { data: null, error: null };
};

export const redeemReward = async (userId: EntityId, reward: Reward): Promise<ServiceResult<Reward>> => {
  void userId;
  void reward;
  return backendNotConfigured<Reward>();
};
