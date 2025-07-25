// src/components/CreatePost/PublishSection.tsx
/**
 * Seção de configurações de publicação
 * @fileoverview Controles de publicação e botões de ação
 */

import React, { useMemo } from 'react';
import {
  Typography,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Box,
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { CreatePostData, LoadingState } from '@/hooks/useCreatePostForm';

/**
 * Props da seção de publicação
 */
interface PublishSectionProps {
  formData: CreatePostData;
  loadingState: LoadingState;
  mode: 'create' | 'edit';
  updateField: <K extends keyof CreatePostData>(field: K, value: CreatePostData[K]) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
}

/**
 * Componente da seção de publicação
 */
const PublishSection: React.FC<PublishSectionProps> = ({
  formData,
  loadingState,
  mode,
  updateField,
  onSubmit,
  onSaveDraft,
  onCancel,
}) => {
  /**
   * Labels dos botões baseados no estado
   */
  const buttonLabels = useMemo(() => {
    const isEditing = mode === 'edit';
    return {
      primary: formData.published 
        ? (isEditing ? 'Atualizar e Publicar' : 'Criar e Publicar')
        : (isEditing ? 'Salvar Alterações' : 'Salvar Rascunho'),
      draft: isEditing ? 'Salvar como Rascunho' : 'Salvar Rascunho',
    };
  }, [mode, formData.published]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Publicação
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.published}
              onChange={(e) => updateField('published', e.target.checked)}
              disabled={loadingState.saving}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body1">
                {formData.published ? "Publicar imediatamente" : "Salvar como rascunho"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.published 
                  ? "O post ficará visível para todos os visitantes"
                  : "O post ficará salvo mas não será visível publicamente"
                }
              </Typography>
            </Box>
          }
        />
      </Box>

      {/* Botões de Ação */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          disabled={loadingState.saving}
          onClick={onSubmit}
          startIcon={
            loadingState.saving ? (
              <CircularProgress size={20} />
            ) : formData.published ? (
              <PublishIcon />
            ) : (
              <SaveIcon />
            )
          }
          sx={{ 
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            minWidth: 200 
          }}
        >
          {buttonLabels.primary}
        </Button>

        {formData.published && (
          <Button
            variant="outlined"
            onClick={onSaveDraft}
            disabled={loadingState.saving}
            startIcon={<SaveIcon />}
            sx={{ minWidth: 160 }}
          >
            {buttonLabels.draft}
          </Button>
        )}

        <Button
          variant="text"
          onClick={onCancel}
          disabled={loadingState.saving}
          startIcon={<CancelIcon />}
          color="inherit"
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default PublishSection;
