/**
 * @fileoverview Hook principal para gerenciar Newsletter
 * @module newsletter/hooks/useNewsletter
 */

import { useState, useCallback, useEffect } from 'react';
import { emailService } from '@/services';
import type { 
  UseNewsletterReturn, 
  UseNewsletterState, 
  SubscriberData, 
  NewsletterStats,
  ValidationConfig 
} from '../types';
import { 
  EmailValidator, 
  NewsletterFormatter, 
  NewsletterCache, 
  NewsletterAnalytics,
  NEWSLETTER_CONSTANTS 
} from '../utils';

/**
 * Interface para props do hook
 */
interface UseNewsletterProps {
  /** Configuração de validação personalizada */
  validationConfig?: ValidationConfig;
  /** Se deve carregar estatísticas automaticamente */
  autoLoadStats?: boolean;
  /** Callback para eventos de tracking */
  onTrackEvent?: (event: string, data: any) => void;
}

/**
 * Hook principal para gerenciar sistema de Newsletter
 * 
 * @param props - Configurações do hook
 * @returns Estado e funções para gerenciar newsletter
 * 
 * @example
 * ```tsx
 * const {
 *   status,
 *   message,
 *   subscribe,
 *   unsubscribe,
 *   checkSubscription,
 *   stats
 * } = useNewsletter({
 *   autoLoadStats: true,
 *   onTrackEvent: (event, data) => console.log(event, data)
 * });
 * ```
 */
