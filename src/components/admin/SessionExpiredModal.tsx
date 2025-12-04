import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onRelogin: () => void;
  onLogout: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ 
  isOpen, 
  onRelogin, 
  onLogout 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200"
          >
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </motion.div>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Session expirée
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter pour continuer à utiliser l'administration.
              </p>
              
              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRelogin}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Se reconnecter
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiredModal;