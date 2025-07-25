/**
 * @fileoverview Tipos TypeScript para sistema de Social Links
 * @module social-links/types
 */

import type { SxProps, Theme, BoxProps } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Tipos de redes sociais suportadas
 */
export type SocialPlatformName = 
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'github'
  | 'website'
  | 'email'
  | 'phone'
  | 'custom';

/**
 * Categorias de plataformas sociais
 */
export type SocialPlatformCategory = 
  | 'social'
  | 'professional'
  | 'media'
  | 'messaging'
  | 'development'
  | 'other';

/**
 * Interface para dados de plataforma social
 */
export type SocialPlatform = SocialPlatformName;

export interface SocialPlatformInfo {
  /** Nome único da plataforma */
  name: SocialPlatformName;
  /** Nome para exibição */
  displayName: string;
  /** Categoria da plataforma */
  category: SocialPlatformCategory;
  /** Cor da marca */
  color: string;
  /** Padrão de URL para validação */
  urlPattern: string;
  /** URL base da plataforma */
  baseUrl: string;
  /** Ícone da plataforma */
  icon?: string;
  /** Se é uma plataforma popular */
  isPopular?: boolean;
  /** Metadados adicionais */
  metadata?: {
    /** Se suporta verificação */
    supportsVerification?: boolean;
    /** Se tem API pública */
    hasPublicApi?: boolean;
    /** Máximo de caracteres para bio */
    maxBioLength?: number;
  };
}

/**
 * Variantes de exibição dos links sociais
 */
export type SocialLinksVariant = 
  | 'default'
  | 'compact'
  | 'minimal'
  | 'cards'
  | 'buttons'
  | 'horizontal'
  | 'vertical';

/**
 * Tamanhos dos ícones
 */
export type SocialIconSize = 'small' | 'medium' | 'large' | 'extra-large';

/**
 * Estilos de hover
 */
export type SocialHoverEffect = 
  | 'none'
  | 'scale'
  | 'rotate'
  | 'glow'
  | 'bounce'
  | 'slide';

/**
 * Interface para dados de um link social
 */
export interface SocialLinkData {
  /** URL do link social */
  url: string;
  /** Plataforma detectada automaticamente ou definida manualmente */
  platform?: SocialPlatform;
  /** Label customizado (opcional) */
  label?: string;
  /** Se o link está ativo/habilitado */
  isActive?: boolean;
  /** Ordem de exibição */
  order?: number;
  /** Configurações específicas do link */
  config?: SocialLinkConfig;
}

/**
 * Configurações específicas de um link social
 */
export interface SocialLinkConfig {
  /** Cor customizada do ícone */
  color?: string;
  /** Ícone customizado (componente React) */
  customIcon?: ReactNode;
  /** Se deve abrir em nova aba */
  openInNewTab?: boolean;
  /** Atributos rel personalizados */
  relAttributes?: string;
  /** Tooltip personalizado */
  tooltip?: string;
  /** Dados de analytics */
  analytics?: {
    category?: string;
    action?: string;
    label?: string;
  };
}

/**
 * Interface para configuração de validação de URLs
 */
export interface SocialUrlValidation {
  /** Se deve validar URLs automaticamente */
  autoValidate?: boolean;
  /** Se deve permitir URLs customizadas/não reconhecidas */
  allowCustomUrls?: boolean;
  /** Regex customizado para validação */
  customValidationPattern?: RegExp;
  /** Máximo de caracteres permitidos */
  maxUrlLength?: number;
}

/**
 * Interface para configuração de aparência
 */
