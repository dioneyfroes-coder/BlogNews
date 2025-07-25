// src/components/PostManagement/EditPost/EditPostError.tsx

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Paper
} from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';

interface EditPostErrorProps {
  /** Mensagem de erro */
  error: string;
  /** Callback para tentar novamente */
  onRetry?: () => void;
  /** Callback para voltar à página inicial */
  onGoHome?: () => void;
  /** Mostrar botão de retry */
  showRetry?: boolean;
  /** Mostrar botão de voltar ao início */
  showGoHome?: boolean;
}

/**
 * Componente para exibir erros na edição de posts
 * Oferece opções de retry e navegação
 */
export const EditPostError: React.FC<EditPostErrorProps> = ({
  error,
  onRetry,
  onGoHome,
  showRetry = true,
  showGoHome = true
}) => {
  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Post
        </Typography>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                {showRetry && onRetry && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={onRetry}
                    startIcon={<RefreshIcon />}
                    aria-label="Tentar carregar novamente"
                  >
                    Tentar Novamente
                  </Button>
                )}
                {showGoHome && onGoHome && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={onGoHome}
                    startIcon={<HomeIcon />}
                    aria-label="Voltar à página inicial"
                  >
                    Início
                  </Button>
                )}
              </Box>
            }
          >
            <AlertTitle>Erro ao Carregar Post</AlertTitle>
            {error}
          </Alert>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Possíveis causas:
            </Typography>
            
            <Box component="ul" sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Post não encontrado ou foi removido
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Problemas de conexão com o servidor
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Você não tem permissão para editar este post
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Erro interno do servidor
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              {showRetry && onRetry && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onRetry}
                  startIcon={<RefreshIcon />}
                >
                  Tentar Novamente
                </Button>
              )}
              
              {showGoHome && onGoHome && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onGoHome}
                  startIcon={<HomeIcon />}
                >
                  Voltar ao Início
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
