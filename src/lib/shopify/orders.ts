import card1 from "@/assets/card-1.jpg";
import boosterBox from "@/assets/booster-box.jpg";
import eliteBox from "@/assets/elite-box.jpg";
import type { ServiceResult } from "@/lib/store-schema";
import type { ShopifyConnection, ShopifyId, ShopifyOrder } from "@/lib/shopify-types";
import { shopifyBackendNotConfigured } from "./client";

export type SpecialRequestIconId = "star" | "package" | "check" | "search";

export type SpecialRequestTypeOption = {
  labelKey: string;
  icon: SpecialRequestIconId;
};

export const specialRequestFeaturedArt = [card1, boosterBox, eliteBox];

export const specialRequestTypes: SpecialRequestTypeOption[] = [
  { labelKey: "rareCard", icon: "star" },
  { labelKey: "sealedBox", icon: "package" },
  { labelKey: "gradedSlab", icon: "check" },
  { labelKey: "customBundle", icon: "search" },
];

export const specialRequestConditions = ["any", "nearMint", "lightlyPlayed", "sealedOnly", "graded8", "graded10"];

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

export const submitShopifyDraftOrderRequest = async (input: unknown): Promise<ServiceResult<ShopifyOrder>> => {
  void input;
  return shopifyBackendNotConfigured<ShopifyOrder>("Shopify order submission is not connected yet.");
};
