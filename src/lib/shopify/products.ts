import type { LocalizedText, ServiceResult } from "@/lib/store-schema";
import type {
  ShopifyConnection,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductQuery,
  ShopifyProductVariant,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyConfig } from "./config";
import { shopifyBackendNotConfigured, storefrontRequest } from "./client";

export type ProductCategory = "cards" | "boosters" | "magnets" | "apparel" | "cups" | "custom-cups" | "custom-apparel";

export type Product = {
  id: string;
  category: ProductCategory;
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
  gallery: string[];
  badge?: LocalizedText;
  featured?: boolean;
  specs: Record<"en" | "ar", string[]>;
  colors?: { name: LocalizedText; hex: string }[];
  sizes?: string[];
  shopifyProductId: string;
  shopifyVariantId?: string;
  shopifyHandle: string;
  shopifyVariants: ShopifyProductVariant[];
  availableForSale: boolean;
};

export type ShopCategoryId = "all" | "featured" | ProductCategory;

export const products: Product[] = [];

export const getProductCatalog = () => products;

export const getProductFromCatalog = (id?: string, catalog: Product[] = getProductCatalog()) =>
  catalog.find((product) => product.id === id || product.shopifyProductId === id || product.shopifyHandle === id);

export const getProduct = (id?: string) => getProductFromCatalog(id);

export const productsByCategoryFromCatalog = (category: ProductCategory, catalog: Product[] = getProductCatalog()) =>
  catalog.filter((product) => product.category === category);

export const productsByCategory = (category: ProductCategory) => productsByCategoryFromCatalog(category);

export const getFeaturedProductsFromCatalog = (catalog: Product[] = getProductCatalog()) => {
  const cards = productsByCategoryFromCatalog("cards", catalog);
  const boosters = productsByCategoryFromCatalog("boosters", catalog);
  const magnets = productsByCategoryFromCatalog("magnets", catalog);
  const apparel = productsByCategoryFromCatalog("apparel", catalog);
  return [catalog.find((item) => item.featured), cards[0], boosters[0], magnets[0], apparel[0]].filter(Boolean) as Product[];
};

export const getFeaturedProducts = () => getFeaturedProductsFromCatalog();

export const getProductsForCategoryFromCatalog = (category: ShopCategoryId, catalog: Product[] = getProductCatalog()) => {
  if (category === "all") return catalog;
  if (category === "featured") return getFeaturedProductsFromCatalog(catalog);
  return productsByCategoryFromCatalog(category, catalog);
};

export const getProductsForCategory = (category: ShopCategoryId) => getProductsForCategoryFromCatalog(category);

export const getRelatedProductsFromCatalog = (product: Product, limit = 3, catalog: Product[] = getProductCatalog()) => {
  const related = catalog.filter((item) => item.id !== product.id && item.category === product.category).slice(0, limit);
  return related.length ? related : catalog.filter((item) => item.id !== product.id).slice(0, limit);
};

export const getRelatedProducts = (product: Product, limit = 3) => getRelatedProductsFromCatalog(product, limit);

export const getProductCollections = () => ({
  cards: productsByCategory("cards"),
  boosters: productsByCategory("boosters"),
  magnets: productsByCategory("magnets"),
  apparel: productsByCategory("apparel"),
});

export const toShopifyMoney = (price: number): ShopifyMoney => ({
  amount: String(price),
  currencyCode: shopifyConfig.currencyCode,
});

export const toShopifyImage = (url?: string, altText?: string): ShopifyImage | undefined =>
  url ? { url, altText } : undefined;

export const mapLocalProductToShopifyProduct = (product: Product): ShopifyProduct => ({
  id: product.shopifyProductId,
  handle: product.shopifyHandle,
  title: product.name.en,
  localizedTitle: product.name,
  description: product.description.en,
  localizedDescription: product.description,
  productType: product.category,
  vendor: "Pokémon SA",
  tags: [product.category, ...(product.featured ? ["featured"] : [])],
  availableForSale: product.availableForSale,
  featuredImage: toShopifyImage(product.image, product.name.en),
  images: product.gallery.map((image) => ({ url: image, altText: product.name.en })),
  variants: product.shopifyVariants.length
    ? product.shopifyVariants
    : [
        {
          id: product.shopifyVariantId ?? `${product.id}-default`,
          title: "Default",
          availableForSale: product.availableForSale,
          selectedOptions: [],
          price: toShopifyMoney(product.price),
          image: toShopifyImage(product.image, product.name.en),
        },
      ],
  priceRange: {
    minVariantPrice: toShopifyMoney(product.price),
    maxVariantPrice: toShopifyMoney(product.price),
  },
});

