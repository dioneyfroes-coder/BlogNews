// src/lib/utils/postManagementUtils.ts

import type { PostValidationRules, PostManagementLabels } from '@/types/postManagement';
import type { Post } from '@/services/postService';

/**
 * Utilitários para gerenciamento de posts
 */
export class PostManagementUtils {
  /**
   * Valida os dados de um post
   * @param formData - Dados do formulário
   * @param rules - Regras de validação
   * @returns Objeto com erros encontrados
   */
  static validatePost(
    formData: Record<string, any>,
    rules: PostValidationRules
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    // Validação do título
    if (rules.title.required && !formData.title?.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (rules.title.minLength && formData.title?.length < rules.title.minLength) {
      errors.title = `Título deve ter pelo menos ${rules.title.minLength} caracteres`;
    } else if (rules.title.maxLength && formData.title?.length > rules.title.maxLength) {
      errors.title = `Título deve ter no máximo ${rules.title.maxLength} caracteres`;
    }

    // Validação do conteúdo
    if (rules.content.required && !formData.content?.trim()) {
      errors.content = 'Conteúdo é obrigatório';
    } else if (rules.content.minLength && formData.content?.length < rules.content.minLength) {
      errors.content = `Conteúdo deve ter pelo menos ${rules.content.minLength} caracteres`;
    }

    // Validação do autor
    if (rules.author.required && !formData.author?.trim()) {
      errors.author = 'Autor é obrigatório';
    } else if (rules.author.pattern && !rules.author.pattern.test(formData.author)) {
      errors.author = 'Formato do autor inválido';
    }

    // Validação da categoria
    if (rules.category.required && !formData.category?.trim()) {
      errors.category = 'Categoria é obrigatória';
    }

    // Validação da URL da imagem
    if (rules.imageUrl.required && !formData.imageUrl?.trim()) {
      errors.imageUrl = 'URL da imagem é obrigatória';
    } else if (rules.imageUrl.pattern && formData.imageUrl && !rules.imageUrl.pattern.test(formData.imageUrl)) {
      errors.imageUrl = 'URL da imagem inválida';
    }

    return errors;
  }

  /**
   * Extrai dados do formulário de um post
   * @param post - Post a ser convertido
   * @returns Dados do formulário
   */
  static postToFormData(post: Post) {
    return {
      title: post.title || '',
      content: post.content || '',
      author: post.author || '',
      category: post.category || 'Sem Categoria',
      imageUrl: post.imageUrl || '',
      excerpt: post.excerpt || '',
      tags: post.tags || []
    };
  }

  /**
   * Converte dados do formulário para formato de post
   * @param formData - Dados do formulário
   * @returns Dados do post
   */
  static formDataToPostUpdate(formData: Record<string, any>) {
    return {
      title: formData.title?.trim(),
      content: formData.content?.trim(),
      author: formData.author?.trim(),
      category: formData.category?.trim(),
      imageUrl: formData.imageUrl?.trim(),
      excerpt: formData.excerpt?.trim(),
      tags: Array.isArray(formData.tags) ? formData.tags : []
    };
  }

  /**
   * Gera URL de redirecionamento baseada no contexto
   * @param type - Tipo de operação ('edit' | 'delete')
   * @param postId - ID do post (para edit)
   * @param customUrl - URL customizada
   * @returns URL de redirecionamento
   */
  static generateRedirectUrl(
    type: 'edit' | 'delete',
    postId?: string,
    customUrl?: string
  ): string {
    if (customUrl) return customUrl;
    
    switch (type) {
      case 'edit':
        return postId ? `/posts/${postId}` : '/admin';
      case 'delete':
        return '/admin';
      default:
        return '/';
    }
  }

  /**
   * Compara se dois objetos de post são diferentes
   * @param original - Post original
   * @param current - Post atual
   * @returns true se são diferentes
   */
  static hasPostChanged(original: Post, current: Record<string, any>): boolean {
    const originalData = this.postToFormData(original);
    
    const fieldsToCompare = ['title', 'content', 'author', 'category', 'imageUrl', 'excerpt'];
    
    return fieldsToCompare.some(field => {
      const originalValue = originalData[field as keyof typeof originalData];
      const currentValue = current[field];
      
      if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
        return JSON.stringify(originalValue.sort()) !== JSON.stringify(currentValue.sort());
      }
      
      return originalValue !== currentValue;
    });
  }

  /**
   * Sanitiza dados do post antes de salvar
   * @param formData - Dados do formulário
   * @returns Dados sanitizados
   */
  static sanitizePostData(formData: Record<string, any>) {
    return {
      ...formData,
      title: formData.title?.trim().replace(/\s+/g, ' '),
      content: formData.content?.trim(),
      author: formData.author?.trim().replace(/\s+/g, ' '),
      category: formData.category?.trim(),
      imageUrl: formData.imageUrl?.trim(),
      excerpt: formData.excerpt?.trim().replace(/\s+/g, ' '),
      tags: Array.isArray(formData.tags) 
        ? formData.tags.map((tag: string) => tag.trim()).filter(Boolean)
        : []
    };
  }

  /**
   * Gera resumo automático do conteúdo
   * @param content - Conteúdo do post
   * @param maxLength - Tamanho máximo do resumo
   * @returns Resumo gerado
   */
  static generateExcerpt(content: string, maxLength: number = 200): string {
    if (!content) return '';
    
    // Remove HTML tags
    const textOnly = content.replace(/<[^>]*>/g, '');
    
    if (textOnly.length <= maxLength) {
      return textOnly;
    }
    
    // Corta no último espaço antes do limite
    const truncated = textOnly.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  /**
   * Formata data para exibição
   * @param date - Data a ser formatada
   * @returns Data formatada
   */
  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  /**
   * Verifica se uma URL é válida
   * @param url - URL a ser validada
   * @returns true se válida
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Regras de validação padrão
 */
export const DEFAULT_VALIDATION_RULES: PostValidationRules = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 50
  },
  author: {
    required: true,
    pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/
  },
  category: {
    required: true
  },
  imageUrl: {
    required: false,
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
  }
};

/**
 * Labels padrão em português
 */
export const DEFAULT_LABELS: PostManagementLabels = {
  editPost: {
    title: 'Editar Post',
    submitButton: 'Salvar Alterações',
    submitButtonSaving: 'Salvando...',
    loadingText: 'Carregando post...',
    notFoundText: 'Post não encontrado'
  },
  deletePost: {
    title: 'Deletar Post',
    confirmText: 'Tem certeza que deseja deletar este post?',
    deleteButton: 'Deletar',
    deletingButton: 'Deletando...',
    helpText: 'A exclusão de posts é irreversível e pode levar alguns minutos para refletir nas alterações.'
  }
};

/**
 * Mensagens de erro padrão
 */
export const POST_ERROR_MESSAGES = {
  LOAD_ERROR: 'Erro ao carregar o post',
  SAVE_ERROR: 'Erro ao salvar o post',
  DELETE_ERROR: 'Erro ao deletar o post',
  VALIDATION_ERROR: 'Dados inválidos fornecidos',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  PERMISSION_ERROR: 'Você não tem permissão para esta ação',
  POST_NOT_FOUND: 'Post não encontrado'
} as const;
