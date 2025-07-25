// src/hooks/useFormValidation.ts
/**
 * Hook para validação de formulários
 * @fileoverview Regras de validação centralizadas e reutilizáveis
 */

import { useCallback } from 'react';
import { CreatePostData, ValidationErrors } from './useCreatePostForm';

/**
 * Hook para validação de formulário
 */
export const useFormValidation = () => {
  /**
   * Valida dados do formulário de post
   */
  const validateForm = useCallback((data: CreatePostData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validação do título
    if (!data.title.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (data.title.length < 5) {
      errors.title = 'Título deve ter pelo menos 5 caracteres';
    } else if (data.title.length > 200) {
      errors.title = 'Título deve ter no máximo 200 caracteres';
    }

    // Validação do conteúdo
    if (!data.content.trim()) {
      errors.content = 'Conteúdo é obrigatório';
    } else if (data.content.length < 50) {
      errors.content = 'Conteúdo deve ter pelo menos 50 caracteres';
    }

    // Validação do autor
    if (!data.author.trim()) {
      errors.author = 'Autor é obrigatório';
    } else if (data.author.length < 2) {
      errors.author = 'Nome do autor deve ter pelo menos 2 caracteres';
    }

    // Validação da categoria
    if (!data.category || data.category === 'Sem Categoria') {
      errors.category = 'Por favor, selecione uma categoria válida';
    }

    return errors;
  }, []);

  /**
   * Valida campo específico
   */
  const validateField = useCallback((field: keyof CreatePostData, value: any): string | undefined => {
    switch (field) {
      case 'title':
        if (!value || !value.trim()) return 'Título é obrigatório';
        if (value.length < 5) return 'Título deve ter pelo menos 5 caracteres';
        if (value.length > 200) return 'Título deve ter no máximo 200 caracteres';
        break;
      
      case 'content':
        if (!value || !value.trim()) return 'Conteúdo é obrigatório';
        if (value.length < 50) return 'Conteúdo deve ter pelo menos 50 caracteres';
        break;
      
      case 'author':
        if (!value || !value.trim()) return 'Autor é obrigatório';
        if (value.length < 2) return 'Nome do autor deve ter pelo menos 2 caracteres';
        break;
      
      case 'category':
        if (!value || value === 'Sem Categoria') return 'Selecione uma categoria válida';
        break;
    }
    
    return undefined;
  }, []);

  return { 
    validateForm, 
    validateField 
  };
};
