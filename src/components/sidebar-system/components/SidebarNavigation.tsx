/**
 * @fileoverview Componente de Navegação da Sidebar
 * @module sidebar/components/SidebarNavigation
 */

'use client';

import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Badge,
  Box,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon
} from '@mui/icons-material';

import type { SidebarNavigationProps, SidebarSection, SidebarNavItem } from '../types';
import { useSidebarNavigation } from '../hooks';

/**
 * Componente de item de navegação
 */
const NavigationItem: React.FC<{
  item: SidebarNavItem;
  level?: number;
  compact?: boolean;
  showIcons?: boolean;
  onSelect?: (item: SidebarNavItem) => void;
}> = ({ 
  item, 
  level = 0, 
  compact = false, 
  showIcons = true, 
  onSelect 
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(item.expanded || false);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.active;
  const isDisabled = item.disabled;

  const handleClick = () => {
    if (isDisabled) return;

    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      if (onSelect) {
        onSelect(item);
      }
    }
  };

  const getItemIcon = () => {
    if (!showIcons && !compact) return null;
    
    if (item.icon) {
      return item.icon;
    }
    
    if (level > 0) {
      return (
        <CircleIcon 
          sx={{ 
            fontSize: 8,
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
          }} 
        />
      );
    }
    
    return null;
  };

  const itemContent = (
    <ListItemButton
      onClick={handleClick}
      disabled={isDisabled}
      selected={isActive}
      sx={{
        pl: 2 + (level * 2),
        minHeight: 48,
        borderRadius: 1,
        mx: 1,
        my: 0.25,
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16)
          },
          '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main
          }
        },
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.primary, 0.04)
        },
        '&.Mui-disabled': {
          opacity: 0.5
        }
      }}
    >
      {/* Ícone */}
      {getItemIcon() && (
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
          }}
        >
          {getItemIcon()}
        </ListItemIcon>
      )}

      {/* Texto */}
      {!compact && (
        <ListItemText
          primary={item.label}
          secondary={item.description}
          primaryTypographyProps={{
            fontSize: level > 0 ? '0.875rem' : '1rem',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? theme.palette.primary.main : 'inherit'
          }}
          secondaryTypographyProps={{
            fontSize: '0.75rem'
          }}
        />
      )}

      {/* Badge */}
      {item.badge && !compact && (
        <Badge
          badgeContent={
            typeof item.badge === 'object' 
              ? item.badge.content 
              : item.badge
          }
          color={
            typeof item.badge === 'object' 
              ? item.badge.color || 'default'
              : 'default'
          }
          variant={
            typeof item.badge === 'object' 
              ? item.badge.variant || 'standard'
              : 'standard'
          }
          sx={{ ml: 1 }}
        />
      )}

      {/* Indicador de expansão */}
      {hasChildren && !compact && (
        <Box sx={{ ml: 1 }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
      )}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disablePadding>
        {itemContent}
      </ListItem>

      {/* Subitens */}
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <NavigationItem
                key={child.id}
                item={child}
                level={level + 1}
                compact={compact}
                showIcons={showIcons}
                onSelect={onSelect}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

/**
 * Componente de seção de navegação
 */
const NavigationSection: React.FC<{
  section: SidebarSection;
  compact?: boolean;
  showIcons?: boolean;
  showDividers?: boolean;
  onItemSelect?: (item: SidebarNavItem) => void;
}> = ({ 
  section, 
  compact = false, 
  showIcons = true, 
  showDividers = true,
  onItemSelect 
}) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Título da seção */}
      {section.title && !compact && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            {section.title}
          </Typography>
        </Box>
      )}

      {/* Itens da seção */}
      <List component="nav" disablePadding>
        {section.items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            compact={compact}
            showIcons={showIcons}
            onSelect={onItemSelect}
          />
        ))}
      </List>

      {/* Divider */}
      {showDividers && section.showDivider !== false && (
        <Divider sx={{ my: 1 }} />
      )}
    </Box>
  );
};

/**
 * Componente principal de navegação da sidebar
 */
export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  sections: propSections,
  activeItem,
  onItemSelect,
  compact = false,
  showIcons = true,
  showDividers = true,
  maxHeight,
  sx,
  ...props
}) => {
  // Hook de navegação
  const { sections, setActiveItem } = useSidebarNavigation({
    initialSections: propSections,
    initialActiveItem: activeItem
  });

  // Handler para seleção de item
  const handleItemSelect = (item: SidebarNavItem) => {
    setActiveItem(item.id);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight,
        overflow: 'auto',
        ...sx
      }}
      {...props}
    >
      {sections.map((section) => (
        <NavigationSection
          key={section.id}
          section={section}
          compact={compact}
          showIcons={showIcons}
          showDividers={showDividers}
          onItemSelect={handleItemSelect}
        />
      ))}
    </Box>
  );
};
