/**
 * Sistema de Sanitização Centralizado - BlogNews
 * 
 * @description
 * Este módulo fornece métodos centralizados para sanitização de dados
 * em toda a aplicação, garantindo segurança e consistência
 * 
 * @features
 * - Sanitização de HTML para posts e comentários
 * - Validação e limpeza de dados de usuário
 * - Prevenção de XSS e injection attacks
 * - Configurações específicas por tipo de conteúdo
 * - Performance otimizada com cache
 * 
 * @author BlogNews Team
 * @version 2.0
 */

import DOMPurify from 'isomorphic-dompurify';
import sanitizeHtml from 'sanitize-html';
import { logger } from '@/lib/logger';

/**
 * Configurações de sanitização para diferentes tipos de conteúdo
 */
const SANITIZE_CONFIGS = {
  /**
   * Configuração para conteúdo de posts (HTML rico)
   */
  POST_CONTENT: {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'a', 'img', 'iframe', 'video', 'audio',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'div', 'span', 'pre', 'code',
      'hr'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'style'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      'video': ['src', 'controls', 'width', 'height', 'poster'],
      'audio': ['src', 'controls'],
      'div': ['class', 'style'],
      'span': ['class', 'style'],
      'p': ['class', 'style'],
      'table': ['class', 'style'],
      'td': ['colspan', 'rowspan', 'style'],
      'th': ['colspan', 'rowspan', 'style']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedClasses: {
      'div': ['highlight', 'code-block', 'quote'],
      'span': ['highlight', 'mention', 'tag'],
      'p': ['lead', 'subtitle']
    }
  },

  /**
   * Configuração para comentários (HTML limitado)
   */
  COMMENT_CONTENT: {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'code'],
    allowedAttributes: {
      'a': ['href', 'title', 'rel']
    },
    allowedSchemes: ['http', 'https']
  },

  /**
   * Configuração para texto simples (sem HTML)
   */
  PLAIN_TEXT: {
    allowedTags: [],
    allowedAttributes: {}
  },

  /**
   * Configuração para títulos e metadados
   */
  METADATA: {
    allowedTags: ['strong', 'em'],
    allowedAttributes: {}
  }
};

/**
 * Cache para sanitização (melhora performance)
 */
const sanitizeCache = new Map<string, string>();
const CACHE_MAX_SIZE = 1000;
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutos

/**
 * Interface para resultado de sanitização
 */
export interface SanitizeResult {
  /** Conteúdo sanitizado */
  content: string;
  /** Se o conteúdo foi modificado */
  wasModified: boolean;
  /** Avisos sobre modificações realizadas */
  warnings: string[];
  /** Tamanho original vs sanitizado */
  stats: {
    originalLength: number;
    sanitizedLength: number;
    reduction: number;
  };
}

/**
 * Classe principal para sanitização de dados
 */
export class SanitizationService {
  /**
   * Sanitiza conteúdo HTML para posts do blog
   * 
   * @param content - Conteúdo HTML a ser sanitizado
   * @param options - Opções adicionais de sanitização
   * @returns Resultado detalhado da sanitização
   * 
   * @example
   * ```typescript
   * const result = SanitizationService.sanitizePostContent(
   *   '<p>Post content with <script>alert("xss")</script></p>'
   * );
   * console.log(result.content); // '<p>Post content with </p>'
   * console.log(result.wasModified); // true
   * ```
   */
  static sanitizePostContent(
    content: string, 
    options: { strict?: boolean; preserveFormatting?: boolean } = {}
  ): SanitizeResult {
    const originalLength = content.length;
    const cacheKey = `post_${content.substring(0, 100)}_${JSON.stringify(options)}`;
    
    // Verifica cache
    if (sanitizeCache.has(cacheKey)) {
      const cached = sanitizeCache.get(cacheKey)!;
      return this.createResult(cached, originalLength, cached.length, []);
    }

    const warnings: string[] = [];
    let sanitized: string;

    try {
      const config = { ...SANITIZE_CONFIGS.POST_CONTENT };
      
      if (options.strict) {
        // Remove iframes e conteúdo embed em modo strict
        config.allowedTags = config.allowedTags.filter(tag => !['iframe', 'video', 'audio'].includes(tag));
        warnings.push('Conteúdo embed removido (modo strict)');
      }

      // Sanitiza com DOMPurify primeiro (client-side security)
      const domPurified = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
      });

      // Depois com sanitize-html (server-side control)
      sanitized = sanitizeHtml(domPurified, config);

      // Verifica se foi modificado
      if (sanitized !== content) {
        warnings.push('Conteúdo HTML foi sanitizado para segurança');
        
        // Log da sanitização para auditoria
        logger.info('Content sanitized', {
          originalLength,
          sanitizedLength: sanitized.length,
          reduction: ((originalLength - sanitized.length) / originalLength * 100).toFixed(2) + '%'
        });
      }

