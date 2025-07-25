// src/components/PostManagement/EditPost/EditPostForm.tsx

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { categories } from '@/lib/constants/categories';
import type { EditPostState } from '@/types/postManagement';

interface EditPostFormProps {
  /** Dados do formulário */
  formData: EditPostState['formData'];
  /** Erros de validação */
  errors: Record<string, string>;
  /** Estado de salvamento */
  isSaving: boolean;
  /** Post foi modificado */
  isDirty: boolean;
  /** Callback para atualizar campo */
  onFieldChange: (field: keyof EditPostState['formData'], value: any) => void;
  /** Callback para submeter formulário */
  onSubmit: () => void;
  /** Callback para resetar formulário */
  onReset?: () => void;
  /** Desabilitar formulário */
  disabled?: boolean;
}

/**
 * Componente de formulário para edição de posts
 * Responsável apenas pela renderização dos campos do formulário
 */
export const EditPostForm: React.FC<EditPostFormProps> = ({
  formData,
  errors,
  isSaving,
  isDirty,
  onFieldChange,
  onSubmit,
  onReset,
  disabled = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      {/* Título */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Título"
        name="title"
        value={formData.title}
        onChange={(e) => onFieldChange('title', e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
        disabled={disabled || isSaving}
        aria-describedby="title-helper"
      />

      {/* Autor */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="author"
        label="Autor"
        name="author"
        value={formData.author}
        onChange={(e) => onFieldChange('author', e.target.value)}
        error={!!errors.author}
        helperText={errors.author}
        disabled={disabled || isSaving}
        aria-describedby="author-helper"
      />

      {/* Categoria */}
      <FormControl 
        fullWidth 
        margin="normal" 
        error={!!errors.category}
        disabled={disabled || isSaving}
      >
        <InputLabel id="category-label">Categoria</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={formData.category}
          onChange={(e) => onFieldChange('category', e.target.value)}
          label="Categoria"
          aria-describedby="category-helper"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {errors.category && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
            {errors.category}
          </Typography>
        )}
      </FormControl>

      {/* URL da Imagem */}
      <TextField
        margin="normal"
        fullWidth
        id="imageUrl"
        label="URL da Imagem (opcional)"
        name="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => onFieldChange('imageUrl', e.target.value)}
        error={!!errors.imageUrl}
        helperText={errors.imageUrl || 'URL da imagem para miniatura do post'}
        disabled={disabled || isSaving}
        aria-describedby="imageUrl-helper"
      />

      {/* Resumo */}
      <TextField
        margin="normal"
        fullWidth
        id="excerpt"
        label="Resumo (opcional)"
        name="excerpt"
        multiline
        rows={3}
        value={formData.excerpt}
        onChange={(e) => onFieldChange('excerpt', e.target.value)}
        error={!!errors.excerpt}
        helperText={errors.excerpt || 'Breve descrição do post (será gerado automaticamente se não fornecido)'}
        disabled={disabled || isSaving}
        aria-describedby="excerpt-helper"
      />

      {/* Tags */}
      <TextField
        margin="normal"
        fullWidth
        id="tags"
        label="Tags (opcional)"
        name="tags"
        value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
        onChange={(e) => {
          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
          onFieldChange('tags', tags);
        }}
        helperText="Separe as tags por vírgulas (ex: tecnologia, javascript, tutorial)"
        disabled={disabled || isSaving}
        aria-describedby="tags-helper"
      />

      {/* Indicador de mudanças */}
      {isDirty && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2">
            Há alterações não salvas no formulário.
          </Typography>
        </Alert>
      )}

      {/* Botões de ação */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={disabled || isSaving || !isDirty}
          sx={{ flex: 1 }}
          aria-describedby="submit-helper"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
        
        {onReset && isDirty && (
          <Button 
            variant="outlined" 
            onClick={onReset}
            disabled={disabled || isSaving}
            aria-describedby="reset-helper"
          >
            Resetar
          </Button>
        )}
      </Box>

      {/* Mensagens de ajuda */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Campos obrigatórios
        </Typography>
      </Box>
    </Box>
  );
};
