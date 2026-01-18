import { apiClient } from '../config/api';

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
  originalName?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency: string;
  stockQuantity: number;
  lowStockThreshold: number;
  status: 'draft' | 'published' | 'out_of_stock' | 'discontinued';
  isFeatured: boolean;
  isNew: boolean;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  tags?: string[];
  weight?: number;
  sku?: string;
  barcode?: string;
  careInstructions?: string;
  viewCount: number;
  likeCount: number;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  categoryId: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  isOnSale?: boolean;
  discountPercentage?: number;
  isInStock?: boolean;
  isLowStock?: boolean;
}

export interface CreateProductImageData {
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  originalName?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency?: string;
  stockQuantity?: number;
  lowStockThreshold?: number;
  status?: 'draft' | 'published' | 'out_of_stock' | 'discontinued';
  isFeatured?: boolean;
  isNew?: boolean;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  tags?: string[];
  weight?: number;
  sku?: string;
  barcode?: string;
  careInstructions?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  categoryId: string;
  images?: CreateProductImageData[];
  imageUrls?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  newImageUrls?: string[];
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: 'draft' | 'published' | 'out_of_stock' | 'discontinued';
  isFeatured?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  tags?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'stockQuantity' | 'viewCount' | 'soldCount' | 'averageRating';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  return searchParams.toString();
};

export const productsApi = {
  // Public endpoints (no auth required)
  getProducts: (params?: ProductsQueryParams): Promise<PaginatedProductsResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    return apiClient.get(`/products${queryString ? '?' + queryString : ''}`);
  },

  getProductById: (id: string): Promise<Product> => 
    apiClient.get<Product>(`/products/${id}`),

  getProductBySlug: (slug: string): Promise<Product> => 
    apiClient.get<Product>(`/products/slug/${slug}`),

  getFeaturedProducts: (limit: number = 10): Promise<Product[]> => 
    apiClient.get<Product[]>(`/products/featured?limit=${limit}`),

  getNewProducts: (limit: number = 10): Promise<Product[]> => 
    apiClient.get<Product[]>(`/products/new?limit=${limit}`),

  getRelatedProducts: (id: string, limit: number = 5): Promise<Product[]> => 
    apiClient.get<Product[]>(`/products/${id}/related?limit=${limit}`),

  incrementViewCount: (id: string): Promise<void> => 
    apiClient.post<void>(`/products/${id}/view`),

  // Admin endpoints (auth required)
  getProductsAdmin: (params?: ProductsQueryParams): Promise<PaginatedProductsResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    return apiClient.get(`/products/admin${queryString ? '?' + queryString : ''}`);
  },

  getProductByIdAdmin: (id: string): Promise<Product> => 
    apiClient.get<Product>(`/products/admin/${id}`),

  createProduct: (data: CreateProductData): Promise<Product> => 
    apiClient.post<Product>('/products', data),

  updateProduct: (id: string, data: UpdateProductData): Promise<Product> => 
    apiClient.patch<Product>(`/products/${id}`, data),

  deleteProduct: (id: string): Promise<void> => 
    apiClient.delete<void>(`/products/${id}`),

  updateStock: (id: string, quantity: number): Promise<Product> => 
    apiClient.patch<Product>(`/products/${id}/stock`, { quantity }),

  // Image management
  addImageUrls: (id: string, imageUrls: string[]): Promise<Product> => 
    apiClient.post<Product>(`/products/${id}/images/urls`, { imageUrls }),

  deleteImage: (productId: string, imageId: string): Promise<void> => 
    apiClient.delete<void>(`/products/${productId}/images/${imageId}`),
};
