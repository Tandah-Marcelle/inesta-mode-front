import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Key,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  address?: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  isActive: boolean;
  phone?: string;
  address?: string;
  password?: string;
  permissions?: string[];
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-800' },
  { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
  { value: 'user', label: 'Utilisateur', color: 'bg-blue-100 text-blue-800' }
];

function UsersManagement() {
  const { user: currentUser } = useAuth();
  const { permissions, fetchUserPermissions, updateUserPermissions, hasPermission } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState<User | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    isActive: true,
    phone: '',
    address: '',
    password: '',
    permissions: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  // Sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch users with filters and pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        sortBy: sortField,
        sortOrder: sortDirection.toUpperCase(),
      });

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: UsersResponse = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalUsers(data.total);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(`http://localhost:3000/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchUsers();
        setEditingUser(null);
        resetForm();
      } else {
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchUsers();
        setDeleteConfirm(null);
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleStatus = async (userId: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },

      });

      if (response.ok) {
        await fetchUsers();
      } else {
        console.error('Error updating user status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordModal) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3000/api/users/${showPasswordModal.id}/password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password }),
      });

      if (response.ok) {
        setShowPasswordModal(null);
        resetForm();
      } else {
        console.error('Error updating password:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      isActive: true,
      phone: '',
      address: '',
      password: '',
      permissions: [],
    });
  };

  const openEditModal = async (user: User) => {
    setEditingUser(user);
    const userPermissions = await fetchUserPermissions(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      permissions: userPermissions.map(up => up.permissionId),
    });
  };

  const openPasswordModal = (user: User) => {
    setShowPasswordModal(user);
    setFormData({ ...formData, password: '' });
  };

  const openPermissionsModal = async (user: User) => {
    setShowPermissionsModal(user);
    try {
      const userPermissions = await fetchUserPermissions(user.id);
      setSelectedPermissions(userPermissions.map(up => up.permissionId));
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      setSelectedPermissions([]);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    setShowPasswordModal(null);
    setShowPermissionsModal(null);
    setSelectedPermissions([]);
    resetForm();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleConfig = (role: string) => {
    return ROLES.find(r => r.value === role) || ROLES[1];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-8 font-admin"
    >
      {/* Header Card - Style Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100"
      >
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Gestion des Utilisateurs
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-cyan-600 font-medium">{totalUsers} utilisateurs</span>
            </div>
            <span className="text-primary-300">•</span>
            <span className="text-sm text-primary-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div className="mt-6 sm:mt-0">
          {hasPermission('users', 'create') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvel Utilisateur
            </motion.button>
          )}
        </div>
      </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 min-w-44"
              >
                <option value="all">Tous les rôles</option>
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 min-w-40"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('firstName')}
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Utilisateur</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>Email</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Rôle</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">
                    Statut
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Créé le</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('lastLoginAt')}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Dernière connexion</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500">Chargement des utilisateurs...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                users.map((user, index) => {
                  const roleConfig = getRoleConfig(user.role);
                  
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-cyan-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
                            <User className="w-6 h-6 text-cyan-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{user.email}</div>
                            {user.isEmailVerified ? (
                              <div className="flex items-center text-xs text-green-600">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                Vérifié
                              </div>
                            ) : (
                              <div className="flex items-center text-xs text-orange-600">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
                                Non vérifié
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <UserX className="w-3 h-3 mr-1" />
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(user.lastLoginAt)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Jamais connecté</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasPermission('users', 'update') && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleStatus(user.id, !user.isActive)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                user.isActive 
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                              title={user.isActive ? 'Désactiver' : 'Activer'}
                            >
                              {user.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                            </motion.button>
                          )}
                          
                          {hasPermission('users', 'update') && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openPasswordModal(user)}
                              className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-all duration-200"
                              title="Changer mot de passe"
                            >
                              <Key size={16} />
                            </motion.button>
                          )}
                          
                          {hasPermission('users', 'update') && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(user)}
                              className="p-2 rounded-lg bg-cyan-100 text-cyan-600 hover:bg-cyan-200 transition-all duration-200"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </motion.button>
                          )}
                          
                          {hasPermission('users', 'delete') && currentUser?.id !== user.id && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteConfirm(user.id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">👥</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par créer votre premier utilisateur'}
                        </p>
                        {!searchTerm && hasPermission('users', 'create') && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
                          >
                            Créer un utilisateur
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-2xl">
              <div className="flex-1 flex justify-between sm:hidden">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </motion.button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{((currentPage - 1) * usersPerPage) + 1}</span> à{' '}
                    <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> sur{' '}
                    <span className="font-medium">{totalUsers}</span> utilisateurs
                  </p>
                </div>
                <div>
                  <nav className="flex items-center gap-1" aria-label="Pagination">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </motion.button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = Math.max(1, currentPage - 2) + i;
                      if (pageNumber > totalPages) return null;
                      
                      return (
                        <motion.button
                          key={pageNumber}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            pageNumber === currentPage
                              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-200'
                              : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </motion.button>
                      );
                    })}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </motion.button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingUser) && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={closeModal}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative inline-block w-full max-w-2xl mx-4 p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h2>
                </div>

                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe *
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">Au moins 6 caractères</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle *
                      </label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'super_admin' | 'admin' | 'user' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {ROLES.filter(role => {
                          // Super admin can create all roles
                          if (currentUser?.role === 'super_admin') return true;
                          // Admin can only create users
                          if (currentUser?.role === 'admin') return role.value === 'user';
                          return false;
                        }).map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Compte actif
                    </label>
                  </div>

                  {/* Permissions Section - For all users */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions d'accès ({permissions.length} disponibles)
                    </label>
                    {permissions.length === 0 ? (
                      <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                        Chargement des permissions... (Vérifiez la console pour les erreurs)
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                        <div className="space-y-4">
                          {Object.entries(permissions.reduce((acc, permission) => {
                            if (!acc[permission.resource]) {
                              acc[permission.resource] = [];
                            }
                            acc[permission.resource].push(permission);
                            return acc;
                          }, {} as Record<string, typeof permissions>)).map(([resource, resourcePermissions]) => (
                            <div key={resource} className="border-b border-gray-100 pb-3 last:border-b-0">
                              <h4 className="font-medium text-gray-900 mb-2 capitalize text-sm">
                                {resource.replace('_', ' ')}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {resourcePermissions.map((permission) => (
                                  <label key={permission.id} className="flex items-center text-sm">
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions?.includes(permission.id) || false}
                                      onChange={(e) => {
                                        const currentPermissions = formData.permissions || [];
                                        const newPermissions = e.target.checked
                                          ? [...currentPermissions, permission.id]
                                          : currentPermissions.filter(id => id !== permission.id);
                                        setFormData({ ...formData, permissions: newPermissions });
                                      }}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-gray-700">
                                      {permission.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Sélectionnez les pages auxquelles cet utilisateur aura accès
                    </p>
                  </div>


                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {submitting ? 'Enregistrement...' : (editingUser ? 'Mettre à jour' : 'Créer')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowPasswordModal(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative inline-block w-full max-w-md mx-4 p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Changer le mot de passe
                  </h2>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilisateur
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {showPasswordModal.firstName} {showPasswordModal.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{showPasswordModal.email}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Au moins 6 caractères</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {submitting ? 'Mise à jour...' : 'Changer le mot de passe'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>



      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setDeleteConfirm(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative inline-block w-full max-w-md mx-4 p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Supprimer l'utilisateur
                  </h3>
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                  </p>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteUser(deleteConfirm)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UsersManagement;
