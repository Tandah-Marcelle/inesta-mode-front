import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search, Globe, Mail, Phone, MapPin, Building2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnersApi, Partner, CreatePartnerData, PartnerFilterParams } from '../../services/partners.api';
import { useImageUpload } from '../../hooks/useImageUpload';
import { TableSkeleton } from '../../components/ui/Skeleton';

function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<CreatePartnerData>({
    name: '',
    description: '',
    logoUrl: '',
    partnershipType: 'humanitarian',
    isActive: true,
    isFeatured: false,
    sortOrder: 0
  });

  // Filter states
  const [filters, setFilters] = useState<PartnerFilterParams>({
    page: 1,
    limit: 10,
    sortBy: 'sortOrder',
    sortOrder: 'ASC'
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { uploadSingle, uploading } = useImageUpload();

  const partnershipTypes = [
    'humanitarian',
    'corporate',
    'ngo',
    'government',
    'international',
    'local',
    'educational',
    'healthcare',
    'technology'
  ];

  useEffect(() => {
    fetchPartners();
  }, [filters]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await partnersApi.getAllPartners(filters);
      setPartners(response.data);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const logoUrl = await uploadSingle(file, 'partners');
      if (logoUrl) {
        setFormData(prev => ({ ...prev, logoUrl }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erreur lors du téléchargement du logo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await partnersApi.updatePartner(editingPartner.id, formData);
      } else {
        await partnersApi.createPartner(formData);
      }
      fetchPartners();
      resetForm();
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description,
      logoUrl: partner.logoUrl || '',
      website: partner.website,
      contactEmail: partner.contactEmail,
      contactPhone: partner.contactPhone,
      contactPerson: partner.contactPerson,
      partnershipType: partner.partnershipType,
      partnershipStartDate: partner.partnershipStartDate,
      isActive: partner.isActive,
      isFeatured: partner.isFeatured,
      location: partner.location,
      achievements: partner.achievements,
      sortOrder: partner.sortOrder
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      try {
        await partnersApi.deletePartner(id);
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await partnersApi.togglePartnerStatus(id);
      fetchPartners();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      await partnersApi.togglePartnerFeatured(id);
      fetchPartners();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
      partnershipType: 'humanitarian',
      isActive: true,
      isFeatured: false,
      sortOrder: 0
    });
    setEditingPartner(null);
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
            Gestion des Partenaires
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Gérez vos partenaires et collaborations stratégiques
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-600 font-medium">{totalItems} partenaires</span>
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouveau Partenaire
          </motion.button>
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
                  placeholder="Rechercher par nom, description, localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Rechercher
                </motion.button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.partnershipType || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, partnershipType: e.target.value || undefined, page: 1 }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 min-w-48"
              >
                <option value="">Tous les types</option>
                {partnershipTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={filters.isActive?.toString() || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value ? e.target.value === 'true' : undefined, page: 1 }))}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 min-w-40"
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
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Building2 size={24} className="text-emerald-600" />
                  {editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
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
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">Informations générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Nom du partenaire *</label>
                      <input
                        type="text"
                        placeholder="ex: Organisation Mondiale de la Santé"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Type de partenariat *</label>
                      <select
                        value={formData.partnershipType}
                        onChange={(e) => setFormData(prev => ({ ...prev, partnershipType: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        {partnershipTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 ml-1">Description *</label>
                    <textarea
                      placeholder="Décrivez le partenaire et sa mission..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                        <Globe size={14} />
                        Site web
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.org"
                        value={formData.website || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                        <MapPin size={14} />
                        Localisation
                      </label>
                      <input
                        type="text"
                        placeholder="Ville, Pays"
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Users size={20} />
                    Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                        <Mail size={14} />
                        Email de contact
                      </label>
                      <input
                        type="email"
                        placeholder="contact@exemple.org"
                        value={formData.contactEmail || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                        <Phone size={14} />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="+33 1 23 45 67 89"
                        value={formData.contactPhone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Personne de contact</label>
                      <input
                        type="text"
                        placeholder="Nom du responsable"
                        value={formData.contactPerson || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations additionnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">Détails du partenariat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Date de début</label>
                      <input
                        type="date"
                        value={formData.partnershipStartDate || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, partnershipStartDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600 ml-1">Ordre d'affichage</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 ml-1">Réalisations</label>
                    <textarea
                      placeholder="Décrivez les principales réalisations de ce partenariat..."
                      value={formData.achievements || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 h-20 resize-none"
                    />
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-4">
                  <label className="text-sm text-gray-600 ml-1 flex items-center gap-1">
                    <Building2 size={14} />
                    Logo du partenaire
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {uploading && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-emerald-500 mt-2 flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Upload en cours...
                      </motion.p>
                    )}
                    {formData.logoUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4"
                      >
                        <img src={formData.logoUrl} alt="Preview" className="w-32 h-32 object-contain rounded-xl mx-auto shadow-md border" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Partenaire actif</span>
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
                      Partenaire vedette
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all duration-300"
                  >
                    {editingPartner ? 'Modifier le partenaire' : 'Créer le partenaire'}
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Logo</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Partenaire</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Type</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-28"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
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
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">🤝</div>
                        <p className="text-lg">Aucun partenaire trouvé</p>
                        <p className="text-sm mt-1">Commencez par ajouter votre premier partenaire</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  partners.map((partner, index) => (
                    <motion.tr 
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-emerald-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        {partner.logoUrl ? (
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name} 
                            className="w-16 h-16 object-contain rounded-xl shadow-sm bg-white p-2" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <Building2 size={24} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="line-clamp-1">{partner.name}</span>
                            {partner.isFeatured && (
                              <Star size={16} className="text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {partner.description}
                          </p>
                          {partner.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin size={14} className="text-emerald-500" />
                              <span className="truncate max-w-40">{partner.location}</span>
                            </div>
                          )}
                          {partner.partnershipStartDate && (
                            <div className="text-xs text-gray-400">
                              Depuis {new Date(partner.partnershipStartDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                          <Building2 size={14} className="mr-1" />
                          {partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2 text-sm">
                          {partner.website && (
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-blue-500 flex-shrink-0" />
                              <a 
                                href={partner.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-32 transition-colors duration-200"
                              >
                                Site web
                              </a>
                            </div>
                          )}
                          {partner.contactEmail && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-500 flex-shrink-0" />
                              <span className="truncate max-w-32 text-gray-700">{partner.contactEmail}</span>
                            </div>
                          )}
                          {partner.contactPhone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-500 flex-shrink-0" />
                              <span className="text-gray-700">{partner.contactPhone}</span>
                            </div>
                          )}
                          {partner.contactPerson && (
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-gray-500 flex-shrink-0" />
                              <span className="text-gray-700 truncate max-w-32">{partner.contactPerson}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          partner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            partner.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {partner.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFeatured(partner.id)} 
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              partner.isFeatured 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                            }`}
                            title="Basculer partenaire vedette"
                          >
                            <Star size={16} className={partner.isFeatured ? 'fill-current' : ''} />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleStatus(partner.id)} 
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              partner.isActive 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={partner.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {partner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(partner)} 
                            className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(partner.id)} 
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            
            <div className="ml-4 text-sm text-gray-500">
              {totalItems} partenaire{totalItems > 1 ? 's' : ''} au total
            </div>
          </motion.div>
        )}
    </motion.div>
  );
}

export default PartnersManagement;