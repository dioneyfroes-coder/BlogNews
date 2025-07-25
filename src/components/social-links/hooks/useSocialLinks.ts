/**
 * @fileoverview Hook principal para gerenciar Social Links
 * @module social-links/hooks/useSocialLinks
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  SocialLinkData,
  SocialLinksConfig,
  UseSocialLinksReturn,
  UseSocialLinksState,
  SocialPlatform,
  SocialLinkConfig
} from '../types';
import { 
  SocialPlatformDetector,
  SocialLinkValidator,
  SocialLinkFormatter,
  SocialLinksCache,
  SocialLinksAnalytics,
  SOCIAL_LINKS_CONSTANTS
} from '../utils';

/**
 * Interface para props do hook
 */
interface UseSocialLinksProps {
  /** Links iniciais */
  initialLinks?: SocialLinkData[] | string[];
  /** Configuração do sistema */
  config?: Partial<SocialLinksConfig>;
  /** Callback para mudanças nos links */
  onChange?: (links: SocialLinkData[]) => void;
  /** Se deve salvar automaticamente */
  autoSave?: boolean;
  /** Função para persistir dados externamente */
  onSave?: (links: SocialLinkData[]) => Promise<void>;
}

/**
 * Hook principal para gerenciar sistema de Social Links
 * 
 * @param props - Configurações do hook
 * @returns Estado e funções para gerenciar links sociais
 * 
 * @example
 * ```tsx
 * const {
 *   links,
 *   addLink,
 *   updateLink,
 *   removeLink,
 *   status,
 *   stats
 * } = useSocialLinks({
 *   initialLinks: ['https://facebook.com/example'],
 *   autoSave: true
 * });
 * ```
 */
