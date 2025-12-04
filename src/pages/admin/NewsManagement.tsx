import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar, MapPin, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsApi, NewsItem, CreateNewsData, NewsFilterParams } from '../../services/news.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import { TableSkeleton } from '../../components/ui/Skeleton';

function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<CreateNewsData>({
    title: '',
    content: '',
    imageUrl: '',
    category: 'news',
    isActive: true,
    isFeatured: false
  });

  // Filter states
  const [filters, setFilters] = useState<NewsFilterParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { uploadSingle, uploading } = useImageUpload();

  useEffect(() => {
    fetchNews();
  }, [filters]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsApi.getAllNews(filters);
      setNews(response.data);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadSingle(file, 'news');
      if (imageUrl) {
        setFormData(prev => ({ ...prev, imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare form data with proper date handling
      const submitData = { ...formData };
      
      // Handle eventDate validation
      if (submitData.eventDate) {
        const date = new Date(submitData.eventDate);
        if (isNaN(date.getTime())) {
          // If invalid date, remove it or set to null
          delete submitData.eventDate;
        } else {
          // Convert to ISO string for backend
          submitData.eventDate = date.toISOString();
        }
      }
      
      // If category is not event, remove event-specific fields
      if (submitData.category !== 'event') {
        delete submitData.eventDate;
        delete submitData.eventLocation;
      }
      
      if (editingNews) {
        await newsApi.updateNews(editingNews.id, submitData);
      } else {
        await newsApi.createNews(submitData);
      }
      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    
    // Format eventDate for datetime-local input
    let eventDateFormatted = '';
    if (newsItem.eventDate) {
      try {
        const date = new Date(newsItem.eventDate);
        if (!isNaN(date.getTime())) {
          // Format as YYYY-MM-DDTHH:MM for datetime-local input
          eventDateFormatted = date.toISOString().slice(0, 16);
        }
      } catch (error) {
        console.warn('Invalid event date:', newsItem.eventDate);
      }
    }
    
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl || '',
      category: newsItem.category,
      eventDate: eventDateFormatted,
      eventLocation: newsItem.eventLocation,
      isActive: newsItem.isActive,
      isFeatured: newsItem.isFeatured,
      tags: newsItem.tags,
      excerpt: newsItem.excerpt
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        await newsApi.deleteNews(id);
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await newsApi.toggleNewsStatus(id);
      fetchNews();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await newsApi.toggleNewsFeatured(id);
      fetchNews();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      category: 'news',
      eventDate: undefined,
      eventLocation: undefined,
      isActive: true,
      isFeatured: false,
      tags: undefined,
      excerpt: undefined
    });
    setEditingNews(null);
    setShowForm(false);
  };

  const totalPages = Math.ceil(totalItems / (filters.limit || 10));

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
            Gestion des Actualités
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Gérez le contenu et les événements de votre organisation
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-600 font-medium">{totalItems} articles</span>
            </div>
            <span className="text-primary-300">•</span>
            <span className="text-sm text-primary-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div className="mt-6 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle Actualité
          </motion.button>
        </div>
      </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow border border-gray-200"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par titre, contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Rechercher
                </motion.button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as 'news' | 'event' || undefined, page: 1 }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-48"
              >
                <option value="">Toutes catégories</option>
                <option value="news">Actualités</option>
                <option value="event">Événements</option>
              </select>
              
              <select
                value={filters.isActive?.toString() || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value ? e.target.value === 'true' : undefined, page: 1 }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-40"
              >
                <option value="">Tous statuts</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {editingNews ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <Plus className="rotate-45" size={20} />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 ml-1">Titre *</label>
                    <input
                      type="text"
                      placeholder="Titre de l'actualité"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 ml-1">Type *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'news' | 'event' }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="news">Actualité</option>
                      <option value="event">Événement</option>
                    </select>
                  </div>
                </div>
                
                <AnimatePresence>
                  {formData.category === 'event' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                          <Calendar size={14} />
                          Date de l'événement
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.eventDate || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!value || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
                              setFormData(prev => ({ ...prev, eventDate: value || undefined }));
                            }
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                          <MapPin size={14} />
                          Lieu de l'événement
                        </label>
                        <input
                          type="text"
                          placeholder="Adresse ou lieu de l'événement"
                          value={formData.eventLocation || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 ml-1">Contenu *</label>
                  <textarea
                    placeholder="Rédigez le contenu de votre actualité..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 ml-1">Extrait</label>
                  <textarea
                    placeholder="Résumé court pour l'aperçu (optionnel)"
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 ml-1">Tags</label>
                  <input
                    type="text"
                    placeholder="séparés par des virgules (ex: humanitaire, urgence, santé)"
                    value={formData.tags ? formData.tags.join(', ') : ''}
                    onChange={(e) => {
                      const tagsString = e.target.value;
                      const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined;
                      setFormData(prev => ({ ...prev, tags: tagsArray }));
                    }}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                    <ImageIcon size={14} />
                    Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-blue-500 mt-2 flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Upload en cours...
                      </motion.p>
                    )}
                    {formData.imageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4"
                      >
                        <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto shadow-md" />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Publier immédiatement</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <Star size={14} />
                      Mettre en vedette
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all duration-300"
                  >
                    {editingNews ? 'Modifier l\'actualité' : 'Créer l\'actualité'}
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={resetForm} 
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                  >
                    Annuler
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Titre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="flex gap-1 mt-2">
                            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {[...Array(4)].map((_, btnIndex) => (
                            <div key={btnIndex} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : news.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">📰</div>
                        <p className="text-lg">Aucune actualité trouvée</p>
                        <p className="text-sm mt-1">Commencez par créer votre première actualité</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  news.map((newsItem, index) => (
                    <motion.tr 
                      key={newsItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        {newsItem.imageUrl ? (
                          <img 
                            src={newsItem.imageUrl} 
                            alt={newsItem.title} 
                            className="w-14 h-14 object-cover rounded-xl shadow-sm" 
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-gray-900 flex items-center gap-2">
                            <span className="line-clamp-1">{newsItem.title}</span>
                            {newsItem.isFeatured && (
                              <Star size={16} className="text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {newsItem.excerpt || newsItem.content}
                          </p>
                          {newsItem.tags && newsItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {newsItem.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {newsItem.tags.length > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  +{newsItem.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          newsItem.category === 'event' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {newsItem.category === 'event' ? (
                            <>
                              <Calendar size={14} className="mr-1" />
                              Événement
                            </>
                          ) : (
                            <>
                              <ImageIcon size={14} className="mr-1" />
                              Actualité
                            </>
                          )}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 space-y-1">
                          {newsItem.category === 'event' && newsItem.eventDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-purple-500" />
                              <span>{new Date(newsItem.eventDate).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{new Date(newsItem.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {newsItem.category === 'event' && newsItem.eventLocation && (
                            <div className="flex items-center gap-1 text-xs">
                              <MapPin size={12} className="text-purple-500" />
                              <span className="truncate max-w-32">{newsItem.eventLocation}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          newsItem.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            newsItem.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {newsItem.isActive ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFeatured(newsItem.id)} 
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              newsItem.isFeatured 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                            }`}
                            title="Basculer en vedette"
                          >
                            <Star size={16} className={newsItem.isFeatured ? 'fill-current' : ''} />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleStatus(newsItem.id)} 
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              newsItem.isActive 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={newsItem.isActive ? 'Mettre en brouillon' : 'Publier'}
                          >
                            {newsItem.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(newsItem)} 
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(newsItem.id)} 
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-2"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters(prev => ({ ...prev, page }))}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    filters.page === page 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            
            <div className="ml-4 text-sm text-gray-500">
              {totalItems} résultat{totalItems > 1 ? 's' : ''} au total
            </div>
          </motion.div>
        )}
    </motion.div>
  );
}

export default NewsManagement;