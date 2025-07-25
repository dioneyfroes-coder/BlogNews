// src/components/PostManagement/CreatePost/CreatePost.tsx
/**
 * Componente principal para criação/edição de posts
 * @fileoverview Sistema modular e limpo usando hooks e componentes separados
 */

"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Box,
} from '@mui/material';
import BasicInfoSection from './BasicInfoSection';
import ContentSection from './ContentSection';
import MediaSection from './MediaSection';
import PublishSection from './PublishSection';
import { useCreatePostForm, type CreatePostData } from '@/hooks/useCreatePostForm';
import { useFormValidation } from '@/hooks/useFormValidation';
import { usePostSubmission } from '@/hooks/usePostSubmission';

/**
 * Props do componente principal
 */
interface CreatePostProps {
  /** Callback executado quando post é criado com sucesso */
  onPostCreated?: (post: any) => void;
  /** Dados iniciais para edição */
  initialData?: Partial<CreatePostData>;
  /** Modo de operação (criar ou editar) */
  mode?: 'create' | 'edit';
}

/**
 * Componente principal para criação/edição de posts
 */
const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  initialData,
  mode = 'create',
}) => {
  const router = useRouter();
  const { validateForm } = useFormValidation();
  const { submitPost, uploadImage } = usePostSubmission({
    mode,
    initialData,
    onPostCreated,
  });

  // Hook principal do formulário
  const {
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
  } = useCreatePostForm(initialData);

  /**
   * Adiciona nova tag à lista
   */
  const handleAddTag = useCallback(() => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      updateField('tags', [...formData.tags, trimmedTag]);
      setNewTag('');
    }
  }, [newTag, formData.tags, updateField]);

  /**
   * Remove tag da lista
   */
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  }, [formData.tags, updateField]);

  /**
   * Faz upload de imagem
   */
  const handleImageUpload = useCallback((file: File) => {
    uploadImage(
      file,
      (field, value) => updateField(field, value),
      setErrors,
      setSuccessMessage,
      updateLoading
    );
  }, [uploadImage, updateField, setErrors, setSuccessMessage, updateLoading]);

  /**
   * Submete o formulário
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Limpa estados anteriores
    setErrors({});
    setSuccessMessage('');

    // Valida formulário
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await submitPost(formData, setErrors, setSuccessMessage, updateLoading);
  }, [formData, validateForm, submitPost, setErrors, setSuccessMessage, updateLoading]);

  /**
   * Salva como rascunho
   */
  const handleSaveDraft = useCallback(() => {
    updateField('published', false);
    setTimeout(() => handleSubmit(), 0);
  }, [updateField, handleSubmit]);

  /**
   * Cancela e volta
   */
  const handleCancel = useCallback(() => {
    if (loadingState.saving) return;
    router.back();
  }, [router, loadingState.saving]);

  /**
   * Título da página baseado no modo
   */
  const pageTitle = useMemo(() => {
    return mode === 'edit' ? 'Editar Post' : 'Criar Novo Post';
  }, [mode]);

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {pageTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {mode === 'edit' 
            ? 'Atualize as informações do seu post'
            : 'Crie um novo post para o seu blog'
          }
        </Typography>
      </Box>

      {/* Alertas */}
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {errors.general && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setErrors(prev => ({ ...prev, general: undefined }))}
        >
          {errors.general}
        </Alert>
      )}

      {/* Formulário Principal */}
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box 
            component="form" 
            id="create-post-form"
            onSubmit={handleSubmit} 
            noValidate
          >
            <Stack spacing={4}>
              {/* Seção: Informações Básicas */}
              <BasicInfoSection
                formData={formData}
                errors={errors}
                loadingState={loadingState}
                updateField={updateField}
              />

              <Divider />

              {/* Seção: Conteúdo */}
              <ContentSection
                formData={formData}
                editorValue={editorValue}
                errors={errors}
                loadingState={loadingState}
                updateField={updateField}
                setEditorValue={setEditorValue}
              />

              <Divider />

              {/* Seção: Mídia e Metadados */}
              <MediaSection
                formData={formData}
                loadingState={loadingState}
                newTag={newTag}
                setNewTag={setNewTag}
                updateField={updateField}
                onImageUpload={handleImageUpload}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />

              <Divider />

              {/* Seção: Publicação */}
              <PublishSection
                formData={formData}
                loadingState={loadingState}
                mode={mode}
                updateField={updateField}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                onCancel={handleCancel}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Informações de Ajuda */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          <strong>Dicas:</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Use Ctrl+B para negrito, Ctrl+I para itálico no editor
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Posts salvos como rascunho não ficam visíveis publicamente
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • O resumo é gerado automaticamente se não for preenchido
        </Typography>
      </Box>
    </Container>
  );
};

export default CreatePost;
