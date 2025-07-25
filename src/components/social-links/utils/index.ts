/**
 * @fileoverview Utilitários para sistema de Social Links
 * @module social-links/utils
 */

import type { 
  SocialPlatform, 
  SocialLinkData, 
  PlatformDetectionResult,
  SocialUrlValidation,
  SocialLinksConfig
} from '../types';

/**
 * Mapeamento de domínios para plataformas sociais
 */
const PLATFORM_DOMAINS: Record<string, SocialPlatform> = {
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'instagram.com': 'instagram',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'linkedin.com': 'linkedin',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'tiktok.com': 'tiktok',
  'whatsapp.com': 'whatsapp',
  'wa.me': 'whatsapp',
  'telegram.org': 'telegram',
  't.me': 'telegram',
  'discord.com': 'discord',
  'discord.gg': 'discord',
  'github.com': 'github',
  'mailto:': 'email',
  'tel:': 'phone'
};

/**
 * Padrões regex para validação de URLs específicas
 */
const PLATFORM_PATTERNS: Record<SocialPlatform, RegExp> = {
  facebook: /^https?:\/\/(www\.)?(facebook|fb)\.com\/[\w\-\.]+\/?$/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w\-\.]+\/?$/i,
  twitter: /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w\-]+\/?$/i,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w\-]+\/?$/i,
  youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|user\/|c\/)?|youtu\.be\/)[\w\-]+\/?$/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w\-\.]+\/?$/i,
  whatsapp: /^(https?:\/\/(www\.)?whatsapp\.com\/|https?:\/\/wa\.me\/|whatsapp:\/\/)/i,
  telegram: /^(https?:\/\/(www\.)?telegram\.org\/|https?:\/\/t\.me\/|telegram:\/\/)/i,
  discord: /^(https?:\/\/(www\.)?discord\.com\/|https?:\/\/discord\.gg\/|discord:\/\/)/i,
  github: /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/?$/i,
  website: /^https?:\/\/[\w\-\.]+(\.[\w\-]+)+([\/\w\-\._~:/?#[\]@!$&'()*+,;=]*)?$/i,
  email: /^mailto:[\w\-\.]+@[\w\-\.]+(\.[\w\-]+)+$/i,
  phone: /^tel:\+?[\d\s\-\(\)]+$/i,
  custom: /.*/
};

/**
 * Cores da marca para cada plataforma
 */
const PLATFORM_BRAND_COLORS: Record<SocialPlatform, string> = {
  facebook: '#1877f2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  linkedin: '#0077B5',
  youtube: '#FF0000',
  tiktok: '#000000',
  whatsapp: '#25D366',
  telegram: '#0088cc',
  discord: '#5865F2',
  github: '#333333',
  website: '#666666',
  email: '#EA4335',
  phone: '#34A853',
  custom: '#888888'
};

/**
 * Classe utilitária para detecção de plataformas sociais
 */
export class SocialPlatformDetector {
  /**
   * Detecta a plataforma social a partir de uma URL
   * @param url - URL para analisar
   * @returns Resultado da detecção
   */
  static detect(url: string): PlatformDetectionResult {
    const normalizedUrl = this.normalizeUrl(url);
    
    // Verificar por domínio
    const domain = this.extractDomain(normalizedUrl);
    const platformByDomain = PLATFORM_DOMAINS[domain];
    
    if (platformByDomain) {
      return {
        platform: platformByDomain,
        confidence: 0.9,
        normalizedUrl,
        metadata: this.extractMetadata(normalizedUrl, platformByDomain)
      };
    }

    // Verificar por padrões específicos
    for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
      if (pattern.test(normalizedUrl)) {
        return {
          platform: platform as SocialPlatform,
          confidence: 0.8,
          normalizedUrl,
          metadata: this.extractMetadata(normalizedUrl, platform as SocialPlatform)
        };
      }
    }

    // Se não detectou, classificar como website ou custom
    if (this.isValidUrl(normalizedUrl)) {
      return {
        platform: 'website',
        confidence: 0.5,
        normalizedUrl
      };
    }

    return {
      platform: 'custom',
      confidence: 0.1,
      normalizedUrl
    };
  }

  /**
   * Normaliza URL adicionando protocolo se necessário
   * @param url - URL para normalizar
   * @returns URL normalizada
   */
  static normalizeUrl(url: string): string {
    const trimmed = url.trim();
    
    // Se já tem protocolo, retornar como está
    if (/^https?:\/\//.test(trimmed)) {
      return trimmed;
    }

    // Se é email, adicionar mailto:
    if (this.isEmail(trimmed)) {
      return `mailto:${trimmed}`;
    }

    // Se é telefone, adicionar tel:
    if (this.isPhone(trimmed)) {
      return `tel:${trimmed}`;
    }

    // Adicionar https:// para URLs
    if (trimmed.includes('.') || trimmed.startsWith('www.')) {
      return `https://${trimmed}`;
    }

    return trimmed;
  }

  /**
   * Extrai domínio de uma URL
   * @param url - URL para extrair domínio
   * @returns Domínio extraído
   */
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  }

  /**
   * Extrai metadados específicos da plataforma
   * @param url - URL para extrair metadados
   * @param platform - Plataforma detectada
   * @returns Metadados extraídos
   */
  static extractMetadata(url: string, platform: SocialPlatform): Record<string, string> | undefined {
    const metadata: Record<string, string> = {};

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      switch (platform) {
        case 'facebook':
          const fbMatch = pathname.match(/\/([^\/\?]+)/);
          if (fbMatch) metadata.username = fbMatch[1];
          break;

        case 'instagram':
          const igMatch = pathname.match(/\/([^\/\?]+)/);
          if (igMatch) metadata.username = igMatch[1];
          break;

        case 'twitter':
          const twitterMatch = pathname.match(/\/([^\/\?]+)/);
          if (twitterMatch) metadata.username = twitterMatch[1];
          break;

        case 'linkedin':
          const linkedinMatch = pathname.match(/\/(in|company)\/([^\/\?]+)/);
          if (linkedinMatch) {
            metadata.profileType = linkedinMatch[1];
            metadata.username = linkedinMatch[2];
          }
          break;

        case 'youtube':
          const youtubeMatch = pathname.match(/\/(channel|user|c)\/([^\/\?]+)/);
          if (youtubeMatch) {
            metadata.channelType = youtubeMatch[1];
            metadata.channelId = youtubeMatch[2];
          }
          break;

        case 'github':
          const githubMatch = pathname.match(/\/([^\/\?]+)/);
          if (githubMatch) metadata.username = githubMatch[1];
          break;

        case 'email':
          const emailMatch = url.match(/mailto:([^?]+)/);
          if (emailMatch) metadata.email = emailMatch[1];
          break;

        case 'phone':
          const phoneMatch = url.match(/tel:(.+)/);
          if (phoneMatch) metadata.phone = phoneMatch[1];
          break;
      }
    } catch {
      // Se não conseguir extrair, retorna undefined
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }

  /**
   * Verifica se string é um email válido
   * @param str - String para verificar
   * @returns Se é email
   */
  static isEmail(str: string): boolean {
    return /^[\w\-\.]+@[\w\-\.]+(\.[\w\-]+)+$/.test(str);
  }

  /**
   * Verifica se string é um telefone válido
   * @param str - String para verificar
   * @returns Se é telefone
   */
  static isPhone(str: string): boolean {
    return /^\+?[\d\s\-\(\)]{8,}$/.test(str);
  }

  /**
   * Verifica se é uma URL válida
   * @param str - String para verificar
   * @returns Se é URL válida
   */
  static isValidUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Classe utilitária para validação de links sociais
 */
