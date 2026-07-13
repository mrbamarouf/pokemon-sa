import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { isShopifyConfigured } from "@/lib/shopify/config";
import {
  getFeaturedProductsFromCatalog,
  getProductFromCatalog,
  getProductsForCategoryFromCatalog,
  getRelatedProductsFromCatalog,
  loadCommerceProducts,
  productsByCategoryFromCatalog,
  type Product,
  type ProductCategory,
  type ShopCategoryId,
} from "@/lib/shopify/products";

type CommerceContextValue = {
  products: Product[];
  isLoading: boolean;
  isShopifyConnected: boolean;
  errorMessage?: string;
  getProduct: (id?: string) => Product | undefined;
  productsByCategory: (category: ProductCategory) => Product[];
  getFeaturedProducts: () => Product[];
  getProductsForCategory: (category: ShopCategoryId) => Product[];
  getRelatedProducts: (product: Product, limit?: number) => Product[];
};

const fallbackValue: CommerceContextValue = {
  products: [],
  isLoading: true,
  isShopifyConnected: false,
  getProduct: () => undefined,
  productsByCategory: () => [],
  getFeaturedProducts: () => [],
  getProductsForCategory: () => [],
  getRelatedProducts: () => [],
};

const CommerceContext = createContext<CommerceContextValue>(fallbackValue);

export const CommerceProvider = ({ children }: { children: ReactNode }) => {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const isConfigured = isShopifyConfigured();

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    if (!isConfigured) {
      setCatalog([]);
      setErrorMessage("Shopify Storefront API is not configured.");
      setIsLoading(false);
      return undefined;
    }

    loadCommerceProducts({ first: 100 }).then((result) => {
      if (cancelled) return;
      setCatalog(result.data ?? []);
      setErrorMessage(result.error?.message);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isConfigured]);

  const value = useMemo<CommerceContextValue>(
    () => ({
      products: catalog,
      isLoading,
      isShopifyConnected: isConfigured && !errorMessage && catalog.length > 0,
      errorMessage,
      getProduct: (id?: string) => getProductFromCatalog(id, catalog),
      productsByCategory: (category) => productsByCategoryFromCatalog(category, catalog),
      getFeaturedProducts: () => getFeaturedProductsFromCatalog(catalog),
      getProductsForCategory: (category) => getProductsForCategoryFromCatalog(category, catalog),
      getRelatedProducts: (product, limit = 3) => getRelatedProductsFromCatalog(product, limit, catalog),
    }),
    [catalog, errorMessage, isConfigured, isLoading],
  );

  if (isLoading && catalog.length === 0) return null;

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
};

export const useCommerce = () => useContext(CommerceContext);