export interface SocialAppearanceConfig {
  /** Tamanho dos ícones */
  iconSize?: SocialIconSize;
  /** Efeito de hover */
  hoverEffect?: SocialHoverEffect;
  /** Se deve mostrar labels */
  showLabels?: boolean;
  /** Se deve mostrar tooltips */
  showTooltips?: boolean;
  /** Espaçamento entre itens */
  spacing?: number;
  /** Cores customizadas por plataforma */
  platformColors?: Partial<Record<SocialPlatformName, string>>;
  /** Se deve usar cores da marca das plataformas */
  useBrandColors?: boolean;
  /** Tema escuro/claro */
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Interface para configuração de comportamento
 */
export interface SocialBehaviorConfig {
  /** Se permite edição dos links */
  allowEditing?: boolean;
  /** Se permite reordenação por drag & drop */
  allowReordering?: boolean;
  /** Se permite adicionar novos links */
  allowAddNew?: boolean;
  /** Se permite remover links */
  allowRemove?: boolean;
  /** Máximo de links permitidos */
  maxLinks?: number;
  /** Se deve salvar automaticamente mudanças */
  autoSave?: boolean;
  /** Intervalo de auto-save em ms */
  autoSaveInterval?: number;
}

/**
 * Interface para configuração de analytics
 */
export interface SocialAnalyticsConfig {
  /** Se deve fazer tracking de cliques */
  trackClicks?: boolean;
  /** Se deve fazer tracking de hover */
  trackHover?: boolean;
  /** Provider de analytics */
  provider?: 'google' | 'custom' | 'none';
  /** Configurações customizadas */
  customConfig?: Record<string, any>;
}

/**
 * Configuração completa do sistema de Social Links
 */
export interface SocialLinksConfig {
  /** Configurações de validação */
  validation?: SocialUrlValidation;
  /** Configurações de aparência */
  appearance?: SocialAppearanceConfig;
  /** Configurações de comportamento */
  behavior?: SocialBehaviorConfig;
  /** Configurações de analytics */
  analytics?: SocialAnalyticsConfig;
}

/**
 * Estado do hook useSocialLinks
 */
export interface UseSocialLinksState {
  /** Array de links sociais */
  links: SocialLinkData[];
  /** Status da operação atual */
  status: 'idle' | 'loading' | 'saving' | 'error' | 'success';
  /** Mensagem de feedback */
  message: string;
  /** Erro atual */
  error: string | null;
  /** Se existem mudanças não salvas */
  hasUnsavedChanges: boolean;
  /** Timestamp da última modificação */
  lastModified: Date | null;
}

/**
 * Ações disponíveis para gerenciar links sociais
 */
export interface SocialLinksActions {
  /** Adicionar novo link */
  addLink: (url: string, config?: Partial<SocialLinkConfig>) => void;
  /** Remover link por índice */
  removeLink: (index: number) => void;
  /** Atualizar link específico */
  updateLink: (index: number, updates: Partial<SocialLinkData>) => void;
  /** Reordenar links */
  reorderLinks: (startIndex: number, endIndex: number) => void;
  /** Validar URL */
  validateUrl: (url: string) => Promise<{ isValid: boolean; platform?: SocialPlatform; error?: string }>;
  /** Salvar mudanças */
  saveChanges: () => Promise<void>;
  /** Descartar mudanças */
  discardChanges: () => void;
  /** Limpar todos os links */
  clearAll: () => void;
  /** Resetar para valores padrão */
  reset: () => void;
}

/**
 * Retorno do hook useSocialLinks
 */
export interface UseSocialLinksReturn extends UseSocialLinksState, SocialLinksActions {
  /** Configuração atual */
  config: SocialLinksConfig;
  /** Estatísticas dos links */
  stats: {
    totalLinks: number;
    activeLinks: number;
    platformsUsed: SocialPlatform[];
    lastUpdate: Date | null;
  };
}

// ===========================
// PROPS DOS COMPONENTES
// ===========================

/**
 * Props base para componentes de Social Links
 */
export interface BaseSocialLinksProps {
  /** Array de links sociais */
  links?: SocialLinkData[];
  /** Configuração do sistema */
  config?: Partial<SocialLinksConfig>;
  /** Callback para mudanças nos links */
  onChange?: (links: SocialLinkData[]) => void;
  /** Callback para cliques em links */
  onLinkClick?: (link: SocialLinkData, index: number) => void;
  /** Callback para erros */
  onError?: (error: string) => void;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS customizada */
  className?: string;
}

/**
 * Props para o componente principal SocialLinks
 */
export interface SocialLinksProps extends BaseSocialLinksProps, Omit<BoxProps, 'onChange' | 'onError'> {
  /** Variante de exibição */
  variant?: SocialLinksVariant;
  /** Se está em modo de edição */
  isEditable?: boolean;
  /** Se deve mostrar botão de adicionar */
  showAddButton?: boolean;
  /** Título da seção */
  title?: string;
  /** Se deve mostrar contadores */
  showStats?: boolean;
  /** Dados externos (para compatibilidade) */
  socialLinks?: string[];
  /** Setter externo (para compatibilidade) */
  setSocialLinks?: (links: string[]) => void;
}

/**
 * Props para componente individual de link social
 */
export interface SocialLinkItemProps {
  /** Dados do link */
  link: SocialLinkData;
  /** Índice no array */
  index: number;
  /** Se está em modo de edição */
  isEditable?: boolean;
  /** Configuração de aparência */
  appearance?: SocialAppearanceConfig;
  /** Se deve mostrar label */
  showLabel?: boolean;
  /** Se deve mostrar ações */
  showActions?: boolean;
  /** Variante visual */
  variant?: 'default' | 'compact' | 'card' | 'chip' | 'avatar';
  /** Tamanho do componente */
  size?: SocialIconSize;
  /** Callback para mudanças */
  onChange?: (index: number, updates: Partial<SocialLinkData>) => void;
  /** Callback para remoção */
  onRemove?: (index: number) => void;
  /** Callback para clique */
  onClick?: (link: SocialLinkData, index: number) => void;
  /** Callback para compartilhar */
  onShare?: (link: SocialLinkData, index: number) => void;
  /** Se permite drag & drop */
  isDraggable?: boolean;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Props para formulário de edição de link
 */
export interface SocialLinkFormProps {
  /** Link sendo editado (undefined para novo) */
  link?: SocialLinkData;
  /** Se o formulário está aberto */
  open: boolean;
  /** Callback para fechar */
  onClose: () => void;
  /** Callback para salvar */
  onSave: (link: SocialLinkData) => void;
  /** Configuração de validação */
  validation?: SocialUrlValidation;
  /** Título do formulário */
  title?: string;
}

/**
 * Props para preview de link social
 */
export interface SocialLinkPreviewProps {
  /** URL para preview */
  url: string;
  /** Configuração de aparência */
  appearance?: SocialAppearanceConfig;
  /** Se deve mostrar informações detalhadas */
  showDetails?: boolean;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Props para estatísticas de links sociais
 */
export interface SocialStatsProps {
  /** Links para calcular estatísticas */
  links: SocialLinkData[];
  /** Variante de exibição */
  variant?: 'compact' | 'detailed' | 'chart';
  /** Se deve mostrar gráficos */
  showCharts?: boolean;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Interface para resultado de detecção de plataforma
 */
export interface PlatformDetectionResult {
  /** Plataforma detectada */
  platform: SocialPlatform;
  /** Confiança na detecção (0-1) */
  confidence: number;
  /** URL normalizada */
  normalizedUrl: string;
  /** Metadados extraídos */
  metadata?: {
    username?: string;
    profileId?: string;
    displayName?: string;
  };
}

/**
 * Interface para configurações de importação/exportação
 */
export interface SocialLinksImportExport {
  /** Formato de exportação */
  format: 'json' | 'csv' | 'yaml' | 'xml';
  /** Se deve incluir configurações */
  includeConfig?: boolean;
  /** Se deve incluir metadados */
  includeMetadata?: boolean;
  /** Opções específicas do formato */
  formatOptions?: Record<string, any>;
}

/**
 * Props para o seletor de plataformas
 */
export interface PlatformSelectorProps {
  /** Valor selecionado */
  value: string;
  /** Plataforma detectada automaticamente */
  detectedPlatform?: SocialPlatform;
  /** Se está detectando plataforma */
  isDetecting?: boolean;
  /** Se deve mostrar categorias */
  showCategories?: boolean;
  /** Se deve mostrar plataformas populares */
  showPopular?: boolean;
  /** Máximo de sugestões */
  maxSuggestions?: number;
  /** Callback para mudança de valor */
  onPlatformChange?: (platformName: string) => void;
  /** Callback para seleção de plataforma */
  onPlatformSelect?: (platform: SocialPlatform | null) => void;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}
