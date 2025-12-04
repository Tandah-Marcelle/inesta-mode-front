import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Eye, 
  Reply, 
  Trash2, 
  Filter, 
  Search, 
  Download, 
  MoreVertical,
  Calendar,
  User,
  Building2,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Star,
  Archive,
  RefreshCw,
  Inbox,
  Send,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { messagesApi, ContactMessage, MessagesFilterParams, MessageStats } from '../../services/messages.api';
import { TableSkeleton } from '../../components/ui/Skeleton';

function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [filters, setFilters] = useState<MessagesFilterParams>({
    page: 1,
    limit: 15,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [filters]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        setFilters(prev => ({ ...prev, search: searchTerm || undefined, page: 1 }));
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filters.search]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesApi.getAllMessages(filters);
      setMessages(response.data);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await messagesApi.getMessageStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (message.status === 'unread') {
      try {
        await messagesApi.markAsRead(message.id);
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleStatusUpdate = async (messageId: string, status: 'unread' | 'read' | 'replied') => {
    try {
      await messagesApi.updateMessage(messageId, { status });
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handlePriorityUpdate = async (messageId: string, priority: 'low' | 'medium' | 'high' | 'urgent') => {
    try {
      await messagesApi.setPriority(messageId, priority);
      fetchMessages();
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await messagesApi.deleteMessage(messageId);
        fetchMessages();
        fetchStats();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return;

    try {
      setSubmitting(true);
      switch (action) {
        case 'mark-read':
          await messagesApi.bulkUpdateMessages(selectedMessages, { status: 'read' });
          break;
        case 'mark-unread':
          await messagesApi.bulkUpdateMessages(selectedMessages, { status: 'unread' });
          break;
        case 'delete':
          if (window.confirm(`Supprimer ${selectedMessages.length} messages ?`)) {
            await Promise.all(selectedMessages.map(id => messagesApi.deleteMessage(id)));
          }
          break;
      }
      setSelectedMessages([]);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error with bulk action:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await messagesApi.exportMessages(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `messages-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting messages:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalPages = Math.ceil(totalItems / (filters.limit || 15));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-8 font-admin"
    >
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Gestion des Messages
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Gérez les messages de contact reçus via le site web
          </p>
          {stats && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-600 font-medium">{stats.unread} non lus</span>
              </div>
              <span className="text-primary-300">•</span>
              <span className="text-sm text-primary-500">{stats.total} messages total</span>
              <span className="text-primary-300">•</span>
              <span className="text-sm text-primary-500">{stats.todayCount} aujourd'hui</span>
            </div>
          )}
        </div>
        <div className="mt-6 sm:mt-0 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
          >
            <Download size={18} />
            Exporter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchMessages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow transition-all duration-300 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Actualiser
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Inbox className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Non lus</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Répondus</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Urgents</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-2xl shadow border border-gray-200"
      >
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined, page: 1 }))}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-40"
            >
              <option value="">Tous statuts</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
              <option value="replied">Répondus</option>
            </select>
            
            <select
              value={filters.priority || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value || undefined, page: 1 }))}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-36"
            >
              <option value="">Toutes priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">
                {selectedMessages.length} message(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('mark-read')}
                  disabled={submitting}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Marquer comme lu
                </button>
                <button
                  onClick={() => handleBulkAction('mark-unread')}
                  disabled={submitting}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  Marquer comme non lu
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={submitting}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Messages List */}
      <div className="flex gap-6">
        {/* Messages List Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white rounded-2xl shadow border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Messages ({totalItems})</h3>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                        <div className="h-3 bg-gray-200 rounded w-40 mt-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun message</h3>
                  <p className="text-gray-600">Aucun message trouvé avec les filtres actuels</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    } ${message.status === 'unread' ? 'font-semibold' : ''}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedMessages(prev => [...prev, message.id]);
                          } else {
                            setSelectedMessages(prev => prev.filter(id => id !== message.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {message.firstName} {message.lastName}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(message.status)}`}>
                              {message.status === 'unread' ? 'Non lu' : 
                               message.status === 'read' ? 'Lu' : 'Répondu'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                              {message.priority === 'low' ? 'Faible' :
                               message.priority === 'medium' ? 'Moyenne' :
                               message.priority === 'high' ? 'Élevée' : 'Urgente'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 font-medium mb-1 truncate">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.email}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Affichage de {((filters.page || 1) - 1) * (filters.limit || 15) + 1} à{' '}
                  {Math.min((filters.page || 1) * (filters.limit || 15), totalItems)} sur {totalItems}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">
                    {filters.page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, (prev.page || 1) + 1) }))}
                    disabled={filters.page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Message Detail Panel */}
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-96 bg-white rounded-2xl shadow border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Détails du message</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedMessage.priority}
                    onChange={(e) => handlePriorityUpdate(selectedMessage.id, e.target.value as any)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                  )}
                  {selectedMessage.company && (
                    <p className="text-sm text-gray-600">{selectedMessage.company}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</label>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
                  <p className="text-sm text-gray-600">{formatDate(selectedMessage.createdAt)}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusUpdate(selectedMessage.id, e.target.value as any)}
                    className="mt-1 block w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unread">Non lu</option>
                    <option value="read">Lu</option>
                    <option value="replied">Répondu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`, '_blank')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Reply size={16} />
                  Répondre
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default MessagesManagement;