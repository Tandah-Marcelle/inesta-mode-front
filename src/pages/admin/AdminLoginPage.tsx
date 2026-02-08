import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Shield, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedBackground from '../../components/admin/AnimatedBackground';
import MfaVerification from '../../components/MfaVerification';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { apiClient } from '../../config/api';

function AdminLoginPage() {
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    requestReason: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMfaVerification, setShowMfaVerification] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [tempLoginData, setTempLoginData] = useState<any>(null);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated and admin
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      // Use the login function from AuthContext to ensure state is updated correctly
      const data = await login(formData.email, formData.password);
      console.log('Login successful:', data);

      // Check if MFA is required (if the login response indicates it, though AuthContext types might need adjustment if login() returns stricter types)
      // Note: AuthContext.login returns AuthResponse. If it returns more (like requiresMfa), we might need to cast or update the interface.
      // Based on previous code, data might have requiresMfa property.
      const responseData = data as any;

      if (responseData.requiresMfa) {
        setTempLoginData(responseData);
        setShowMfaVerification(true);
        setLoading(false);
        return;
      }

      // Check admin privileges
      if (responseData.user.role !== 'admin' && responseData.user.role !== 'super_admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Login successful and state updated by AuthContext
      setSuccess('Login successful! Redirecting...');

      // Delay redirect slightly to show success message and ensure state propagation
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setError('');
    setForgotPasswordSuccess('');

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setForgotPasswordSuccess('Password reset instructions have been sent to your email address.');
      setForgotPasswordEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/create-secure-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          requestReason: formData.requestReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create admin account');
      }

      if (data.requiresApproval) {
        setSuccess('Admin request submitted successfully! Your account will be activated once approved by a super administrator. You will receive an email notification when your request is processed.');
      } else {
        setSuccess('Secure admin account created successfully! You can now log in.');
      }

      setMode('login');
      setFormData({
        email: formData.email,
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        requestReason: '',

      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerification = async (mfaToken: string) => {
    setMfaLoading(true);
    setMfaError('');

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempToken: tempLoginData.tempToken,
          mfaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'MFA verification failed');
      }

      // Check admin privileges
      if (data.user.role !== 'admin' && data.user.role !== 'super_admin') {
        setMfaError('Access denied. Admin privileges required.');
        return;
      }

      // Store token and redirect
      localStorage.setItem('token', data.access_token);
      if (data.sessionToken) {
        localStorage.setItem('sessionToken', data.sessionToken);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : 'MFA verification failed');
    } finally {
      setMfaLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex font-admin">
      {/* Left Side - Login/Create Form */}
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
              Pour vous connecter à votre compte d'administrateur selon différents panels, veuillez saisir vos informations de compte
            </p>
          </div>

          {/* Forms */}
          <div className="space-y-6">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
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

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Create Admin Account Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Besoin d'un accès administrateur ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('create')}
                      className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200"
                    >
                      Demander un compte admin
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full px-3 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                    placeholder="Entrez votre prénom"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Nom de famille
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-3 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                    placeholder="Entrez votre nom de famille"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                      placeholder="admin@inestamode.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                      placeholder="Créez un mot de passe fort"
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
                  <PasswordStrengthIndicator password={formData.password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-4 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base"
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Request Reason */}
                <div>
                  <label htmlFor="requestReason" className="block text-sm font-medium text-secondary-700 mb-2">
                    Raison de la demande (Optionnel)
                  </label>
                  <textarea
                    id="requestReason"
                    name="requestReason"
                    rows={3}
                    value={formData.requestReason}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-secondary-300 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base resize-none"
                    placeholder="Veuillez expliquer pourquoi vous avez besoin d'un accès administrateur (ex: rôle dans l'organisation, responsabilités, etc.)"
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    Cette information aidera les super administrateurs à examiner votre demande.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                      Envoi de la demande...
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Demander un accès admin</span>
                    </div>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-gray-600 hover:text-gray-500 font-medium transition-colors duration-200"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              </form>
            )}

            {/* Additional Options */}
            <div className="mt-6">
              <p className="text-sm text-center text-secondary-500">
                {mode === 'login'
                  ? 'Besoin d\'aide avec votre compte ?'
                  : 'Votre demande sera examinée par les super administrateurs'
                }
              </p>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-secondary-400">
                {mode === 'login'
                  ? 'N\'hésitez pas à nous contacter\nEn cas de difficultés de connexion'
                  : 'Authentification sécurisée avec processus d\'approbation\nValidation des mots de passe incluse'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-100"></div>
        <img
          src={""}
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
              {mode === 'create' && (
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Shield className="h-4 w-4" />
                    <span>Processus d'approbation sécurisé</span>
                  </div>
                  <ul className="text-xs mt-2 space-y-1 text-left">
                    <li>• Demande soumise aux super administrateurs</li>
                    <li>• Vérification des informations fournies</li>
                    <li>• Notification par email du statut</li>
                    <li>• Activation sécurisée du compte</li>
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MFA Verification Modal */}
      <MfaVerification
        isOpen={showMfaVerification}
        onVerify={handleMfaVerification}
        onCancel={() => {
          setShowMfaVerification(false);
          setMfaError('');
          setTempLoginData(null);
        }}
        loading={mfaLoading}
        error={mfaError}
      />

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Réinitialiser le mot de passe</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setError('');
                  setForgotPasswordSuccess('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {forgotPasswordSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 mb-4">{forgotPasswordSuccess}</p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSuccess('');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p className="text-gray-600 mb-4">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="votre@email.com"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {forgotPasswordLoading ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
      {/* Debug Info */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 p-1 rounded pointer-events-none z-50">
        API: {API_CONFIG.BASE_URL}
      </div>
    </div>
  );
}

export default AdminLoginPage;
