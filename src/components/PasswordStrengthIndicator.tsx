import React from 'react';
import { default as zxcvbn } from 'zxcvbn';
import { Check, X, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'Contains number',
    test: (password) => /\d/.test(password),
  },
  {
    label: 'Contains special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const result = password ? zxcvbn(password) : null;
  const score = result?.score || 0;

  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = (score: number): string => {
    switch (score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthTextColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return 'text-red-600';
      case 2:
        return 'text-orange-600';
      case 3:
        return 'text-yellow-600';
      case 4:
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  const isPasswordValid = passwordRequirements.every(req => req.test(password));

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Password Strength</span>
          <span className={`text-sm font-medium ${getStrengthTextColor(score)}`}>
            {getStrengthText(score)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(score)}`}
            style={{ width: `${((score + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-2">
          <span className="text-sm text-gray-600">Requirements:</span>
          <div className="space-y-1">
            {passwordRequirements.map((requirement, index) => {
              const isValid = requirement.test(password);
              return (
                <div key={index} className="flex items-center space-x-2">
                  {isValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      isValid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {requirement.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback */}
      {result?.feedback?.warning && (
        <div className="flex items-start space-x-2 p-2 bg-orange-50 border border-orange-200 rounded">
          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-700">
            <p className="font-medium">Suggestion:</p>
            <p>{result.feedback.warning}</p>
            {result.feedback.suggestions.length > 0 && (
              <ul className="mt-1 list-disc list-inside">
                {result.feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
export { passwordRequirements };