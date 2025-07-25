// src/components/PostManagement/DeletePost/DeletePostModal.tsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { Warning as WarningIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DEFAULT_LABELS } from '@/lib/utils/postManagementUtils';

interface DeletePostModalProps {
  /** Modal está aberto */
  open: boolean;
  /** Callback para fechar modal */
  onClose: () => void;
  /** Callback para confirmar deleção */
  onConfirm: () => void;
  /** Estado de deleção */
  isDeleting: boolean;
  /** Erro durante deleção */
  error?: string | null;
  /** Título do post (opcional) */
  postTitle?: string;
  /** Texto de confirmação customizado */
  confirmText?: string;
  /** Texto de ajuda customizado */
  helpText?: string;
}

/**
 * Modal de confirmação para deletar post
 * Oferece interface segura com confirmação explícita
 */
export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  error,
  postTitle,
  confirmText,
  helpText
}) => {
  const finalConfirmText = confirmText || DEFAULT_LABELS.deletePost.confirmText;
  const finalHelpText = helpText || DEFAULT_LABELS.deletePost.helpText;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-post-dialog-title"
      aria-describedby="delete-post-dialog-description"
    >
      <DialogTitle 
        id="delete-post-dialog-title"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pb: 1
        }}
      >
        <WarningIcon color="warning" />
        {DEFAULT_LABELS.deletePost.title}
      </DialogTitle>

      <DialogContent>
        {/* Erro se houver */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Texto de confirmação */}
        <Typography 
          id="delete-post-dialog-description" 
          variant="body1" 
          sx={{ mb: 2 }}
        >
          {finalConfirmText}
        </Typography>

        {/* Título do post se fornecido */}
        {postTitle && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1, 
              mb: 2,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Post a ser deletado:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              "{postTitle}"
            </Typography>
          </Box>
        )}

        {/* Texto de ajuda */}
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {finalHelpText}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          color="primary"
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={isDeleting}
          color="error"
          variant="contained"
          startIcon={
            isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
          autoFocus
        >
          {isDeleting ? 'Deletando...' : 'Confirmar Deleção'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