      // Adiciona ao cache
      this.addToCache(cacheKey, sanitized);

    } catch (error: any) {
      logger.error('Error sanitizing post content', error);
      
      // Fallback para sanitização básica
      sanitized = sanitizeHtml(content, SANITIZE_CONFIGS.PLAIN_TEXT);
      warnings.push('Erro na sanitização - aplicado fallback seguro');
    }

    return this.createResult(sanitized, originalLength, sanitized.length, warnings);
  }

  /**
   * Sanitiza conteúdo de comentários
   * 
   * @param content - Conteúdo do comentário
   * @returns Resultado da sanitização
   */
  static sanitizeCommentContent(content: string): SanitizeResult {
    const originalLength = content.length;
    const cacheKey = `comment_${content.substring(0, 50)}`;
    
    if (sanitizeCache.has(cacheKey)) {
      const cached = sanitizeCache.get(cacheKey)!;
      return this.createResult(cached, originalLength, cached.length, []);
    }

    const warnings: string[] = [];
    let sanitized: string;

    try {
      sanitized = sanitizeHtml(content, SANITIZE_CONFIGS.COMMENT_CONTENT);
      
      // Limita tamanho de comentários
      if (sanitized.length > 1000) {
        sanitized = sanitized.substring(0, 1000) + '...';
        warnings.push('Comentário truncado (máximo 1000 caracteres)');
      }

      if (sanitized !== content) {
        warnings.push('Comentário sanitizado para segurança');
      }

      this.addToCache(cacheKey, sanitized);

    } catch (error: any) {
      logger.error('Error sanitizing comment', error);
      sanitized = sanitizeHtml(content, SANITIZE_CONFIGS.PLAIN_TEXT);
      warnings.push('Erro na sanitização - aplicado fallback seguro');
    }

    return this.createResult(sanitized, originalLength, sanitized.length, warnings);
  }

  /**
   * Sanitiza texto simples (remove todo HTML)
   * 
   * @param text - Texto a ser sanitizado
   * @returns Texto limpo
   */
  static sanitizePlainText(text: string): string {
    if (!text) return '';
    
    // Remove HTML tags
    let sanitized = sanitizeHtml(text, SANITIZE_CONFIGS.PLAIN_TEXT);
    
    // Remove caracteres especiais perigosos
    sanitized = sanitized
      .replace(/[<>\"'&]/g, '') // Remove caracteres HTML
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/data:/gi, '') // Remove data: URLs
      .trim();

    return sanitized;
  }

  /**
   * Sanitiza metadados (títulos, nomes, etc.)
   * 
   * @param text - Texto de metadado
   * @param maxLength - Tamanho máximo
   * @returns Texto sanitizado
   */
  static sanitizeMetadata(text: string, maxLength: number = 200): string {
    if (!text) return '';

    let sanitized = sanitizeHtml(text, SANITIZE_CONFIGS.METADATA);
    
    // Trunca se necessário
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength).trim();
    }

    return sanitized;
  }

  /**
   * Sanitiza dados de usuário
   * 
   * @param userData - Dados do usuário
   * @returns Dados sanitizados
   */
  static sanitizeUserData(userData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    Object.keys(userData).forEach(key => {
      const value = userData[key];
      
      if (typeof value === 'string') {
        switch (key) {
          case 'email':
            sanitized[key] = value.toLowerCase().trim();
            break;
          case 'name':
          case 'author':
            sanitized[key] = this.sanitizeMetadata(value, 100);
            break;
          case 'title':
            sanitized[key] = this.sanitizeMetadata(value, 200);
            break;
          case 'content':
            sanitized[key] = this.sanitizePostContent(value).content;
            break;
          case 'comment':
            sanitized[key] = this.sanitizeCommentContent(value).content;
            break;
          default:
            sanitized[key] = this.sanitizePlainText(value);
        }
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Valida e sanitiza URL
   * 
   * @param url - URL a ser validada
   * @returns URL sanitizada ou null se inválida
   */
  static sanitizeUrl(url: string): string | null {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      
      // Apenas HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }

      // Remove parâmetros perigosos
      urlObj.searchParams.delete('javascript');
      urlObj.searchParams.delete('data');
      
      return urlObj.toString();
    } catch {
      return null;
    }
  }

  /**
   * Extrai texto limpo de HTML (para excerpts, busca, etc.)
   * 
   * @param html - HTML de origem
   * @param maxLength - Tamanho máximo do texto
   * @returns Texto limpo
   */
  static extractCleanText(html: string, maxLength: number = 300): string {
    if (!html) return '';

    // Remove HTML
    let text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
    
    // Remove espaços extras
    text = text.replace(/\s+/g, ' ').trim();
    
    // Trunca se necessário
    if (text.length > maxLength) {
      text = text.substring(0, maxLength);
      
      // Trunca na última palavra completa
      const lastSpace = text.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        text = text.substring(0, lastSpace);
      }
      
      text += '...';
    }

    return text;
  }

  /**
   * Limpa o cache de sanitização
   */
  static clearCache(): void {
    sanitizeCache.clear();
    logger.info('Sanitization cache cleared');
  }

  /**
   * Cria resultado estruturado de sanitização
   */
  private static createResult(
    content: string, 
    originalLength: number, 
    sanitizedLength: number, 
    warnings: string[]
  ): SanitizeResult {
    return {
      content,
      wasModified: originalLength !== sanitizedLength,
      warnings,
      stats: {
        originalLength,
        sanitizedLength,
        reduction: originalLength > 0 ? ((originalLength - sanitizedLength) / originalLength * 100) : 0
      }
    };
  }

  /**
   * Adiciona item ao cache com controle de tamanho
   */
  private static addToCache(key: string, value: string): void {
    if (sanitizeCache.size >= CACHE_MAX_SIZE) {
      // Remove o primeiro item (FIFO)
      const firstKey = sanitizeCache.keys().next().value;
      if (firstKey) {
        sanitizeCache.delete(firstKey);
      }
    }

    sanitizeCache.set(key, value);
    
    // Auto-limpeza do cache
    setTimeout(() => {
      sanitizeCache.delete(key);
    }, CACHE_EXPIRY);
  }
}

// Export de funções de conveniência
export const {
  sanitizePostContent,
  sanitizeCommentContent,
  sanitizePlainText,
  sanitizeMetadata,
  sanitizeUserData,
  sanitizeUrl,
  extractCleanText
} = SanitizationService;

// Export da classe principal
export default SanitizationService;
