// src/hooks/usePostSubmission.ts
/**
 * Hook para submissão de posts
 * @fileoverview Lógica de envio e processamento de posts
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePostData, ValidationErrors, LoadingState } from './useCreatePostForm';

/**
 * Interface para props do hook
 */
interface UsePostSubmissionProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<CreatePostData>;
  onPostCreated?: (post: any) => void;
}

/**
 * Hook para gerenciar submissão de posts
 */
export const usePostSubmission = ({
  mode = 'create',
  initialData,
  onPostCreated,
}: UsePostSubmissionProps) => {
  const router = useRouter();

  /**
   * Gera resumo automático do conteúdo HTML
   */
  const generateExcerpt = useCallback((htmlContent: string): string => {
    const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
  }, []);

  /**
   * Submete formulário para criar/editar post
   */
  const submitPost = useCallback(async (
    formData: CreatePostData,
    setErrors: (errors: ValidationErrors) => void,
    setSuccessMessage: (message: string) => void,
    updateLoading: (field: keyof LoadingState, value: boolean) => void
  ) => {
    updateLoading('saving', true);

    try {
      const postData = {
        ...formData,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
      };

      const url = mode === 'edit' && initialData?.id 
        ? `/api/posts/${initialData.id}` 
        : '/api/posts';
      
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        const action = formData.published ? 'publicado' : 'salvo como rascunho';
        const message = mode === 'edit' 
          ? `Post atualizado e ${action} com sucesso!`
          : `Post criado e ${action} com sucesso!`;
        
        setSuccessMessage(message);

        // Executa callback ou redireciona
        if (onPostCreated && result.data) {
          onPostCreated(result.data);
        } else if (result.data) {
          setTimeout(() => {
            router.push(`/posts/${result.data._id}`);
          }, 1500);
        }
      } else {
        setErrors({ 
          general: result.message || `Erro ao ${mode === 'edit' ? 'atualizar' : 'criar'} post` 
        });
      }
    } catch (error) {
      setErrors({ 
        general: `Erro inesperado ao ${mode === 'edit' ? 'atualizar' : 'criar'} post` 
      });
    } finally {
      updateLoading('saving', false);
    }
  }, [mode, initialData, onPostCreated, router, generateExcerpt]);

  /**
   * Upload de imagem
   */
  const uploadImage = useCallback(async (
    file: File,
    updateField: (field: 'imageUrl', value: string) => void,
    setErrors: (errors: ValidationErrors) => void,
    setSuccessMessage: (message: string) => void,
    updateLoading: (field: keyof LoadingState, value: boolean) => void
  ) => {
    updateLoading('uploading', true);
    setErrors({});

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok && result.url) {
        updateField('imageUrl', result.url);
        setSuccessMessage('Imagem carregada com sucesso!');
      } else {
        setErrors({ general: result.message || 'Erro ao fazer upload da imagem' });
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado ao fazer upload da imagem' });
    } finally {
      updateLoading('uploading', false);
    }
  }, []);

  return {
    submitPost,
    uploadImage,
    generateExcerpt,
  };
};
