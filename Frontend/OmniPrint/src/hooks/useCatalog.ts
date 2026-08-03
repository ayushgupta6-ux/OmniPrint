import { useQuery } from '@tanstack/react-query';

const API_URL = 'http://localhost:8080/api'; // Ensure this points to your API Gateway

// --- Types matching your Spring Boot backend ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  basePrice: number;
  categories: Category[];
  filters: { label: string; options: string[] }[];
  discountTiers: { minQuantity: number; maxQuantity: number; discountPercentage: number }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  primaryFilters?: string[];
  products?: Product[]; // Attached dynamically below
}

// --- API Fetchers ---
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

// --- React Query Hooks ---
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
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
        // Avoid infinite recursion by creating a shallow copy without categories
        const productWithoutCategories = { ...product, categories: [] };
        categoryMap.get(cat.slug)!.products!.push(productWithoutCategories as Product);
      });
    });
    
    return Array.from(categoryMap.values());
  })() : [];

  return { categories, ...rest };
};