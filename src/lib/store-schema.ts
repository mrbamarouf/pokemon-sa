export type StoreLanguage = "en" | "ar";
export type LocalizedText = Record<StoreLanguage, string>;
export type EntityId = string;
export type ISODateTime = string;
export type CurrencyCode = "SAR";
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type ServiceErrorCode =
  | "backend_not_configured"
  | "not_authenticated"
  | "not_found"
  | "validation_error"
  | "upload_failed"
  | "unknown";

export type ServiceError = {
  code: ServiceErrorCode;
  message: string;
  details?: JsonValue;
};

export type ServiceResult<T> = {
  data: T | null;
  error: ServiceError | null;
};

export type UserProfile = {
  id: EntityId;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  preferredLanguage: StoreLanguage;
  defaultAddressId?: EntityId;
  marketingOptIn?: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type CustomerAddress = {
  id: EntityId;
  userId: EntityId;
  label?: string;
  recipientName: string;
  phone: string;
  country: "SA";
  city: string;
  district?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
  notes?: string;
  isDefault: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type StoreItemKind =
  | "product"
  | "custom_cup"
  | "custom_apparel"
  | "special_request"
  | "reward"
  | "coupon_adjustment";

export type ProductCategory = "cards" | "boosters" | "magnets" | "apparel" | "cups";

export type CartItem = {
  id: EntityId;
  userId?: EntityId;
  productId?: EntityId;
  kind: StoreItemKind;
  category?: ProductCategory;
  name: LocalizedText;
  unitPrice: number;
  currency: CurrencyCode;
  quantity: number;
  imageUrl?: string;
  variant?: LocalizedText;
  customCupDesignId?: EntityId;
  customApparelDesignId?: EntityId;
  specialRequestId?: EntityId;
  rewardId?: EntityId;
  couponId?: EntityId;
  metadata?: Record<string, JsonValue>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type OrderStatus = "draft" | "pending_payment" | "paid" | "processing" | "completed" | "cancelled" | "refunded";
export type PaymentStatus = "unpaid" | "authorized" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "unfulfilled" | "preparing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: EntityId;
  orderId: EntityId;
  productId?: EntityId;
  kind: StoreItemKind;
  name: LocalizedText;
  unitPrice: number;
  currency: CurrencyCode;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
  variant?: LocalizedText;
  customCupDesignId?: EntityId;
  customApparelDesignId?: EntityId;
  specialRequestId?: EntityId;
  rewardId?: EntityId;
  couponId?: EntityId;
  metadata?: Record<string, JsonValue>;
  createdAt: ISODateTime;
};

export type Order = {
  id: EntityId;
  orderNumber: string;
  userId?: EntityId;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: CurrencyCode;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  items: OrderItem[];
  customerProfile?: Pick<UserProfile, "id" | "fullName" | "phone" | "email">;
  shippingAddress?: CustomerAddress;
  couponId?: EntityId;
  rewardId?: EntityId;
  notes?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  placedAt?: ISODateTime;
};

export type CupPrintMode = "character" | "text" | "both";

export type CustomCupDesign = {
  id: EntityId;
  userId?: EntityId;
  cupStyleId: string;
  cupStyleName: LocalizedText;
  colorName: LocalizedText;
  colorHex: string;
  printMode: CupPrintMode;
  characterName?: string;
  characterImageUrl?: string;
  uploadedImagePath?: string;
  uploadedFileName?: string;
  printedText?: string;
  previewImagePath?: string;
  unitPrice: number;
  currency: CurrencyCode;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type ApparelGarmentType = "tee" | "hoodie";

export type CustomApparelDesign = {
  id: EntityId;
  userId?: EntityId;
  garmentType: ApparelGarmentType;
  garmentName: LocalizedText;
  size: string;
  colorId: string;
  colorName: LocalizedText;
  colorHex: string;
  characterName?: string;
  characterImageUrl?: string;
  uploadedImagePath?: string;
  uploadedFileName?: string;
  printedText?: string;
  previewImagePath?: string;
  unitPrice: number;
  currency: CurrencyCode;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type RewardType = "percentage_discount" | "fixed_discount" | "free_gift" | "free_shipping" | "cashback";

export type Reward = {
  id: EntityId;
  code: string;
  title: LocalizedText;
  description?: LocalizedText;
  type: RewardType;
  value?: number;
  currency?: CurrencyCode;
  isActive: boolean;
  startsAt?: ISODateTime;
  expiresAt?: ISODateTime;
  usageLimit?: number;
  perUserLimit?: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type Coupon = {
  id: EntityId;
  code: string;
  title: LocalizedText;
  description?: LocalizedText;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  currency?: CurrencyCode;
  minimumSubtotal?: number;
  isActive: boolean;
  startsAt?: ISODateTime;
  expiresAt?: ISODateTime;
  usageLimit?: number;
  perUserLimit?: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type SpecialRequestType = "rare_card" | "sealed_box" | "graded_slab" | "custom_bundle";
export type SpecialRequestStatus = "draft" | "submitted" | "reviewing" | "quoted" | "accepted" | "declined" | "fulfilled";

export type SpecialRequest = {
  id: EntityId;
  userId?: EntityId;
  type: SpecialRequestType;
  status: SpecialRequestStatus;
  itemName: string;
  budgetText?: string;
  budgetAmount?: number;
  condition?: string;
  contact: string;
  referenceImagePath?: string;
  referenceFileName?: string;
  notes?: string;
  quotePrice?: number;
  currency: CurrencyCode;
  cartItemId?: EntityId;
  orderId?: EntityId;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
