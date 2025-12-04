import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  Tags,
  Eye,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  Handshake,
  Calendar,
  BarChart3,
  DollarSign,
  Activity,
  Clock,
  Star,
  FileText,
  Target,
  Globe,
  Mail,
  MessageSquare
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useCategories } from '../../contexts/CategoriesContext';
import { productsApi } from '../../services/products.api';
import { usersApi } from '../../services/users.api';
import { newsApi } from '../../services/news.api';
import { partnersApi } from '../../services/partners.api';
import { dashboardApi } from '../../services/dashboard.api';
import { messagesApi } from '../../services/messages.api';
import { testimonialsApi } from '../../services/testimonials.api';
import { DashboardSkeleton } from '../../components/ui/DashboardSkeleton';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

// Default colors for category chart
const categoryColors = ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#F97316', '#84CC16'];

// Helper function to get relative time
const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}j`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} mois`;
  return `${Math.floor(diffInSeconds / 31536000)} ans`;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [productsOverTime, setProductsOverTime] = useState<any[]>([]);
  const [contentStats, setContentStats] = useState({
    news: { total: 0, published: 0, events: 0 },
    partners: { total: 0, featured: 0, active: 0 },
    messages: { total: 0, unread: 0, resolved: 0 },
    testimonials: { total: 0, published: 0, featured: 0 }
  });
  
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Produits',
      value: 0,
      change: 8.1,
      trend: 'up',
      icon: Package,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700'
    },
    {
      title: 'Utilisateurs',
      value: 0,
      change: 15.2,
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-br from-red-500 to-red-700'
    },
    {
      title: 'Commandes',
      value: '---',
      change: 0,
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-orange-500 to-orange-700'
    },
    {
      title: 'Revenus',
      value: '---',
      change: 0,
      trend: 'up',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-500 to-green-700'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Add minimum loading time to show skeleton (1 second minimum)
        const startTime = Date.now();
        
        // Fetch all data in parallel
        const [productsResponse, usersResponse, newsResponse, partnersResponse, messagesResponse, testimonialsResponse, productsTimeData] = await Promise.all([
          productsApi.getProducts({ limit: 1 }),
          usersApi.getAllUsers({ limit: 1 }),
          newsApi.getAllNews({ limit: 1000 }),
          partnersApi.getAllPartners({ limit: 1000 }),
          messagesApi.getAllMessages({ limit: 1 }),
          testimonialsApi.getAllTestimonials(),
          dashboardApi.getProductsOverTime().catch(() => [])
        ]);
        
        // Ensure minimum loading time of 1 second to show skeleton
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000; // 1 second
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        const productsCount = productsResponse.total;
        const usersCount = usersResponse.total;

        // Process news statistics
        const newsStats = {
          total: newsResponse.total,
          published: newsResponse.data.filter(n => n.isPublished).length,
          events: newsResponse.data.filter(n => n.isEvent).length
        };

        // Process partners statistics  
        const partnersStats = {
          total: partnersResponse.total,
          featured: partnersResponse.data.filter(p => p.isFeatured).length,
          active: partnersResponse.data.filter(p => p.status === 'active').length
        };
        
        // Process messages statistics
        const messagesStats = {
          total: messagesResponse.total,
          unread: messagesResponse.data.filter(m => m.status === 'unread').length,
          resolved: messagesResponse.data.filter(m => m.status === 'replied').length
        };

        // Process testimonials statistics
        const testimonialsStats = {
          total: testimonialsResponse.length,
          published: testimonialsResponse.filter(t => t.isActive).length,
          featured: testimonialsResponse.filter(t => t.isActive && t.sortOrder <= 3).length
        };
        
        // Process category distribution from products
        const productsData = productsResponse.products || productsResponse.data || [];
        const categoryStats = categories.reduce((acc, category) => {
          const categoryProducts = productsData.filter(p => p.categoryId === category.id) || [];
          
          if (categoryProducts.length > 0) {
            acc.push({
              name: category.name,
              value: categoryProducts.length,
              color: categoryColors[acc.length % categoryColors.length]
            });
          }
          return acc;
        }, [] as any[]);
        
        // Update states
        setCategoryData(categoryStats);
        
        // Set products over time data or generate mock data if empty
        if (productsTimeData.length > 0) {
          setProductsOverTime(productsTimeData);
        } else {
          // Generate mock data with current months if API fails
          const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
          const now = new Date();
          const mockData = [];
          
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            // Count actual products created in this month
            const monthProducts = productsData.filter(product => {
              const productDate = new Date(product.createdAt);
              return productDate.getFullYear() === date.getFullYear() && 
                     productDate.getMonth() === date.getMonth();
            });
            
            mockData.push({
              month: monthNames[date.getMonth()],
              count: monthProducts.length
            });
          }
          
          setProductsOverTime(mockData);
        }
        
        // Update main stats with real data
        setStats(prev => prev.map(stat => {
          if (stat.title === 'Produits') {
            return { ...stat, value: productsCount };
          }
          if (stat.title === 'Utilisateurs') {
            return { ...stat, value: usersCount };
          }
          // Keep Commandes and Revenus as '---' since no API is connected yet
          return stat;
        }));

        setContentStats({
          news: newsStats,
          partners: partnersStats,
          messages: messagesStats,
          testimonials: testimonialsStats
        });

        // Process recent activities from real data
        const activities = [];
        
        // Combine all items with their creation dates for proper sorting
        const allItems = [];

        // Add messages
        if (messagesResponse.data) {
          messagesResponse.data.forEach(message => {
            allItems.push({
              id: `message-${message.id}`,
              type: 'message',
              message: `Nouveau message de ${message.firstName} ${message.lastName}`,
              createdAt: message.createdAt,
              icon: MessageSquare,
              color: 'text-blue-500'
            });
          });
        }

        // Add users (recent registrations)
        if (usersResponse.data) {
          usersResponse.data.forEach(user => {
            allItems.push({
              id: `user-${user.id}`,
              type: 'user', 
              message: `Nouvel utilisateur: ${user.firstName} ${user.lastName}`,
              createdAt: user.createdAt,
              icon: Users,
              color: 'text-green-500'
            });
          });
        }

        // Add products
        if (productsData.length > 0) {
          productsData.forEach(product => {
            allItems.push({
              id: `product-${product.id}`,
              type: 'product',
              message: `Nouveau produit: ${product.name}`,
              createdAt: product.createdAt,
              icon: Package,
              color: 'text-purple-500'
            });
          });
        }

        // Add news
        if (newsResponse.data) {
          newsResponse.data.forEach(article => {
            allItems.push({
              id: `news-${article.id}`,
              type: 'news',
              message: `Article publié: ${article.title}`,
              createdAt: article.createdAt,
              icon: Newspaper,
              color: 'text-indigo-500'
            });
          });
        }

        // Add partners
        if (partnersResponse.data) {
          partnersResponse.data.forEach(partner => {
            allItems.push({
              id: `partner-${partner.id}`,
              type: 'partner',
              message: `Nouveau partenaire: ${partner.name}`,
              createdAt: partner.createdAt,
              icon: Handshake,
              color: 'text-orange-500'
            });
          });
        }

        // Add testimonials
        if (testimonialsResponse.length > 0) {
          testimonialsResponse.forEach(testimonial => {
            allItems.push({
              id: `testimonial-${testimonial.id}`,
              type: 'testimonial',
              message: `Nouveau témoignage de ${testimonial.name}`,
              createdAt: testimonial.createdAt,
              icon: Heart,
              color: 'text-pink-500'
            });
          });
        }

        // Sort by creation date (most recent first) and take top 4
        const sortedActivities = allItems
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4)
          .map(item => ({
            ...item,
            time: getRelativeTime(item.createdAt)
          }));

        setRecentActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchDashboardData();
    }
  }, [categories]);


  // Show skeleton loading while data is being fetched
  if (loading || categoriesLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl border border-primary-100"
      >
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h1>
          <p className="mt-2 text-primary-600/80 text-lg">
            Aperçu complet de votre boutique Inesta Mode
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Système en ligne</span>
            </div>
            <span className="text-primary-300">•</span>
            <span className="text-sm text-primary-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <div className="mt-6 sm:mt-0">
          <button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <BarChart3 className="w-4 h-4" />
            Rapports
          </button>
        </div>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${stat.color} rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform cursor-pointer group relative overflow-hidden`}
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white/90 text-sm font-medium mb-3">{stat.title}</p>
                  <p className="text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {loading ? (
                      <div className="animate-pulse bg-white/20 h-10 w-24 rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12 transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Management Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News & Events Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -3 }}
          className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Gestion de Contenu</h3>
                  <p className="text-sm text-gray-500">News & Événements</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Articles</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {loading ? '...' : contentStats.news.total}
                  </p>
                  <p className="text-xs text-blue-600/80 font-medium">Total Articles</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {loading ? '...' : contentStats.news.published}
                  </p>
                  <p className="text-xs text-green-600/80 font-medium">Publiés</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    {loading ? '...' : contentStats.news.events}
                  </p>
                  <p className="text-xs text-purple-600/80 font-medium">Événements</p>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Partners Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -3 }}
          className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Partenariats</h3>
                  <p className="text-sm text-gray-500">Sponsors & Collaborateurs</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Réseau</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600 mb-1">
                    {loading ? '...' : contentStats.partners.total}
                  </p>
                  <p className="text-xs text-orange-600/80 font-medium">Partenaires</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                  <p className="text-2xl font-bold text-yellow-600 mb-1">
                    {loading ? '...' : contentStats.partners.featured}
                  </p>
                  <p className="text-xs text-yellow-600/80 font-medium">En vedette</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {loading ? '...' : contentStats.partners.active}
                  </p>
                  <p className="text-xs text-green-600/80 font-medium">Actifs</p>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-2">Catégories</p>
              <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                {categoriesLoading ? '...' : categories.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12 transform">
              <Tags className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-2">Messages</p>
              <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                {loading ? '...' : contentStats.messages.total}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12 transform">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-2">Témoignages</p>
              <p className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                {loading ? '...' : contentStats.testimonials.total}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12 transform">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Évolution des Produits</h3>
              <p className="text-gray-500 text-sm mt-1">Nombre de produits ajoutés par mois</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Produits</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productsOverTime}>
                <defs>
                  <linearGradient id="colorProduits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProduits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Activité Récente</h3>
              <p className="text-gray-500 text-sm mt-1">Dernières actions système</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 hover:bg-primary-50 px-3 py-1 rounded-lg transition-all duration-200">
              Voir tout
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={`p-2.5 rounded-lg bg-gray-100 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">il y a {activity.time}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-xs text-gray-500 capitalize">{activity.type}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Aucune activité récente</p>
                <p className="text-xs mt-1">Les activités apparaîtront ici</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Single Row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Actions Rapides</h3>
          <p className="text-gray-500 text-sm mt-1">Raccourcis d'administration</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Gérer Produits', icon: Package, color: 'from-purple-500 to-purple-700', path: '/admin/products' },
            { title: 'Gérer News', icon: Newspaper, color: 'from-blue-500 to-blue-700', path: '/admin/news' },
            { title: 'Gérer Partenaires', icon: Handshake, color: 'from-orange-500 to-orange-700', path: '/admin/partners' },
            { title: 'Voir Messages', icon: MessageSquare, color: 'from-green-500 to-green-700', path: '/admin/messages' },
            { title: 'Gérer Utilisateurs', icon: Users, color: 'from-red-500 to-red-700', path: '/admin/users' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`p-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-3 group`}
              >
                <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-medium text-sm block">{action.title}</span>
                  <ArrowUpRight className="w-4 h-4 mx-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
