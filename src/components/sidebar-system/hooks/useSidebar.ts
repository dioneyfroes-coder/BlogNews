/**
 * @fileoverview Hook principal para gerenciamento de estado da Sidebar
 * @module sidebar/hooks/useSidebar
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  SidebarState, 
  SidebarConfig,
  SidebarHookReturn,
  SidebarBreakpoints
} from '../types';
import { 
  SidebarConfigManager, 
  SidebarStateManager, 
  SidebarBreakpointDetector,
  SIDEBAR_DEFAULTS 
} from '../utils';

/**
 * Hook principal para gerenciamento da sidebar
 */
export const useSidebar = (
  initialConfig?: Partial<SidebarConfig>
): SidebarHookReturn => {
  // Managers
  const configManagerRef = useRef<SidebarConfigManager | null>(null);
  const stateManagerRef = useRef<SidebarStateManager | null>(null);
  const breakpointDetectorRef = useRef<SidebarBreakpointDetector | null>(null);

  // Estados
  const [isOpen, setIsOpen] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<SidebarConfig>(() => {
    const manager = SidebarConfigManager.getInstance(initialConfig);
    return manager.getConfig();
  });

  // Inicialização dos managers
  useEffect(() => {
    configManagerRef.current = SidebarConfigManager.getInstance(initialConfig);
    stateManagerRef.current = new SidebarStateManager(config.behavior?.storageKey);
    breakpointDetectorRef.current = new SidebarBreakpointDetector(config.breakpoints);

    setConfig(configManagerRef.current.getConfig());
    setIsLoading(false);
  }, []);

  // Carregar estado salvo
  useEffect(() => {
    if (!stateManagerRef.current || !config.behavior?.persistState) return;

    const savedState = stateManagerRef.current.loadState();
    if (savedState) {
      setIsOpen(savedState.open);
    }
  }, [config.behavior?.persistState]);

  // Listener para mudanças de breakpoint
  useEffect(() => {
    if (!breakpointDetectorRef.current) return;

    const handleBreakpointChange = (mobile: boolean) => {
      setIsMobile(mobile);
      
      if (mobile && isOpen && config.behavior?.autoCollapse) {
        setIsOpen(false);
      }
    };

    setIsMobile(breakpointDetectorRef.current.isMobile());
    const removeListener = breakpointDetectorRef.current.addListener(handleBreakpointChange);

    return removeListener;
  }, [isOpen, config.behavior?.autoCollapse]);

  // Salvar estado quando muda
  useEffect(() => {
    if (!stateManagerRef.current || !config.behavior?.persistState) return;

    stateManagerRef.current.saveState({
      open: isOpen
    });
  }, [isOpen, config.behavior?.persistState]);

  // Funções de controle
  const open = useCallback(() => {
    setIsOpen(true);
    setIsMini(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsMini(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const minimize = useCallback(() => {
    setIsMini(true);
    setIsOpen(true);
  }, []);

  const maximize = useCallback(() => {
    setIsMini(false);
    setIsOpen(true);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SidebarConfig>) => {
    if (configManagerRef.current) {
      configManagerRef.current.updateConfig(newConfig);
      setConfig(configManagerRef.current.getConfig());
    }
  }, []);

  const resetConfig = useCallback(() => {
    if (configManagerRef.current) {
      configManagerRef.current.resetConfig();
      setConfig(configManagerRef.current.getConfig());
    }
  }, []);

  // Estado atual
  const state: SidebarState = {
    isOpen,
    isMini,
    isMobile,
    isDesktop: !isMobile,
    isLoading,
    width: isMini ? config.appearance?.miniWidth : config.appearance?.width,
    position: 'left' as const
  };

  return {
    // Estado
    state,
    config,
    isOpen,
    isMini,
    isMobile,
    isLoading,

    // Ações
    open,
    close,
    toggle,
    minimize,
    maximize,
    updateConfig,
    resetConfig
  };
};
