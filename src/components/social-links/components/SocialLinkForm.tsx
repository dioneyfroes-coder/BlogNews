/**
 * @fileoverview Formulário para adicionar/editar links sociais
 * @module social-links/components/SocialLinkForm
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Close as CloseIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { PlatformSelectorSimple as PlatformSelector } from './PlatformSelectorSimple';
import { 
  useSocialUrlValidation, 
  usePlatformDetection,
  useSocialAnalytics 
} from '../hooks';
import { SocialIconResolver } from '../utils';
import type { 
  SocialLinkFormProps, 
  SocialLinkData,
  SocialPlatform
} from '../types';

/**
 * Formulário para adicionar/editar links sociais
 */
export const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
  open,
  link,
  title = 'Configurar Link Social',
  validation,
  onClose,
  onSave,
  ...props
}) => {
  // Estados do formulário
  const [url, setUrl] = useState(link?.url || '');
  const [label, setLabel] = useState(link?.label || '');
  const [platform, setPlatform] = useState(link?.platform || 'website');
  const [isActive, setIsActive] = useState(link?.isActive !== false);
  const [openInNewTab, setOpenInNewTab] = useState(link?.config?.openInNewTab !== false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks
  const { trackEvent } = useSocialAnalytics();
  const { validation: urlValidation, validateUrl } = useSocialUrlValidation();
  const { detectPlatform } = usePlatformDetection();

  /**
   * Efeito para validar URL automaticamente
   */
  useEffect(() => {
    if (url && url.length > 10) {
      validateUrl(url);
      const detected = detectPlatform(url);
      if (detected && !platform) {
        setPlatform(detected);
      }
    }
  }, [url, validateUrl, detectPlatform, platform]);

  /**
   * Efeito para resetar formulário quando abrir
   */
  useEffect(() => {
    if (open) {
      setUrl(link?.url || '');
      setLabel(link?.label || '');
      setPlatform(link?.platform || 'website');
      setIsActive(link?.isActive !== false);
      setOpenInNewTab(link?.config?.openInNewTab !== false);
      setErrors({});
    }
  }, [open, link]);

  /**
   * Valida formulário
   */
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!url) {
      newErrors.url = 'URL é obrigatória';
    } else if (!urlValidation.isValid) {
      newErrors.url = urlValidation.error || 'URL inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [url, urlValidation]);

  /**
   * Handler para salvar formulário
   */
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const linkData: SocialLinkData = {
        url,
        label: label || undefined,
        platform: platform as any,
        isActive,
        config: {
          openInNewTab,
          relAttributes: 'noopener noreferrer'
        }
      };

      await onSave(linkData);
      
      trackEvent('form_save_success', {
        platform,
        isNew: !link,
        hasCustomLabel: !!label
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar link:', error);
    }
  }, [url, label, platform, isActive, openInNewTab, validateForm, onSave, link, trackEvent, onClose]);

  /**
   * Renderiza preview do link
   */
  const renderLinkPreview = () => {
    if (!url) return null;

    const IconComponent = SocialIconResolver.getIcon(platform as any);

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Preview:
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24
            }}
          >
            <IconComponent />
          </Box>
          
          <Typography variant="body2">
            {label || (typeof platform === 'string' ? platform : 'Link')}
          </Typography>
          
          {urlValidation.isValid && (
            <IconButton
              size="small"
              onClick={() => window.open(url, '_blank')}
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      {...props}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {title}
        
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* URL Field */}
          <TextField
            fullWidth
            label="URL do Link Social"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={!!errors.url}
            helperText={errors.url}
            placeholder="https://twitter.com/seuusuario"
            autoFocus={!link}
          />
          
          {!urlValidation.isValid && urlValidation.error && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {urlValidation.error}
            </Alert>
          )}

          {/* Label Field */}
          <TextField
            fullWidth
            label="Texto do Link (opcional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Meu Twitter"
            helperText="Deixe vazio para usar o nome da plataforma"
          />

          {/* Platform Selector */}
          <PlatformSelector
            value={platform}
            onChange={(newPlatform) => newPlatform && setPlatform(newPlatform)}
          />

          {renderLinkPreview()}

          {/* Configurações */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Configurações
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                />
              }
              label="Abrir em nova aba"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Link ativo"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!urlValidation.isValid}
        >
          {link ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
