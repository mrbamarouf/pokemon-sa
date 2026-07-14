import type {
  Coupon,
  CustomApparelDesign,
  CustomCupDesign,
  EntityId,
  Order,
  OrderItem,
  Reward,
  ServiceResult,
  SpecialRequest,
} from "../store-schema";
import { fetchShopifyCustomerSession, type ShopifyCustomerOrder } from "../shopify/customer";

export type CreateOrderInput = Omit<Order, "id" | "orderNumber" | "status" | "createdAt" | "updatedAt">;

const backendNotConfigured = <T>(message = "Order write operations are handled by Shopify checkout."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

const statusFromFinancial = (status?: string): Order["paymentStatus"] => {
  if (status === "PAID") return "paid";
  if (status === "AUTHORIZED") return "authorized";
  if (status === "REFUNDED") return "refunded";
  return "unpaid";
};

const fulfillmentStatus = (status?: string): Order["fulfillmentStatus"] => {
  if (status === "FULFILLED") return "delivered";
  if (status === "IN_PROGRESS") return "shipped";
  if (status === "CANCELED") return "cancelled";
  return "unfulfilled";
};

const mapOrder = (userId: EntityId, order: ShopifyCustomerOrder): Order => {
  const createdAt = order.processedAt || new Date().toISOString();
  const items: OrderItem[] =
    order.lineItems?.nodes?.map((line) => ({
      id: line.id,
      orderId: order.id,
      kind: "product",
      name: { en: line.title || line.name || "Product", ar: line.title || line.name || "منتج" },
      unitPrice: Number(line.price?.amount || 0),
      currency: "SAR",
      quantity: line.quantity,
      lineTotal: Number(line.totalPrice?.amount || line.price?.amount || 0),
      imageUrl: line.image?.url,
      variant: line.variantTitle ? { en: line.variantTitle, ar: line.variantTitle } : undefined,
      createdAt,
    })) || [];

  return {
    id: order.id,
    orderNumber: order.name || String(order.number || ""),
    userId,
    status: statusFromFinancial(order.financialStatus) === "paid" ? "paid" : "pending_payment",
    paymentStatus: statusFromFinancial(order.financialStatus),
    fulfillmentStatus: fulfillmentStatus(order.fulfillmentStatus),
    currency: "SAR",
    subtotal: Number(order.subtotal?.amount || 0),
    shippingTotal: Number(order.totalShipping?.amount || 0),
    discountTotal: 0,
    total: Number(order.totalPrice?.amount || 0),
    items,
    createdAt,
    updatedAt: createdAt,
    placedAt: order.processedAt,
  };
};

export const listOrders = async (userId: EntityId): Promise<ServiceResult<Order[]>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  if (!account || account.id !== userId) return { data: [], error: null };
  return { data: account.orders.map((order) => mapOrder(account.id, order)), error: null };
};

export const getOrder = async (orderId: EntityId): Promise<ServiceResult<Order>> => {
  const session = await fetchShopifyCustomerSession();
  const account = session.data?.account;
  const order = account?.orders.find((item) => item.id === orderId);
  return { data: account && order ? mapOrder(account.id, order) : null, error: null };
};

export const createOrder = async (input: CreateOrderInput): Promise<ServiceResult<Order>> => {
  void input;
  return backendNotConfigured<Order>();
};

export const saveCustomCupDesign = async (design: CustomCupDesign): Promise<ServiceResult<CustomCupDesign>> => {
  void design;
  return backendNotConfigured<CustomCupDesign>("Custom cup persistence will be connected after Shopify metaobjects/files are configured.");
};

export const saveCustomApparelDesign = async (design: CustomApparelDesign): Promise<ServiceResult<CustomApparelDesign>> => {
  void design;
  return backendNotConfigured<CustomApparelDesign>("Custom apparel persistence will be connected after Shopify metaobjects/files are configured.");
};

export const submitSpecialRequest = async (request: SpecialRequest): Promise<ServiceResult<SpecialRequest>> => {
  void request;
  return backendNotConfigured<SpecialRequest>("Special requests are not connected to a backend workflow yet.");
};

export const validateCoupon = async (code: string): Promise<ServiceResult<Coupon>> => {
  void code;
  return { data: null, error: null };
};

export const redeemReward = async (userId: EntityId, reward: Reward): Promise<ServiceResult<Reward>> => {
  void userId;
  void reward;
  return backendNotConfigured<Reward>("Reward redemption still needs a Shopify discount integration.");
};
