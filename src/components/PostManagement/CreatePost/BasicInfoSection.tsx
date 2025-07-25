// src/components/CreatePost/BasicInfoSection.tsx
/**
 * Seção de informações básicas do formulário de post
 * @fileoverview Campos de título, autor e categoria
 */

import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Box,
} from '@mui/material';
import { categories } from '@/lib/constants/categories';
import { CreatePostData, ValidationErrors, LoadingState } from '@/hooks/useCreatePostForm';

/**
 * Props da seção de informações básicas
 */
interface BasicInfoSectionProps {
  formData: CreatePostData;
  errors: ValidationErrors;
  loadingState: LoadingState;
  updateField: <K extends keyof CreatePostData>(field: K, value: CreatePostData[K]) => void;
}

/**
 * Componente da seção de informações básicas
 */
const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  loadingState,
  updateField,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informações Básicas
      </Typography>
      
      <Stack spacing={2}>
        <TextField
          required
          fullWidth
          label="Título"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          disabled={loadingState.saving}
          placeholder="Digite um título atrativo para seu post..."
        />

        <TextField
          required
          fullWidth
          label="Autor"
          value={formData.author}
          onChange={(e) => updateField('author', e.target.value)}
          error={!!errors.author}
          helperText={errors.author}
          disabled={loadingState.saving}
          placeholder="Nome do autor do post"
        />

        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Categoria *</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            label="Categoria *"
            disabled={loadingState.saving}
          >
            <MenuItem value="" disabled>
              <em>Selecione uma categoria</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <FormHelperText>{errors.category}</FormHelperText>
          )}
        </FormControl>
      </Stack>
    </Box>
  );
};

export default BasicInfoSection;
