import { apiClient } from '../config/api';

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateTestimonialData extends Partial<CreateTestimonialData> {}

export const testimonialsApi = {
  // Public endpoints
  getActiveTestimonials: (): Promise<Testimonial[]> => 
    apiClient.get<Testimonial[]>('/testimonials/active'),

  // Admin endpoints
  getAllTestimonials: (): Promise<Testimonial[]> => 
    apiClient.get<Testimonial[]>('/testimonials'),

  getTestimonialById: (id: string): Promise<Testimonial> => 
    apiClient.get<Testimonial>(`/testimonials/${id}`),

  createTestimonial: (data: CreateTestimonialData): Promise<Testimonial> => 
    apiClient.post<Testimonial>('/testimonials', data),

  updateTestimonial: (id: string, data: UpdateTestimonialData): Promise<Testimonial> => 
    apiClient.patch<Testimonial>(`/testimonials/${id}`, data),

  deleteTestimonial: (id: string): Promise<void> => 
    apiClient.delete<void>(`/testimonials/${id}`),

  toggleTestimonialStatus: (id: string): Promise<Testimonial> => 
    apiClient.patch<Testimonial>(`/testimonials/${id}/toggle-status`),
};