import type { CurrencyCode, EntityId, ISODateTime, JsonValue, LocalizedText } from "./store-schema";

export type ShopifyId = string;

export type ShopifyMoney = {
  amount: string;
  currencyCode: CurrencyCode;
};

export type ShopifyImage = {
  id?: ShopifyId;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type ShopifyMetafield = {
  id: ShopifyId;
  namespace: string;
  key: string;
  value: string;
  type?: string;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: ShopifyId;
  title: string;
  sku?: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  image?: ShopifyImage;
  quantityAvailable?: number;
  metadata?: Record<string, JsonValue>;
};

export type ShopifyProductOption = {
  id?: ShopifyId;
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: ShopifyId;
  handle: string;
  title: string;
  localizedTitle?: LocalizedText;
  description?: string;
  localizedDescription?: LocalizedText;
  productType?: string;
  vendor?: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage?: ShopifyImage;
  images: ShopifyImage[];
  options?: ShopifyProductOption[];
  metafields?: ShopifyMetafield[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
};

export type ShopifyCollection = {
  id: ShopifyId;
  handle: string;
  title: string;
  localizedTitle?: LocalizedText;
  description?: string;
  localizedDescription?: LocalizedText;
  image?: ShopifyImage;
  products?: ShopifyProduct[];
  updatedAt?: ISODateTime;
};

export type ShopifyCartAttribute = {
  key: string;
  value: string;
};

export type ShopifyCartLineInput = {
  merchandiseId: ShopifyId;
  quantity: number;
  attributes?: ShopifyCartAttribute[];
};

export type ShopifyCartLine = {
  id: ShopifyId;
  quantity: number;
  merchandise: ShopifyProductVariant;
  attributes: ShopifyCartAttribute[];
  estimatedCost?: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
};

export type ShopifyCart = {
  id: ShopifyId;
  checkoutUrl?: string;
  totalQuantity: number;
  lines: ShopifyCartLine[];
  attributes: ShopifyCartAttribute[];
  buyerIdentity?: ShopifyBuyerIdentity;
  estimatedCost?: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount?: ShopifyMoney;
  };
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
};

export type ShopifyBuyerIdentity = {
  email?: string;
  phone?: string;
  customerAccessToken?: string;
  countryCode?: "SA";
};

export type ShopifyMailingAddress = {
  id: ShopifyId;
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  countryCodeV2?: "SA";
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  province?: string;
  zip?: string;
};

export type ShopifyMailingAddressInput = Omit<ShopifyMailingAddress, "id" | "countryCodeV2" | "name"> & {
  countryCode?: "SA";
};

export type ShopifyCheckout = {
  id: ShopifyId;
  cartId?: ShopifyId;
  webUrl: string;
  completedAt?: ISODateTime;
  ready: boolean;
  requiresShipping: boolean;
  totalPrice?: ShopifyMoney;
  subtotalPrice?: ShopifyMoney;
  taxPrice?: ShopifyMoney;
};

export type ShopifyCustomer = {
  id: ShopifyId;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  acceptsMarketing?: boolean;
  defaultAddressId?: ShopifyId;
  defaultAddress?: ShopifyMailingAddress;
  addresses?: ShopifyMailingAddress[];
  pokemonSaProfileId?: EntityId;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
};

export type ShopifyCustomerAccessToken = {
  accessToken: string;
  expiresAt: ISODateTime;
};

export type ShopifyOrderLineItem = {
  id: ShopifyId;
  title: string;
  quantity: number;
  variant?: ShopifyProductVariant;
  originalTotalPrice: ShopifyMoney;
  discountedTotalPrice?: ShopifyMoney;
};

export type ShopifyOrder = {
  id: ShopifyId;
  orderNumber: number;
  name: string;
  statusUrl?: string;
  processedAt?: ISODateTime;
  fulfillmentStatus?: string;
  financialStatus?: string;
  totalPrice: ShopifyMoney;
  subtotalPrice?: ShopifyMoney;
  totalShippingPrice?: ShopifyMoney;
  totalTax?: ShopifyMoney;
  lineItems: ShopifyOrderLineItem[];
};

export type ShopifyProductQuery = {
  query?: string;
  collectionHandle?: string;
  productType?: string;
  tag?: string;
  first?: number;
  after?: string;
};

export type ShopifyCollectionQuery = {
  query?: string;
  first?: number;
  after?: string;
};

export type ShopifyPageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

export type ShopifyConnection<T> = {
  nodes: T[];
  pageInfo: ShopifyPageInfo;
};
