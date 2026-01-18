import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Permission {
  id: string;
  resource: string;
  action: string;
  name: string;
  description: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  isGranted: boolean;
  permission: Permission;
}

interface PermissionsContextType {
  permissions: Permission[];
  userPermissions: UserPermission[];
  loading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  fetchPermissions: () => Promise<void>;
  fetchUserPermissions: (userId: string) => Promise<UserPermission[]>;
  updateUserPermissions: (userId: string, permissionIds: string[]) => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      console.log('Fetching permissions with token:', token);
      const response = await fetch('http://localhost:3000/api/users/permissions/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Permissions response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Permissions data:', data);
        setPermissions(data);
      } else {
        console.error('Permissions fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPermissions = async (userId: string): Promise<UserPermission[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/users/${userId}/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  };

  const updateUserPermissions = async (userId: string, permissionIds: string[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:3000/api/users/${userId}/permissions`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: permissionIds }),
      });
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    // Super admins have all permissions
    if (user?.role === 'super_admin') {
      return true;
    }
    
    return userPermissions.some(
      up => up.permission.resource === resource && 
            up.permission.action === action && 
            up.isGranted
    );
  };

  useEffect(() => {
    if (user) {
      fetchPermissions();
      if (user.id) {
        fetchUserPermissions(user.id).then(setUserPermissions);
      }
    }
  }, [user]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        userPermissions,
        loading,
        hasPermission,
        fetchPermissions,
        fetchUserPermissions,
        updateUserPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};