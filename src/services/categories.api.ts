import { apiClient } from '../config/api';
import { Category } from '../types';

export const categoriesApi = {
  // Public endpoints
  getActiveCategories: (): Promise<Category[]> => 
    apiClient.get<Category[]>('/categories'),

  getCategoriesWithCount: (): Promise<Category[]> => 
    apiClient.get<Category[]>('/categories/with-count'),

  getCategoryBySlug: (slug: string): Promise<Category> => 
    apiClient.get<Category>(`/categories/slug/${slug}`),

  getCategoryById: (id: string): Promise<Category> => 
    apiClient.get<Category>(`/categories/${id}`),

  // Admin endpoints (will need authentication headers later)
  getAllCategories: (): Promise<Category[]> => 
    apiClient.get<Category[]>('/categories/admin/all'),

  createCategory: (data: {
    name: string;
    description: string;
    image?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Category> => 
    apiClient.post<Category>('/categories', data),

  updateCategory: (id: string, data: {
    name?: string;
    description?: string;
    image?: string;
    color?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Category> => 
    apiClient.patch<Category>(`/categories/${id}`, data),

  deleteCategory: (id: string): Promise<void> => 
    apiClient.delete<void>(`/categories/${id}`),
};
