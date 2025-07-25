/**
 * @fileoverview Hooks especializados para sistema de Newsletter
 * @module newsletter/hooks
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { EmailValidator, NewsletterCache } from '../utils';
import type { ValidationConfig, SubscriberPreferences } from '../types';

/**
 * Hook para validação de email em tempo real
 */
export const useEmailValidation = (validationConfig?: ValidationConfig) => {
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    error?: string;
    suggestion?: string;
  }>({
    isValid: false
  });

  const validateEmail = useCallback((value: string) => {
    setEmail(value);
    
    if (!value.trim()) {
      setValidation({ isValid: false });
      return;
    }

    const result = EmailValidator.validate(value, validationConfig);
    setValidation(result);
  }, [validationConfig]);

  const clearValidation = useCallback(() => {
    setEmail('');
    setValidation({ isValid: false });
  }, []);

  return {
    email,
    validation,
    validateEmail,
    clearValidation,
    isValid: validation.isValid && email.length > 0
  };
};

/**
 * Hook para gerenciar preferências do assinante
 */
export const useSubscriberPreferences = (initialPreferences?: SubscriberPreferences) => {
  const [preferences, setPreferences] = useState<SubscriberPreferences>(
    initialPreferences || {
      emailNotifications: true,
      weeklyDigest: true,
      categories: [],
      frequency: 'weekly'
    }
  );

  const updatePreference = useCallback(<K extends keyof SubscriberPreferences>(
    key: K,
    value: SubscriberPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleNotification = useCallback((type: 'emailNotifications' | 'weeklyDigest') => {
    setPreferences(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const addCategory = useCallback((category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: [...prev.categories, category].filter((c, i, arr) => arr.indexOf(c) === i)
    }));
  }, []);

  const removeCategory = useCallback((category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({
      emailNotifications: true,
      weeklyDigest: true,
      categories: [],
      frequency: 'weekly'
    });
  }, []);

  return {
    preferences,
    updatePreference,
    toggleNotification,
    addCategory,
    removeCategory,
    resetPreferences
  };
};

/**
 * Hook para feedback de UI (loading, success, error)
 */
export const useNewsletterFeedback = () => {
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
    isVisible: boolean;
  }>({
    type: null,
    message: '',
    isVisible: false
  });

  const showFeedback = useCallback((
    type: 'success' | 'error' | 'info',
    message: string,
    duration: number = 5000
  ) => {
    setFeedback({ type, message, isVisible: true });

    if (duration > 0) {
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, isVisible: false }));
      }, duration);
    }
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedback({ type: null, message: '', isVisible: false });
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showFeedback('success', message, duration);
  }, [showFeedback]);

  const showError = useCallback((message: string, duration?: number) => {
    showFeedback('error', message, duration);
  }, [showFeedback]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showFeedback('info', message, duration);
  }, [showFeedback]);

  return {
    feedback,
    showFeedback,
    hideFeedback,
    showSuccess,
    showError,
    showInfo
  };
};

/**
 * Hook para persistir dados do formulário no localStorage
 */
export const useNewsletterForm = () => {
  const STORAGE_KEY = 'newsletter_form_data';

  const [formData, setFormData] = useState<{
    email: string;
    name: string;
    preferences?: SubscriberPreferences;
  }>({
    email: '',
    name: ''
  });

  // Carregar dados salvos ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      }
    } catch (error) {
      console.warn('Erro ao carregar dados salvos do formulário:', error);
    }
  }, []);

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Salvar no localStorage (sem a senha, se houver)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.warn('Erro ao salvar dados do formulário:', error);
      }
      
      return newData;
    });
  }, []);

  const clearFormData = useCallback(() => {
    setFormData({ email: '', name: '' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar dados salvos:', error);
    }
  }, []);

  const updateEmail = useCallback((email: string) => {
    updateFormData({ email });
  }, [updateFormData]);

  const updateName = useCallback((name: string) => {
    updateFormData({ name });
  }, [updateFormData]);

  const updatePreferences = useCallback((preferences: SubscriberPreferences) => {
    updateFormData({ preferences });
  }, [updateFormData]);

  return {
    formData,
    updateFormData,
    updateEmail,
    updateName,
    updatePreferences,
    clearFormData
  };
};

/**
 * Hook para debounce de validação
 */
export const useValidationDebounce = (
  value: string,
  validationFn: (value: string) => boolean | { isValid: boolean; error?: string },
  delay: number = 300
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsValidating(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsValidating(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const validation = useMemo(() => {
    if (!debouncedValue) return { isValid: false };
    
    const result = validationFn(debouncedValue);
    return typeof result === 'boolean' ? { isValid: result } : result;
  }, [debouncedValue, validationFn]);

  return {
    debouncedValue,
    validation,
    isValidating: isValidating && value !== debouncedValue
  };
};

/**
 * Hook para analytics de newsletter
 */
export const useNewsletterAnalytics = () => {
  const trackEvent = useCallback((
    event: string,
    properties?: Record<string, any>
  ) => {
    // Implementar tracking real aqui
    console.log('Newsletter Analytics:', event, properties);
    
    // Exemplo com Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'Newsletter',
        ...properties
      });
    }
  }, []);

  const trackSubscription = useCallback((email: string, hasName: boolean) => {
    trackEvent('subscribe', { email_hash: btoa(email), has_name: hasName });
  }, [trackEvent]);

  const trackUnsubscription = useCallback((email: string, reason?: string) => {
    trackEvent('unsubscribe', { 
      email_hash: btoa(email), 
      reason: reason || 'not_specified' 
    });
  }, [trackEvent]);

  const trackValidationError = useCallback((email: string, errorType: string) => {
    trackEvent('validation_error', { 
      email_hash: btoa(email), 
      error_type: errorType 
    });
  }, [trackEvent]);

  const trackFormInteraction = useCallback((action: string, field?: string) => {
    trackEvent('form_interaction', { action, field });
  }, [trackEvent]);

  return {
    trackEvent,
    trackSubscription,
    trackUnsubscription,
    trackValidationError,
    trackFormInteraction
  };
};

/**
 * Hook para cache de newsletter
 */
export const useNewsletterCache = () => {
  const getCached = useCallback(<T>(key: string): T | null => {
    return NewsletterCache.get(key) as T | null;
  }, []);

  const setCached = useCallback(<T>(
    key: string, 
    value: T, 
    ttl?: number
  ): void => {
    NewsletterCache.set(key, value, ttl);
  }, []);

  const removeCached = useCallback((key: string): void => {
    NewsletterCache.remove(key);
  }, []);

  const clearCache = useCallback((): void => {
    NewsletterCache.clear();
  }, []);

  const isEmailChecked = useCallback((email: string): boolean | null => {
    return NewsletterCache.getEmailCheck(email);
  }, []);

  const setEmailChecked = useCallback((email: string, isSubscribed: boolean): void => {
    NewsletterCache.setEmailCheck(email, isSubscribed);
  }, []);

  return {
    getCached,
    setCached,
    removeCached,
    clearCache,
    isEmailChecked,
    setEmailChecked
  };
};

// Barrel export
export { useNewsletter } from './useNewsletter';