type StorefrontMetafield = {
  namespace: string;
  key: string;
  value: string;
  type?: string;
} | null;

type StorefrontProductNode = Omit<ShopifyProduct, "images" | "variants" | "metafields"> & {
  images?: ShopifyConnection<ShopifyImage>;
  variants?: ShopifyConnection<ShopifyProductVariant>;
  metafields?: StorefrontMetafield[];
};

type StorefrontProductsResponse = {
  products: ShopifyConnection<StorefrontProductNode>;
};

const PRODUCT_CATEGORY_BY_HANDLE: Record<string, ProductCategory> = {
  cards: "cards",
  card: "cards",
  boosters: "boosters",
  booster: "boosters",
  "sealed-products": "boosters",
  sealed: "boosters",
  magnets: "magnets",
  magnet: "magnets",
  apparel: "apparel",
  "ready-apparel": "apparel",
  cups: "cups",
  cup: "cups",
  "custom-cups": "custom-cups",
  "custom-apparel": "custom-apparel",
};

const normalizeCategory = (value?: string | null): ProductCategory | undefined => {
  if (!value) return undefined;
  const key = value.toLowerCase().trim().replace(/\s+/g, "-");
  return PRODUCT_CATEGORY_BY_HANDLE[key];
};

const tagValue = (tags: string[], prefix: string) => {
  const normalizedPrefix = prefix.toLowerCase();
  const tag = tags.find((item) => item.toLowerCase().startsWith(normalizedPrefix));
  return tag?.slice(prefix.length).trim();
};

const findMetafield = (metafields: StorefrontMetafield[] | undefined, key: string) =>
  metafields?.find((field): field is NonNullable<StorefrontMetafield> => Boolean(field && field.key === key));

const parseMetafieldJson = <T>(metafields: StorefrontMetafield[] | undefined, key: string): T | undefined => {
  const field = findMetafield(metafields, key);
  if (!field?.value) return undefined;
  try {
    return JSON.parse(field.value) as T;
  } catch {
    return undefined;
  }
};

const parseMetafieldText = (metafields: StorefrontMetafield[] | undefined, key: string) => findMetafield(metafields, key)?.value;

const normalizeProductImage = (image?: ShopifyImage) => image?.url;

const fallbackLocalized = (value: string): LocalizedText => ({ en: value, ar: value });

export const mapStorefrontProductToLocalProduct = (product: StorefrontProductNode): Product => {
  const tags = product.tags ?? [];
  const localId = tagValue(tags, "pokemon-sa:id:") ?? tagValue(tags, "pokemon-sa:") ?? product.handle;
  const metafields = product.metafields ?? [];
  const images = product.images?.nodes?.map((image) => image.url).filter(Boolean) ?? [];
  const variants = product.variants?.nodes ?? [];
  const firstVariant = variants[0];
  const isFeatured = tags.some((tag) => tag.toLowerCase() === "featured" || tag.toLowerCase() === "pokemon-sa:featured");
  const category =
    normalizeCategory(parseMetafieldText(metafields, "category")) ??
    normalizeCategory(product.productType) ??
    normalizeCategory(tagValue(tags, "category:")) ??
    "cards";
  const price = Number(firstVariant?.price.amount ?? product.priceRange.minVariantPrice.amount);
  const featuredImage = normalizeProductImage(product.featuredImage) ?? images[0] ?? "";

  return {
    id: localId,
    shopifyProductId: product.id,
    shopifyVariantId: firstVariant?.id,
    shopifyHandle: product.handle,
    shopifyVariants: variants,
    category,
    name: parseMetafieldJson(metafields, "localized_title") ?? fallbackLocalized(product.title),
    subtitle:
      parseMetafieldJson(metafields, "localized_subtitle") ??
      fallbackLocalized(product.productType ?? "Pokémon SA product"),
    description:
      parseMetafieldJson(metafields, "localized_description") ??
      fallbackLocalized(product.description ?? ""),
    price,
    image: featuredImage,
    gallery: images.length ? images : [featuredImage].filter(Boolean),
    badge: parseMetafieldJson(metafields, "localized_badge"),
    featured: isFeatured,
    specs: parseMetafieldJson(metafields, "localized_specs") ?? { en: [], ar: [] },
    colors: parseMetafieldJson(metafields, "colors"),
    sizes: parseMetafieldJson(metafields, "sizes"),
    availableForSale: product.availableForSale,
  };
};