export class SocialLinkValidator {
  /**
   * Valida um link social
   * @param url - URL para validar
   * @param config - Configuração de validação
   * @returns Resultado da validação
   */
  static validate(
    url: string, 
    config?: SocialUrlValidation
  ): { isValid: boolean; platform?: SocialPlatform; error?: string; suggestion?: string } {
    const trimmedUrl = url.trim();

    // Verificar se está vazio
    if (!trimmedUrl) {
      return {
        isValid: false,
        error: 'URL é obrigatória'
      };
    }

    // Verificar comprimento máximo
    if (config?.maxUrlLength && trimmedUrl.length > config.maxUrlLength) {
      return {
        isValid: false,
        error: `URL muito longa (máximo ${config.maxUrlLength} caracteres)`
      };
    }

    // Normalizar URL
    const normalizedUrl = SocialPlatformDetector.normalizeUrl(trimmedUrl);
    
    // Detectar plataforma
    const detection = SocialPlatformDetector.detect(normalizedUrl);

    // Verificar se permite URLs customizadas
    if (!config?.allowCustomUrls && detection.platform === 'custom' && detection.confidence < 0.5) {
      return {
        isValid: false,
        error: 'URL não reconhecida. Use links de redes sociais conhecidas.',
        suggestion: this.generateSuggestion(trimmedUrl)
      };
    }

    // Validação customizada
    if (config?.customValidationPattern && !config.customValidationPattern.test(normalizedUrl)) {
      return {
        isValid: false,
        error: 'URL não atende aos critérios específicos'
      };
    }

    // Validar padrão específico da plataforma
    if (detection.platform !== 'custom' && detection.platform !== 'website') {
      const pattern = PLATFORM_PATTERNS[detection.platform];
      if (!pattern.test(normalizedUrl)) {
        return {
          isValid: false,
          error: `Formato inválido para ${detection.platform}`,
          suggestion: this.getFormatExample(detection.platform)
        };
      }
    }

    return {
      isValid: true,
      platform: detection.platform
    };
  }

