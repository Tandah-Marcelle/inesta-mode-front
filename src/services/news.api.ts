import { apiClient } from '../config/api';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: 'news' | 'event';
  eventDate?: string;
  eventLocation?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  slug?: string;
  excerpt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  imageUrl?: string;
  category: 'news' | 'event';
  eventDate?: string;
  eventLocation?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  slug?: string;
  excerpt?: string;
}

export interface UpdateNewsData extends Partial<CreateNewsData> {}

export interface NewsFilterParams {
  search?: string;
  category?: 'news' | 'event';
  isActive?: boolean;
  isFeatured?: boolean;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface NewsResponse {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
}

export const newsApi = {
  // Public endpoints
  getActiveNews: (): Promise<NewsItem[]> => 
    apiClient.get<NewsItem[]>('/news/active'),

  getFeaturedNews: (): Promise<NewsItem[]> => 
    apiClient.get<NewsItem[]>('/news/featured'),

  getNewsBySlug: (slug: string): Promise<NewsItem> => 
    apiClient.get<NewsItem>(`/news/slug/${slug}`),

  // Admin endpoints
  getAllNews: (params?: NewsFilterParams): Promise<NewsResponse> => 
    apiClient.get<NewsResponse>('/news', { params }),

  getNewsById: (id: string): Promise<NewsItem> => 
    apiClient.get<NewsItem>(`/news/${id}`),

  createNews: (data: CreateNewsData): Promise<NewsItem> => 
    apiClient.post<NewsItem>('/news', data),

  updateNews: (id: string, data: UpdateNewsData): Promise<NewsItem> => 
    apiClient.patch<NewsItem>(`/news/${id}`, data),

  deleteNews: (id: string): Promise<void> => 
    apiClient.delete<void>(`/news/${id}`),

  toggleNewsStatus: (id: string): Promise<NewsItem> => 
    apiClient.patch<NewsItem>(`/news/${id}/toggle-status`),

  toggleNewsFeatured: (id: string): Promise<NewsItem> => 
    apiClient.patch<NewsItem>(`/news/${id}/toggle-featured`),
};