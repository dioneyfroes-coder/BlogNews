// src/hooks/useEditPost.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  UseEditPostReturn, 
  EditPostHookOptions,
  EditPostState 
} from '@/types/postManagement';
import { 
  PostManagementUtils, 
  DEFAULT_VALIDATION_RULES,
  POST_ERROR_MESSAGES 
} from '@/lib/utils/postManagementUtils';
import { postService } from '@/services';
import { logger } from '@/lib/logger';

/**
 * Hook personalizado para edição de posts
 * 
 * @param postId - ID do post a ser editado
 * @param options - Opções de configuração do hook
 * @returns Estado e funções para controle da edição
 * 
 * @example
 * ```tsx
 * const { 
 *   post, 
 *   formData, 
 *   isLoading, 
 *   isSaving,
 *   errors,
 *   updateField,
 *   handleSubmit 
 * } = useEditPost('post-id-123', {
 *   autoValidate: true,
 *   onSaveSuccess: (post) => console.log('Salvo!', post)
 * });
 * ```
 */
export const useEditPost = (
  postId: string,
  options: EditPostHookOptions = {}
): UseEditPostReturn => {
  const {
    initialPost,
    autoValidate = true,
    onPostLoaded,
    onSaveSuccess,
    onSaveError
  } = options;

  const router = useRouter();

  // Estado interno
  const [state, setState] = useState<EditPostState>({
    post: initialPost || null,
    formData: {
      title: '',
      content: '',
      author: '',
      category: 'Sem Categoria',
      imageUrl: '',
      excerpt: '',
      tags: []
    },
    isLoading: !initialPost,
    isSaving: false,
    errors: {},
    error: null,
    isDirty: false
  });

  /**
   * Carrega o post para edição
   */
  const loadPost = useCallback(async () => {
    if (initialPost) {
      setState(prev => ({
        ...prev,
        post: initialPost,
        formData: PostManagementUtils.postToFormData(initialPost),
        isLoading: false
      }));
      onPostLoaded?.(initialPost);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      logger.info('Carregando post para edição', { postId, component: 'useEditPost' });
      
      const response = await postService.getPostById(postId);
      
      if (response.success && response.data) {
        const post = response.data;
        const formData = PostManagementUtils.postToFormData(post);
        
        setState(prev => ({
          ...prev,
          post,
          formData,
          isLoading: false,
          error: null
        }));

        onPostLoaded?.(post);
        logger.info('Post carregado com sucesso para edição', { postId, title: post.title });
      } else {
        throw new Error(response.error || POST_ERROR_MESSAGES.LOAD_ERROR);
      }
    } catch (error: any) {
      const errorMessage = error.message || POST_ERROR_MESSAGES.LOAD_ERROR;
      logger.error('Erro ao carregar post para edição', error, { postId });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [postId, initialPost, onPostLoaded]);

  /**
   * Atualiza campo do formulário
   */
  const updateField = useCallback((field: keyof EditPostState['formData'], value: any) => {
    setState(prev => {
      const newFormData = { ...prev.formData, [field]: value };
      const isDirty = prev.post ? PostManagementUtils.hasPostChanged(prev.post, newFormData) : true;

      let newErrors = { ...prev.errors };

      // Auto-validação se habilitada
      if (autoValidate) {
        const fieldErrors = PostManagementUtils.validatePost(newFormData, DEFAULT_VALIDATION_RULES);
        if (fieldErrors[field]) {
          newErrors[field] = fieldErrors[field];
        } else {
          delete newErrors[field];
        }
      }

      return {
        ...prev,
        formData: newFormData,
        isDirty,
        errors: newErrors
      };
    });
  }, [autoValidate]);

  /**
   * Valida o formulário completo
   */
  const validateForm = useCallback((): boolean => {
    const errors = PostManagementUtils.validatePost(state.formData, DEFAULT_VALIDATION_RULES);
    
    setState(prev => ({ ...prev, errors }));
    
    return Object.keys(errors).length === 0;
  }, [state.formData]);

  /**
   * Submete o formulário
   */
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      logger.info('Atualizando post', { postId, title: state.formData.title, component: 'useEditPost' });
      
      const sanitizedData = PostManagementUtils.sanitizePostData(state.formData);
      const updateData = PostManagementUtils.formDataToPostUpdate(sanitizedData);
      
      const response = await postService.updatePost(postId, updateData);

      if (response.success && response.data) {
        const updatedPost = response.data;
        
        setState(prev => ({
          ...prev,
          post: updatedPost,
          formData: PostManagementUtils.postToFormData(updatedPost),
          isDirty: false,
          isSaving: false,
          error: null
        }));

        onSaveSuccess?.(updatedPost);
        logger.info('Post atualizado com sucesso', { postId, title: updatedPost.title });
        
        // Redirecionar após sucesso
        const redirectUrl = PostManagementUtils.generateRedirectUrl('edit', updatedPost._id);
        router.push(redirectUrl);
      } else {
        throw new Error(response.error || POST_ERROR_MESSAGES.SAVE_ERROR);
      }
    } catch (error: any) {
      const errorMessage = error.message || POST_ERROR_MESSAGES.SAVE_ERROR;
      logger.error('Erro ao atualizar post', error, { postId });
      
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: errorMessage
      }));

      onSaveError?.(errorMessage);
    }
  }, [postId, state.formData, validateForm, onSaveSuccess, onSaveError, router]);

  /**
   * Reseta o formulário para o estado original
   */
  const resetForm = useCallback(() => {
    if (state.post) {
      setState(prev => ({
        ...prev,
        formData: PostManagementUtils.postToFormData(prev.post!),
        isDirty: false,
        errors: {},
        error: null
      }));
    }
  }, [state.post]);

  /**
   * Recarrega o post
   */
  const refreshPost = useCallback(async (): Promise<void> => {
    await loadPost();
  }, [loadPost]);

  // Carrega post na inicialização
  useEffect(() => {
    if (postId && !initialPost) {
      loadPost();
    }
  }, [postId, initialPost, loadPost]);

  // Geração automática de excerpt quando content muda
  useEffect(() => {
    if (state.formData.content && !state.formData.excerpt) {
      const generatedExcerpt = PostManagementUtils.generateExcerpt(state.formData.content);
      if (generatedExcerpt) {
        updateField('excerpt', generatedExcerpt);
      }
    }
  }, [state.formData.content, state.formData.excerpt, updateField]);

  // Memoização do retorno
  const returnValue = useMemo<UseEditPostReturn>(() => ({
    ...state,
    updateField,
    handleSubmit,
    resetForm,
    validateForm,
    refreshPost
  }), [state, updateField, handleSubmit, resetForm, validateForm, refreshPost]);

  return returnValue;
};

/**
 * Hook simplificado para casos básicos
 * 
 * @param postId - ID do post
 * @returns Versão simplificada do hook
 */
export const useEditPostSimple = (postId: string) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'Sem Categoria',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await postService.updatePost(postId, formData);
      if (response.success) {
        console.log('Post atualizado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    } finally {
      setIsSaving(false);
    }
  }, [postId, formData]);

  return {
    formData,
    isLoading,
    isSaving,
    updateField,
    handleSubmit,
    setFormData,
    setIsLoading
  };
};
