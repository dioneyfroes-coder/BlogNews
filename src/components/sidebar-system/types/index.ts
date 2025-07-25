/**
 * @fileoverview Tipos para sistema de Sidebar
 * @module sidebar/types
 */

import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Posições da sidebar
 */
export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Variantes de exibição da sidebar
 */
export type SidebarVariant = 'permanent' | 'persistent' | 'temporary';

/**
 * Modos de comportamento da sidebar
 */
export type SidebarMode = 'overlay' | 'push' | 'mini';

/**
 * Estados da sidebar
 */
export type SidebarStatus = 'open' | 'closed' | 'mini' | 'auto';

/**
 * Configuração de breakpoints responsivos
 */
export interface SidebarBreakpoints {
  /** Ponto de quebra para desktop */
  desktop?: number;
  /** Ponto de quebra para tablet */
  tablet?: number;
  /** Ponto de quebra para mobile */
  mobile?: number;
}

/**
 * Configuração de animações
 */
export interface SidebarAnimations {
  /** Duração da animação de entrada */
  duration?: number;
  /** Easing da animação */
  easing?: string;
  /** Desabilitar animações */
  disabled?: boolean;
}

/**
 * Configuração de aparência
 */
export interface SidebarAppearance {
  /** Largura da sidebar */
  width?: number | string;
  /** Largura da sidebar em modo mini */
  miniWidth?: number | string;
  /** Cor de fundo */
  backgroundColor?: string;
  /** Elevação (shadow) */
  elevation?: number;
  /** Border radius */
  borderRadius?: number;
  /** Mostrar border */
  showBorder?: boolean;
  /** Cor do border */
  borderColor?: string;
}

/**
 * Configuração de comportamento
 */
export interface SidebarBehavior {
  /** Fechar ao clicar no overlay */
  closeOnOverlayClick?: boolean;
  /** Fechar ao pressionar Escape */
  closeOnEscape?: boolean;
  /** Permitir redimensionamento */
  resizable?: boolean;
  /** Colapsar automaticamente em mobile */
  autoCollapse?: boolean;
  /** Manter estado no localStorage */
  persistState?: boolean;
  /** Chave para localStorage */
  storageKey?: string;
}

/**
 * Item de navegação da sidebar
 */
export interface SidebarNavItem {
  /** ID único do item */
  id: string;
  /** Texto do item */
  label: string;
  /** Ícone do item */
  icon?: ReactNode;
  /** Descrição do item */
  description?: string;
  /** URL de navegação */
  href?: string;
  /** Função de clique personalizada */
  onClick?: () => void;
  /** Se o item está ativo */
  active?: boolean;
  /** Se o item está desabilitado */
  disabled?: boolean;
  /** Badge/contador */
  badge?: string | number | {
    content: string | number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
    variant?: 'standard' | 'dot';
  };
  /** Cor do badge */
  badgeColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Subitens */
  children?: SidebarNavItem[];
  /** Se está expandido (para subitens) */
  expanded?: boolean;
  /** Divider após o item */
  divider?: boolean;
}

/**
 * Seção da sidebar
 */
export interface SidebarSection {
  /** ID da seção */
  id: string;
  /** Título da seção */
  title?: string;
  /** Itens da seção */
  items: SidebarNavItem[];
  /** Se deve mostrar divider após a seção */
  showDivider?: boolean;
  /** Se a seção é colapsável */
  collapsible?: boolean;
  /** Se está expandida */
  expanded?: boolean;
  /** Ícone da seção */
  icon?: ReactNode;
}

/**
 * Configuração geral da sidebar
 */
export interface SidebarConfig {
  /** Configuração de aparência */
  appearance?: SidebarAppearance;
  /** Configuração de comportamento */
  behavior?: SidebarBehavior;
  /** Configuração de animações */
  animations?: SidebarAnimations;
  /** Configuração de breakpoints */
  breakpoints?: SidebarBreakpoints;
}

/**
 * Props do componente Sidebar
 */
export interface SidebarProps {
  /** Se a sidebar está aberta */
  open?: boolean;
  /** Callback quando o estado muda */
  onOpenChange?: (open: boolean) => void;
  /** Posição da sidebar */
  position?: SidebarPosition;
  /** Variante da sidebar */
  variant?: SidebarVariant;
  /** Modo de comportamento */
  mode?: SidebarMode;
  /** Seções da sidebar */
  sections?: SidebarSection[];
  /** Cabeçalho personalizado */
  header?: ReactNode;
  /** Rodapé personalizado */
  footer?: ReactNode;
  /** Conteúdo personalizado */
  children?: ReactNode;
  /** Configuração */
  config?: SidebarConfig;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS */
  className?: string;
  /** Props adicionais */
  [key: string]: any;
}

/**
 * Props do SidebarToggle
 */
export interface SidebarToggleProps {
  /** Se a sidebar está aberta */
  open?: boolean;
  /** Callback para toggle */
  onToggle?: () => void;
  /** Callback para click */
  onClick?: () => void;
  /** Posição da sidebar */
  position?: SidebarPosition;
  /** Variante do botão */
  variant?: 'icon' | 'fab';
  /** Tamanho do botão */
  size?: 'small' | 'medium' | 'large';
  /** Cor do botão */
  color?: 'primary' | 'secondary' | 'default' | 'inherit';
  /** Ícone personalizado */
  icon?: ReactNode;
  /** Ícone personalizado para aberto */
  openIcon?: ReactNode;
  /** Ícone personalizado para fechado */
  closedIcon?: ReactNode;
  /** Tooltip */
  tooltip?: string;
  /** Tooltip quando aberto */
  openTooltip?: string;
  /** Tooltip quando fechado */
  closedTooltip?: string;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se está flutuante */
  floating?: boolean;
  /** Posição quando flutuante */
  floatingPosition?: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  };
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS */
  className?: string;
  /** Props adicionais */
  [key: string]: any;
}

