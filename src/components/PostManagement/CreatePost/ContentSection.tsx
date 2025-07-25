// src/components/CreatePost/ContentSection.tsx
/**
 * Seção de conteúdo do formulário de post
 * @fileoverview Editor Slate.js e campo de resumo
 */

import React, { useCallback } from 'react';
import {
  Typography,
  TextField,
  FormHelperText,
  Box,
} from '@mui/material';
import { Descendant } from 'slate';
import SlateEditor from '@/components/slate/SlateEditor';
import { slateToHtml } from '@/lib/slate/utils';
import { CreatePostData, ValidationErrors, LoadingState } from '@/hooks/useCreatePostForm';

/**
 * Props da seção de conteúdo
 */
interface ContentSectionProps {
  formData: CreatePostData;
  editorValue: Descendant[];
  errors: ValidationErrors;
  loadingState: LoadingState;
  updateField: <K extends keyof CreatePostData>(field: K, value: CreatePostData[K]) => void;
  setEditorValue: (value: Descendant[]) => void;
}

/**
 * Componente da seção de conteúdo
 */
const ContentSection: React.FC<ContentSectionProps> = ({
  formData,
  editorValue,
  errors,
  loadingState,
  updateField,
  setEditorValue,
}) => {
  /**
   * Manipula mudanças no editor Slate
   */
  const handleEditorChange = useCallback((value: Descendant[]) => {
    setEditorValue(value);
    const htmlContent = slateToHtml(value);
    updateField('content', htmlContent);
  }, [updateField, setEditorValue]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Conteúdo
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Conteúdo do Post *
        </Typography>
        <SlateEditor
          initialValue={editorValue}
          onChange={handleEditorChange}
          placeholder="Digite o conteúdo do seu post aqui. Use a barra de ferramentas para formatação..."
          minHeight={300}
          showToolbar={true}
        />
        {errors.content && (
          <FormHelperText error sx={{ mt: 1 }}>
            {errors.content}
          </FormHelperText>
        )}
      </Box>

      <TextField
        fullWidth
        label="Resumo (opcional)"
        multiline
        rows={3}
        value={formData.excerpt}
        onChange={(e) => updateField('excerpt', e.target.value)}
        helperText="Se não preenchido, será gerado automaticamente do conteúdo"
        disabled={loadingState.saving}
        placeholder="Escreva um breve resumo do post para exibição em listas..."
      />
    </Box>
  );
};

export default ContentSection;