const buildStorefrontSearchQuery = (query: ShopifyProductQuery) => {
  const parts = [query.query, query.productType ? `product_type:${query.productType}` : "", query.tag ? `tag:${query.tag}` : ""]
    .filter(Boolean)
    .map((part) => String(part).trim());
  return parts.length ? parts.join(" AND ") : undefined;
};

export const STOREFRONT_PRODUCTS_QUERY = `#graphql
query PokemonSaProducts($first: Int!, $after: String, $query: String) {
  products(first: $first, after: $after, query: $query) {
    nodes {
      id
      handle
      title
      description
      productType
      vendor
      tags
      availableForSale
      featuredImage { url altText width height }
      images(first: 12) { nodes { url altText width height } pageInfo { hasNextPage endCursor } }
      options { id name values }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
        pageInfo { hasNextPage endCursor }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      metafields(identifiers: [
        { namespace: "pokemon_sa", key: "category" },
        { namespace: "pokemon_sa", key: "localized_title" },
        { namespace: "pokemon_sa", key: "localized_subtitle" },
        { namespace: "pokemon_sa", key: "localized_description" },
        { namespace: "pokemon_sa", key: "localized_specs" },
        { namespace: "pokemon_sa", key: "localized_badge" },
        { namespace: "pokemon_sa", key: "colors" },
        { namespace: "pokemon_sa", key: "sizes" }
      ]) {
        namespace
        key
        value
        type
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const filterProducts = (catalog: Product[], query: ShopifyProductQuery) => {
  if (query.collectionHandle === "featured" || query.tag === "featured") return catalog.filter((product) => product.featured);
  if (query.collectionHandle) {
    const category = normalizeCategory(query.collectionHandle);
    if (category) return catalog.filter((product) => product.category === category);
  }
  if (query.productType) {
    const category = normalizeCategory(query.productType);
    if (category) return catalog.filter((product) => product.category === category);
  }
  return catalog;
};

export const fetchStorefrontProducts = async (
  query: ShopifyProductQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyProduct>>> => {
  const products = await loadCommerceProducts(query);
  return {
    data: products.data
      ? {
          nodes: products.data.map(mapLocalProductToShopifyProduct),
          pageInfo: { hasNextPage: false },
        }
      : null,
    error: products.error,
  };
};

export const loadCommerceProducts = async (query: ShopifyProductQuery = {}): Promise<ServiceResult<Product[]>> => {
  if (!isShopifyConfigured()) return shopifyBackendNotConfigured<Product[]>();

  const response = await storefrontRequest<StorefrontProductsResponse>({
    query: STOREFRONT_PRODUCTS_QUERY,
    variables: {
      first: query.first ?? 100,
      after: query.after,
      query: buildStorefrontSearchQuery(query),
    },
  });

  if (!response.data) return { data: null, error: response.error };

  return {
    data: filterProducts(response.data.products.nodes.map(mapStorefrontProductToLocalProduct), query),
    error: null,
  };
};

export const listProducts = async (query: ShopifyProductQuery = {}): Promise<ServiceResult<Product[]>> => {
  return loadCommerceProducts(query);
};

export const listShopifyProducts = async (
  query: ShopifyProductQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyProduct>>> => {
  return fetchStorefrontProducts(query);
};

export const searchShopifyProducts = async (query: string, first = 20): Promise<ServiceResult<Product[]>> =>
  loadCommerceProducts({ query, first });

export const getShopifyProduct = async (handleOrId: string): Promise<ServiceResult<ShopifyProduct>> => {
  const catalog = await loadCommerceProducts({ first: 100 });
  const product = catalog.data?.find((item) => item.id === handleOrId || item.shopifyHandle === handleOrId || item.shopifyProductId === handleOrId);
  return {
    data: product ? mapLocalProductToShopifyProduct(product) : null,
    error: catalog.error,
  };
};

export const getProductVariantIdForOptions = (
  product: Product,
  options: Record<string, string | undefined>,
) => {
  const optionEntries = Object.entries(options).filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (!optionEntries.length) return product.shopifyVariantId;

  const variant = product.shopifyVariants.find((item) =>
    optionEntries.every(([name, value]) =>
      item.selectedOptions.some((option) => option.name.toLowerCase() === name.toLowerCase() && option.value === value),
    ),
  );

  return variant?.id ?? product.shopifyVariantId;
};

export const PRODUCT_CARD_FRAGMENT = `# Shopify Storefront Product fragment placeholder.
fragment PokemonSaProductCard on Product {
  id
  handle
  title
  description
  productType
  vendor
  tags
  availableForSale
  featuredImage { url altText width height }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
}`;

export const storefrontProductRequest = storefrontRequest;
