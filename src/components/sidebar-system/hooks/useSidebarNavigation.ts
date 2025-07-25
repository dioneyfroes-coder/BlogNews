/**
 * @fileoverview Hook para navegação da Sidebar
 * @module sidebar/hooks/useSidebarNavigation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  SidebarSection, 
  SidebarNavItem,
  SidebarNavigationState
} from '../types';
import { SidebarNavigationManager } from '../utils';

export interface UseSidebarNavigationOptions {
  /** Seções iniciais */
  initialSections?: SidebarSection[];
  /** Item ativo inicial */
  initialActiveItem?: string;
  /** Auto-expandir seções com item ativo */
  autoExpand?: boolean;
  /** Persist navigation state */
  persistState?: boolean;
  /** Storage key para persistência */
  storageKey?: string;
}

export interface UseSidebarNavigationReturn {
  /** Estado atual da navegação */
  navigationState: SidebarNavigationState;
  /** Seções de navegação */
  sections: SidebarSection[];
  /** Item ativo atual */
  activeItem?: string;
  /** Seções expandidas */
  expandedSections: string[];
  
  /** Definir seções */
  setSections: (sections: SidebarSection[]) => void;
  /** Adicionar seção */
  addSection: (section: SidebarSection) => void;
  /** Remover seção */
  removeSection: (sectionId: string) => void;
  /** Atualizar seção */
  updateSection: (sectionId: string, updates: Partial<SidebarSection>) => void;
  
  /** Definir item ativo */
  setActiveItem: (itemId: string) => void;
  /** Navegar para item */
  navigateToItem: (itemId: string) => void;
  /** Encontrar item por ID */
  findItemById: (itemId: string) => SidebarNavItem | undefined;
  
  /** Toggle seção expandida */
  toggleSection: (sectionId: string) => void;
  /** Expandir seção */
  expandSection: (sectionId: string) => void;
  /** Colapsar seção */
  collapseSection: (sectionId: string) => void;
  /** Expandir todas as seções */
  expandAllSections: () => void;
  /** Colapsar todas as seções */
  collapseAllSections: () => void;
}

/**
 * Hook para gerenciamento de navegação da sidebar
 */
export const useSidebarNavigation = (
  options: UseSidebarNavigationOptions = {}
): UseSidebarNavigationReturn => {
  const {
    initialSections = [],
    initialActiveItem,
    autoExpand = true,
    persistState = false,
    storageKey = 'sidebar-navigation'
  } = options;

  // Navigation manager
  const navigationManagerRef = useRef<SidebarNavigationManager | null>(null);

  // Estados
  const [sections, setSectionsState] = useState<SidebarSection[]>(initialSections);
  const [activeItem, setActiveItemState] = useState<string | undefined>(initialActiveItem);
  const [expandedSections, setExpandedSectionsState] = useState<string[]>([]);

  // Inicializar navigation manager
  useEffect(() => {
    if (!navigationManagerRef.current) {
      navigationManagerRef.current = new SidebarNavigationManager();
    }

    const manager = navigationManagerRef.current;
    manager.setSections(sections);

    if (initialActiveItem) {
      manager.setActiveItem(initialActiveItem);
    }

    // Listener para mudanças no item ativo
    const removeListener = manager.addListener((newActiveItem) => {
      setActiveItemState(newActiveItem);
    });

    return removeListener;
  }, [sections, initialActiveItem]);

  // Carregar estado salvo
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        if (savedState.activeItem) {
          setActiveItemState(savedState.activeItem);
        }
        if (savedState.expandedSections) {
          setExpandedSectionsState(savedState.expandedSections);
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar estado da navegação:', error);
    }
  }, [persistState, storageKey]);

  // Salvar estado
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      const stateToSave = {
        activeItem,
        expandedSections
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Erro ao salvar estado da navegação:', error);
    }
  }, [activeItem, expandedSections, persistState, storageKey]);

  // Funções de controle de seções
  const setSections = useCallback((newSections: SidebarSection[]) => {
    setSectionsState(newSections);
    navigationManagerRef.current?.setSections(newSections);
  }, []);

  const addSection = useCallback((section: SidebarSection) => {
    setSectionsState(prev => [...prev, section]);
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setSectionsState(prev => prev.filter(s => s.id !== sectionId));
    setExpandedSectionsState(prev => prev.filter(id => id !== sectionId));
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<SidebarSection>) => {
    setSectionsState(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, ...updates }
        : section
    ));
  }, []);

  // Funções de navegação
  const setActiveItem = useCallback((itemId: string) => {
    navigationManagerRef.current?.setActiveItem(itemId);
    
    if (autoExpand) {
      // Auto-expandir seção do item ativo
      const section = sections.find(s => 
        s.items.some(item => 
          item.id === itemId || 
          item.children?.some(child => child.id === itemId)
        )
      );
      
      if (section && !expandedSections.includes(section.id)) {
        setExpandedSectionsState(prev => [...prev, section.id]);
      }
    }
  }, [sections, expandedSections, autoExpand]);

  const navigateToItem = useCallback((itemId: string) => {
    navigationManagerRef.current?.navigateToItem(itemId);
  }, []);

  const findItemById = useCallback((itemId: string): SidebarNavItem | undefined => {
    return navigationManagerRef.current?.findItemById(itemId);
  }, []);

  // Funções de expansão
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSectionsState(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });

    navigationManagerRef.current?.toggleSection(sectionId);
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSectionsState(prev => {
      if (!prev.includes(sectionId)) {
        return [...prev, sectionId];
      }
      return prev;
    });
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSectionsState(prev => prev.filter(id => id !== sectionId));
  }, []);

  const expandAllSections = useCallback(() => {
    const allSectionIds = sections.map(s => s.id);
    setExpandedSectionsState(allSectionIds);
  }, [sections]);

  const collapseAllSections = useCallback(() => {
    setExpandedSectionsState([]);
  }, []);

  // Estado da navegação
  const navigationState: SidebarNavigationState = {
    sections,
    activeItem,
    expandedSections,
    hasActiveItem: !!activeItem,
    activeSectionId: sections.find(s => 
      s.items.some(item => 
        item.id === activeItem || 
        item.children?.some(child => child.id === activeItem)
      )
    )?.id
  };

  return {
    navigationState,
    sections,
    activeItem,
    expandedSections,
    
    setSections,
    addSection,
    removeSection,
    updateSection,
    
    setActiveItem,
    navigateToItem,
    findItemById,
    
    toggleSection,
    expandSection,
    collapseSection,
    expandAllSections,
    collapseAllSections
  };
};
