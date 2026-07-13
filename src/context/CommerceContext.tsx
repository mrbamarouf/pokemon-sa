import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { isShopifyConfigured } from "@/lib/shopify/config";
import {
  getFeaturedProductsFromCatalog,
  getProductCatalog,
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

const localCatalog = getProductCatalog();

const fallbackValue: CommerceContextValue = {
  products: localCatalog,
  isLoading: false,
  isShopifyConnected: false,
  getProduct: (id?: string) => getProductFromCatalog(id, localCatalog),
  productsByCategory: (category) => productsByCategoryFromCatalog(category, localCatalog),
  getFeaturedProducts: () => getFeaturedProductsFromCatalog(localCatalog),
  getProductsForCategory: (category) => getProductsForCategoryFromCatalog(category, localCatalog),
  getRelatedProducts: (product, limit = 3) => getRelatedProductsFromCatalog(product, limit, localCatalog),
};

const CommerceContext = createContext<CommerceContextValue>(fallbackValue);

export const CommerceProvider = ({ children }: { children: ReactNode }) => {
  const [catalog, setCatalog] = useState<Product[]>(localCatalog);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const isConfigured = isShopifyConfigured();

  useEffect(() => {
    let cancelled = false;

    if (!isConfigured) return undefined;

    setIsLoading(true);
    loadCommerceProducts({ first: 100 }).then((result) => {
      if (cancelled) return;
      if (result.data?.length) setCatalog(result.data);
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
      isShopifyConnected: isConfigured && !errorMessage,
      errorMessage,
      getProduct: (id?: string) => getProductFromCatalog(id, catalog),
      productsByCategory: (category) => productsByCategoryFromCatalog(category, catalog),
      getFeaturedProducts: () => getFeaturedProductsFromCatalog(catalog),
      getProductsForCategory: (category) => getProductsForCategoryFromCatalog(category, catalog),
      getRelatedProducts: (product, limit = 3) => getRelatedProductsFromCatalog(product, limit, catalog),
    }),
    [catalog, errorMessage, isConfigured, isLoading],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
};

export const useCommerce = () => useContext(CommerceContext);
