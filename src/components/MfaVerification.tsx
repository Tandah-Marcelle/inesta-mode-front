import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OtpInput from 'react-otp-input';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface MfaVerificationProps {
  isOpen: boolean;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

const MfaVerification: React.FC<MfaVerificationProps> = ({
  isOpen,
  onVerify,
  onCancel,
  loading = false,
  error,
}) => {
  const [code, setCode] = useState('');
  const [isBackupCode, setIsBackupCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === (isBackupCode ? 8 : 6)) {
      await onVerify(code);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-sm">
              {isBackupCode 
                ? 'Enter one of your 8-digit backup codes'
                : 'Enter the 6-digit code from your authenticator app'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div className="space-y-3">
              <OtpInput
                value={code}
                onChange={setCode}
                numInputs={isBackupCode ? 8 : 6}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: isBackupCode ? '32px' : '40px',
                  height: '48px',
                  margin: '0 2px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center',
                  outline: 'none',
                }}
                focusStyle={{
                  border: '2px solid #3b82f6',
                }}
                shouldAutoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || code.length !== (isBackupCode ? 8 : 6)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Verifying...' : 'Verify'}</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBackupCode(!isBackupCode);
                    setCode('');
                  }}
                  className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  {isBackupCode ? 'Use authenticator code' : 'Use backup code'}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              {isBackupCode ? (
                <>
                  <p>• Backup codes are 8 characters long</p>
                  <p>• Each backup code can only be used once</p>
                  <p>• Generate new codes after using them</p>
                </>
              ) : (
                <>
                  <p>• Open your authenticator app</p>
                  <p>• Find the Inesta Mode entry</p>
                  <p>• Enter the current 6-digit code</p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MfaVerification;