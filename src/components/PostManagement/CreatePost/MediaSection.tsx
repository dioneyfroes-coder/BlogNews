// src/components/CreatePost/MediaSection.tsx
/**
 * Seção de mídia e metadados do formulário de post
 * @fileoverview Upload de imagens e sistema de tags
 */

import React, { useCallback } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { CreatePostData, ValidationErrors, LoadingState } from '@/hooks/useCreatePostForm';

/**
 * Props da seção de mídia
 */
interface MediaSectionProps {
  formData: CreatePostData;
  loadingState: LoadingState;
  newTag: string;
  setNewTag: (tag: string) => void;
  updateField: <K extends keyof CreatePostData>(field: K, value: CreatePostData[K]) => void;
  onImageUpload: (file: File) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

/**
 * Componente da seção de mídia e metadados
 */
const MediaSection: React.FC<MediaSectionProps> = ({
  formData,
  loadingState,
  newTag,
  setNewTag,
  updateField,
  onImageUpload,
  onAddTag,
  onRemoveTag,
}) => {
  /**
   * Manipula seleção de arquivo para upload
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  /**
   * Manipula tecla Enter no campo de tag
   */
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  }, [onAddTag]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mídia e Metadados
      </Typography>
      
      <Stack spacing={3}>
        {/* Upload de imagem */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Imagem de Capa
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="URL da Imagem de Capa"
              value={formData.imageUrl}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              disabled={loadingState.saving || loadingState.uploading}
              placeholder="https://exemplo.com/imagem.jpg"
              InputProps={{
                endAdornment: loadingState.uploading && (
                  <CircularProgress size={20} />
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                disabled={loadingState.saving || loadingState.uploading}
                size="small"
              >
                Fazer Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Sistema de Tags */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Adicionar tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              disabled={loadingState.saving}
              placeholder="Ex: tecnologia, tutorial, dicas..."
              sx={{ flexGrow: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={onAddTag}
              disabled={!newTag.trim() || loadingState.saving}
              startIcon={<AddIcon />}
              size="small"
            >
              Adicionar
            </Button>
          </Box>

          {/* Lista de tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.tags.length > 0 ? (
              formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => onRemoveTag(tag)}
                  disabled={loadingState.saving}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Nenhuma tag adicionada ainda
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default MediaSection;