export const useNewsletter = ({
  validationConfig,
  autoLoadStats = false,
  onTrackEvent
}: UseNewsletterProps = {}): UseNewsletterReturn => {
  // Estado do hook
  const [state, setState] = useState<UseNewsletterState>({
    status: 'idle',
    message: '',
    error: null,
    lastSubscriber: null,
    stats: null
  });

  /**
   * Atualiza estado interno
   */
  const updateState = useCallback((updates: Partial<UseNewsletterState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Valida dados do assinante
   */
  const validateSubscriberData = useCallback((
    subscriberData: Omit<SubscriberData, 'subscribedAt' | 'isActive'>
  ): { isValid: boolean; error?: string } => {
    // Validar email
    const emailValidation = EmailValidator.validate(subscriberData.email, validationConfig);
    if (!emailValidation.isValid) {
      return { isValid: false, error: emailValidation.error };
    }

    // Validar nome se fornecido
    if (subscriberData.name) {
      const sanitizedName = NewsletterFormatter.sanitizeName(subscriberData.name);
      if (sanitizedName.length === 0) {
        return { isValid: false, error: 'Nome inválido' };
      }
      if (sanitizedName.length > NEWSLETTER_CONSTANTS.MAX_NAME_LENGTH) {
        return { isValid: false, error: 'Nome muito longo' };
      }
    }

    return { isValid: true };
  }, [validationConfig]);

  /**
   * Função para inscrever assinante
   */
  const subscribe = useCallback(async (
    subscriberData: Omit<SubscriberData, 'subscribedAt' | 'isActive'>
  ): Promise<void> => {
    // Validar dados
    const validation = validateSubscriberData(subscriberData);
    if (!validation.isValid) {
      updateState({
        status: 'error',
        error: validation.error!,
        message: validation.error!
      });
      return;
    }

    updateState({
      status: 'loading',
      message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.LOADING.SUBSCRIBE,
      error: null
    });

    try {
      // Sanitizar dados
      const sanitizedData = {
        email: NewsletterFormatter.sanitizeEmail(subscriberData.email),
        name: subscriberData.name ? NewsletterFormatter.sanitizeName(subscriberData.name) : undefined,
        preferences: subscriberData.preferences
      };

      // Verificar se já está inscrito (cache primeiro)
      const cachedCheck = NewsletterCache.getEmailCheck(sanitizedData.email);
      if (cachedCheck === true) {
        updateState({
          status: 'error',
          error: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.ERROR.ALREADY_SUBSCRIBED,
          message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.ERROR.ALREADY_SUBSCRIBED
        });
        return;
      }

      // Chamar API de inscrição
      await emailService.addSubscriber(sanitizedData);

      // Criar objeto do assinante
      const newSubscriber: SubscriberData = {
        ...sanitizedData,
        subscribedAt: new Date(),
        isActive: true
      };

      // Atualizar estado
      updateState({
        status: 'success',
        message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.SUCCESS.SUBSCRIBE,
        error: null,
        lastSubscriber: newSubscriber
      });

      // Atualizar cache
      NewsletterCache.setEmailCheck(sanitizedData.email, true);
      NewsletterCache.remove(NEWSLETTER_CONSTANTS.CACHE_KEYS.STATS); // Invalidar stats

      // Tracking
      NewsletterAnalytics.trackSubscription(sanitizedData.email);
      onTrackEvent?.(
        'newsletter_subscribe', 
        { email: sanitizedData.email, hasName: !!sanitizedData.name }
      );

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.ERROR.GENERIC;

      updateState({
        status: 'error',
        error: errorMessage,
        message: errorMessage
      });

      // Tracking de erro
      NewsletterAnalytics.trackValidationError(subscriberData.email, 'api_error');
      onTrackEvent?.('newsletter_error', { 
        type: 'subscribe', 
        error: errorMessage 
      });
    }
  }, [validateSubscriberData, updateState, onTrackEvent]);

  /**
   * Função para desinscrever assinante
   */
  const unsubscribe = useCallback(async (
    email: string, 
    reason?: string
  ): Promise<void> => {
    // Validar email
    const emailValidation = EmailValidator.validate(email, validationConfig);
    if (!emailValidation.isValid) {
      updateState({
        status: 'error',
        error: emailValidation.error!,
        message: emailValidation.error!
      });
      return;
    }

    updateState({
      status: 'loading',
      message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.LOADING.UNSUBSCRIBE,
      error: null
    });

    try {
      const sanitizedEmail = NewsletterFormatter.sanitizeEmail(email);

      // Chamar API de desinscrição
      await emailService.unsubscribe(sanitizedEmail);

      updateState({
        status: 'success',
        message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.SUCCESS.UNSUBSCRIBE,
        error: null
      });

      // Atualizar cache
      NewsletterCache.setEmailCheck(sanitizedEmail, false);
      NewsletterCache.remove(NEWSLETTER_CONSTANTS.CACHE_KEYS.STATS); // Invalidar stats

      // Tracking
      NewsletterAnalytics.trackUnsubscription(sanitizedEmail, reason);
      onTrackEvent?.(
        'newsletter_unsubscribe', 
        { email: sanitizedEmail, reason: reason || 'not_specified' }
      );

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.ERROR.GENERIC;

      updateState({
        status: 'error',
        error: errorMessage,
        message: errorMessage
      });

      onTrackEvent?.('newsletter_error', { 
        type: 'unsubscribe', 
        error: errorMessage 
      });
    }
  }, [validationConfig, updateState, onTrackEvent]);

  /**
   * Função para verificar se email está inscrito
   */
  const checkSubscription = useCallback(async (email: string): Promise<boolean> => {
    const sanitizedEmail = NewsletterFormatter.sanitizeEmail(email);

    // Verificar cache primeiro
    const cachedResult = NewsletterCache.getEmailCheck(sanitizedEmail);
    if (cachedResult !== null) {
      return cachedResult;
    }

    try {
      updateState({ status: 'loading', message: NEWSLETTER_CONSTANTS.DEFAULT_MESSAGES.LOADING.CHECKING });

      // Aqui você chamaria uma API específica para verificar status
      // Por enquanto, vamos simular com base na tentativa de inscrição
      const isSubscribed = false; // Implementar lógica real

      // Armazenar no cache
      NewsletterCache.setEmailCheck(sanitizedEmail, isSubscribed);

      updateState({ status: 'idle', message: '' });
      return isSubscribed;

    } catch (error) {
      updateState({ 
        status: 'error', 
        error: 'Erro ao verificar inscrição',
        message: 'Erro ao verificar inscrição'
      });
      return false;
    }
  }, [updateState]);

  /**
   * Função para carregar estatísticas
   */
  const loadStats = useCallback(async (): Promise<void> => {
    // Verificar cache primeiro
    const cachedStats = NewsletterCache.get(NEWSLETTER_CONSTANTS.CACHE_KEYS.STATS);
    if (cachedStats) {
      updateState({ stats: cachedStats });
      return;
    }

    try {
      updateState({ status: 'loading' });

      // Buscar estatísticas reais da API
      const response = await fetch('/api/newsletter/stats');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar estatísticas');
      }

      const stats: NewsletterStats = result.data;

      // Armazenar no cache por 30 minutos
      NewsletterCache.set(NEWSLETTER_CONSTANTS.CACHE_KEYS.STATS, stats, 30 * 60 * 1000);

      updateState({ 
        stats,
        status: 'idle'
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas da newsletter:', error);
      updateState({ 
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas'
      });
    }
  }, [updateState]);

  /**
   * Limpa mensagens de feedback
   */
  const clearMessage = useCallback((): void => {
    updateState({ 
      message: '', 
      error: null, 
      status: 'idle' 
    });
  }, [updateState]);

  /**
   * Reseta estado completo
   */
  const reset = useCallback((): void => {
    setState({
      status: 'idle',
      message: '',
      error: null,
      lastSubscriber: null,
      stats: null
    });
  }, []);

  /**
   * Carrega estatísticas automaticamente se configurado
   */
  useEffect(() => {
    if (autoLoadStats) {
      loadStats();
    }
  }, [autoLoadStats, loadStats]);

  /**
   * Auto-limpa mensagens após timeout
   */
  useEffect(() => {
    if (state.message && state.status !== 'loading') {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.message, state.status, clearMessage]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    checkSubscription,
    loadStats,
    clearMessage,
    reset
  };
};
