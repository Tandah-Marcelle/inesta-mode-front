import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedBackground from '../../components/admin/AnimatedBackground';
import bgImage from '../../assets/images/bg_image.jpg';

function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated and admin
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.user.role !== 'admin' && response.user.role !== 'super_admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex font-admin">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Animated Background - Only on login side */}
        <AnimatedBackground className="opacity-20" />
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-900 mb-2">
              Hello!
            </h1>
            <p className="text-secondary-600 text-lg leading-relaxed">
              Pour vous connecter à votre compte d'administrateur selon
              différents panels, veuillez saisir vos informations de compte
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Votre adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                    placeholder="admin@inestamode.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                  Votre mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
            
            {/* Additional Options */}
            <div className="mt-6">
              <p className="text-sm text-center text-secondary-500">
                Mot de passe oublié ?
              </p>
            </div>
            
            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-secondary-400">
                N'hésitez pas à nous contacter<br />
                En cas de difficultés de connexion
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-100"></div>
        <img 
          src={bgImage} 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
                L'élégance africaine<br />rencontre l'innovation<br />moderne
              </h2>
              <p className="text-lg opacity-90 leading-relaxed drop-shadow">
                Découvrez une nouvelle approche<br />
                de la mode africaine où tradition<br />
                et modernité se complètent parfaitement
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
