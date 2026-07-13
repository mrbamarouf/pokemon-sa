import {
  getProduct as getLocalProduct,
  products as localProducts,
  type Product as LocalProduct,
} from "@/data/products";
import type { ServiceResult } from "@/lib/store-schema";
import type {
  ShopifyConnection,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductQuery,
  ShopifyProductVariant,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyConfig } from "./config";
import { storefrontRequest } from "./client";

export type Product = LocalProduct & {
  shopifyProductId?: string;
  shopifyVariantId?: string;
  shopifyHandle?: string;
  availableForSale?: boolean;
};
export type ProductCategory = Product["category"];
export type ShopCategoryId = "all" | "featured" | ProductCategory;

export const products = localProducts;

export const getProductCatalog = () => products as Product[];

export const getProductFromCatalog = (id?: string, catalog: Product[] = getProductCatalog()) =>
  catalog.find((product) => product.id === id || product.shopifyProductId === id || product.shopifyHandle === id);

export const getProduct = (id?: string) => getProductFromCatalog(id) ?? getLocalProduct(id);

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
  id: product.shopifyProductId ?? product.id,
  handle: product.shopifyHandle ?? product.id,
  title: product.name.en,
  localizedTitle: product.name,
  description: product.description.en,
  localizedDescription: product.description,
  productType: product.category,
  vendor: "Pokémon SA",
  tags: [product.category, ...(product.featured ? ["featured"] : [])],
  availableForSale: product.availableForSale ?? true,
  featuredImage: toShopifyImage(product.image, product.name.en),
  images: product.gallery.map((image) => ({ url: image, altText: product.name.en })),
  variants: [
    {
      id: product.shopifyVariantId ?? `${product.id}-default`,
      title: "Default",
      availableForSale: product.availableForSale ?? true,
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
};

const localById = new Map(products.map((product) => [product.id, product as Product]));

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

const normalizeProductImage = (image?: ShopifyImage) => image?.url;

export const mapStorefrontProductToLocalProduct = (product: StorefrontProductNode): Product => {
  const tags = product.tags ?? [];
  const localId = tagValue(tags, "pokemon-sa:id:") ?? tagValue(tags, "pokemon-sa:") ?? product.handle;
  const fallback = localById.get(localId) ?? localById.get(product.handle);
  const metafields = product.metafields ?? [];
  const images = product.images?.nodes?.map((image) => image.url).filter(Boolean) ?? [];
  const firstVariant = product.variants?.nodes?.[0];
  const isFeatured = tags.some((tag) => tag.toLowerCase() === "featured" || tag.toLowerCase() === "pokemon-sa:featured");
  const category =
    normalizeCategory(parseMetafieldJson<string>(metafields, "category")) ??
    normalizeCategory(product.productType) ??
    normalizeCategory(tagValue(tags, "category:")) ??
    fallback?.category ??
    "cards";

  return {
    id: fallback?.id ?? product.handle,
    shopifyProductId: product.id,
    shopifyVariantId: firstVariant?.id,
    shopifyHandle: product.handle,
    category,
    name: parseMetafieldJson(metafields, "localized_title") ?? fallback?.name ?? { en: product.title, ar: product.title },
    subtitle:
      parseMetafieldJson(metafields, "localized_subtitle") ??
      fallback?.subtitle ??
      { en: product.productType ?? "Pokémon SA product", ar: product.productType ?? "منتج Pokémon SA" },
    description:
      parseMetafieldJson(metafields, "localized_description") ??
      fallback?.description ??
      { en: product.description ?? "", ar: product.description ?? "" },
    price: Number(firstVariant?.price.amount ?? product.priceRange.minVariantPrice.amount),
    image: normalizeProductImage(product.featuredImage) ?? images[0] ?? fallback?.image ?? "",
    gallery: images.length ? images : fallback?.gallery ?? [normalizeProductImage(product.featuredImage) ?? ""].filter(Boolean),
    badge: parseMetafieldJson(metafields, "localized_badge") ?? fallback?.badge,
    featured: isFeatured || fallback?.featured,
    specs: parseMetafieldJson(metafields, "localized_specs") ?? fallback?.specs ?? { en: [], ar: [] },
    colors: parseMetafieldJson(metafields, "colors") ?? fallback?.colors,
    sizes: parseMetafieldJson(metafields, "sizes") ?? fallback?.sizes,
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
      variants(first: 50) {
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
  if (query.productType) {
    const category = normalizeCategory(query.productType);
    if (category) return catalog.filter((product) => product.category === category);
  }
  return catalog;
};

export const fetchStorefrontProducts = async (
  query: ShopifyProductQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyProduct>>> => {
  if (!isShopifyConfigured()) {
    return {
      data: {
        nodes: filterProducts(getProductCatalog(), query).map(mapLocalProductToShopifyProduct),
        pageInfo: { hasNextPage: false },
      },
      error: null,
    };
  }

  const response = await storefrontRequest<StorefrontProductsResponse>({
    query: STOREFRONT_PRODUCTS_QUERY,
    variables: {
      first: query.first ?? 100,
      after: query.after,
      query: buildStorefrontSearchQuery(query),
    },
  });

  if (!response.data) {
    return {
      data: {
        nodes: filterProducts(getProductCatalog(), query).map(mapLocalProductToShopifyProduct),
        pageInfo: { hasNextPage: false },
      },
      error: response.error,
    };
  }

  return {
    data: {
      nodes: response.data.products.nodes.map(mapStorefrontProductToLocalProduct).map(mapLocalProductToShopifyProduct),
      pageInfo: response.data.products.pageInfo,
    },
    error: null,
  };
};

export const loadCommerceProducts = async (query: ShopifyProductQuery = {}): Promise<ServiceResult<Product[]>> => {
  if (!isShopifyConfigured()) return { data: filterProducts(getProductCatalog(), query), error: null };

  const response = await storefrontRequest<StorefrontProductsResponse>({
    query: STOREFRONT_PRODUCTS_QUERY,
    variables: {
      first: query.first ?? 100,
      after: query.after,
      query: buildStorefrontSearchQuery(query),
    },
  });

  if (!response.data) {
    return { data: filterProducts(getProductCatalog(), query), error: response.error };
  }

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

export const getShopifyProduct = async (handleOrId: string): Promise<ServiceResult<ShopifyProduct>> => {
  const catalog = await loadCommerceProducts({ first: 100 });
  const product = catalog.data?.find((item) => item.id === handleOrId || item.shopifyHandle === handleOrId || item.shopifyProductId === handleOrId);
  return {
    data: product ? mapLocalProductToShopifyProduct(product) : null,
    error: catalog.error,
  };
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
