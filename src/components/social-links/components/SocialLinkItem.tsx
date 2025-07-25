/**
 * @fileoverview Componente para exibir um link social individual
 * @module social-links/components/SocialLinkItem
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Chip,
  Avatar,
  Link as MuiLink,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { 
  SocialPlatformDetector, 
  SocialLinkValidator, 
  SocialIconResolver 
} from '../utils';
import { useSocialAnalytics } from '../hooks';
import type { 
  SocialLinkItemProps, 
  SocialLinkData
} from '../types';

/**
 * Componente para exibir um link social individual
 */
export const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  link,
  index,
  appearance,
  isEditable = false,
  isDraggable = false,
  showLabel = true,
  showActions = true,
  variant = 'default',
  size = 'medium',
  onClick,
  onChange,
  onRemove,
  onShare,
  sx,
  ...props
}) => {
  // Hooks
  const { trackEvent } = useSocialAnalytics();

  /**
   * Dados processados do link
   */
  const linkData = useMemo(() => {
    const platformResult = SocialPlatformDetector.detect(link.url);
    const validation = SocialLinkValidator.validate(link.url);
    const platformName = platformResult?.platform || 'website';
    const icon = SocialIconResolver.getIcon(platformName as any);
    
    // Cores padrão das plataformas
    const platformColors: Record<string, string> = {
      facebook: '#1877f2',
      instagram: '#E4405F',
      twitter: '#1DA1F2',
      linkedin: '#0077B5',
      youtube: '#FF0000',
      tiktok: '#000000',
      whatsapp: '#25D366',
      telegram: '#0088cc',
      discord: '#5865F2',
      github: '#333333',
      website: '#666666',
      email: '#EA4335',
      phone: '#34A853',
      custom: '#888888'
    };
    
    // Nomes de exibição das plataformas
    const platformDisplayNames: Record<string, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      discord: 'Discord',
      github: 'GitHub',
      website: 'Website',
      email: 'Email',
      phone: 'Telefone',
      custom: 'Link Personalizado'
    };
    
    return {
      platform: platformResult?.platform,
      validation,
      icon,
      displayName: link.label || platformDisplayNames[platformName] || 'Link',
      color: platformColors[platformName] || '#666',
      isValid: validation.isValid
    };
  }, [link]);

  /**
   * Handler para clique no link
   */
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    if (!linkData.isValid) {
      return;
    }

    onClick?.(link, index);

    // Abrir link se não estiver em modo de edição
    if (!isEditable && link.url) {
      window.open(link.url, '_blank', 'noopener noreferrer');
    }
  }, [onClick, link, index, linkData, isEditable]);

  /**
   * Handler para editar link
   */
  const handleEdit = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.(index, { ...link });
  }, [onChange, index, link]);

  /**
   * Handler para remover link
   */
  const handleRemove = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('Deseja remover este link social?')) {
      onRemove?.(index);
    }
  }, [onRemove, index]);

  /**
   * Renderiza ícone do link
   */
  const renderIcon = () => {
    const IconComponent = linkData.icon;
    const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;

    if (variant === 'avatar') {
      return (
        <Avatar
          sx={{
            bgcolor: linkData.color,
            width: iconSize + 8,
            height: iconSize + 8,
            '& .MuiSvgIcon-root': {
              fontSize: iconSize * 0.6
            }
          }}
        >
          <IconComponent />
        </Avatar>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: iconSize,
          height: iconSize,
          color: linkData.color,
          '& .MuiSvgIcon-root': {
            fontSize: iconSize
          }
        }}
      >
        <IconComponent />
      </Box>
    );
  };

  /**
   * Renderiza ações do link
   */
  const renderActions = () => {
    if (!isEditable || !showActions) return null;

    return (
      <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
        <Tooltip title="Editar">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remover">
          <IconButton size="small" onClick={handleRemove}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  if (variant === 'chip') {
    return (
      <Chip
        icon={renderIcon() as any}
        label={showLabel ? linkData.displayName : undefined}
        onClick={handleClick}
        deleteIcon={isEditable ? <EditIcon fontSize="small" /> : undefined}
        onDelete={isEditable ? handleEdit : undefined}
        variant="outlined"
        sx={sx}
      />
    );
  }

  if (variant === 'card') {
    return (
      <Paper 
        component={isEditable ? 'div' : 'a'}
        href={!isEditable ? link.url : undefined}
        target={!isEditable ? '_blank' : undefined}
        rel={!isEditable ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderRadius: 1,
          textDecoration: 'none',
          color: 'inherit',
          cursor: linkData.isValid ? 'pointer' : 'not-allowed',
          opacity: linkData.isValid ? 1 : 0.6,
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'scale(1.02)'
          },
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          ...sx
        }}
        {...props}
      >
        {renderIcon()}
        
        {showLabel && (
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {linkData.displayName}
          </Typography>
        )}

        {!linkData.isValid && (
          <WarningIcon fontSize="small" color="warning" />
        )}

        {renderActions()}
      </Paper>
    );
  }

  return (
    <Box 
      component={isEditable ? 'div' : 'a'}
      href={!isEditable ? link.url : undefined}
      target={!isEditable ? '_blank' : undefined}
      rel={!isEditable ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: variant === 'compact' ? 0.5 : 1,
        borderRadius: 1,
        textDecoration: 'none',
        color: 'inherit',
        cursor: linkData.isValid ? 'pointer' : 'not-allowed',
        opacity: linkData.isValid ? 1 : 0.6,
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
          transform: 'scale(1.02)'
        },
        ...sx
      }}
      {...props}
    >
      {renderIcon()}
      
      {showLabel && (
        <Typography variant="body2">
          {linkData.displayName}
        </Typography>
      )}

      {!linkData.isValid && (
        <WarningIcon fontSize="small" color="warning" />
      )}

      {renderActions()}
    </Box>
  );
};
