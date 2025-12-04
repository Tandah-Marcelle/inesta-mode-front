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
  Package,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Image as ImageIcon,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Tags,
  Calendar,
  Activity
} from 'lucide-react';
import { productsApi, Product, CreateProductData, UpdateProductData, PaginatedProductsResponse, ProductsQueryParams } from '../../services/products.api';
import { categoriesApi } from '../../services/categories.api';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Category } from '../../types';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency: string;
  stockQuantity: number;
  lowStockThreshold: number;
  sku?: string;
  categoryId: string;
  status: 'draft' | 'published' | 'out_of_stock' | 'discontinued';
  isFeatured: boolean;
  isNew: boolean;
  tags: string;
  sizes: string;
  colors: string;
  materials: string;
  weight?: number;
  barcode?: string;
  careInstructions?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SortState {
  field: string;
  direction: 'ASC' | 'DESC';
}

function ProductsManagement() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'out_of_stock' | 'discontinued'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sort, setSort] = useState<SortState>({
    field: 'createdAt',
    direction: 'DESC'
  });
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    comparePrice: undefined,
    costPrice: undefined,
    currency: 'EUR',
    stockQuantity: 0,
    lowStockThreshold: 5,
    sku: '',
    categoryId: '',
    status: 'draft',
    isFeatured: false,
    isNew: false,
    tags: '',
    sizes: '',
    colors: '',
    materials: '',
    weight: undefined,
    barcode: '',
    careInstructions: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading: uploadingImages, uploadMultiple } = useImageUpload();

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('ProductsManagement: Fetching data...', { 
        user: user?.email, 
        role: user?.role, 
        token: localStorage.getItem('auth_token') ? 'present' : 'missing' 
      });
      const queryParams: ProductsQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        sortBy: sort.field as any,
        sortOrder: sort.direction
      };

      const [productsResponse, categoriesResponse] = await Promise.all([
        productsApi.getProducts(queryParams),
        categoriesApi.getAllCategories()
      ]);
      
      setProducts(productsResponse.products);
      setPagination(prev => ({
        ...prev,
        total: productsResponse.total,
        totalPages: productsResponse.totalPages
      }));
      setCategories(categoriesResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger refetch when filters, pagination, or sort changes (but not when modals are open)
  useEffect(() => {
    if (!showCreateModal && !editingProduct) {
      fetchData();
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, categoryFilter, sort, showCreateModal, editingProduct]);

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when sorting
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 })); // Reset to first page
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter(file => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid image type`);
        return false;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId: string) => {
    if (selectedImages.length === 0) return [];
    
    try {
      const imageUrls = await uploadMultiple(selectedImages, 'products');
      setSelectedImages([]);
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
      return [];
    }
  };

  const deleteProductImage = async (productId: string, imageId: string) => {
    try {
      await productsApi.deleteImage(productId, imageId);
      await fetchData(); // Refresh to show updated images
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && (!editingProduct || formData.slug === generateSlug(editingProduct.name))) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }));
    }
  }, [formData.name, editingProduct]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData: CreateProductData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        comparePrice: formData.comparePrice,
        costPrice: formData.costPrice,
        currency: formData.currency,
        stockQuantity: formData.stockQuantity,
        lowStockThreshold: formData.lowStockThreshold,
        sku: formData.sku,
        categoryId: formData.categoryId,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        materials: formData.materials ? formData.materials.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        weight: formData.weight,
        barcode: formData.barcode,
        careInstructions: formData.careInstructions,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(s => s.trim()).filter(Boolean) : undefined
      };

      // Upload images first if any were selected
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages('');
      }
      
      // Add image URLs to product data
      const productWithImages = {
        ...productData,
        imageUrls
      };
      
      console.log('Creating product with image URLs:', {
        productName: productData.name,
        imageUrls,
        totalImages: imageUrls.length
      });
      
      const newProduct = await productsApi.createProduct(productWithImages);
      console.log('Product created successfully:', newProduct.id);
      await fetchData();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSubmitting(true);

    try {
      const updateData: UpdateProductData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        comparePrice: formData.comparePrice,
        costPrice: formData.costPrice,
        currency: formData.currency,
        stockQuantity: formData.stockQuantity,
        lowStockThreshold: formData.lowStockThreshold,
        sku: formData.sku,
        categoryId: formData.categoryId,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        materials: formData.materials ? formData.materials.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        weight: formData.weight,
        barcode: formData.barcode,
        careInstructions: formData.careInstructions,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(s => s.trim()).filter(Boolean) : undefined
      };

      // Upload new images if any were selected
      let newImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        newImageUrls = await uploadImages(editingProduct.id);
      }
      
      // Add new image URLs to existing ones
      const updatedData = {
        ...updateData,
        ...(newImageUrls.length > 0 && { newImageUrls })
      };
      
      await productsApi.updateProduct(editingProduct.id, updatedData);
      await fetchData();
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productsApi.deleteProduct(productId);
      setDeleteConfirm(null);
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      comparePrice: undefined,
      costPrice: undefined,
      currency: 'EUR',
      stockQuantity: 0,
      lowStockThreshold: 5,
      sku: '',
      categoryId: '',
      status: 'draft',
      isFeatured: false,
      isNew: false,
      tags: '',
      sizes: '',
      colors: '',
      materials: '',
      weight: undefined,
      barcode: '',
      careInstructions: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
    setSelectedImages([]);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price,
      comparePrice: product.comparePrice,
      costPrice: product.costPrice,
      currency: product.currency,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      sku: product.sku || '',
      categoryId: product.categoryId,
      status: product.status,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      tags: product.tags?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      materials: product.materials?.join(', ') || '',
      weight: product.weight,
      barcode: product.barcode || '',
      careInstructions: product.careInstructions || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      metaKeywords: product.metaKeywords?.join(', ') || ''
    });
    setSelectedImages([]);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'N/A';
  };

  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Brouillon' },
      published: { color: 'bg-green-100 text-green-800', label: 'Publié' },
      out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Rupture de stock' },
      discontinued: { color: 'bg-gray-100 text-gray-800', label: 'Discontinué' }
    };
    
    const config = statusConfig[status];
    if (!config) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <div className={`w-2 h-2 ${
          status === 'published' ? 'bg-green-400' : 
          status === 'draft' ? 'bg-yellow-400' : 
          status === 'out_of_stock' ? 'bg-red-400' : 
          'bg-gray-400'
        } rounded-full mr-1`}></div>
        {config.label}
      </span>
    );
  };

  const getSortIcon = (field: string) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sort.direction === 'ASC' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl" />
        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestion des Produits
                </h1>
                <p className="text-gray-600 text-lg mt-2 flex items-center gap-2">
                  <span>Gérez votre catalogue de mode</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-700 text-sm font-medium">{products.length} produits</span>
                  </div>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {hasPermission('products', 'create') && (
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Nouveau Produit
                </motion.button>
              )}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 shadow-md"
              >
                <DollarSign className="w-6 h-6 text-green-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6"
      >
        <div className="space-y-6">
          {/* Search and Primary Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300"
            >
              <option value="all">Tous statuts</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="out_of_stock">Rupture</option>
              <option value="discontinued">Discontinué</option>
            </motion.select>
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </motion.select>
          </div>

          {/* Advanced Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.select
                whileHover={{ scale: 1.02 }}
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm"
              >
                <option value={10}>10 par page</option>
                <option value={25}>25 par page</option>
                <option value={50}>50 par page</option>
                <option value={100}>100 par page</option>
              </motion.select>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 text-sm font-medium"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                Plus de filtres
              </motion.button>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{pagination.total} produits</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Products Table */}
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
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors duration-200"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>Produit</span>
                    <div className="text-gray-400">{getSortIcon('name')}</div>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-blue-600" />
                    <span>Catégorie</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors duration-200"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Prix</span>
                    <div className="text-gray-400">{getSortIcon('price')}</div>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors duration-200"
                  onClick={() => handleSort('stockQuantity')}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span>Stock</span>
                    <div className="text-gray-400">{getSortIcon('stockQuantity')}</div>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Statut</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-white/50 transition-colors duration-200"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Créé le</span>
                    <div className="text-gray-400">{getSortIcon('createdAt')}</div>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {loading ? (
                // Enhanced Skeleton loading rows
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse bg-white/50">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mr-4"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded-lg w-32 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-lg w-12"></div>
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
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                    whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.02)" }}
                    className="bg-white/60 hover:bg-purple-50/50 border-b border-gray-200/30 transition-all duration-300 group cursor-pointer"
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="relative w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300"
                        >
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.images[0].alt || product.name}
                              className="w-14 h-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <ImageIcon className="w-7 h-7 text-gray-400" />
                          )}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                              {product.name}
                            </div>
                            {product.isFeatured && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                              >
                                <Star className="w-3 h-3 text-white" fill="currentColor" />
                                <span className="text-xs font-bold text-white">Featured</span>
                              </motion.div>
                            )}
                            {product.isNew && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full"
                              >
                                Nouveau
                              </motion.span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>SKU:</span>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                              {product.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.comparePrice && (
                        <div className="text-sm text-red-600 line-through">
                          {formatPrice(product.comparePrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stockQuantity} unités
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left group">
                        <button
                          className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => openEditModal(product)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-3" />
                              Modifier
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                        ? 'Essayez de modifier vos filtres' 
                        : 'Commencez par créer votre premier produit'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                      >
                        Créer un produit
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Enhanced Pagination Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Affichage {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} produits</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </motion.button>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <span className="text-sm font-semibold text-purple-700">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingProduct) && (
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                  </h2>
                </div>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Ex: Robe élégante..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                      <input type="text" required value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea required rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€)</label>
                      <input type="number" step="0.01" min="0" required value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input type="number" min="0" required value={formData.stockQuantity} onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                      <select required value={formData.categoryId} onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                      <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                        <option value="out_of_stock">Rupture de stock</option>
                        <option value="discontinued">Discontinué</option>
                      </select>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleImageSelect(e.target.files)} className="hidden" />
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary">
                              Sélectionner des images
                            </button>
                          </div>
                        </div>
                        {selectedImages.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {selectedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-20 object-cover rounded" />
                                <button type="button" onClick={() => removeSelectedImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                      <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Produit vedette</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="new" checked={formData.isNew} onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                      <label htmlFor="new" className="ml-2 text-sm text-gray-700">Nouveau produit</label>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Enregistrement...' : (editingProduct ? 'Mettre à jour' : 'Créer')}
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
                  Supprimer le produit
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce produit ?
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
                      await handleDeleteProduct(deleteConfirm);
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

export default ProductsManagement;
