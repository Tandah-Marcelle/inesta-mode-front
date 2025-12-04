import { apiClient } from '../config/api';

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  partnershipType: string;
  partnershipStartDate?: string;
  isActive: boolean;
  isFeatured: boolean;
  location?: string;
  achievements?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerData {
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPerson?: string;
  partnershipType: string;
  partnershipStartDate?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  location?: string;
  achievements?: string;
  sortOrder?: number;
}

export interface UpdatePartnerData extends Partial<CreatePartnerData> {}

export interface PartnerFilterParams {
  search?: string;
  partnershipType?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PartnerResponse {
  data: Partner[];
  total: number;
  page: number;
  limit: number;
}

export const partnersApi = {
  // Public endpoints
  getActivePartners: (): Promise<Partner[]> => 
    apiClient.get<Partner[]>('/partners/active'),

  getFeaturedPartners: (): Promise<Partner[]> => 
    apiClient.get<Partner[]>('/partners/featured'),

  getPartnersByType: (type: string): Promise<Partner[]> => 
    apiClient.get<Partner[]>(`/partners/type/${type}`),

  // Admin endpoints
  getAllPartners: (params?: PartnerFilterParams): Promise<PartnerResponse> => 
    apiClient.get<PartnerResponse>('/partners', { params }),

  getPartnerById: (id: string): Promise<Partner> => 
    apiClient.get<Partner>(`/partners/${id}`),

  createPartner: (data: CreatePartnerData): Promise<Partner> => 
    apiClient.post<Partner>('/partners', data),

  updatePartner: (id: string, data: UpdatePartnerData): Promise<Partner> => 
    apiClient.patch<Partner>(`/partners/${id}`, data),

  deletePartner: (id: string): Promise<void> => 
    apiClient.delete<void>(`/partners/${id}`),

  togglePartnerStatus: (id: string): Promise<Partner> => 
    apiClient.patch<Partner>(`/partners/${id}/toggle-status`),

  togglePartnerFeatured: (id: string): Promise<Partner> => 
    apiClient.patch<Partner>(`/partners/${id}/toggle-featured`),
};