import { apiClient } from '../config/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'customer';
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'customer';
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
}

export interface UserFilters {
  role?: 'admin' | 'customer';
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const usersApi = {
  // Admin endpoints
  getAllUsers: (filters?: UserFilters): Promise<{ users: User[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/users${params.toString() ? `?${params.toString()}` : ''}`);
  },

  getUserById: (id: string): Promise<User> => 
    apiClient.get<User>(`/users/${id}`),

  createUser: (data: CreateUserData): Promise<User> => 
    apiClient.post<User>('/users', data),

  updateUser: (id: string, data: UpdateUserData): Promise<User> => 
    apiClient.patch<User>(`/users/${id}`, data),

  deleteUser: (id: string): Promise<void> => 
    apiClient.delete<void>(`/users/${id}`),

  // Role and permission management
  updateUserRole: (id: string, role: 'admin' | 'customer'): Promise<User> =>
    apiClient.patch<User>(`/users/${id}/role`, { role }),

  toggleUserStatus: (id: string): Promise<User> =>
    apiClient.patch<User>(`/users/${id}/toggle-status`),

  // Bulk operations
  bulkUpdateUsers: (ids: string[], data: UpdateUserData): Promise<User[]> =>
    apiClient.patch<User[]>('/users/bulk', { ids, data }),

  bulkDeleteUsers: (ids: string[]): Promise<void> =>
    apiClient.delete<void>('/users/bulk', { ids }),
};
