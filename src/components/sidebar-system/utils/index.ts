/**
 * @fileoverview Utilitários para sistema de Sidebar
 * @module sidebar/utils
 */

import type { 
  SidebarConfig, 
  SidebarSection, 
  SidebarNavItem, 
  SidebarBreakpoints,
  SidebarPosition,
  SidebarVariant,
  SidebarState
} from '../types';

/**
 * Configurações padrão da sidebar
 */
export const SIDEBAR_DEFAULTS = {
  appearance: {
    width: 280,
    miniWidth: 64,
    backgroundColor: '#ffffff',
    elevation: 4,
    borderRadius: 0,
    showBorder: true,
    borderColor: 'rgba(0,0,0,0.12)'
  },
  behavior: {
    closeOnOverlayClick: true,
    closeOnEscape: true,
    resizable: false,
    autoCollapse: true,
    persistState: true,
    storageKey: 'sidebar-state'
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    disabled: false
  },
  breakpoints: {
    desktop: 1200,
    tablet: 768,
    mobile: 480
  }
} as const;

/**
 * Classe para gerenciamento de configurações da sidebar
 */
export class SidebarConfigManager {
  private static instance: SidebarConfigManager;
  private config: SidebarConfig;

  private constructor(initialConfig?: SidebarConfig) {
    this.config = this.mergeConfig(initialConfig);
  }

  /**
   * Singleton instance
   */
  static getInstance(config?: SidebarConfig): SidebarConfigManager {
    if (!SidebarConfigManager.instance) {
      SidebarConfigManager.instance = new SidebarConfigManager(config);
    }
    return SidebarConfigManager.instance;
  }

  /**
   * Merge configurações com defaults
   */
  private mergeConfig(userConfig?: SidebarConfig): SidebarConfig {
    return {
      appearance: {
        ...SIDEBAR_DEFAULTS.appearance,
        ...userConfig?.appearance
      },
      behavior: {
        ...SIDEBAR_DEFAULTS.behavior,
        ...userConfig?.behavior
      },
      animations: {
        ...SIDEBAR_DEFAULTS.animations,
        ...userConfig?.animations
      },
      breakpoints: {
        ...SIDEBAR_DEFAULTS.breakpoints,
        ...userConfig?.breakpoints
      }
    };
  }

  /**
   * Obter configuração atual
   */
  getConfig(): SidebarConfig {
    return this.config;
  }

  /**
   * Atualizar configuração
   */
  updateConfig(newConfig: Partial<SidebarConfig>): void {
    this.config = this.mergeConfig({
      ...this.config,
      ...newConfig
    });
  }

  /**
   * Resetar para configuração padrão
   */
  resetConfig(): void {
    this.config = this.mergeConfig();
  }
}

/**
 * Classe para gerenciamento de estado da sidebar
 */
export class SidebarStateManager {
  private storageKey: string;
  
  constructor(storageKey: string = SIDEBAR_DEFAULTS.behavior.storageKey!) {
    this.storageKey = storageKey;
  }

  /**
   * Salvar estado no localStorage
   */
  saveState(state: {
    open: boolean;
    activeItem?: string;
    expandedSections?: string[];
  }): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(state));
      }
    } catch (error) {
      console.warn('Não foi possível salvar estado da sidebar:', error);
    }
  }

  /**
   * Carregar estado do localStorage
   */
  loadState(): {
    open: boolean;
    activeItem?: string;
    expandedSections?: string[];
  } | null {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.warn('Não foi possível carregar estado da sidebar:', error);
    }
    return null;
  }

  /**
   * Limpar estado salvo
   */
  clearState(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.warn('Não foi possível limpar estado da sidebar:', error);
    }
  }
}

/**
 * Classe para detecção de breakpoints responsivos
 */
export class SidebarBreakpointDetector {
  private breakpoints: SidebarBreakpoints;
  private listeners: Set<(isMobile: boolean) => void> = new Set();

  constructor(breakpoints: SidebarBreakpoints = SIDEBAR_DEFAULTS.breakpoints) {
    this.breakpoints = breakpoints;
    
    if (typeof window !== 'undefined') {
      this.setupListener();
    }
  }

