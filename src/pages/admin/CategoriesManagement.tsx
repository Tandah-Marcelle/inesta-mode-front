import { useState, useEffect, useRef } from 'react';
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
  Tag,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Activity,
  Tags
} from 'lucide-react';
import { useCategories } from '../../contexts/CategoriesContext';
import { categoriesApi } from '../../services/categories.api';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Category } from '../../types';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

function CategoriesManagement() {
  const { categories, loading, refreshCategories } = useCategories();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [adminCategories, setAdminCategories] = useState<Category[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const categoriesPerPage = 10;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#775e48',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading: uploadingImage, uploadSingle } = useImageUpload();

  // Fetch admin categories
  const fetchAdminCategories = async () => {
    try {
      setLoadingAdmin(true);
      const data = await categoriesApi.getAllCategories();
      setAdminCategories(data);
    } catch (error) {
      console.error('Error fetching admin categories:', error);
      // Fallback to public categories
      setAdminCategories(categories);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Use admin categories if available, otherwise use public categories
  const currentCategories = user?.role === 'admin' ? adminCategories : categories;
  const currentLoading = user?.role === 'admin' ? loadingAdmin : loading;

  // Filter and paginate categories
  const filteredCategories = currentCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalFiltered = filteredCategories.length;
  const totalPagesCalculated = Math.ceil(totalFiltered / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + categoriesPerPage);
  
  // Update total pages when filtered results change
  useEffect(() => {
    const newTotalPages = Math.max(1, totalPagesCalculated);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [totalPagesCalculated, currentPage]);

  // useEffect to fetch admin categories on mount (but not when modals are open)
  useEffect(() => {
    if (user?.role === 'admin' && !showCreateModal && !editingCategory) {
      fetchAdminCategories();
    }
  }, [user?.role, showCreateModal, editingCategory]);

  const refreshAdminCategories = async () => {
    if (user?.role === 'admin') {
      await fetchAdminCategories();
    } else {
      await refreshCategories();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload image if selected
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadSingle(selectedImage, 'categories');
      }

      await categoriesApi.createCategory({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isActive: formData.isActive,
        ...(imageUrl && { image: imageUrl })
      });
      
      await refreshAdminCategories();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setSubmitting(true);

    try {
      // Upload new image if selected
      let imageUrl = editingCategory.image;
      if (selectedImage) {
        imageUrl = await uploadSingle(selectedImage, 'categories');
      }

      await categoriesApi.updateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isActive: formData.isActive,
        ...(imageUrl && { image: imageUrl })
      });
      
      await refreshAdminCategories();
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoriesApi.deleteCategory(categoryId);
      setDeleteConfirm(null);
      await refreshAdminCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#775e48',
      isActive: true,
    });
    setSelectedImage(null);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color || '#775e48',
      isActive: category.isActive,
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCategory(null);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl" />
        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Tag className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Gestion des Catégories
                </h1>
                <p className="text-gray-600 text-lg mt-2 flex items-center gap-2">
                  <span>Organisez vos collections et produits</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-teal-100 rounded-full">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                    <span className="text-teal-700 text-sm font-medium">{currentCategories.length} catégories</span>
                  </div>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {hasPermission('categories', 'create') && (
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle Catégorie
                </motion.button>
              )}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 shadow-md"
              >
                <Tags className="w-6 h-6 text-emerald-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6"
      >
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 font-medium"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                Filtrer
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 font-medium"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                Trier
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{totalFiltered} catégories</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{filteredCategories.filter(c => c.isActive).length} actives</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Categories Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-200/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Catégorie</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Description</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Statut</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Créée le</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {currentLoading ? (
                // Enhanced Skeleton loading rows
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse bg-white/50">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded-lg w-28 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-4 bg-gray-200 rounded-lg w-48"></div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                    whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.02)" }}
                    className="bg-white/60 hover:bg-emerald-50/50 border-b border-gray-200/30 transition-all duration-300 group cursor-pointer"
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        >
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-14 h-14 object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: category.color || '#775e48' }}
                            >
                              <Tag className="w-7 h-7 text-white" />
                            </div>
                          )}
                        </motion.div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 mb-1">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>Slug:</span>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                              {category.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                        <button
                          className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {/* Dropdown menu */}
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            {hasPermission('categories', 'update') && (
                              <button
                                onClick={() => openEditModal(category)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-3" />
                                Modifier
                              </button>
                            )}
                            {hasPermission('categories', 'delete') && (
                              <button
                                onClick={() => setDeleteConfirm(category.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par créer votre première catégorie'}
                    </p>
                    {!searchTerm && (
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                      >
                        Créer une catégorie
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Enhanced Pagination */}
      {totalFiltered > categoriesPerPage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Affichage {startIndex + 1} à {Math.min(startIndex + categoriesPerPage, totalFiltered)} sur {totalFiltered} catégories</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </motion.button>
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <span className="text-sm font-semibold text-emerald-700">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingCategory) && (
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
                className="relative inline-block w-full max-w-md mx-4 p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                  </h2>
                </div>

                <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Mariage, Casual, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Décrivez cette catégorie..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="#775e48"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image de la catégorie
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} 
                        className="hidden" 
                      />
                      <div className="text-center">
                        {selectedImage ? (
                          <div className="relative inline-block">
                            <img 
                              src={URL.createObjectURL(selectedImage)} 
                              alt="Preview" 
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button 
                              type="button" 
                              onClick={() => setSelectedImage(null)} 
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : editingCategory?.image ? (
                          <div className="relative inline-block">
                            <img 
                              src={editingCategory.image} 
                              alt={editingCategory.name} 
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="mt-2">
                              <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()} 
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                Changer l'image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                            <div className="mt-2">
                              <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()} 
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                Sélectionner une image
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Catégorie active
                    </label>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploadingImage}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Enregistrement...' : (editingCategory ? 'Mettre à jour' : 'Créer')}
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
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Supprimer la catégorie
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette catégorie ?
                </p>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      await handleDeleteCategory(deleteConfirm);
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoriesManagement;