  /**
   * Gera sugestão de correção para URL inválida
   * @param url - URL com erro
   * @returns Sugestão de correção
   */
  static generateSuggestion(url: string): string | undefined {
    const lower = url.toLowerCase();

    // Sugestões comuns
    if (lower.includes('facebook') || lower.includes('fb')) {
      return 'https://facebook.com/seu-perfil';
    }
    if (lower.includes('instagram') || lower.includes('insta')) {
      return 'https://instagram.com/seu-perfil';
    }
    if (lower.includes('twitter') || lower.includes('x.com')) {
      return 'https://twitter.com/seu-perfil';
    }
    if (lower.includes('linkedin')) {
      return 'https://linkedin.com/in/seu-perfil';
    }
    if (lower.includes('youtube')) {
      return 'https://youtube.com/channel/seu-canal';
    }
    
    // Se parece com domínio, sugerir https
    if (url.includes('.') && !url.startsWith('http')) {
      return `https://${url}`;
    }

    return undefined;
  }

  /**
   * Retorna exemplo de formato para uma plataforma
   * @param platform - Plataforma
   * @returns Exemplo de formato
   */
  static getFormatExample(platform: SocialPlatform): string {
    const examples: Record<SocialPlatform, string> = {
      facebook: 'https://facebook.com/seu-perfil',
      instagram: 'https://instagram.com/seu-perfil',
      twitter: 'https://twitter.com/seu-perfil',
      linkedin: 'https://linkedin.com/in/seu-perfil',
      youtube: 'https://youtube.com/channel/seu-canal',
      tiktok: 'https://tiktok.com/@seu-perfil',
      whatsapp: 'https://wa.me/5511999999999',
      telegram: 'https://t.me/seu-perfil',
      discord: 'https://discord.gg/seu-servidor',
      github: 'https://github.com/seu-usuario',
      website: 'https://seu-site.com',
      email: 'mailto:seu-email@exemplo.com',
      phone: 'tel:+5511999999999',
      custom: 'URL personalizada'
    };

    return examples[platform] || 'URL válida';
  }
}

