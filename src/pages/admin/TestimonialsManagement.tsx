import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, MessageCircle, User, Quote, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonialsApi, Testimonial, CreateTestimonialData } from '../../services/testimonials.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';

function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<CreateTestimonialData>({
    name: '',
    title: '',
    quote: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 0
  });

  const { uploadSingle, uploading } = useImageUpload();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsApi.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadSingle(file, 'testimonials');
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
      if (editingTestimonial) {
        await testimonialsApi.updateTestimonial(editingTestimonial.id, formData);
      } else {
        await testimonialsApi.createTestimonial(formData);
      }
      fetchTestimonials();
      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      quote: testimonial.quote,
      imageUrl: testimonial.imageUrl,
      isActive: testimonial.isActive,
      sortOrder: testimonial.sortOrder
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      try {
        await testimonialsApi.deleteTestimonial(id);
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await testimonialsApi.toggleTestimonialStatus(id);
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      quote: '',
      imageUrl: '',
      isActive: true,
      sortOrder: 0
    });
    setEditingTestimonial(null);
    setShowForm(false);
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
            Gestion des Témoignages
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Collectez et gérez les retours d'expérience de vos bénéficiaires
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-600 font-medium">{testimonials.length} témoignages</span>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouveau Témoignage
          </motion.button>
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
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <MessageCircle size={24} className="text-purple-600" />
                  {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
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
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <User size={20} />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Nom complet *</label>
                      <input
                        type="text"
                        placeholder="ex: Marie Dubois"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Titre/Fonction *</label>
                      <input
                        type="text"
                        placeholder="ex: Bénéficiaire, Responsable de projet"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Témoignage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Quote size={20} />
                    Témoignage
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 ml-1">Citation/Témoignage *</label>
                    <div className="relative">
                      <Quote className="absolute left-4 top-4 text-purple-300" size={16} />
                      <textarea
                        placeholder="Partagez votre expérience avec notre organisation..."
                        value={formData.quote}
                        onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <div className="space-y-4">
                  <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                    <User size={14} />
                    Photo du témoin
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {uploading && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-purple-500 mt-2 flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        Upload en cours...
                      </motion.p>
                    )}
                    {formData.imageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4"
                      >
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-24 h-24 object-cover rounded-full mx-auto shadow-md border-4 border-white" 
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">Options d'affichage</h3>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Témoignage actif</span>
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Ordre d'affichage:</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all duration-300"
                  >
                    {editingTestimonial ? 'Modifier le témoignage' : 'Créer le témoignage'}
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

        {/* Témoignages Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow border border-gray-200 p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, btnIndex) => (
                        <div key={btnIndex} className="w-6 h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300"
            >
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun témoignage</h3>
              <p className="text-gray-500">Commencez par ajouter votre premier témoignage</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group"
                >
                  {/* Header compact avec photo et infos */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      {testimonial.imageUrl ? (
                        <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.name} 
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${
                        testimonial.isActive ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-gray-900 truncate">{testimonial.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  {/* Citation compacte */}
                  <div className="mb-4">
                    <blockquote className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  {/* Actions compactes */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      testimonial.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {testimonial.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleStatus(testimonial.id)} 
                        className={`p-1.5 rounded transition-all duration-200 ${
                          testimonial.isActive 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={testimonial.isActive ? 'Masquer' : 'Afficher'}
                      >
                        {testimonial.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(testimonial)} 
                        className="p-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(testimonial.id)} 
                        className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
    </motion.div>
  );
}

export default TestimonialsManagement;