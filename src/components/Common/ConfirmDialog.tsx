// src/components/Common/ConfirmDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'info' | 'warning' | 'error';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  severity = 'info',
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 2 },
        },
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          pb: 1,
          fontSize: { xs: '1.125rem', md: '1.25rem' },
          fontWeight: 500,
        }}
      >
        {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{
            color: 'text.primary',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            minWidth: { xs: '100%', sm: 100 },
            order: { xs: 2, sm: 1 },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          sx={{
            minWidth: { xs: '100%', sm: 100 },
            order: { xs: 1, sm: 2 },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