/**
 * Classe utilitária para formatação e sanitização
 */
export class SocialLinkFormatter {
  /**
   * Formata lista de links para exibição
   * @param links - Array de links para formatar
   * @returns Links formatados
   */
  static formatLinksForDisplay(links: SocialLinkData[]): SocialLinkData[] {
    return links
      .filter(link => link.url && link.url.trim())
      .map(link => ({
        ...link,
        url: SocialPlatformDetector.normalizeUrl(link.url),
        platform: link.platform || SocialPlatformDetector.detect(link.url).platform,
        isActive: link.isActive !== false
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Converte array simples de URLs para SocialLinkData
   * @param urls - Array de URLs
   * @returns Array de SocialLinkData
   */
  static convertUrlsToLinkData(urls: string[]): SocialLinkData[] {
    return urls
      .filter(url => url && url.trim())
      .map((url, index) => {
        const detection = SocialPlatformDetector.detect(url);
        return {
          url: detection.normalizedUrl,
          platform: detection.platform,
          isActive: true,
          order: index,
          config: {
            openInNewTab: true,
            relAttributes: 'noopener noreferrer'
          }
        };
      });
  }

  /**
   * Converte SocialLinkData para array simples de URLs
   * @param links - Array de SocialLinkData
   * @returns Array de URLs
   */
  static convertLinkDataToUrls(links: SocialLinkData[]): string[] {
    return links
      .filter(link => link.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(link => link.url);
  }

  /**
   * Sanitiza URL removendo caracteres perigosos
   * @param url - URL para sanitizar
   * @returns URL sanitizada
   */
  static sanitizeUrl(url: string): string {
    return url
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres perigosos
      .replace(/\s+/g, '') // Remove espaços
      .substring(0, 2000); // Limita tamanho
  }

  /**
   * Gera label amigável para um link
   * @param link - Dados do link
   * @returns Label formatado
   */
  static generateFriendlyLabel(link: SocialLinkData): string {
    if (link.label) return link.label;

    const platformLabels: Record<SocialPlatform, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      discord: 'Discord',
      github: 'GitHub',
      website: 'Website',
      email: 'Email',
      phone: 'Telefone',
      custom: 'Link'
    };

    return platformLabels[link.platform || 'custom'] || 'Link Social';
  }
}

/**
 * Classe utilitária para cache de links sociais
 */
export class SocialLinksCache {
  private static cache = new Map<string, any>();
  private static readonly CACHE_PREFIX = 'social_links_';

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
   * @param ttl - Tempo de vida em ms
   */
  static set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    const cacheKey = this.getCacheKey(key);
    const expiresAt = Date.now() + ttl;
    this.cache.set(cacheKey, { data, expiresAt });
  }

  /**
   * Recupera dados do cache
   * @param key - Chave do cache
   * @returns Dados armazenados ou null
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
   * Remove item do cache
   * @param key - Chave para remover
   */
  static remove(key: string): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.delete(cacheKey);
  }

  /**
   * Limpa todo o cache
   */
  static clear(): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(this.CACHE_PREFIX)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Verifica se item está no cache
   * @param key - Chave para verificar
   * @returns Se existe no cache
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * Classe utilitária para analytics de links sociais
 */
export class SocialLinksAnalytics {
  /**
   * Rastreia clique em link social
   * @param link - Dados do link clicado
   * @param index - Índice do link
   */
  static trackLinkClick(link: SocialLinkData, index: number): void {
    // Tracking interno
    this.logEvent('social_link_click', {
      platform: link.platform,
      url: link.url,
      index,
      timestamp: new Date(),
      has_custom_config: !!link.config
    });

    // Analytics externo (Google Analytics, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'social_link_click', {
        event_category: 'Social Links',
        event_label: link.platform,
        custom_parameter_platform: link.platform
      });
    }

    // Analytics customizado do link
    if (link.config?.analytics) {
      this.trackCustomAnalytics(link.config.analytics, 'click');
    }
  }

