// src/components/CategoryFilter/CategoryError.tsx

import React from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface CategoryErrorProps {
  /** Mensagem de erro */
  error: string;
  /** Callback para tentar novamente */
  onRetry?: () => void;
  /** Mostrar botão de retry */
  showRetry?: boolean;
}

/**
 * Componente para exibir erros do CategoryFilter
 * Responsável por mostrar mensagens de erro de forma amigável
 */
export const CategoryError: React.FC<CategoryErrorProps> = ({
  error,
  onRetry,
  showRetry = true
}) => {
  return (
    <Alert 
      severity="error" 
      sx={{ mt: 1 }}
      action={
        showRetry && onRetry && (
          <IconButton
            aria-label="tentar novamente"
            color="inherit"
            size="small"
            onClick={onRetry}
            title="Tentar carregar categorias novamente"
          >
            <RefreshIcon fontSize="inherit" />
          </IconButton>
        )
      }
    >
      <AlertTitle>Erro no filtro</AlertTitle>
      {error}
    </Alert>
  );
};