  /**
   * Configurar listener de resize
   */
  private setupListener(): void {
    const handleResize = () => {
      const isMobile = this.isMobile();
      this.listeners.forEach(listener => listener(isMobile));
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup automático
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        window.removeEventListener('resize', handleResize);
      });
    }
  }

  /**
   * Verificar se está em modo mobile
   */
  isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < (this.breakpoints.tablet || 768);
  }

  /**
   * Verificar se está em modo tablet
   */
  isTablet(): boolean {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= (this.breakpoints.tablet || 768) && 
           width < (this.breakpoints.desktop || 1200);
  }

  /**
   * Verificar se está em modo desktop
   */
  isDesktop(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= (this.breakpoints.desktop || 1200);
  }

  /**
   * Adicionar listener de mudança
   */
  addListener(listener: (isMobile: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * Classe para navegação da sidebar
 */
export class SidebarNavigationManager {
  private sections: SidebarSection[] = [];
  private activeItem?: string;
  private expandedSections: Set<string> = new Set();
  private listeners: Set<(activeItem?: string) => void> = new Set();

  /**
   * Definir seções
   */
  setSections(sections: SidebarSection[]): void {
    this.sections = sections;
    
    // Auto-expandir seções com item ativo
    this.sections.forEach(section => {
      if (this.sectionHasActiveItem(section)) {
        this.expandedSections.add(section.id);
      }
    });
  }

  /**
   * Verificar se seção tem item ativo
   */
  private sectionHasActiveItem(section: SidebarSection): boolean {
    return section.items.some(item => 
      item.active || 
      item.id === this.activeItem || 
      (item.children && item.children.some(child => 
        child.active || child.id === this.activeItem
      ))
    );
  }

  /**
   * Definir item ativo
   */
  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.notifyListeners();
    
    // Auto-expandir seção do item ativo
    const section = this.findSectionByItemId(itemId);
    if (section) {
      this.expandedSections.add(section.id);
    }
  }

  /**
   * Obter item ativo
   */
  getActiveItem(): string | undefined {
    return this.activeItem;
  }

  /**
   * Encontrar seção por ID do item
   */
  private findSectionByItemId(itemId: string): SidebarSection | undefined {
    return this.sections.find(section =>
      section.items.some(item =>
        item.id === itemId ||
        (item.children && item.children.some(child => child.id === itemId))
      )
    );
  }

  /**
   * Toggle seção expandida
   */
  toggleSection(sectionId: string): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  /**
   * Verificar se seção está expandida
   */
  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  /**
   * Encontrar item por ID
   */
  findItemById(itemId: string): SidebarNavItem | undefined {
    for (const section of this.sections) {
      for (const item of section.items) {
        if (item.id === itemId) return item;
        
        if (item.children) {
          const childItem = item.children.find(child => child.id === itemId);
          if (childItem) return childItem;
        }
      }
    }
    return undefined;
  }

  /**
   * Navegar para item
   */
  navigateToItem(itemId: string): void {
    const item = this.findItemById(itemId);
    if (!item || item.disabled) return;

    this.setActiveItem(itemId);

    if (item.onClick) {
      item.onClick();
    } else if (item.href && typeof window !== 'undefined') {
      window.location.href = item.href;
    }
  }

  /**
   * Adicionar listener de mudança
   */
  addListener(listener: (activeItem?: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notificar listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.activeItem));
  }

  /**
   * Obter seções expandidas
   */
  getExpandedSections(): string[] {
    return Array.from(this.expandedSections);
  }

  /**
   * Definir seções expandidas
   */
  setExpandedSections(sectionIds: string[]): void {
    this.expandedSections = new Set(sectionIds);
  }
}

/**
 * Utilitários para animações da sidebar
 */
export class SidebarAnimationUtils {
  /**
   * Criar transição CSS para sidebar
   */
  static createTransition(
    duration: number = SIDEBAR_DEFAULTS.animations.duration,
    easing: string = SIDEBAR_DEFAULTS.animations.easing
  ): string {
    return `transform ${duration}ms ${easing}, width ${duration}ms ${easing}`;
  }

  /**
   * Calcular transform para posição
   */
  static getTransform(
    position: SidebarPosition,
    isOpen: boolean,
    width: number | string
  ): string {
    if (isOpen) return 'translateX(0)';

    const translateValue = typeof width === 'number' ? `${width}px` : width;

    switch (position) {
      case 'left':
        return `translateX(-${translateValue})`;
      case 'right':
        return `translateX(${translateValue})`;
      case 'top':
        return `translateY(-${translateValue})`;
      case 'bottom':
        return `translateY(${translateValue})`;
      default:
        return `translateX(-${translateValue})`;
    }
  }

  /**
   * Obter estilos de overlay
   */
  static getOverlayStyles(isOpen: boolean): {
    opacity: number;
    visibility: 'visible' | 'hidden';
    pointerEvents: 'auto' | 'none';
  } {
    return {
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      pointerEvents: isOpen ? 'auto' : 'none'
    };
  }
}

/**
 * Validador de configurações da sidebar
 */
