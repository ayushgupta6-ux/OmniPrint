import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'du91zlnae';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? 'product_uploads';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
};

const getAuthHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data?.message || error.message || error)
);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  primaryFilters?: string[];
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  basePrice: number;
  categories: Category[];
  filters: { label: string; options: string[] }[];
  discountTiers?: { minQuantity: number; maxQuantity: number | null; discountPercentage: number }[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface QuoteRequest {
  productId: string;
  quantity: number;
  selectedFilters: Record<string, string>;
}

export interface QuoteResponse {
  agencyName?: string;
  quantity: number;
  baseUnitPrice: number;
  discountPercentage: number;
  finalUnitPrice: number;
  totalAmount: number;
}

// --- NEW: Payload interface for Nearest Vendor Quote ---
export interface NearestVendorQuotePayload {
  productId: string;
  quantity: number;
  lat: number;
  lng: number;
  selectedFilters?: Record<string, string>;
  needsInstallation?: boolean;
}

export interface OrderPayload {
  productId: string;
  quantity: number;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryAddress: string;
  // --- NEW: Added new fields for checkout ---
  selectedFilters?: Record<string, string>;
  needsInstallation?: boolean;
  designPath?: string;
}

export interface VendorProfilePayload {
  agencyName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface VendorProductPayload {
  productId: string;
  vendorPrice: number;
  offersInstallation: boolean;
  installationFee: number;
  discountTiers: Array<{ minQuantity: number; maxQuantity: number | null; discountPercentage: number }>;
  filterPricings: Array<{ filterLabel: string; optionName: string; additionalPrice: number }>;
}

export interface AdminProductPayload {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[];
  categories: Category[];
  filters: Array<{ label: string; options: string[] }>;
}

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

export const api = {
  auth: {
    login: (credentials: AuthCredentials): Promise<{ token: string }> =>
      axiosInstance.post('/v1/auth/login', credentials) as Promise<{ token: string }>,
    register: (userData: RegisterPayload): Promise<any> => {
      const payload = {
        name: userData.name,
        email: userData.email,
        number: userData.phoneNumber,
        password: userData.password,
        role: userData.role,
      };
      return axiosInstance.post('/v1/auth/register', payload) as Promise<any>;
    },
  },

  products: {
    getAll: (): Promise<Product[]> => axiosInstance.get('/products') as Promise<Product[]>,
    getBySlug: (slug: string): Promise<Product> => axiosInstance.get(`/products/${slug}`) as Promise<Product>,
    getById: (id: string): Promise<Product> => axiosInstance.get(`/products/${id}`) as Promise<Product>,
  },

  admin: {
    createProduct: async (payload: AdminProductPayload) => axiosInstance.post('/admin/products', payload),
    updateProduct: async (id: string, payload: AdminProductPayload) => axiosInstance.put(`/admin/products/${id}`, payload),
    deleteProduct: async (id: string) => axiosInstance.delete(`/admin/products/${id}`),
  },

  quote: {
    getQuote: async (body: QuoteRequest): Promise<QuoteResponse> =>
      axiosInstance.post('/products/quote', body) as Promise<QuoteResponse>,
  },

  orders: {
    placeOrder: async (payload: OrderPayload): Promise<any> =>
      axiosInstance.post('/orders', payload) as Promise<any>,
    getClientOrders: async (): Promise<any[]> =>
      axiosInstance.get('/orders/client', { headers: getAuthHeaders() }) as Promise<any[]>,
  },

  vendor: {
    // --- CHANGED: Now accepts a payload object and makes a POST request ---
    getNearestVendorQuote: async (payload: NearestVendorQuotePayload): Promise<any> =>
      axiosInstance.post('/vendors/quote', payload, {
        headers: getAuthHeaders(),
      }) as Promise<any>,
    getVendorOrders: async (): Promise<any[]> =>
      axiosInstance.get('/orders/vendor', { headers: getAuthHeaders() }) as Promise<any[]>,
    getVendorProducts: async (vendorId: number): Promise<any[]> =>
      axiosInstance.get(`/vendors/${vendorId}/products`, { headers: getAuthHeaders() }) as Promise<any[]>,
    addVendorProduct: async (vendorId: number, payload: VendorProductPayload): Promise<any> =>
      axiosInstance.post(`/vendors/${vendorId}/products`, payload, { headers: getAuthHeaders() }) as Promise<any>,
    updateVendorProduct: async (vendorId: number, productId: string, payload: VendorProductPayload): Promise<any> =>
      axiosInstance.put(`/vendors/${vendorId}/products/${productId}`, payload, { headers: getAuthHeaders() }) as Promise<any>,
    createProfile: async (payload: VendorProfilePayload): Promise<any> =>
      axiosInstance.post('/vendors/profile', payload, { headers: getAuthHeaders() }) as Promise<any>,
    updateOrderStatus: async (orderId: number, newStatus: string): Promise<any> =>
      axiosInstance.patch(`/orders/${orderId}/status`, null, {
        params: { status: newStatus },
        headers: getAuthHeaders(),
      }) as Promise<any>,
  },

  cloudinary: {
    uploadImage: uploadImageToCloudinary,
    uploadImages: async (files: File[]) => Promise.all(files.map(uploadImageToCloudinary)),
  },

  utils: {
    getVendorIdFromToken: (): number | null => {
      try {
        const token = getStoredToken();
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload?.userId ?? null;
      } catch {
        return null;
      }
    },
  },
};