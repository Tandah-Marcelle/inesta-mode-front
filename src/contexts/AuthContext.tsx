import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../config/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
}

interface AuthResponse {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  token: string | null;
  validateToken: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Validate token with backend
  const validateToken = async (): Promise<boolean> => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) return false;

    try {
      const response = await apiClient.get<{ valid: boolean }>('/auth/validate');
      return response.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) return false;

    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      const { access_token, user: userData } = response;

      // Update state and storage
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Refresh user data from backend
  const refreshUserData = async (): Promise<void> => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) return;

    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      setUser(response.user);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
    }
  };

  // Load user from localStorage on mount and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (savedToken && savedUser) {
        try {
          // Check if token is still valid (optional - fallback to local storage if endpoint doesn't exist)
          try {
            const isValid = await validateToken();
            if (isValid) {
              setToken(savedToken);
              setUser(JSON.parse(savedUser));
              // Refresh user data to ensure it's up to date
              try {
                await refreshUserData();
              } catch (error) {
                // If refresh fails, use cached data
                console.warn('Failed to refresh user data, using cached data');
              }
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              setSessionExpired(true);
            }
          } catch (error) {
            // If validation endpoint doesn't exist, use cached data
            console.warn('Token validation endpoint not available, using cached user data');
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Set up token validation interval (optional)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const isValid = await validateToken();
        if (!isValid) {
          // Try to refresh token before logging out
          const refreshed = await refreshToken();
          if (!refreshed) {
            setSessionExpired(true);
            logout();
          }
        }
      } catch (error) {
        // If validation fails, try to refresh token
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.warn('Token validation and refresh failed');
          setSessionExpired(true);
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [token]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { access_token, user: userData } = response;

      // Save to state
      setToken(access_token);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return response;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    // Call logout API if token exists
    if (token) {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local logout even if API call fails
      }
    }
    
    // Clear local state and storage
    setUser(null);
    setToken(null);
    setSessionExpired(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !sessionExpired,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    loading,
    sessionExpired,
    login,
    logout,
    token,
    validateToken,
    refreshUserData,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