export class SidebarValidator {
  /**
   * Validar configuração da sidebar
   */
  static validateConfig(config: SidebarConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar aparência
    if (config.appearance) {
      const { width, miniWidth } = config.appearance;
      
      if (width && typeof width === 'number' && width <= 0) {
        errors.push('Largura da sidebar deve ser maior que 0');
      }
      
      if (miniWidth && typeof miniWidth === 'number' && miniWidth <= 0) {
        errors.push('Largura mini da sidebar deve ser maior que 0');
      }
    }

    // Validar animações
    if (config.animations) {
      const { duration } = config.animations;
      
      if (duration && duration < 0) {
        errors.push('Duração da animação deve ser maior ou igual a 0');
      }
    }

    // Validar breakpoints
    if (config.breakpoints) {
      const { mobile, tablet, desktop } = config.breakpoints;
      
      if (mobile && tablet && mobile >= tablet) {
        errors.push('Breakpoint mobile deve ser menor que tablet');
      }
      
      if (tablet && desktop && tablet >= desktop) {
        errors.push('Breakpoint tablet deve ser menor que desktop');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar seções de navegação
   */
  static validateSections(sections: SidebarSection[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const sectionIds = new Set<string>();
    const itemIds = new Set<string>();

    sections.forEach((section, sectionIndex) => {
      // Validar ID único da seção
      if (sectionIds.has(section.id)) {
        errors.push(`ID de seção duplicado: ${section.id}`);
      }
      sectionIds.add(section.id);

      // Validar itens da seção
      section.items.forEach((item, itemIndex) => {
        // Validar ID único do item
        if (itemIds.has(item.id)) {
          errors.push(`ID de item duplicado: ${item.id}`);
        }
        itemIds.add(item.id);

        // Validar subitens
        if (item.children) {
          item.children.forEach((child, childIndex) => {
            if (itemIds.has(child.id)) {
              errors.push(`ID de subitem duplicado: ${child.id}`);
            }
            itemIds.add(child.id);

            // Validar que subitem tem label
            if (!child.label?.trim()) {
              errors.push(`Subitem na posição ${childIndex} do item ${item.id} deve ter label`);
            }
          });
        }

        // Validar que item tem label
        if (!item.label?.trim()) {
          errors.push(`Item na posição ${itemIndex} da seção ${section.id} deve ter label`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Funções utilitárias gerais
 */
export const SidebarUtils = {
  /**
   * Gerar ID único para item/seção
   */
  generateId: (prefix: string = 'sidebar'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Debounce para otimização de performance
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), wait);
    };
  },

  /**
   * Detectar se dispositivo tem touch
   */
  isTouchDevice: (): boolean => {
    return typeof window !== 'undefined' && 
           ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  },

  /**
   * Calcular largura da sidebar baseada no conteúdo
   */
  calculateOptimalWidth: (content: string[]): number => {
    const baseWidth = 200;
    const charWidth = 8; // aprox. largura por caractere
    const padding = 40; // padding interno
    
    const maxContentWidth = Math.max(
      ...content.map(text => text.length * charWidth)
    );
    
    return Math.min(Math.max(baseWidth, maxContentWidth + padding), 400);
  },

  /**
   * Converter configuração legacy para nova estrutura
   */
  migrateLegacyConfig: (legacyConfig: any): SidebarConfig => {
    return {
      appearance: {
        width: legacyConfig.width || SIDEBAR_DEFAULTS.appearance.width,
        backgroundColor: legacyConfig.bgColor || SIDEBAR_DEFAULTS.appearance.backgroundColor,
        ...legacyConfig.appearance
      },
      behavior: {
        closeOnOverlayClick: legacyConfig.closeOnClick !== false,
        persistState: legacyConfig.remember !== false,
        ...legacyConfig.behavior
      },
      animations: {
        duration: legacyConfig.animationDuration || SIDEBAR_DEFAULTS.animations.duration,
        ...legacyConfig.animations
      },
      breakpoints: {
        ...SIDEBAR_DEFAULTS.breakpoints,
        ...legacyConfig.breakpoints
      }
    };
  }
};

/**
 * Constantes úteis
 */
export const SIDEBAR_CONSTANTS = {
  POSITIONS: ['left', 'right', 'top', 'bottom'] as const,
  VARIANTS: ['permanent', 'persistent', 'temporary'] as const,
  MODES: ['overlay', 'push', 'mini'] as const,
  STATES: ['open', 'closed', 'mini', 'auto'] as const,
  Z_INDICES: {
    OVERLAY: 1200,
    SIDEBAR: 1201,
    TOGGLE: 1202
  },
  STORAGE_KEYS: {
    STATE: 'sidebar-state',
    CONFIG: 'sidebar-config',
    NAVIGATION: 'sidebar-navigation'
  }
} as const;
