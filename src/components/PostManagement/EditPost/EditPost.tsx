// src/components/PostManagement/EditPost/EditPost.tsx

"use client";

import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { EditPostProps } from '@/types/postManagement';
import { useEditPost } from '@/hooks/useEditPost';
import { DEFAULT_LABELS } from '@/lib/utils/postManagementUtils';
import { EditPostForm } from './EditPostForm';
import { EditPostContent } from './EditPostContent';
import { EditPostLoading } from './EditPostLoading';
import { EditPostError } from './EditPostError';

/**
 * Componente EditPost refatorado
 * 
 * Responsabilidades:
 * - Orquestrar os componentes filhos
 * - Gerenciar estado através do hook
 * - Renderização condicional baseada no estado
 * 
 * @example
 * ```tsx
 * <EditPost 
 *   postId="post-id-123"
 *   onPostUpdated={(post) => console.log('Atualizado!', post)}
 *   mode="page"
 * />
 * ```
 */
export const EditPost: React.FC<EditPostProps> = ({
  postId,
  onPostUpdated,
  onError,
  redirectUrl,
  mode = 'page'
}) => {
  const router = useRouter();

  // Hook para gerenciar estado da edição
  const {
    post,
    formData,
    isLoading,
    isSaving,
    errors,
    error,
    isDirty,
    updateField,
    handleSubmit,
    resetForm,
    refreshPost
  } = useEditPost(postId, {
    autoValidate: true,
    onPostLoaded: (loadedPost) => {
      console.log('Post carregado para edição:', loadedPost.title);
    },
    onSaveSuccess: (updatedPost) => {
      onPostUpdated?.(updatedPost);
      console.log('Post atualizado com sucesso:', updatedPost.title);
    },
    onSaveError: (errorMessage) => {
      onError?.(errorMessage);
      console.error('Erro ao salvar post:', errorMessage);
    }
  });

  // Handlers para ações de erro
  const handleRetry = () => {
    refreshPost();
  };

  const handleGoHome = () => {
    router.push('/admin');
  };

  const handleContentChange = (content: string) => {
    updateField('content', content);
  };

  // Renderização condicional baseada no estado
  if (isLoading) {
    return <EditPostLoading message={DEFAULT_LABELS.editPost.loadingText} />;
  }

  if (error) {
    return (
      <EditPostError
        error={error}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        showRetry
        showGoHome
      />
    );
  }

  if (!post) {
    return (
      <EditPostError
        error={DEFAULT_LABELS.editPost.notFoundText}
        onGoHome={handleGoHome}
        showRetry={false}
        showGoHome
      />
    );
  }

  // Renderização para diferentes modos
  if (mode === 'modal') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {DEFAULT_LABELS.editPost.title}
        </Typography>

        {/* Erro geral */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulário básico */}
        <EditPostForm
          formData={formData}
          errors={errors}
          isSaving={isSaving}
          isDirty={isDirty}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        {/* Editor de conteúdo */}
        <EditPostContent
          content={formData.content}
          error={errors.content}
          onChange={handleContentChange}
          disabled={isSaving}
          minHeight={300}
        />
      </Box>
    );
  }

  if (mode === 'inline') {
    return (
      <Box>
        {/* Erro geral */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulário simplificado */}
        <EditPostForm
          formData={formData}
          errors={errors}
          isSaving={isSaving}
          isDirty={isDirty}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />
      </Box>
    );
  }

  // Modo 'page' (padrão)
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {DEFAULT_LABELS.editPost.title}
        </Typography>

        {/* Informações do post */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Editando: <strong>{post.title}</strong>
          <br />
          Criado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          {post.updatedAt !== post.createdAt && (
            <>
              <br />
              Última atualização: {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
            </>
          )}
        </Alert>

        {/* Erro geral */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulário principal */}
        <EditPostForm
          formData={formData}
          errors={errors}
          isSaving={isSaving}
          isDirty={isDirty}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        {/* Editor de conteúdo */}
        <EditPostContent
          content={formData.content}
          error={errors.content}
          onChange={handleContentChange}
          disabled={isSaving}
          minHeight={400}
        />
      </Box>
    </Container>
  );
};

export default EditPost;