export const useSocialLinks = ({
  initialLinks = [],
  config = {},
  onChange,
  autoSave = false,
  onSave
}: UseSocialLinksProps = {}): UseSocialLinksReturn => {
  
  // Configuração computada
  const computedConfig = useMemo(() => ({
    ...SOCIAL_LINKS_CONSTANTS.DEFAULT_CONFIG,
    ...config
  }), [config]);

  // Estado do hook
  const [state, setState] = useState<UseSocialLinksState>(() => {
    // Processar links iniciais
    const processedLinks = Array.isArray(initialLinks)
      ? typeof initialLinks[0] === 'string'
        ? SocialLinkFormatter.convertUrlsToLinkData(initialLinks as string[])
        : (initialLinks as SocialLinkData[])
      : [];

    return {
      links: processedLinks,
      status: 'idle',
      message: '',
      error: null,
      hasUnsavedChanges: false,
      lastModified: null
    };
  });

  /**
   * Atualiza estado interno
   */
  const updateState = useCallback((updates: Partial<UseSocialLinksState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Estatísticas computadas
   */
  const stats = useMemo(() => {
    const activeLinks = state.links.filter(link => link.isActive !== false);
    const platformsUsed = [...new Set(activeLinks.map(link => link.platform).filter(Boolean))] as SocialPlatform[];

    return {
      totalLinks: state.links.length,
      activeLinks: activeLinks.length,
      platformsUsed,
      lastUpdate: state.lastModified
    };
  }, [state.links, state.lastModified]);

  /**
   * Valida URL
   */
  const validateUrl = useCallback(async (url: string): Promise<{ 
    isValid: boolean; 
    platform?: SocialPlatform; 
    error?: string 
  }> => {
    updateState({ status: 'loading' });

    try {
      // Verificar cache primeiro
      const cacheKey = `validation_${url}`;
      const cachedResult = SocialLinksCache.get(cacheKey);
      if (cachedResult) {
        updateState({ status: 'idle' });
        return cachedResult;
      }

      // Validar URL
      const validation = SocialLinkValidator.validate(url, computedConfig.validation);
      
      // Armazenar no cache
      SocialLinksCache.set(cacheKey, validation, 5 * 60 * 1000); // 5 minutos

      updateState({ status: 'idle' });
      return validation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na validação';
      updateState({ 
        status: 'error', 
        error: errorMessage 
      });
      return { 
        isValid: false, 
        error: errorMessage 
      };
    }
  }, [computedConfig.validation, updateState]);

  /**
   * Adiciona novo link
   */
  const addLink = useCallback(async (url: string, linkConfig?: Partial<SocialLinkConfig>) => {
    if (!url.trim()) return;

    // Verificar limite máximo
    if (state.links.length >= (computedConfig.behavior?.maxLinks || SOCIAL_LINKS_CONSTANTS.MAX_LINKS_DEFAULT)) {
      updateState({
        status: 'error',
        error: `Máximo de ${computedConfig.behavior?.maxLinks} links permitidos`
      });
      return;
    }

    updateState({ status: 'loading' });

    try {
      // Validar URL
      const validation = await validateUrl(url);
      if (!validation.isValid) {
        updateState({
          status: 'error',
          error: validation.error || 'URL inválida'
        });
        return;
      }

      // Detectar plataforma
      const detection = SocialPlatformDetector.detect(url);

      // Verificar se já existe
      const existingIndex = state.links.findIndex(link => 
        link.url.toLowerCase() === detection.normalizedUrl.toLowerCase()
      );

      if (existingIndex !== -1) {
        updateState({
          status: 'error',
          error: 'Este link já foi adicionado'
        });
        return;
      }

      // Criar novo link
      const newLink: SocialLinkData = {
        url: detection.normalizedUrl,
        platform: validation.platform || detection.platform,
        isActive: true,
        order: state.links.length,
        config: {
          openInNewTab: true,
          relAttributes: 'noopener noreferrer',
          ...linkConfig
        }
      };

      // Atualizar estado
      const updatedLinks = [...state.links, newLink];
      updateState({
        links: updatedLinks,
        status: 'success',
        message: 'Link adicionado com sucesso',
        hasUnsavedChanges: true,
        lastModified: new Date(),
        error: null
      });

      // Analytics
      SocialLinksAnalytics.trackLinkAdd(newLink);

      // Callback
      onChange?.(updatedLinks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar link';
      updateState({
        status: 'error',
        error: errorMessage
      });
    }
  }, [state.links, computedConfig.behavior?.maxLinks, validateUrl, updateState, onChange]);

  /**
   * Remove link por índice
   */
  const removeLink = useCallback((index: number) => {
    if (index < 0 || index >= state.links.length) return;

    const linkToRemove = state.links[index];
    const updatedLinks = state.links.filter((_, i) => i !== index);

    // Reordenar
    const reorderedLinks = updatedLinks.map((link, i) => ({
      ...link,
      order: i
    }));

    updateState({
      links: reorderedLinks,
      status: 'success',
      message: 'Link removido com sucesso',
      hasUnsavedChanges: true,
      lastModified: new Date(),
      error: null
    });

    // Analytics
    SocialLinksAnalytics.trackLinkRemove(linkToRemove);

    // Callback
    onChange?.(reorderedLinks);
  }, [state.links, updateState, onChange]);

  /**
   * Atualiza link específico
   */
  const updateLink = useCallback(async (index: number, updates: Partial<SocialLinkData>) => {
    if (index < 0 || index >= state.links.length) return;

    updateState({ status: 'loading' });

    try {
      // Se mudou a URL, validar
      if (updates.url && updates.url !== state.links[index].url) {
        const validation = await validateUrl(updates.url);
        if (!validation.isValid) {
          updateState({
            status: 'error',
            error: validation.error || 'URL inválida'
          });
          return;
        }

        // Verificar duplicatas
        const existingIndex = state.links.findIndex((link, i) => 
          i !== index && link.url.toLowerCase() === updates.url!.toLowerCase()
        );

        if (existingIndex !== -1) {
          updateState({
            status: 'error',
            error: 'Este link já existe'
          });
          return;
        }

        // Detectar nova plataforma se URL mudou
        if (updates.url) {
          const detection = SocialPlatformDetector.detect(updates.url);
          updates.platform = detection.platform;
          updates.url = detection.normalizedUrl;
        }
      }

      // Atualizar link
      const updatedLinks = state.links.map((link, i) => 
        i === index ? { ...link, ...updates } : link
      );

      updateState({
        links: updatedLinks,
        status: 'success',
        message: 'Link atualizado com sucesso',
        hasUnsavedChanges: true,
        lastModified: new Date(),
        error: null
      });

      // Callback
      onChange?.(updatedLinks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar link';
      updateState({
        status: 'error',
        error: errorMessage
      });
    }
  }, [state.links, validateUrl, updateState, onChange]);

  /**
   * Reordena links
   */
  const reorderLinks = useCallback((startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;

    const updatedLinks = [...state.links];
    const [reorderedItem] = updatedLinks.splice(startIndex, 1);
    updatedLinks.splice(endIndex, 0, reorderedItem);

    // Atualizar ordem
    const reorderedWithOrder = updatedLinks.map((link, index) => ({
      ...link,
      order: index
    }));

    updateState({
      links: reorderedWithOrder,
      hasUnsavedChanges: true,
      lastModified: new Date()
    });

    // Callback
    onChange?.(reorderedWithOrder);
  }, [state.links, updateState, onChange]);

  /**
   * Salva mudanças
   */
  const saveChanges = useCallback(async () => {
    if (!state.hasUnsavedChanges || !onSave) return;

    updateState({ status: 'saving' });

    try {
      await onSave(state.links);
      updateState({
        status: 'success',
        message: 'Mudanças salvas com sucesso',
        hasUnsavedChanges: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar';
      updateState({
        status: 'error',
        error: errorMessage
      });
    }
  }, [state.hasUnsavedChanges, state.links, onSave, updateState]);

  /**
   * Descarta mudanças
   */
  const discardChanges = useCallback(() => {
    // Recarregar links iniciais
    const processedLinks = Array.isArray(initialLinks)
      ? typeof initialLinks[0] === 'string'
        ? SocialLinkFormatter.convertUrlsToLinkData(initialLinks as string[])
        : (initialLinks as SocialLinkData[])
      : [];

    updateState({
      links: processedLinks,
      status: 'idle',
      message: '',
      error: null,
      hasUnsavedChanges: false,
      lastModified: null
    });
  }, [initialLinks, updateState]);

  /**
   * Limpa todos os links
   */
  const clearAll = useCallback(() => {
    updateState({
      links: [],
      status: 'success',
      message: 'Todos os links foram removidos',
      hasUnsavedChanges: true,
      lastModified: new Date(),
      error: null
    });

    onChange?.([]);
  }, [updateState, onChange]);

  /**
   * Reseta para valores padrão
   */
  const reset = useCallback(() => {
    setState({
      links: [],
      status: 'idle',
      message: '',
      error: null,
      hasUnsavedChanges: false,
      lastModified: null
    });
  }, []);

  /**
   * Auto-save quando configurado
   */
  useEffect(() => {
    if (!autoSave || !state.hasUnsavedChanges || !onSave) return;

    const interval = setInterval(() => {
      saveChanges();
    }, computedConfig.behavior?.autoSaveInterval || SOCIAL_LINKS_CONSTANTS.AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [autoSave, state.hasUnsavedChanges, saveChanges, onSave, computedConfig.behavior?.autoSaveInterval]);

  /**
   * Auto-limpa mensagens após timeout
   */
  useEffect(() => {
    if (state.message && state.status !== 'loading' && state.status !== 'saving') {
      const timer = setTimeout(() => {
        updateState({ message: '', status: 'idle' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.message, state.status, updateState]);

  return {
    ...state,
    config: computedConfig,
    stats,
    addLink,
    removeLink,
    updateLink,
    reorderLinks,
    validateUrl,
    saveChanges,
    discardChanges,
    clearAll,
    reset
  };
};
