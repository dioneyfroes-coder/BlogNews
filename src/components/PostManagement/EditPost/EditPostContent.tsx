// src/components/PostManagement/EditPost/EditPostContent.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import type { EditPostState } from '@/types/postManagement';

// Importação dinâmica do editor para evitar problemas de SSR
const Editor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, minHeight: 200 }}>
      <Typography color="text.secondary">Carregando editor...</Typography>
    </Box>
  )
});

interface EditPostContentProps {
  /** Conteúdo atual */
  content: string;
  /** Erro de validação */
  error?: string;
  /** Callback para mudança do conteúdo */
  onChange: (content: string) => void;
  /** Desabilitar editor */
  disabled?: boolean;
  /** Altura mínima do editor */
  minHeight?: number;
}

/**
 * Componente para edição do conteúdo do post
 * Responsável pela renderização do editor de texto rico
 */
export const EditPostContent: React.FC<EditPostContentProps> = ({
  content,
  error,
  onChange,
  disabled = false,
  minHeight = 400
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h6" 
        component="label" 
        htmlFor="content-editor"
        sx={{ mb: 2, display: 'block' }}
      >
        Conteúdo *
      </Typography>
      
      <Box 
        sx={{ 
          border: error ? '2px solid #f44336' : '1px solid #ccc',
          borderRadius: 1,
          minHeight,
          '& .ql-container': {
            minHeight: minHeight - 50 // Ajusta para altura da toolbar
          }
        }}
      >
        <Editor 
          value={content} 
          onChange={onChange}
          placeholder="Digite o conteúdo do seu post aqui..."
        />
      </Box>
      
      {error && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ mt: 1, ml: 2, display: 'block' }}
        >
          {error}
        </Typography>
      )}
      
      {!error && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 1, ml: 2, display: 'block' }}
        >
          Use o editor para formatar seu texto. Suporte completo para negrito, itálico, listas e links.
        </Typography>
      )}
    </Box>
  );
};
