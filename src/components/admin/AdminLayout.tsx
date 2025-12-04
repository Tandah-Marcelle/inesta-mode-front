import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Newspaper,
  Handshake,
  FileText,
  Store,
  TrendingUp,
  Mail,
  Shield,
  Activity,
  Home,
  Calendar,
  Heart,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { messagesApi } from '../../services/messages.api';
import inestaLogo from '../../assets/images/InestaLogo/logo.jpg';
import SessionExpiredModal from './SessionExpiredModal';

// Main navigation sections function with dynamic badges
const getNavigationSections = (unreadCount: number) => [
  {
    title: 'TABLEAU DE BORD',
    items: [
      {
        name: 'Aperçu Général',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        resource: 'dashboard',
        action: 'view',
        gradient: 'from-blue-500 to-blue-700',
        description: 'Vue d\'ensemble de la boutique'
      }
    ]
  },
  {
    title: 'E-COMMERCE',
    items: [
      {
        name: 'Produits',
        href: '/admin/products',
        icon: Package,
        resource: 'products',
        action: 'view',
        gradient: 'from-purple-500 to-purple-700',
        description: 'Gérer votre catalogue'
      },
      {
        name: 'Catégories',
        href: '/admin/categories',
        icon: Tags,
        resource: 'categories',
        action: 'view',
        gradient: 'from-emerald-500 to-emerald-700',
        description: 'Organiser vos produits'
      },
      {
        name: 'Commandes',
        href: '/admin/orders',
        icon: ShoppingCart,
        resource: 'orders',
        action: 'view',
        gradient: 'from-orange-500 to-orange-700',
        description: 'Suivre les ventes',
        unavailable: true
      }
    ]
  },
  {
    title: 'GESTION DE CONTENU',
    items: [
      {
        name: 'News & Événements',
        href: '/admin/news',
        icon: Newspaper,
        resource: 'settings',
        action: 'view',
        gradient: 'from-indigo-500 to-indigo-700',
        description: 'Actualités et événements'
      },
      {
        name: 'Partenaires',
        href: '/admin/partners',
        icon: Handshake,
        resource: 'settings',
        action: 'view',
        gradient: 'from-rose-500 to-rose-700',
        description: 'Partenariats humanitaires'
      },
      {
        name: 'Témoignages',
        href: '/admin/testimonials',
        icon: Heart,
        resource: 'settings',
        action: 'view',
        gradient: 'from-pink-500 to-pink-700',
        description: 'Avis clients'
      }
    ]
  },
  {
    title: 'UTILISATEURS',
    items: [
      {
        name: 'Clients',
        href: '/admin/users',
        icon: Users,
        resource: 'users',
        action: 'view',
        gradient: 'from-cyan-500 to-cyan-700',
        description: 'Gérer les utilisateurs'
      },
      {
        name: 'Messages',
        href: '/admin/messages',
        icon: Mail,
        resource: 'orders',
        action: 'view',
        gradient: 'from-yellow-500 to-yellow-700',
        description: 'Formulaires de contact',
        badge: unreadCount > 0 ? unreadCount.toString() : undefined
      }
    ]
  },
  {
    title: 'ANALYSES',
    items: [
      {
        name: 'Statistiques',
        href: '/admin/analytics',
        icon: TrendingUp,
        resource: 'settings',
        action: 'view',
        gradient: 'from-green-500 to-green-700',
        description: 'Performance et métriques',
        unavailable: true
      },
      {
        name: 'Activité',
        href: '/admin/activity',
        icon: Activity,
        resource: 'settings',
        action: 'view',
        gradient: 'from-red-500 to-red-700',
        description: 'Journal d\'activité',
        unavailable: true
      }
    ]
  },
  {
    title: 'SYSTÈME',
    items: [
      {
        name: 'Paramètres',
        href: '/admin/settings',
        icon: Settings,
        resource: 'settings',
        action: 'view',
        gradient: 'from-gray-500 to-gray-700',
        description: 'Configuration système',
        unavailable: true
      }
    ]
  }
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  
  // Initialize expanded sections when component mounts
  useEffect(() => {
    const initialSections = getNavigationSections(0).reduce((acc, section) => ({ ...acc, [section.title]: true }), {});
    setExpandedSections(initialSections);
  }, []);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { user, logout, isAuthenticated, isAdmin, loading, sessionExpired } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Toggle section expansion
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        if (isAuthenticated && isAdmin) {
          const stats = await messagesApi.getMessageStats();
          setUnreadMessagesCount(stats.unread);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
        setUnreadMessagesCount(0);
      }
    };

    fetchUnreadMessages();
    
    // Set up an interval to refresh the count every 30 seconds
    const interval = setInterval(fetchUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin]);

  // Watch for session expiry
  useEffect(() => {
    if (sessionExpired) {
      setShowSessionExpiredModal(true);
    }
  }, [sessionExpired]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };
  
  const handleSessionExpired = () => {
    setShowSessionExpiredModal(true);
  };
  
  const handleRelogin = async () => {
    setShowSessionExpiredModal(false);
    await logout();
    navigate('/admin/login');
  };
  
  const handleNavigation = (item: any) => {
    if (item.unavailable) {
      setShowUnavailableModal(true);
    } else {
      navigate(item.href);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Filter navigation sections based on permissions
  const navigationSections = getNavigationSections(unreadMessagesCount);
  const filteredSections = navigationSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => hasPermission(item.resource, item.action))
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-white-50 font-admin">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Brown Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
      }`}>
        <div className="flex grow flex-col overflow-y-auto bg-gradient-to-b from-stone-900 via-zinc-800 to-stone-900 shadow-2xl">
          {/* Enhanced Logo Section */}
          <div className={`flex h-20 shrink-0 items-center border-b border-stone-600/40 bg-gradient-to-r from-stone-800 to-zinc-700 ${
            sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/30 shadow-sm">
                <img 
                  src={inestaLogo} 
                  alt="INESTA Mode Logo" 
                  className="w-8 h-8 object-cover rounded-lg"
                />
                <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <span className="font-display font-bold text-white text-xl tracking-tight">
                    INESTA Mode
                  </span>
                  <p className="text-white/80 text-xs font-medium">Admin Panel</p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Collapse Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              title={sidebarCollapsed ? 'Étendre la sidebar' : 'Réduire la sidebar'}
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-4 py-6 space-y-8">
            <div className="flex-1 space-y-6">
              {filteredSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="space-y-3"
                >
                  {/* Section Header */}
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between px-3">
                      <h3 className="text-xs font-bold text-stone-300 tracking-wider">
                        {section.title}
                      </h3>
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="p-1 rounded-md text-stone-300 hover:text-stone-200 hover:bg-stone-700/50 transition-all duration-200"
                      >
                        <ChevronDown 
                          className={`w-3 h-3 transition-transform duration-200 ${
                            expandedSections[section.title] ? 'rotate-0' : '-rotate-90'
                          }`} 
                        />
                      </button>
                    </div>
                  )}
                  
                  {/* Section Items */}
                  <AnimatePresence>
                    {(expandedSections[section.title] || sidebarCollapsed) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={`overflow-hidden ${
                          sidebarCollapsed ? 'space-y-1' : 'space-y-2'
                        }`}
                      >
                        {section.items.map((item, itemIndex) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          
                          return (
                            <motion.button
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              whileHover={{ scale: 1.02, x: sidebarCollapsed ? 0 : 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleNavigation(item)}
                              className={`group relative w-full flex items-center rounded-xl text-left transition-all duration-300 overflow-hidden ${
                                sidebarCollapsed ? 'justify-center p-2' : 'gap-4 px-3 py-3'
                              } ${
                                active
                                  ? 'bg-gradient-to-r from-stone-600/30 to-zinc-500/30 text-white shadow-lg border border-stone-400/40'
                                  : 'text-stone-100 hover:text-white hover:bg-stone-700/60 hover:shadow-md'
                              }`}
                              title={sidebarCollapsed ? item.name : undefined}
                            >
                              {/* Active indicator */}
                              {active && !sidebarCollapsed && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400 to-stone-300 rounded-r-full"
                                />
                              )}
                              
                              {/* Background gradient overlay */}
                              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
                              
                              {/* Icon */}
                              <div className={`relative z-10 rounded-lg transition-all duration-300 ${
                                sidebarCollapsed ? 'p-2' : 'p-2'
                              } ${
                                active 
                                  ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                                  : 'bg-stone-700/50 group-hover:bg-stone-600/70'
                              }`}>
                                <Icon className={`w-5 h-5 transition-all duration-300 ${
                                  active ? 'text-white' : 'text-stone-200 group-hover:text-white'
                                }`} />
                              </div>
                              
                              {/* Content - Hidden in collapsed mode */}
                              {!sidebarCollapsed && (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex-1 min-w-0 relative z-10"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className={`font-semibold text-sm transition-colors duration-300 ${
                                      active ? 'text-white' : 'text-stone-100 group-hover:text-white'
                                    }`}>
                                      {item.name}
                                    </p>
                                    {item.badge && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                                          active 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-amber-600 text-white'
                                        }`}
                                      >
                                        {item.badge}
                                      </motion.span>
                                    )}
                                  </div>
                                  <p className={`text-xs truncate transition-colors duration-300 mt-0.5 ${
                                    active ? 'text-white/80' : 'text-stone-300 group-hover:text-stone-200'
                                  }`}>
                                    {item.description}
                                  </p>
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            {/* User Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t border-stone-600/50 pt-6 space-y-4"
            >
              {!sidebarCollapsed ? (
                <>
                  {/* User Info Card */}
                  <div className="bg-gradient-to-r from-stone-800/50 to-zinc-700/50 backdrop-blur-sm rounded-xl p-4 border border-stone-600/30">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-stone-800 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-stone-300 text-xs flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {user?.role === 'super_admin' ? 'Super Administrateur' : user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-stone-200 hover:text-white hover:bg-red-500/20 border border-stone-600/30 hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="p-2 bg-stone-700/50 group-hover:bg-red-500/20 rounded-lg transition-all duration-300">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Déconnexion</span>
                  </motion.button>
                </>
              ) : (
                /* Collapsed User Section */
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-stone-800 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="p-2 text-stone-200 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </nav>
        </div>
      </div>
      
      {/* Mobile sidebar - Simplified */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-stone-900 via-zinc-800 to-stone-900 shadow-2xl lg:hidden"
      >
        <div className="flex grow flex-col overflow-y-auto">
          {/* Mobile Logo */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-stone-600/50 bg-gradient-to-r from-stone-800 to-zinc-700 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/30 shadow-sm">
                <img 
                  src={inestaLogo} 
                  alt="INESTA Mode Logo" 
                  className="w-8 h-8 object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl tracking-tight">INESTA Mode</span>
                <p className="text-white/80 text-xs font-medium">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mobile Navigation - Simplified */}
          <nav className="flex flex-1 flex-col px-4 py-6">
            <div className="space-y-6">
              {filteredSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-xs font-bold text-stone-300 tracking-wider px-3">
                    {section.title}
                  </h3>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleNavigation(item);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-stone-600/30 to-zinc-500/30 text-white border border-stone-400/40'
                            : 'text-stone-100 hover:text-white hover:bg-stone-700/60'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          active 
                            ? `bg-gradient-to-br ${item.gradient}` 
                            : 'bg-stone-700/50'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            active ? 'text-white' : 'text-stone-200'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${
                            active ? 'text-white' : 'text-stone-100'
                          }`}>{item.name}</p>
                          <p className={`text-xs truncate ${
                            active ? 'text-white/80' : 'text-stone-300'
                          }`}>{item.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        {/* Professional Enhanced Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
          {/* Moving Encouragement Text Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-b border-gray-100/50 overflow-hidden h-8">
            <div className="flex items-center h-full">
              <motion.div
                key="ultra-slow-text"
                className="flex items-center gap-16 text-sm font-medium text-gray-600 whitespace-nowrap"
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 70,
                    ease: "linear",
                  },
                }}
              >
                <span>La technologie optimise la gestion et réduit les erreurs humaines</span>
                <span>L'automatisation accélère les processus et améliore l'efficacité</span>
                <span>Les outils numériques facilitent la prise de décision basée sur les données</span>
                <span>La digitalisation permet une collaboration à distance efficace</span>
                <span>Les systèmes intégrés synchronisent toutes les opérations en temps réel</span>
                <span>La sécurité numérique protège vos données et garantit la confidentialité</span>
              </motion.div>
            </div>
          </div>

          {/* Main Navigation Content */}
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left Section - Mobile Menu & Page Title */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="-m-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden shadow-sm border border-gray-200/50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </motion.button>

              {/* Page Title */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  {location.pathname === '/admin/dashboard' && 'Tableau de Bord'}
                  {location.pathname === '/admin/products' && 'Gestion des Produits'}
                  {location.pathname === '/admin/categories' && 'Gestion des Catégories'}
                  {location.pathname === '/admin/users' && 'Gestion des Utilisateurs'}
                  {location.pathname === '/admin/messages' && 'Gestion des Messages'}
                  {location.pathname === '/admin/news' && 'Actualités & Événements'}
                  {location.pathname === '/admin/partners' && 'Partenaires Humanitaires'}
                  {location.pathname === '/admin/testimonials' && 'Témoignages'}
                  {location.pathname === '/admin/orders' && 'Commandes'}
                  {location.pathname === '/admin/settings' && 'Paramètres'}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Right Section - Actions & User */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                {/* Search */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200/50"
                  title="Recherche rapide"
                >
                  <Search className="h-5 w-5" />
                </motion.button>

                {/* Settings */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation({ href: '/admin/settings', unavailable: true })}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200/50"
                  title="Paramètres"
                >
                  <Settings className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200/50 shadow-sm"
              >
                <Bell className="h-5 w-5" />
                <motion.span 
                  className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-xs font-bold text-white">3</span>
                </motion.span>
              </motion.button>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200/60" />

              {/* User Profile Section */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-gray-50/80 rounded-xl px-3 py-2 border border-gray-200/50">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-stone-600 to-stone-700 rounded-lg flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200/50 shadow-sm"
                  title="Déconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Unavailable Feature Modal */}
      <AnimatePresence>
        {showUnavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUnavailableModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Settings className="w-8 h-8 text-amber-600" />
                  </motion.div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fonctionnalité Non Disponible
                </h3>
                
                {/* Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cette fonctionnalité est actuellement en développement et sera disponible très bientôt. Merci de votre patience !
                </p>
                
                {/* Actions */}
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUnavailableModal(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-stone-600 to-stone-700 text-white font-medium rounded-xl hover:from-stone-700 hover:to-stone-800 transition-all duration-200 shadow-lg"
                  >
                    Compris
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Session Expired Modal */}
      <SessionExpiredModal 
        isOpen={showSessionExpiredModal}
        onRelogin={handleRelogin}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default AdminLayout;
