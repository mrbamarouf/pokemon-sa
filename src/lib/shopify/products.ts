import {
  getProduct as getLocalProduct,
  products as localProducts,
  productsByCategory as localProductsByCategory,
  type Product as LocalProduct,
} from "@/data/products";
import type { ServiceResult } from "@/lib/store-schema";
import type {
  ShopifyConnection,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductQuery,
} from "@/lib/shopify-types";
import { shopifyConfig } from "./config";
import { storefrontRequest } from "./client";

export type Product = LocalProduct;
export type ProductCategory = Product["category"];
export type ShopCategoryId = "all" | "featured" | ProductCategory;

export const products = localProducts;

export const getProductCatalog = () => products;

export const getProduct = (id?: string) => getLocalProduct(id);

export const productsByCategory = (category: ProductCategory) => localProductsByCategory(category);

export const getFeaturedProducts = () => {
  const cards = productsByCategory("cards");
  const boosters = productsByCategory("boosters");
  const magnets = productsByCategory("magnets");
  const apparel = productsByCategory("apparel");
  return [products.find((item) => item.featured), cards[0], boosters[0], magnets[0], apparel[0]].filter(Boolean) as Product[];
};

export const getProductsForCategory = (category: ShopCategoryId) => {
  if (category === "all") return products;
  if (category === "featured") return getFeaturedProducts();
  return productsByCategory(category);
};

export const getRelatedProducts = (product: Product, limit = 3) => {
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, limit);
  return related.length ? related : products.filter((item) => item.id !== product.id).slice(0, limit);
};

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
  id: product.id,
  handle: product.id,
  title: product.name.en,
  localizedTitle: product.name,
  description: product.description.en,
  localizedDescription: product.description,
  productType: product.category,
  vendor: "Pokémon SA",
  tags: [product.category, ...(product.featured ? ["featured"] : [])],
  availableForSale: true,
  featuredImage: toShopifyImage(product.image, product.name.en),
  images: product.gallery.map((image) => ({ url: image, altText: product.name.en })),
  variants: [
    {
      id: `${product.id}-default`,
      title: "Default",
      availableForSale: true,
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

export const listProducts = async (query: ShopifyProductQuery = {}): Promise<ServiceResult<Product[]>> => {
  void query;
  return { data: products, error: null };
};

export const listShopifyProducts = async (
  query: ShopifyProductQuery = {},
): Promise<ServiceResult<ShopifyConnection<ShopifyProduct>>> => {
  void query;
  return {
    data: {
      nodes: products.map(mapLocalProductToShopifyProduct),
      pageInfo: { hasNextPage: false },
    },
    error: null,
  };
};

export const getShopifyProduct = async (handleOrId: string): Promise<ServiceResult<ShopifyProduct>> => ({
  data: getProduct(handleOrId) ? mapLocalProductToShopifyProduct(getProduct(handleOrId) as Product) : null,
  error: null,
});

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
