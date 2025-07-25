// src/components/PostManagement/DeletePost/DeletePost.tsx

"use client";

import React from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { DeletePostProps } from '@/types/postManagement';
import { useDeletePost } from '@/hooks/useDeletePost';
import { DEFAULT_LABELS } from '@/lib/utils/postManagementUtils';
import { DeletePostButton } from './DeletePostButton';
import { DeletePostModal } from './DeletePostModal';
import HelpBalloon from '@/components/HelpBallon';

/**
 * Componente DeletePost refatorado
 * 
 * Responsabilidades:
 * - Orquestrar os componentes filhos
 * - Gerenciar estado através do hook
 * - Renderização baseada no modo selecionado
 * 
 * @example
 * ```tsx
 * <DeletePost 
 *   postId="post-id-123"
 *   onPostDeleted={(id) => console.log('Deletado!', id)}
 *   mode="modal"
 *   confirmBeforeDelete={true}
 * />
 * ```
 */
export const DeletePost: React.FC<DeletePostProps> = ({
  postId,
  onPostDeleted,
  onError,
  redirectUrl,
  mode = 'page',
  confirmBeforeDelete = true,
  buttonText
}) => {
  const router = useRouter();

  // Hook para gerenciar estado da deleção
  const {
    isDeleting,
    error,
    isConfirmModalOpen,
    handleDelete,
    openConfirmModal,
    closeConfirmModal,
    confirmDelete
  } = useDeletePost(postId, {
    autoConfirm: !confirmBeforeDelete,
    onDeleteSuccess: (deletedId) => {
      toast.success('Post deletado com sucesso');
      onPostDeleted?.(deletedId);
      console.log('Post deletado com sucesso:', deletedId);
      
      // Redirecionar se URL customizada fornecida
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    },
    onDeleteError: (errorMessage) => {
      toast.error(`Erro: ${errorMessage}`);
      onError?.(errorMessage);
      console.error('Erro ao deletar post:', errorMessage);
    }
  });

  // Renderização para modo 'button'
  if (mode === 'button') {
    return (
      <>
        <DeletePostButton
          isDeleting={isDeleting}
          error={error}
          onDelete={confirmBeforeDelete ? openConfirmModal : handleDelete}
          buttonText={buttonText}
          confirmText={!confirmBeforeDelete ? DEFAULT_LABELS.deletePost.confirmText : undefined}
        />

        {/* Modal de confirmação se necessário */}
        {confirmBeforeDelete && (
          <DeletePostModal
            open={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={confirmDelete}
            isDeleting={isDeleting}
            error={error}
          />
        )}
      </>
    );
  }

  // Renderização para modo 'modal'
  if (mode === 'modal') {
    return (
      <DeletePostModal
        open={true} // Sempre aberto no modo modal
        onClose={() => {
          // No modo modal, fechar significa cancelar
          router.back();
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        error={error}
      />
    );
  }

  // Modo 'page' (padrão)
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {DEFAULT_LABELS.deletePost.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          {DEFAULT_LABELS.deletePost.confirmText}
        </Typography>

        {/* Erro se houver */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <DeletePostButton
          isDeleting={isDeleting}
          error={error}
          onDelete={confirmBeforeDelete ? openConfirmModal : handleDelete}
          buttonText={buttonText || DEFAULT_LABELS.deletePost.deleteButton}
          variant="contained"
          color="error"
          size="large"
          confirmText={!confirmBeforeDelete ? DEFAULT_LABELS.deletePost.confirmText : undefined}
        />

        {/* Modal de confirmação se necessário */}
        {confirmBeforeDelete && (
          <DeletePostModal
            open={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={confirmDelete}
            isDeleting={isDeleting}
            error={error}
          />
        )}

        {/* Balão de ajuda */}
        <Box sx={{ mt: 3 }}>
          <HelpBalloon message={DEFAULT_LABELS.deletePost.helpText} />
        </Box>
      </Box>
    </Container>
  );
};

export default DeletePost;
