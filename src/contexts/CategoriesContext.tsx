import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../types';
import { categoriesApi } from '../services/categories.api';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getActiveCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      // Fallback to static data if API fails
      try {
        const { categories: staticCategories } = await import('../data/categories');
        // Convert static categories to match API format
        const convertedCategories: Category[] = staticCategories.map(cat => ({
          ...cat,
          slug: cat.id,
          image: cat.image || null,
          color: null,
          isActive: true,
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setCategories(convertedCategories);
        setError('Using offline data - some features may be limited');
      } catch (fallbackErr) {
        console.error('Failed to load fallback categories:', fallbackErr);
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find(cat => cat.slug === slug);
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  return (
    <CategoriesContext.Provider 
      value={{
        categories,
        loading,
        error,
        refreshCategories,
        getCategoryBySlug,
        getCategoryById,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
