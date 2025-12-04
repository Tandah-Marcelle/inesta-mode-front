import { apiClient } from '../config/api';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    featured: number;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      count: number;
    }>;
  };
  categories: {
    total: number;
    active: number;
  };
  users: {
    total: number;
    active: number;
  };
  news: {
    total: number;
    published: number;
    events: number;
  };
  partners: {
    total: number;
    active: number;
    featured: number;
  };
  messages: {
    total: number;
    unread: number;
    resolved: number;
  };
  testimonials: {
    total: number;
    published: number;
    featured: number;
  };
}

interface ProductsOverTime {
  month: string;
  count: number;
  sales?: number;
}

class DashboardApi {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>('/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data as fallback
      return this.getMockStats();
    }
  }

  async getProductsOverTime(): Promise<ProductsOverTime[]> {
    try {
      const response = await apiClient.get<ProductsOverTime[]>('/dashboard/products-over-time');
      return response;
    } catch (error) {
      console.error('Error fetching products over time:', error);
      // Return mock data as fallback
      return this.getMockProductsOverTime();
    }
  }

  private getMockStats(): DashboardStats {
    return {
      products: {
        total: 0,
        active: 0,
        featured: 0,
        byCategory: []
      },
      categories: {
        total: 0,
        active: 0
      },
      users: {
        total: 0,
        active: 0
      },
      news: {
        total: 0,
        published: 0,
        events: 0
      },
      partners: {
        total: 0,
        active: 0,
        featured: 0
      },
      messages: {
        total: 0,
        unread: 0,
        resolved: 0
      },
      testimonials: {
        total: 0,
        published: 0,
        featured: 0
      }
    };
  }

  private getMockProductsOverTime(): ProductsOverTime[] {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();
    const result: ProductsOverTime[] = [];

    // Get last 6 months including current month
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        month: monthNames[date.getMonth()],
        count: 0
      });
    }

    return result;
  }
}

export const dashboardApi = new DashboardApi();