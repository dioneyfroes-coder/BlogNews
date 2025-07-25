/**
 * @fileoverview Hooks especializados para sistema de Social Links
 * @module social-links/hooks
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { 
  SocialPlatform, 
  SocialLinkData,
  SocialAppearanceConfig,
  SocialUrlValidation
} from '../types';
import { 
  SocialPlatformDetector,
  SocialLinkValidator,
  SocialLinksCache,
  SOCIAL_LINKS_CONSTANTS
} from '../utils';

/**
 * Hook para validação de URL em tempo real
 */
export const useSocialUrlValidation = (config?: SocialUrlValidation) => {
  const [url, setUrl] = useState('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    platform?: SocialPlatform;
    error?: string;
    suggestion?: string;
  }>({
    isValid: false
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateUrl = useCallback(async (value: string) => {
    setUrl(value);
    
    if (!value.trim()) {
      setValidation({ isValid: false });
      return;
    }

    setIsValidating(true);

    // Debounce validation
    const timeoutId = setTimeout(async () => {
      try {
        const result = SocialLinkValidator.validate(value, config);
        setValidation(result);
      } catch (error) {
        setValidation({
          isValid: false,
          error: 'Erro na validação'
        });
      } finally {
        setIsValidating(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [config]);

  const clearValidation = useCallback(() => {
    setUrl('');
    setValidation({ isValid: false });
  }, []);

  return {
    url,
    validation,
    isValidating,
    validateUrl,
    clearValidation,
    isValid: validation.isValid && url.length > 0
  };
};

/**
 * Hook para detecção de plataforma social
 */
export const usePlatformDetection = () => {
  const [detectionCache, setDetectionCache] = useState(new Map<string, SocialPlatform>());

  const detectPlatform = useCallback((url: string): SocialPlatform | null => {
    if (!url.trim()) return null;

    // Verificar cache primeiro
    if (detectionCache.has(url)) {
      return detectionCache.get(url) || null;
    }

    try {
      const detection = SocialPlatformDetector.detect(url);
      
      // Armazenar no cache
      setDetectionCache(prev => new Map(prev.set(url, detection.platform)));
      
      return detection.platform;
    } catch {
      return null;
    }
  }, [detectionCache]);

  const getPlatformMetadata = useCallback((url: string) => {
    try {
      const detection = SocialPlatformDetector.detect(url);
      return detection.metadata;
    } catch {
      return undefined;
    }
  }, []);

  const clearCache = useCallback(() => {
    setDetectionCache(new Map());
  }, []);

  return {
    detectPlatform,
    getPlatformMetadata,
    clearCache
  };
};

/**
 * Hook para gerenciar aparência dos links sociais
 */
export const useSocialAppearance = (initialConfig?: SocialAppearanceConfig) => {
  const [appearance, setAppearance] = useState<SocialAppearanceConfig>(
    initialConfig || SOCIAL_LINKS_CONSTANTS.DEFAULT_CONFIG.appearance!
  );

  const updateAppearance = useCallback(<K extends keyof SocialAppearanceConfig>(
    key: K,
    value: SocialAppearanceConfig[K]
  ) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAppearance = useCallback(() => {
    setAppearance(SOCIAL_LINKS_CONSTANTS.DEFAULT_CONFIG.appearance!);
  }, []);

  const getIconSize = useCallback((): number => {
    const sizes = {
      small: 24,
      medium: 32,
      large: 48,
      'extra-large': 64
    };
    return sizes[appearance.iconSize || 'medium'];
  }, [appearance.iconSize]);

  const getPlatformColor = useCallback((platform: SocialPlatform): string => {
    if (appearance.useBrandColors) {
      // Usar cores padrão do sistema
      const brandColors: Record<string, string> = {
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
      return brandColors[String(platform)] || '#666666';
    }
    
    return '#666666';
  }, [appearance.platformColors, appearance.useBrandColors]);

  const getSpacing = useCallback((): number => {
    return (appearance.spacing || 2) * 8; // Material-UI spacing
  }, [appearance.spacing]);

  return {
    appearance,
    updateAppearance,
    resetAppearance,
    getIconSize,
    getPlatformColor,
    getSpacing
  };
};

/**
 * Hook para drag & drop de links sociais
 */
export const useSocialDragDrop = () => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((index: number) => {
    setDropTargetIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  const handleDrop = useCallback((
    targetIndex: number,
    onReorder: (startIndex: number, endIndex: number) => void
  ) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    handleDragEnd();
  }, [draggedIndex, handleDragEnd]);

  return {
    draggedIndex,
    dropTargetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop
  };
};

/**
 * Hook para persistência de links sociais no localStorage
 */
export const useSocialPersistence = (key: string = 'social_links') => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const saveToStorage = useCallback((links: SocialLinkData[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(links));
    } catch (error) {
      console.warn('Erro ao salvar links sociais:', error);
    }
  }, [key]);

  const loadFromStorage = useCallback((): SocialLinkData[] => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setHasLoaded(true);
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Erro ao carregar links sociais:', error);
    }
    setHasLoaded(true);
    return [];
  }, [key]);

  const removeFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Erro ao remover links sociais:', error);
    }
  }, [key]);

  return {
    hasLoaded,
    saveToStorage,
    loadFromStorage,
    removeFromStorage
  };
};

/**
 * Hook para analytics de links sociais
 */
export const useSocialAnalytics = () => {
  const [events, setEvents] = useState<Array<{
    type: string;
    data: any;
    timestamp: Date;
  }>>([]);

  const trackEvent = useCallback((type: string, data: any) => {
    const event = {
      type,
      data,
      timestamp: new Date()
    };

    setEvents(prev => [...prev.slice(-99), event]); // Manter últimos 100 eventos

    // Implementar tracking real aqui
    console.log('Social Links Analytics:', event);
    
    // Exemplo com Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', type, {
        event_category: 'Social Links',
        ...data
      });
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const getEventsByType = useCallback((type: string) => {
    return events.filter(event => event.type === type);
  }, [events]);

  const getEventsCount = useCallback((type?: string) => {
    return type 
      ? events.filter(event => event.type === type).length
      : events.length;
  }, [events]);

  return {
    events,
    trackEvent,
    clearEvents,
    getEventsByType,
    getEventsCount
  };
};

/**
 * Hook para importação/exportação de links sociais
 */
export const useSocialImportExport = () => {
  const exportToJson = useCallback((links: SocialLinkData[]) => {
    const data = {
      links,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-links-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportToCsv = useCallback((links: SocialLinkData[]) => {
    const headers = ['URL', 'Platform', 'Label', 'Active', 'Order'];
    const rows = links.map(link => [
      link.url,
      link.platform || '',
      link.label || '',
      link.isActive !== false ? 'Yes' : 'No',
      (link.order || 0).toString()
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-links-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importFromJson = useCallback(async (file: File): Promise<SocialLinkData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.links && Array.isArray(data.links)) {
            resolve(data.links);
          } else {
            reject(new Error('Formato inválido: esperado propriedade "links"'));
          }
        } catch (error) {
          reject(new Error('Erro ao analisar arquivo JSON'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }, []);

  return {
    exportToJson,
    exportToCsv,
    importFromJson
  };
};

/**
 * Hook para debounce de operações
 */
export const useSocialDebounce = <T>(value: T, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para gerenciar formulário de edição de link
 */
export const useSocialLinkForm = (initialLink?: SocialLinkData) => {
  const [formData, setFormData] = useState({
    url: initialLink?.url || '',
    label: initialLink?.label || '',
    platform: initialLink?.platform || ('custom' as const),
    isActive: initialLink?.isActive !== false,
    openInNewTab: initialLink?.config?.openInNewTab !== false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'URL é obrigatória';
    } else {
      const validation = SocialLinkValidator.validate(formData.url);
      if (!validation.isValid) {
        newErrors.url = validation.error || 'URL inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      url: '',
      label: '',
      platform: 'custom' as const,
      isActive: true,
      openInNewTab: true
    });
    setErrors({});
  }, []);

  const populateForm = useCallback((link: SocialLinkData) => {
    setFormData({
      url: link.url,
      label: link.label || '',
      platform: link.platform || ('custom' as const),
      isActive: link.isActive !== false,
      openInNewTab: link.config?.openInNewTab !== false
    });
    setErrors({});
  }, []);

  const toLinkData = useCallback((): SocialLinkData => {
    const detection = SocialPlatformDetector.detect(formData.url);
    
    return {
      url: detection.normalizedUrl,
      platform: formData.platform !== 'custom' ? formData.platform : (detection.platform as SocialPlatform),
      label: formData.label || undefined,
      isActive: formData.isActive,
      config: {
        openInNewTab: formData.openInNewTab,
        relAttributes: 'noopener noreferrer'
      }
    };
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    populateForm,
    toLinkData,
    isValid: Object.keys(errors).length === 0 && formData.url.trim().length > 0
  };
};

// Barrel export
export { useSocialLinks } from './useSocialLinks';
