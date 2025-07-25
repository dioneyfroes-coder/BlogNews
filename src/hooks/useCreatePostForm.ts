// src/hooks/useCreatePostForm.ts
/**
 * Hook para gerenciamento de estado do formulário de criação de posts
 * @fileoverview Centraliza lógica de estado e validações
 */

import { useState, useCallback } from 'react';
import { Descendant } from 'slate';

/**
 * Interface para dados de criação de post
 */
export interface CreatePostData {
  id?: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  excerpt?: string;
  published: boolean;
}

/**
 * Interface para erros de validação
 */
export interface ValidationErrors {
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  general?: string;
}

/**
 * Interface para estado de loading
 */
export interface LoadingState {
  saving: boolean;
  uploading: boolean;
}

/**
 * Hook personalizado para gerenciamento de formulário
 */
export const useCreatePostForm = (initialData?: Partial<CreatePostData>) => {
  // Estados principais do formulário
  const [formData, setFormData] = useState<CreatePostData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    imageUrl: initialData?.imageUrl || '',
    excerpt: initialData?.excerpt || '',
    published: initialData?.published ?? false,
  });

  // Estado do editor Slate
  const [editorValue, setEditorValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: initialData?.content || '' }],
    },
  ]);

  // Estados de controle
  const [loadingState, setLoadingState] = useState<LoadingState>({
    saving: false,
    uploading: false,
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');

  /**
   * Atualiza campo específico do formulário
   */
  const updateField = useCallback(<K extends keyof CreatePostData>(
    field: K,
    value: CreatePostData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa erro do campo quando valor é alterado
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  /**
   * Atualiza estado de loading
   */
  const updateLoading = useCallback(<K extends keyof LoadingState>(
    field: K,
    value: LoadingState[K]
  ) => {
    setLoadingState(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Reseta formulário para estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      author: '',
      category: '',
      tags: [],
      imageUrl: '',
      excerpt: '',
      published: false,
    });
    setEditorValue([{ type: 'paragraph', children: [{ text: '' }] }]);
    setErrors({});
    setSuccessMessage('');
    setNewTag('');
  }, []);

  return {
    formData,
    editorValue,
    loadingState,
    errors,
    successMessage,
    newTag,
    setEditorValue,
    setErrors,
    setSuccessMessage,
    setNewTag,
    updateField,
    updateLoading,
    resetForm,
  };
};
