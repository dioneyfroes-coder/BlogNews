// src/hooks/useDeletePost.ts

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  UseDeletePostReturn, 
  DeletePostHookOptions,
  DeletePostState 
} from '@/types/postManagement';
import { 
  PostManagementUtils,
  POST_ERROR_MESSAGES 
} from '@/lib/utils/postManagementUtils';
import { postService } from '@/services';
import { logger } from '@/lib/logger';

/**
 * Hook personalizado para deleção de posts
 * 
 * @param postId - ID do post a ser deletado
 * @param options - Opções de configuração do hook
 * @returns Estado e funções para controle da deleção
 * 
 * @example
 * ```tsx
 * const { 
 *   isDeleting, 
 *   error,
 *   isConfirmModalOpen,
 *   handleDelete,
 *   openConfirmModal,
 *   confirmDelete 
 * } = useDeletePost('post-id-123', {
 *   autoConfirm: false,
 *   onDeleteSuccess: (id) => console.log('Deletado!', id)
 * });
 * ```
 */
export const useDeletePost = (
  postId: string,
  options: DeletePostHookOptions = {}
): UseDeletePostReturn => {
  const {
    autoConfirm = false,
    onDeleteSuccess,
    onDeleteError
  } = options;

  const router = useRouter();

  // Estado interno
  const [state, setState] = useState<DeletePostState>({
    isDeleting: false,
    error: null,
    isConfirmModalOpen: false
  });

  /**
   * Função interna para executar a deleção
   */
  const executeDelete = useCallback(async (): Promise<void> => {
    if (!postId) {
      const errorMessage = 'ID do post é obrigatório';
      setState(prev => ({ ...prev, error: errorMessage }));
      onDeleteError?.(errorMessage);
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isDeleting: true, 
      error: null,
      isConfirmModalOpen: false 
    }));

    try {
      logger.info('Iniciando deleção de post', { postId, component: 'useDeletePost' });
      
      const response = await postService.deletePost(postId);

      if (response.success) {
        logger.info('Post deletado com sucesso', { postId });
        
        setState(prev => ({ 
          ...prev, 
          isDeleting: false 
        }));

        // Callback de sucesso
        onDeleteSuccess?.(postId);

        // Redirecionar após sucesso
        const redirectUrl = PostManagementUtils.generateRedirectUrl('delete');
        router.push(redirectUrl);
      } else {
        throw new Error(response.error || POST_ERROR_MESSAGES.DELETE_ERROR);
      }
    } catch (error: any) {
      const errorMessage = error.message || POST_ERROR_MESSAGES.DELETE_ERROR;
      logger.error('Erro ao deletar post', error, { postId });
      
      setState(prev => ({
        ...prev,
        isDeleting: false,
        error: errorMessage
      }));

      onDeleteError?.(errorMessage);
    }
  }, [postId, onDeleteSuccess, onDeleteError, router]);

  /**
   * Manipula tentativa de deleção
   */
  const handleDelete = useCallback(async (): Promise<void> => {
    if (autoConfirm) {
      await executeDelete();
    } else {
      setState(prev => ({ ...prev, isConfirmModalOpen: true }));
    }
  }, [autoConfirm, executeDelete]);

  /**
   * Abre modal de confirmação
   */
  const openConfirmModal = useCallback(() => {
    setState(prev => ({ ...prev, isConfirmModalOpen: true, error: null }));
  }, []);

  /**
   * Fecha modal de confirmação
   */
  const closeConfirmModal = useCallback(() => {
    setState(prev => ({ ...prev, isConfirmModalOpen: false }));
  }, []);

  /**
   * Confirma e executa a deleção
   */
  const confirmDelete = useCallback(async (): Promise<void> => {
    await executeDelete();
  }, [executeDelete]);

  // Memoização do retorno
  const returnValue = useMemo<UseDeletePostReturn>(() => ({
    ...state,
    handleDelete,
    openConfirmModal,
    closeConfirmModal,
    confirmDelete
  }), [state, handleDelete, openConfirmModal, closeConfirmModal, confirmDelete]);

  return returnValue;
};

/**
 * Hook simplificado para casos básicos
 * 
 * @param postId - ID do post
 * @param onSuccess - Callback de sucesso
 * @returns Versão simplificada do hook
 */
export const useDeletePostSimple = (
  postId: string, 
  onSuccess?: (deletedId: string) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (!postId) {
      setError('ID do post é obrigatório');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await postService.deletePost(postId);
      
      if (response.success) {
        onSuccess?.(postId);
        router.push('/admin');
      } else {
        throw new Error(response.error || 'Erro ao deletar post');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  }, [postId, onSuccess, router]);

  return {
    isDeleting,
    error,
    handleDelete,
    setError
  };
};

/**
 * Hook para deleção em lote
 * 
 * @param postIds - Array de IDs dos posts
 * @param options - Opções de configuração
 * @returns Hook para deleção múltipla
 */
export const useBulkDeletePosts = (
  postIds: string[],
  options: {
    onSuccess?: (deletedIds: string[]) => void;
    onError?: (error: string, failedIds: string[]) => void;
    onProgress?: (current: number, total: number) => void;
  } = {}
) => {
  const { onSuccess, onError, onProgress } = options;
  
  const [state, setState] = useState({
    isDeleting: false,
    deletedIds: [] as string[],
    failedIds: [] as string[],
    currentIndex: 0,
    error: null as string | null
  });

  const handleBulkDelete = useCallback(async () => {
    if (!postIds.length) return;

    setState(prev => ({
      ...prev,
      isDeleting: true,
      deletedIds: [],
      failedIds: [],
      currentIndex: 0,
      error: null
    }));

    const results = {
      deleted: [] as string[],
      failed: [] as string[]
    };

    for (let i = 0; i < postIds.length; i++) {
      const postId = postIds[i];
      
      setState(prev => ({ ...prev, currentIndex: i }));
      onProgress?.(i + 1, postIds.length);

      try {
        const response = await postService.deletePost(postId);
        
        if (response.success) {
          results.deleted.push(postId);
        } else {
          results.failed.push(postId);
        }
      } catch (error) {
        results.failed.push(postId);
      }

      // Pequeno delay para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setState(prev => ({
      ...prev,
      isDeleting: false,
      deletedIds: results.deleted,
      failedIds: results.failed,
      error: results.failed.length > 0 ? `Falha ao deletar ${results.failed.length} posts` : null
    }));

    if (results.deleted.length > 0) {
      onSuccess?.(results.deleted);
    }

    if (results.failed.length > 0) {
      onError?.(`Falha ao deletar ${results.failed.length} posts`, results.failed);
    }
  }, [postIds, onSuccess, onError, onProgress]);

  return {
    ...state,
    handleBulkDelete,
    progress: postIds.length > 0 ? (state.currentIndex / postIds.length) * 100 : 0
  };
};
