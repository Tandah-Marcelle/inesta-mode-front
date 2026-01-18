import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import OtpInput from 'react-otp-input';
import { 
  Shield, 
  Smartphone, 
  Copy, 
  Check, 
  AlertTriangle, 
  Download,
  Eye,
  EyeOff 
} from 'lucide-react';

interface MfaSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface MfaSetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

const MfaSetup: React.FC<MfaSetupProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [mfaData, setMfaData] = useState<MfaSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodesDownloaded, setBackupCodesDownloaded] = useState(false);

  const setupMfa = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to setup MFA');
      }

      const data = await response.json();
      setMfaData(data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    if (mfaData?.secret) {
      await navigator.clipboard.writeText(mfaData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    if (!mfaData?.backupCodes) return;

    const content = `Inesta Mode - MFA Backup Codes
Generated: ${new Date().toLocaleString()}

IMPORTANT: Store these codes in a safe place. Each code can only be used once.

${mfaData.backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instructions:
- Use these codes if you lose access to your authenticator app
- Each code can only be used once
- Generate new codes if you use all of them
- Keep these codes secure and private`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inesta-mode-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setBackupCodesDownloaded(true);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    // Reset state
    setStep(1);
    setMfaData(null);
    setVerificationCode('');
    setError('');
    setShowBackupCodes(false);
    setBackupCodesDownloaded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Setup Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-500">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex-1 h-2 rounded-full ${
                    stepNum <= step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Introduction */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-4">
                  <Smartphone className="h-16 w-16 text-blue-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Secure Your Account
                    </h3>
                    <p className="text-gray-600">
                      Two-factor authentication adds an extra layer of security to your account.
                      You'll need an authenticator app like Google Authenticator or Authy.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What you'll need:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• An authenticator app on your phone</li>
                    <li>• Access to scan a QR code or enter a secret key</li>
                    <li>• A safe place to store backup codes</li>
                  </ul>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={setupMfa}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Setting up...' : 'Continue'}
                </button>
              </motion.div>
            )}

            {/* Step 2: QR Code and Verification */}
            {step === 2 && mfaData && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Scan QR Code
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Scan this QR code with your authenticator app
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRCodeSVG value={mfaData.qrCodeUrl} size={200} />
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Can't scan? Enter this code manually:
                  </p>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all">
                      {mfaData.secret}
                    </code>
                    <button
                      onClick={copySecret}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy secret"
                    >
                      {copiedSecret ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Verification */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter the 6-digit code from your app:
                  </label>
                  <OtpInput
                    value={verificationCode}
                    onChange={setVerificationCode}
                    numInputs={6}
                    separator={<span className="mx-1">-</span>}
                    inputStyle={{
                      width: '40px',
                      height: '48px',
                      margin: '0 4px',
                      fontSize: '18px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                    focusStyle={{
                      border: '2px solid #3b82f6',
                    }}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={verifyAndEnable}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </motion.div>
            )}

            {/* Step 3: Backup Codes */}
            {step === 3 && mfaData && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    MFA Enabled Successfully!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Save your backup codes in a safe place
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important:</p>
                      <p>
                        These backup codes can be used to access your account if you lose your phone.
                        Each code can only be used once.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Backup Codes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Backup Codes
                    </label>
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showBackupCodes ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Show</span>
                        </>
                      )}
                    </button>
                  </div>

                  {showBackupCodes && (
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        {mfaData.backupCodes.map((code, index) => (
                          <div key={index} className="p-2 bg-white rounded border">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={downloadBackupCodes}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Backup Codes</span>
                    {backupCodesDownloaded && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Setup
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MfaSetup;