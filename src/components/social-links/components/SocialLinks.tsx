/**
 * @fileoverview Componente principal de Social Links refatorado
 * @module social-links/components/SocialLinks
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Fab,
  Tooltip,
  Chip,
  Paper,
  Divider,
  Alert,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { SocialLinkItem } from './SocialLinkItem';
import { SocialLinkForm } from './SocialLinkForm';
import { SocialStats } from './SocialStats';
import { useSocialLinks, useSocialDragDrop, useSocialAnalytics } from '../hooks';
import { SocialLinkFormatter } from '../utils';
import type { SocialLinksProps, SocialLinkData } from '../types';

/**
 * Componente principal de Social Links
 * 
 * Fornece interface completa para gerenciar links sociais com
 * funcionalidades de edição, reordenação, validação e analytics.
 */
export const SocialLinks: React.FC<SocialLinksProps> = ({
  links: externalLinks,
  socialLinks: legacyLinks, // Para compatibilidade
  setSocialLinks: legacySetter, // Para compatibilidade
  variant = 'default',
  isEditable = false,
  showAddButton = true,
  showStats = false,
  title,
  config,
  onChange,
  onLinkClick,
  onError,
  sx,
  className,
  ...props
}) => {
  // Hooks
  const { trackEvent } = useSocialAnalytics();
  
  // Determinar links iniciais (compatibilidade com props legadas)
  const initialLinks = useMemo(() => {
    if (externalLinks) return externalLinks;
    if (legacyLinks) return SocialLinkFormatter.convertUrlsToLinkData(legacyLinks);
    return [];
  }, [externalLinks, legacyLinks]);

  // Hook principal
  const {
    links,
    status,
    message,
    error,
    stats,
    addLink,
    removeLink,
    updateLink,
    reorderLinks,
    config: computedConfig
  } = useSocialLinks({
    initialLinks,
    config,
    onChange: useCallback((updatedLinks: SocialLinkData[]) => {
      onChange?.(updatedLinks);
      
      // Compatibilidade com props legadas
      if (legacySetter) {
        const urls = SocialLinkFormatter.convertLinkDataToUrls(updatedLinks);
        legacySetter(urls);
      }
    }, [onChange, legacySetter])
  });

  // Drag & Drop
  const {
    draggedIndex,
    dropTargetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  } = useSocialDragDrop();

  // Estados locais
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  /**
   * Links filtrados e processados
   */
  const processedLinks = useMemo(() => {
    return SocialLinkFormatter.formatLinksForDisplay(links);
  }, [links]);

  /**
   * Handler para clique em link
   */
  const handleLinkClick = useCallback((link: SocialLinkData, index: number) => {
    trackEvent('link_click', {
      platform: link.platform,
      url: link.url,
      index,
      variant,
      isEditable
    });

    onLinkClick?.(link, index);

    // Abrir link se não estiver em modo de edição
    if (!isEditable && link.url) {
      const target = link.config?.openInNewTab !== false ? '_blank' : '_self';
      const rel = link.config?.relAttributes || 'noopener noreferrer';
      
      window.open(link.url, target, rel);
    }
  }, [trackEvent, onLinkClick, variant, isEditable]);

  /**
   * Handler para adicionar novo link
   */
  const handleAddLink = useCallback((newLinkUrl: string) => {
    addLink(newLinkUrl);
    setShowAddForm(false);
    trackEvent('link_add', { url: newLinkUrl, variant });
  }, [addLink, trackEvent, variant]);

  /**
   * Handler para remover link
   */
  const handleRemoveLink = useCallback((index: number) => {
    const link = links[index];
    removeLink(index);
    trackEvent('link_remove', { 
      platform: link.platform, 
      index, 
      variant 
    });
  }, [removeLink, links, trackEvent, variant]);

  /**
   * Handler para editar link
   */
  const handleEditLink = useCallback((index: number, updates: Partial<SocialLinkData>) => {
    updateLink(index, updates);
    setEditingIndex(null);
    trackEvent('link_edit', { 
      index, 
      updates: Object.keys(updates), 
      variant 
    });
  }, [updateLink, trackEvent, variant]);

  /**
   * Renderiza mensagens de feedback
   */
  const renderFeedback = () => {
    if (!message && !error) return null;

    return (
      <Collapse in={!!(message || error)}>
        <Alert 
          severity={error ? 'error' : 'success'} 
          sx={{ mb: 2 }}
          onClose={() => {/* Implementar clear message */}}
        >
          {error || message}
        </Alert>
      </Collapse>
    );
  };

  /**
   * Renderiza cabeçalho
   */
  const renderHeader = () => {
    if (variant === 'minimal') return null;

    return (
      <Box sx={{ mb: 2 }}>
        {title && (
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {title}
          </Typography>
        )}
        
        {showStats && stats && (
          <SocialStats 
            links={processedLinks}
            variant="compact"
            sx={{ mb: 2 }}
          />
        )}
        
        {renderFeedback()}
      </Box>
    );
  };

  /**
   * Renderiza botão de adicionar
   */
  const renderAddButton = () => {
    if (!isEditable || !showAddButton) return null;

    if (variant === 'minimal' || variant === 'compact') {
      return (
        <Tooltip title="Adicionar link social">
          <Fab
            size="small"
            color="primary"
            onClick={() => setShowAddForm(true)}
            sx={{ ml: 1 }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      );
    }

    return (
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setShowAddForm(true)}
        fullWidth={variant === 'default'}
        sx={{ mt: processedLinks.length > 0 ? 2 : 0 }}
      >
        Adicionar Link Social
      </Button>
    );
  };

  /**
   * Renderiza lista de links
   */
  const renderLinksList = () => {
    if (processedLinks.length === 0 && !isEditable) {
      return (
        <Typography variant="body2" color="text.secondary" align="center">
          Nenhum link social disponível
        </Typography>
      );
    }

    const isHorizontal = variant === 'horizontal';
    const spacing = computedConfig.appearance?.spacing || 2;

    return (
      <Grid 
        container 
        spacing={spacing}
        direction={isHorizontal ? 'row' : 'column'}
        sx={{ 
          flexWrap: isHorizontal ? 'wrap' : 'nowrap',
          justifyContent: isHorizontal ? 'center' : 'flex-start'
        }}
      >
        {processedLinks.map((link, index) => (
          <Grid 
            item 
            xs={isHorizontal ? 'auto' : 12}
            key={`${link.url}-${index}`}
          >
            <SocialLinkItem
              link={link}
              index={index}
              isEditable={isEditable}
              appearance={computedConfig.appearance}
              onClick={handleLinkClick}
              onChange={isEditable ? handleEditLink : undefined}
              onRemove={isEditable ? handleRemoveLink : undefined}
              isDraggable={isEditable && computedConfig.behavior?.allowReordering}
              sx={{
                opacity: draggedIndex === index ? 0.5 : 1,
                transform: dropTargetIndex === index ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                ...(variant === 'cards' && {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                })
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  /**
   * Renderiza formulários modais
   */
  const renderForms = () => (
    <>
      {/* Formulário para adicionar */}
      <SocialLinkForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={(link) => handleAddLink(link.url)}
        title="Adicionar Link Social"
        validation={computedConfig.validation}
      />

      {/* Formulário para editar */}
      <SocialLinkForm
        open={editingIndex !== null}
        link={editingIndex !== null ? processedLinks[editingIndex] : undefined}
        onClose={() => setEditingIndex(null)}
        onSave={(link) => {
          if (editingIndex !== null) {
            handleEditLink(editingIndex, link);
          }
        }}
        title="Editar Link Social"
        validation={computedConfig.validation}
      />
    </>
  );

  /**
   * Determinar container baseado na variante
   */
  const getContainer = (children: React.ReactNode) => {
    if (variant === 'minimal') {
      return (
        <Box 
          className={className}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            ...sx 
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }

    if (variant === 'compact') {
      return (
        <Box 
          className={className}
          sx={{ 
            p: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            ...sx 
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }

    return (
      <Paper
        className={className}
        sx={{
          p: variant === 'cards' ? 3 : 2,
          borderRadius: 2,
          ...sx
        }}
      >
        {children}
      </Paper>
    );
  };

  // Renderização principal
  return getContainer(
    <>
      {renderHeader()}
      
      <Box sx={{ position: 'relative' }}>
        {renderLinksList()}
        
        {variant === 'minimal' && renderAddButton()}
      </Box>
      
      {variant !== 'minimal' && (
        <>
          {processedLinks.length > 0 && variant !== 'horizontal' && (
            <Divider sx={{ my: 2 }} />
          )}
          {renderAddButton()}
        </>
      )}
      
      {renderForms()}
    </>
  );
};