  /**
   * Rastreia hover em link social
   * @param link - Dados do link
   * @param index - Índice do link
   */
  static trackLinkHover(link: SocialLinkData, index: number): void {
    this.logEvent('social_link_hover', {
      platform: link.platform,
      index,
      timestamp: new Date()
    });
  }

  /**
   * Rastreia adição de novo link
   * @param link - Link adicionado
   */
  static trackLinkAdd(link: SocialLinkData): void {
    this.logEvent('social_link_add', {
      platform: link.platform,
      timestamp: new Date()
    });
  }

  /**
   * Rastreia remoção de link
   * @param link - Link removido
   */
  static trackLinkRemove(link: SocialLinkData): void {
    this.logEvent('social_link_remove', {
      platform: link.platform,
      timestamp: new Date()
    });
  }

  /**
   * Log interno de eventos
   * @param event - Nome do evento
   * @param data - Dados do evento
   */
  private static logEvent(event: string, data: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SocialLinks Analytics] ${event}:`, data);
    }

    // Aqui você pode implementar seu sistema de analytics
    // Por exemplo, enviar para um serviço de tracking
  }

  /**
   * Tracking customizado baseado na configuração do link
   * @param config - Configuração de analytics
   * @param action - Ação realizada
   */
  private static trackCustomAnalytics(
    config: { category?: string; action?: string; label?: string },
    action: string
  ): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', config.action || action, {
        event_category: config.category || 'Social Links',
        event_label: config.label
      });
    }
  }
}

/**
 * Constantes do sistema de Social Links
 */
export const SOCIAL_LINKS_CONSTANTS = {
  /** Tempo limite para operações em ms */
  OPERATION_TIMEOUT: 10000,
  /** Máximo de links permitidos por padrão */
  MAX_LINKS_DEFAULT: 10,
  /** Máximo de caracteres em URLs */
  MAX_URL_LENGTH: 2000,
  /** Intervalo de auto-save em ms */
  AUTO_SAVE_INTERVAL: 30000,
  /** Configuração padrão */
  DEFAULT_CONFIG: {
    validation: {
      autoValidate: true,
      allowCustomUrls: true,
      maxUrlLength: 2000
    },
    appearance: {
      iconSize: 'medium' as const,
      hoverEffect: 'scale' as const,
      showLabels: false,
      showTooltips: true,
      spacing: 2,
      useBrandColors: true,
      theme: 'auto' as const
    },
    behavior: {
      allowEditing: true,
      allowReordering: true,
      allowAddNew: true,
      allowRemove: true,
      maxLinks: 10,
      autoSave: false,
      autoSaveInterval: 30000
    },
    analytics: {
      trackClicks: true,
      trackHover: false,
      provider: 'none' as const
    }
  } as SocialLinksConfig,
  /** Cores da marca */
  BRAND_COLORS: PLATFORM_BRAND_COLORS,
  /** Chaves de cache */
  CACHE_KEYS: {
    LINKS: 'links',
    VALIDATION: 'validation',
    PLATFORMS: 'platforms'
  }
} as const;

/**
 * Imports necessários para os novos utilitários
 */
import React from 'react';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  GitHub as GitHubIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Pinterest as PinterestIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

import type { 
  SocialPlatformName,
  SocialPlatformCategory
} from '../types';

/**
 * Registro completo de plataformas sociais
 */
export class SocialPlatformRegistry {
  private static platforms: Array<{
    name: SocialPlatformName;
    displayName: string;
    category: SocialPlatformCategory;
    color: string;
    urlPattern: string;
    baseUrl: string;
    isPopular?: boolean;
    metadata?: {
      supportsVerification?: boolean;
      hasPublicApi?: boolean;
      maxBioLength?: number;
    };
  }> = [
    {
      name: 'facebook',
      displayName: 'Facebook',
      category: 'social',
      color: '#1877F2',
      urlPattern: 'facebook.com',
      baseUrl: 'https://facebook.com',
      isPopular: true,
      metadata: {
        supportsVerification: true,
        hasPublicApi: true
      }
    },
    {
      name: 'twitter',
      displayName: 'Twitter/X',
      category: 'social',
      color: '#1DA1F2',
      urlPattern: 'twitter.com|x.com',
      baseUrl: 'https://twitter.com',
      isPopular: true,
      metadata: {
        supportsVerification: true,
        hasPublicApi: true
      }
    },
    {
      name: 'instagram',
      displayName: 'Instagram',
      category: 'social',
      color: '#E4405F',
      urlPattern: 'instagram.com',
      baseUrl: 'https://instagram.com',
      isPopular: true,
      metadata: {
        supportsVerification: true,
        hasPublicApi: true
      }
    },
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      category: 'professional',
      color: '#0A66C2',
      urlPattern: 'linkedin.com',
      baseUrl: 'https://linkedin.com',
      isPopular: true,
      metadata: {
        supportsVerification: true,
        hasPublicApi: true
      }
    },
    {
      name: 'youtube',
      displayName: 'YouTube',
      category: 'media',
      color: '#FF0000',
      urlPattern: 'youtube.com|youtu.be',
      baseUrl: 'https://youtube.com',
      isPopular: true,
      metadata: {
        supportsVerification: true,
        hasPublicApi: true
      }
    },
    {
      name: 'github',
      displayName: 'GitHub',
      category: 'development',
      color: '#181717',
      urlPattern: 'github.com',
      baseUrl: 'https://github.com',
      isPopular: true,
      metadata: {
        supportsVerification: false,
        hasPublicApi: true
      }
    },
    {
      name: 'website',
      displayName: 'Website',
      category: 'other',
      color: '#666666',
      urlPattern: '.*',
      baseUrl: ''
    }
  ];

  /**
   * Retorna todas as plataformas disponíveis
   */
  static getAllPlatforms() {
    return [...this.platforms];
  }

  /**
   * Retorna plataformas populares
   */
  static getPopularPlatforms() {
    return this.platforms.filter(p => p.isPopular);
  }

  /**
   * Retorna plataformas agrupadas por categoria
   */
  static getPlatformsByCategory(): Record<SocialPlatformCategory, typeof this.platforms> {
    const grouped = this.platforms.reduce((acc, platform) => {
      if (!acc[platform.category]) {
        acc[platform.category] = [];
      }
      acc[platform.category].push(platform);
      return acc;
    }, {} as Record<SocialPlatformCategory, typeof this.platforms>);

    return grouped;
  }

  /**
   * Busca plataforma por nome
   */
  static getPlatformByName(name: SocialPlatformName) {
    return this.platforms.find(p => p.name === name);
  }
}

/**
 * Resolvedor de ícones para plataformas sociais
 */
export class SocialIconResolver {
  private static iconMap: Record<SocialPlatformName, React.ComponentType<any>> = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
    youtube: YouTubeIcon,
    github: GitHubIcon,
    tiktok: LinkIcon,
    whatsapp: WhatsAppIcon,
    telegram: TelegramIcon,
    discord: ChatIcon,
    website: LinkIcon,
    email: EmailIcon,
    phone: PhoneIcon,
    custom: LinkIcon
  };

  /**
   * Retorna o componente de ícone para uma plataforma
   */
  static getIcon(platform: SocialPlatformName): React.ComponentType<any> {
    return this.iconMap[platform] || LinkIcon;
  }

  /**
   * Verifica se existe ícone para a plataforma
   */
  static hasIcon(platform: SocialPlatformName): boolean {
    return platform in this.iconMap;
  }

  /**
   * Registra um ícone customizado
   */
  static registerIcon(platform: SocialPlatformName, icon: React.ComponentType<any>): void {
    this.iconMap[platform] = icon;
  }
}