/**
 * Props do SidebarNavigation
 */
export interface SidebarNavigationProps {
  /** Seções de navegação */
  sections: SidebarSection[];
  /** Item ativo atual */
  activeItem?: string;
  /** Callback quando item é selecionado */
  onItemSelect?: (item: SidebarNavItem) => void;
  /** Se está em modo compacto */
  compact?: boolean;
  /** Mostrar ícones */
  showIcons?: boolean;
  /** Mostrar badges */
  showBadges?: boolean;
  /** Mostrar dividers entre seções */
  showDividers?: boolean;
  /** Altura máxima */
  maxHeight?: number | string;
  /** Permitir expansão de subitens */
  expandable?: boolean;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS */
  className?: string;
  /** Props adicionais */
  [key: string]: any;
}

/**
 * Props do SidebarHeader
 */
export interface SidebarHeaderProps {
  /** Título */
  title?: string;
  /** Subtítulo */
  subtitle?: string;
  /** Avatar/imagem de perfil */
  avatar?: string | ReactNode;
  /** Logo/ícone */
  logo?: ReactNode;
  /** Se está em modo compacto */
  compact?: boolean;
  /** Mostrar botão de fechar */
  showCloseButton?: boolean;
  /** Mostrar botão de configurações */
  showSettingsButton?: boolean;
  /** Callback para fechar */
  onClose?: () => void;
  /** Callback para configurações */
  onSettings?: () => void;
  /** Ações customizadas */
  actions?: ReactNode;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS */
  className?: string;
  /** Props adicionais */
  [key: string]: any;
}

/**
 * Props do SidebarFooter
 */
export interface SidebarFooterProps {
  /** Conteúdo do rodapé */
  children?: ReactNode;
  /** Se está em modo compacto */
  compact?: boolean;
  /** Mostrar divider */
  showDivider?: boolean;
  /** Mostrar versão */
  showVersion?: boolean;
  /** Versão personalizada */
  version?: string;
  /** Links do rodapé */
  links?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS */
  className?: string;
  /** Props adicionais */
  [key: string]: any;
}

/**
 * Contexto da Sidebar
 */
export interface SidebarContextValue {
  /** Se está aberta */
  open: boolean;
  /** Função para abrir/fechar */
  setOpen: (open: boolean) => void;
  /** Função de toggle */
  toggle: () => void;
  /** Estado atual */
  state: SidebarState;
  /** Configuração */
  config: SidebarConfig;
  /** Se está em modo mobile */
  isMobile: boolean;
  /** Item ativo */
  activeItem?: string;
  /** Definir item ativo */
  setActiveItem: (itemId: string) => void;
}

/**
 * Estado da sidebar
 */
export interface SidebarState {
  /** Se a sidebar está aberta */
  isOpen: boolean;
  /** Se está em modo mini */
  isMini: boolean;
  /** Se está em modo mobile */
  isMobile: boolean;
  /** Se está em modo desktop */
  isDesktop: boolean;
  /** Se está carregando */
  isLoading: boolean;
  /** Largura atual */
  width?: number | string;
  /** Posição da sidebar */
  position: SidebarPosition;
}

/**
 * Retorno do hook useSidebar
 */
export interface SidebarHookReturn {
  /** Estado atual */
  state: SidebarState;
  /** Configuração atual */
  config: SidebarConfig;
  /** Se está aberta */
  isOpen: boolean;
  /** Se está mini */
  isMini: boolean;
  /** Se está mobile */
  isMobile: boolean;
  /** Se está carregando */
  isLoading: boolean;
  /** Abrir sidebar */
  open: () => void;
  /** Fechar sidebar */
  close: () => void;
  /** Toggle sidebar */
  toggle: () => void;
  /** Minimizar sidebar */
  minimize: () => void;
  /** Maximizar sidebar */
  maximize: () => void;
  /** Atualizar configuração */
  updateConfig: (config: Partial<SidebarConfig>) => void;
  /** Resetar configuração */
  resetConfig: () => void;
}

/**
 * Hook return type
 */
export interface UseSidebarReturn extends SidebarContextValue {
  /** Registrar item de navegação */
  registerNavItem: (item: SidebarNavItem) => void;
  /** Remover item de navegação */
  unregisterNavItem: (itemId: string) => void;
  /** Expandir/colapsar seção */
  toggleSection: (sectionId: string) => void;
  /** Navegar para item */
  navigateToItem: (itemId: string) => void;
}

/**
 * Estado de navegação da sidebar
 */
export interface SidebarNavigationState {
  /** Seções de navegação */
  sections: SidebarSection[];
  /** Item ativo atual */
  activeItem?: string;
  /** Seções expandidas */
  expandedSections: string[];
  /** Se há item ativo */
  hasActiveItem: boolean;
  /** ID da seção ativa */
  activeSectionId?: string;
}
