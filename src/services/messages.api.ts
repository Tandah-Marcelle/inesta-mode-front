import { apiClient } from '../config/api';

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  repliedAt?: string;
  adminNotes?: string;
  source: 'website' | 'direct' | 'social';
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateContactMessageData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  source?: 'website' | 'direct' | 'social';
}

export interface UpdateMessageData {
  status?: 'unread' | 'read' | 'replied';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
}

export interface MessagesFilterParams {
  page?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'replied';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'subject';
  sortOrder?: 'ASC' | 'DESC';
  dateFrom?: string;
  dateTo?: string;
}

export interface MessagesResponse {
  data: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MessageStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  urgent: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

class MessagesApi {
  // Public endpoint for contact form submissions (no auth required)
  async submitContactForm(data: CreateContactMessageData): Promise<ContactMessage> {
    return apiClient.post<ContactMessage>('/contact/submit', {
      ...data,
      source: data.source || 'website',
    });
  }

  // Admin endpoints (require authentication)
  async getAllMessages(params: MessagesFilterParams = {}): Promise<MessagesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    return apiClient.get<MessagesResponse>(
      `/messages${queryString ? `?${queryString}` : ''}`
    );
  }

  async getMessageById(id: string): Promise<ContactMessage> {
    return apiClient.get<ContactMessage>(`/messages/${id}`);
  }

  async getMessageStats(): Promise<MessageStats> {
    return apiClient.get<MessageStats>('/messages/stats');
  }

  async updateMessage(id: string, data: UpdateMessageData): Promise<ContactMessage> {
    return apiClient.patch<ContactMessage>(`/messages/${id}`, data);
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    return this.updateMessage(id, { status: 'read' });
  }

  async markAsReplied(id: string, adminNotes?: string): Promise<ContactMessage> {
    return this.updateMessage(id, { 
      status: 'replied', 
      adminNotes 
    });
  }

  async setPriority(id: string, priority: 'low' | 'medium' | 'high' | 'urgent'): Promise<ContactMessage> {
    return this.updateMessage(id, { priority });
  }

  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete<void>(`/messages/${id}`);
  }

  async bulkUpdateMessages(
    ids: string[], 
    data: UpdateMessageData
  ): Promise<ContactMessage[]> {
    return apiClient.patch<ContactMessage[]>('/messages/bulk-update', { ids, ...data });
  }

  async exportMessages(params: MessagesFilterParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    
    // For blob responses, we need to use fetch directly since apiClient returns JSON
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      `http://localhost:3000/api/messages/export${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export messages');
    }

    return await response.blob();
  }
}

export const messagesApi = new MessagesApi();
export default messagesApi;