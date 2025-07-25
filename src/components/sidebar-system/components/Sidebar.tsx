/**
 * @fileoverview Componente principal da Sidebar
 * @module sidebar/components/Sidebar
 */

'use client';

import React, { forwardRef } from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Divider,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

import type { SidebarProps } from '../types';
import { useSidebar, useSidebarAnimations, useSidebarFocus } from '../hooks';

/**
 * Componente principal da Sidebar
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({
  open = false,
  onClose,
  onToggle,
  variant = 'temporary',
  position = 'left',
  width = 280,
  miniWidth = 64,
  header,
  footer,
  children,
  className,
  sx,
  PaperProps,
  SlideProps,
  BackdropProps,
  elevation = 4,
  showToggleButton = true,
  showCloseButton = true,
  autoFocus = true,
  trapFocus = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ...props
}, ref) => {
  const theme = useTheme();
  
  // Hooks
  const { state } = useSidebar();
  const { transition } = useSidebarAnimations(open);
  const { sidebarRef } = useSidebarFocus(open, { autoFocus, trapFocus });

  // Configurações baseadas na posição
  const isHorizontal = position === 'top' || position === 'bottom';
  const isLeft = position === 'left';
  const isRight = position === 'right';

  // Estilos calculados
  const sidebarWidth = state.isMini ? miniWidth : width;
  const anchor = position === 'top' || position === 'bottom' ? position : 
                position === 'right' ? 'right' : 'left';

  // Ícone de toggle baseado na posição
  const getToggleIcon = () => {
    if (isHorizontal) return <MenuIcon />;
    if (open) {
      return isLeft ? <ChevronLeftIcon /> : <ChevronRightIcon />;
    }
    return isLeft ? <ChevronRightIcon /> : <ChevronLeftIcon />;
  };

  // Handler para fechar
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Handler para toggle
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <Drawer
      ref={ref}
      open={open}
      onClose={closeOnBackdropClick ? handleClose : undefined}
      variant={variant}
      anchor={anchor}
      elevation={elevation}
      PaperProps={{
        ...PaperProps,
        sx: {
          width: isHorizontal ? '100%' : sidebarWidth,
          height: isHorizontal ? 'auto' : '100%',
          transition,
          backgroundColor: theme.palette.background.paper,
          borderRight: isLeft ? `1px solid ${theme.palette.divider}` : 'none',
          borderLeft: isRight ? `1px solid ${theme.palette.divider}` : 'none',
          borderTop: position === 'bottom' ? `1px solid ${theme.palette.divider}` : 'none',
          borderBottom: position === 'top' ? `1px solid ${theme.palette.divider}` : 'none',
          ...PaperProps?.sx
        }
      }}
      SlideProps={{
        direction: anchor,
        ...SlideProps
      }}
      BackdropProps={{
        ...BackdropProps,
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          ...BackdropProps?.sx
        }
      }}
      ModalProps={{
        keepMounted: variant === 'temporary', // Melhor performance para mobile
        disableEscapeKeyDown: !closeOnEscape,
        ...props.ModalProps
      }}
      className={className}
      sx={sx}
      {...props}
    >
      <Box
        ref={sidebarRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        {(header || showToggleButton || showCloseButton) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              minHeight: 64,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            {/* Header Content */}
            {header && (
              <Box sx={{ flex: 1, mr: showToggleButton || showCloseButton ? 1 : 0 }}>
                {typeof header === 'string' ? (
                  <Typography variant="h6" component="h2">
                    {header}
                  </Typography>
                ) : (
                  header
                )}
              </Box>
            )}

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {showToggleButton && onToggle && (
                <IconButton
                  onClick={handleToggle}
                  size="small"
                  aria-label="Toggle sidebar"
                  sx={{
                    color: theme.palette.text.secondary
                  }}
                >
                  {getToggleIcon()}
                </IconButton>
              )}

              {showCloseButton && variant === 'temporary' && (
                <IconButton
                  onClick={handleClose}
                  size="small"
                  aria-label="Close sidebar"
                  sx={{
                    color: theme.palette.text.secondary
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <Box
              sx={{
                p: 2,
                mt: 'auto'
              }}
            >
              {footer}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
});

Sidebar.displayName = 'Sidebar';
