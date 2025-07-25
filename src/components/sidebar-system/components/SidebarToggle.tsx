/**
 * @fileoverview Componente de Toggle da Sidebar
 * @module sidebar/components/SidebarToggle
 */

'use client';

import React, { forwardRef } from 'react';
import {
  IconButton,
  Fab,
  Tooltip,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import type { SidebarToggleProps } from '../types';

// Styled components
const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.speedDial,
  transition: theme.transitions.create(['transform', 'opacity'], {
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create(['transform', 'background-color'], {
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.08),
    transform: 'scale(1.05)'
  }
}));

/**
 * Componente de Toggle da Sidebar
 */
export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(({
  open = false,
  onClick,
  variant = 'icon',
  position = 'left',
  size = 'medium',
  color = 'default',
  icon,
  openIcon,
  closedIcon,
  tooltip,
  openTooltip = 'Fechar sidebar',
  closedTooltip = 'Abrir sidebar',
  disabled = false,
  floating = false,
  floatingPosition = { bottom: 16, left: 16 },
  className,
  sx,
  ...props
}, ref) => {
  const theme = useTheme();

  // Determinar ícone baseado no estado e posição
  const getIcon = () => {
    if (icon) return icon;
    
    if (open) {
      if (openIcon) return openIcon;
      
      switch (position) {
        case 'left':
          return <ChevronLeftIcon />;
        case 'right':
          return <ChevronRightIcon />;
        case 'top':
          return <ExpandLessIcon />;
        case 'bottom':
          return <ExpandMoreIcon />;
        default:
          return <MenuOpenIcon />;
      }
    } else {
      if (closedIcon) return closedIcon;
      
      switch (position) {
        case 'left':
          return <ChevronRightIcon />;
        case 'right':
          return <ChevronLeftIcon />;
        case 'top':
          return <ExpandMoreIcon />;
        case 'bottom':
          return <ExpandLessIcon />;
        default:
          return <MenuIcon />;
      }
    }
  };

  // Determinar tooltip
  const getTooltip = () => {
    if (tooltip) return tooltip;
    return open ? openTooltip : closedTooltip;
  };

  // Props comuns
  const commonProps = {
    ref,
    onClick,
    disabled,
    color,
    size,
    'aria-label': getTooltip(),
    'aria-expanded': open,
    'aria-controls': 'sidebar',
    className,
    sx,
    ...props
  };

  // Renderizar componente baseado no variant
  const renderToggleButton = () => {
    if (variant === 'fab' || floating) {
      return (
        <StyledFab
          {...commonProps}
          sx={{
            ...floatingPosition,
            ...sx
          }}
        >
          {getIcon()}
        </StyledFab>
      );
    }

    return (
      <StyledIconButton {...commonProps}>
        {getIcon()}
      </StyledIconButton>
    );
  };

  const toggleButton = renderToggleButton();

  // Com tooltip se especificado
  if (getTooltip() && !disabled) {
    return (
      <Tooltip title={getTooltip()} placement="right">
        {toggleButton}
      </Tooltip>
    );
  }

  return toggleButton;
});

SidebarToggle.displayName = 'SidebarToggle';
