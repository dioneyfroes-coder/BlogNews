// src/components/PostManagement/EditPost/EditPostLoading.tsx

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Skeleton,
  Paper
} from '@mui/material';

interface EditPostLoadingProps {
  /** Mensagem personalizada de loading */
  message?: string;
}

/**
 * Componente de loading para EditPost
 * Mostra skeleton enquanto carrega o post
 */
export const EditPostLoading: React.FC<EditPostLoadingProps> = ({
  message = 'Carregando post...'
}) => {
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Título da página */}
        <Skeleton 
          variant="text" 
          width="300px" 
          height={60} 
          sx={{ mb: 3 }}
        />

        <Paper elevation={1} sx={{ p: 3 }}>
          {/* Campo título */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>

          {/* Campo autor */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="60px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>

          {/* Campo categoria */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>

          {/* Campo URL da imagem */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="120px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Box>

          {/* Campo resumo */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="70px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Box>

          {/* Editor de conteúdo */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Box>

          {/* Botões */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width="200px" height={48} />
            <Skeleton variant="rectangular" width="100px" height={48} />
          </Box>
        </Paper>

        {/* Mensagem de loading */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mt: 2 
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
