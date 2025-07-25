// src/components/PostManagement/DeletePost/DeletePostButton.tsx

import React from 'react';
import {
  Button,
  CircularProgress,
  Tooltip,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import type { DeletePostState } from '@/types/postManagement';

interface DeletePostButtonProps {
  /** Estado de deleção */
  isDeleting: boolean;
  /** Erro durante deleção */
  error?: string | null;
  /** Callback para iniciar deleção */
  onDelete: () => void;
  /** Texto do botão */
  buttonText?: string;
  /** Variante do botão */
  variant?: 'contained' | 'outlined' | 'text';
  /** Cor do botão */
  color?: 'primary' | 'secondary' | 'error' | 'warning';
  /** Tamanho do botão */
  size?: 'small' | 'medium' | 'large';
  /** Desabilitar botão */
  disabled?: boolean;
  /** Mostrar ícone */
  showIcon?: boolean;
  /** Texto de confirmação */
  confirmText?: string;
}

/**
 * Componente de botão para deletar post
 * Responsável apenas pela renderização do botão de deleção
 */
export const DeletePostButton: React.FC<DeletePostButtonProps> = ({
  isDeleting,
  error,
  onDelete,
  buttonText = 'Deletar',
  variant = 'contained',
  color = 'error',
  size = 'medium',
  disabled = false,
  showIcon = true,
  confirmText
}) => {
  const handleClick = () => {
    // Confirmação simples se necessário
    if (confirmText) {
      const confirmed = window.confirm(confirmText);
      if (!confirmed) return;
    }
    
    onDelete();
  };

  const buttonContent = (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      disabled={disabled || isDeleting}
      startIcon={
        isDeleting ? (
          <CircularProgress size={16} color="inherit" />
        ) : showIcon ? (
          <DeleteIcon />
        ) : null
      }
      aria-label={isDeleting ? 'Deletando post...' : 'Deletar post'}
      sx={{
        minWidth: 120,
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
    >
      {isDeleting ? 'Deletando...' : buttonText}
    </Button>
  );

  // Wrap com tooltip se houver erro
  if (error) {
    return (
      <Tooltip title={`Erro: ${error}`} arrow>
        <Box sx={{ display: 'inline-block' }}>
          <Button
            variant={variant}
            color="warning"
            size={size}
            onClick={handleClick}
            disabled={disabled}
            startIcon={<WarningIcon />}
            aria-label="Erro ao deletar - clique para tentar novamente"
          >
            Tentar Novamente
          </Button>
        </Box>
      </Tooltip>
    );
  }

  return buttonContent;
};
