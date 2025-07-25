/**
 * @fileoverview Utilitários para sistema de Newsletter
 * @module newsletter/utils
 */

import type { 
  EmailValidation, 
  ValidationConfig, 
  MessagesConfig, 
  SubscriberData,
  NewsletterStats 
} from '../types';

/**
 * Classe utilitária para validação de emails
 */
export class EmailValidator {
  private static readonly DEFAULT_BLOCKED_DOMAINS = [
    'tempmail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com'
  ];

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly ADVANCED_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  /**
   * Valida formato básico do email
   * @param email - Email para validar
   * @returns Se o email é válido
   */
  static isValidFormat(email: string): boolean {
    return this.ADVANCED_EMAIL_REGEX.test(email.trim().toLowerCase());
  }

  /**
   * Verifica se domínio está bloqueado
   * @param email - Email para verificar
   * @param config - Configuração de validação
   * @returns Se o domínio está bloqueado
   */
  static isDomainBlocked(email: string, config?: ValidationConfig): boolean {
    const domain = email.toLowerCase().split('@')[1];
    if (!domain) return true;

    const blockedDomains = config?.blockedDomains || this.DEFAULT_BLOCKED_DOMAINS;
    return blockedDomains.includes(domain);
  }

  /**
   * Verifica se domínio está na lista permitida
   * @param email - Email para verificar
   * @param config - Configuração de validação
   * @returns Se o domínio é permitido
   */
  static isDomainAllowed(email: string, config?: ValidationConfig): boolean {
    if (!config?.allowedDomains) return true;

    const domain = email.toLowerCase().split('@')[1];
    if (!domain) return false;

    return config.allowedDomains.includes(domain);
  }

  /**
   * Gera sugestões de correção para emails com erros comuns
   * @param email - Email com possível erro
   * @returns Array de sugestões
   */
  static generateSuggestions(email: string): string[] {
    const suggestions: string[] = [];
    const [localPart, domain] = email.toLowerCase().split('@');

    if (!domain) return suggestions;

    // Correções comuns de domínio
    const domainCorrections: Record<string, string> = {
      'gamil.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'yahoo.om': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'outlok.com': 'outlook.com'
    };

    if (domainCorrections[domain]) {
      suggestions.push(`${localPart}@${domainCorrections[domain]}`);
    }

    return suggestions;
  }

  /**
   * Validação completa do email
   * @param email - Email para validar
   * @param config - Configuração de validação
   * @returns Resultado da validação
   */
  static validate(email: string, config?: ValidationConfig): EmailValidation {
    const trimmedEmail = email.trim().toLowerCase();

    // Verificar se está vazio
    if (!trimmedEmail) {
      return {
        isValid: false,
        error: 'Email é obrigatório'
      };
    }

    // Verificar formato
    if (!this.isValidFormat(trimmedEmail)) {
      return {
        isValid: false,
        error: 'Formato de email inválido',
        suggestions: this.generateSuggestions(trimmedEmail)
      };
    }

    // Verificar domínios bloqueados
    if (this.isDomainBlocked(trimmedEmail, config)) {
      return {
        isValid: false,
        error: 'Este domínio de email não é permitido'
      };
    }

    // Verificar domínios permitidos
    if (!this.isDomainAllowed(trimmedEmail, config)) {
      return {
        isValid: false,
        error: 'Este domínio de email não está na lista permitida'
      };
    }

    // Verificar regex customizado
    if (config?.customPattern && !config.customPattern.test(trimmedEmail)) {
      return {
        isValid: false,
        error: 'Email não atende aos critérios específicos'
      };
    }

    return { isValid: true };
  }
}

/**
 * Classe utilitária para formatação e sanitização
 */
export class NewsletterFormatter {
  /**
   * Sanitiza email removendo espaços e convertendo para minúsculo
   * @param email - Email para sanitizar
   * @returns Email sanitizado
   */
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Sanitiza nome removendo caracteres especiais
   * @param name - Nome para sanitizar
   * @returns Nome sanitizado
   */
  static sanitizeName(name: string): string {
    return name
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres perigosos
      .replace(/\s+/g, ' ') // Normaliza espaços
      .substring(0, 100); // Limita tamanho
  }

  /**
   * Formata contador de assinantes
   * @param count - Número de assinantes
   * @returns String formatada
   */
  static formatSubscriberCount(count: number): string {
    if (count === 0) return 'Nenhum assinante';
    if (count === 1) return '1 assinante';
    if (count < 1000) return `${count} assinantes`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k assinantes`;
    return `${(count / 1000000).toFixed(1)}M assinantes`;
  }

  /**
   * Formata taxa de crescimento
   * @param rate - Taxa de crescimento (decimal)
   * @returns String formatada com porcentagem
   */
  static formatGrowthRate(rate: number): string {
    const percentage = (rate * 100).toFixed(1);
    const sign = rate > 0 ? '+' : '';
    return `${sign}${percentage}%`;
  }

  /**
   * Formata data de inscrição
   * @param date - Data de inscrição
   * @returns String formatada
   */
  static formatSubscriptionDate(date: Date | string): string {
    const subscriptionDate = new Date(date);
    return subscriptionDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Gera resumo de estatísticas
   * @param stats - Estatísticas da newsletter
   * @returns Objeto com resumo formatado
   */
  static formatStatsummary(stats: NewsletterStats): {
    total: string;
    growth: string;
    weekly: string;
    monthly: string;
  } {
    return {
      total: this.formatSubscriberCount(stats.totalSubscribers),
      growth: this.formatGrowthRate(stats.growthRate),
      weekly: `+${stats.weeklySubscribers} esta semana`,
      monthly: `+${stats.monthlySubscribers} este mês`
    };
  }
}

/**
 * Classe utilitária para cache de dados da newsletter
 */
export class NewsletterCache {
  private static cache = new Map<string, any>();
  private static readonly CACHE_PREFIX = 'newsletter_';

  /**
   * Gera chave de cache
   * @param key - Chave base
   * @returns Chave de cache completa
   */
  private static getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${key}`;
  }

