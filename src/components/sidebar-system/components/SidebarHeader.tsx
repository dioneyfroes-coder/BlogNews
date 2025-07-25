/**
 * @fileoverview Componente de Header da Sidebar
 * @module sidebar/components/SidebarHeader
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import type { SidebarHeaderProps } from '../types';

/**
 * Componente de Header da Sidebar
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title,
  subtitle,
  avatar,
  showCloseButton = false,
  showSettingsButton = false,
  compact = false,
  onClose,
  onSettings,
  actions,
  sx,
  ...props
}) => {
  const theme = useTheme();

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          minHeight: 64,
          ...sx
        }}
        {...props}
      >
        {avatar && (
          <Avatar
            src={typeof avatar === 'string' ? avatar : undefined}
            sx={{ width: 32, height: 32 }}
          >
            {typeof avatar !== 'string' ? avatar : undefined}
          </Avatar>
        )}
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          minHeight: 64,
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          ...sx
        }}
        {...props}
      >
        {/* Conteúdo principal */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 1 }}>
          {/* Avatar */}
          {avatar && (
            <Box sx={{ mr: 2 }}>
              <Avatar
                src={typeof avatar === 'string' ? avatar : undefined}
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: `2px solid ${theme.palette.primary.main}`
                }}
              >
                {typeof avatar !== 'string' ? avatar : undefined}
              </Avatar>
            </Box>
          )}

          {/* Títulos */}
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 0.25
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Ações */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* Ações customizadas */}
          {actions}

          {/* Botão de configurações */}
          {showSettingsButton && onSettings && (
            <IconButton
              onClick={onSettings}
              size="small"
              aria-label="Configurações"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.04)
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          )}

          {/* Botão de fechar */}
          {showCloseButton && onClose && (
            <IconButton
              onClick={onClose}
              size="small"
              aria-label="Fechar sidebar"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.04)
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  );
};
