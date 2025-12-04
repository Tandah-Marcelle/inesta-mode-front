import { useState } from 'react';
import { messagesApi, CreateContactMessageData } from '../services/messages.api';

interface UseContactFormReturn {
  submitForm: (data: CreateContactMessageData) => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  resetForm: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (data: CreateContactMessageData) => {
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      await messagesApi.submitContactForm({
        ...data,
        source: 'website'
      });
      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur est survenue lors de l\'envoi du message.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    submitForm,
    isSubmitting,
    isSuccess,
    error,
    resetForm
  };
}