  /**
   * Armazena dados no cache
   * @param key - Chave do cache
   * @param data - Dados para armazenar
   * @param ttl - Tempo de vida em ms (padrão: 10 minutos)
   */
  static set(key: string, data: any, ttl: number = 10 * 60 * 1000): void {
    const cacheKey = this.getCacheKey(key);
    const expiresAt = Date.now() + ttl;
    this.cache.set(cacheKey, { data, expiresAt });
  }

  /**
   * Recupera dados do cache
   * @param key - Chave do cache
   * @returns Dados armazenados ou null se expirado/inexistente
   */
  static get(key: string): any | null {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  /**
   * Remove dados do cache
   * @param key - Chave do cache
   */
  static remove(key: string): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.delete(cacheKey);
  }

  /**
   * Limpa todo o cache da newsletter
   */
  static clear(): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(this.CACHE_PREFIX)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Verifica se email está no cache de verificação
   * @param email - Email para verificar
   * @returns Status da verificação ou null
   */
  static getEmailCheck(email: string): boolean | null {
    return this.get(`email_check_${email}`);
  }

  /**
   * Armazena resultado de verificação de email
   * @param email - Email verificado
   * @param isSubscribed - Se está inscrito
   */
  static setEmailCheck(email: string, isSubscribed: boolean): void {
    this.set(`email_check_${email}`, isSubscribed, 5 * 60 * 1000); // 5 minutos
  }
}

/**
 * Classe utilitária para analytics e tracking
 */
export class NewsletterAnalytics {
  /**
   * Registra evento de inscrição
   * @param email - Email do assinante
   * @param source - Fonte da inscrição
   */
  static trackSubscription(email: string, source?: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_subscribe', {
        'custom_parameter': email,
        'source': source || 'website'
      });
    }
  }

  /**
   * Registra evento de desinscrição
   * @param email - Email do assinante
   * @param reason - Motivo da desinscrição
   */
  static trackUnsubscription(email: string, reason?: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_unsubscribe', {
        'custom_parameter': email,
        'reason': reason || 'not_specified'
      });
    }
  }

  /**
   * Registra erro de validação
   * @param email - Email que causou erro
   * @param errorType - Tipo do erro
   */
  static trackValidationError(email: string, errorType: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_validation_error', {
        'email_domain': email.split('@')[1] || 'unknown',
        'error_type': errorType
      });
    }
  }
}

/**
 * Constantes do sistema de Newsletter
 */
export const NEWSLETTER_CONSTANTS = {
  /** Tempo limite para operações em ms */
  OPERATION_TIMEOUT: 15000,
  /** Máximo de caracteres para nome */
  MAX_NAME_LENGTH: 100,
  /** Máximo de caracteres para motivo de desinscrição */
  MAX_REASON_LENGTH: 500,
  /** Intervalo de debounce para validação em ms */
  VALIDATION_DEBOUNCE: 500,
  /** Configuração padrão de validação */
  DEFAULT_VALIDATION: {
    allowDisposableEmails: false,
    blockedDomains: ['tempmail.org', '10minutemail.com', 'guerrillamail.com'],
    allowedDomains: undefined,
    customPattern: undefined
  } as ValidationConfig,
  /** Chaves de cache */
  CACHE_KEYS: {
    STATS: 'stats',
    SUBSCRIBER_COUNT: 'subscriber_count',
    EMAIL_CHECK: 'email_check'
  },
  /** Mensagens padrão */
  DEFAULT_MESSAGES: {
    SUCCESS: {
      SUBSCRIBE: 'Inscrição realizada com sucesso! Verifique seu email.',
      UNSUBSCRIBE: 'Desinscrição realizada com sucesso.',
      UPDATE_PREFERENCES: 'Preferências atualizadas com sucesso.'
    },
    ERROR: {
      INVALID_EMAIL: 'Por favor, insira um email válido.',
      ALREADY_SUBSCRIBED: 'Este email já está inscrito na newsletter.',
      NOT_SUBSCRIBED: 'Este email não está inscrito na newsletter.',
      NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
      GENERIC: 'Ocorreu um erro inesperado. Tente novamente.'
    },
    LOADING: {
      SUBSCRIBE: 'Inscrevendo...',
      UNSUBSCRIBE: 'Desinscrevendo...',
      CHECKING: 'Verificando...'
    }
  }
} as const;
