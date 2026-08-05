import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';
import type { Category, Product } from '@/api/api';

// --- React Query Hooks ---
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.products.getAll,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.products.getBySlug(slug),
    enabled: !!slug, // Only fetch if slug exists
  });
};

// --- Helper Hook to Group Products into Categories ---
export const useCategories = () => {
  const { data: products, ...rest } = useAllProducts();

  const categories = products ? (() => {
    const categoryMap = new Map<string, Category>();

    products.forEach((product) => {
      product.categories.forEach((cat) => {
        if (!categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, { ...cat, products: [] });
        }
        const productWithoutCategories = { ...product, categories: [] };
        categoryMap.get(cat.slug)!.products!.push(productWithoutCategories as Product);
      });
    });

    return Array.from(categoryMap.values());
  })() : [];

  return { categories, ...rest };
};