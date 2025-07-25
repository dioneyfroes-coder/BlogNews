/**
 * @fileoverview Hook para breakpoints responsivos da Sidebar
 * @module sidebar/hooks/useSidebarBreakpoints
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SidebarBreakpoints } from '../types';
import { SidebarBreakpointDetector, SIDEBAR_DEFAULTS } from '../utils';

export interface UseSidebarBreakpointsOptions {
  /** Breakpoints customizados */
  breakpoints?: SidebarBreakpoints;
  /** Callback para mudanças de breakpoint */
  onBreakpointChange?: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
}

export interface UseSidebarBreakpointsReturn {
  /** Se está em modo mobile */
  isMobile: boolean;
  /** Se está em modo tablet */
  isTablet: boolean;
  /** Se está em modo desktop */
  isDesktop: boolean;
  /** Breakpoint atual */
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
  /** Largura atual da tela */
  screenWidth: number;
  /** Breakpoints configurados */
  breakpoints: SidebarBreakpoints;
}

/**
 * Hook para gerenciamento de breakpoints da sidebar
 */
export const useSidebarBreakpoints = (
  options: UseSidebarBreakpointsOptions = {}
): UseSidebarBreakpointsReturn => {
  const {
    breakpoints = SIDEBAR_DEFAULTS.breakpoints,
    onBreakpointChange
  } = options;

  // Detector de breakpoints
  const detectorRef = useRef<SidebarBreakpointDetector | null>(null);

  // Estados
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  // Inicializar detector
  useEffect(() => {
    if (!detectorRef.current) {
      detectorRef.current = new SidebarBreakpointDetector(breakpoints);
    }

    const detector = detectorRef.current;

    // Estados iniciais
    const updateStates = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const mobile = detector.isMobile();
        const tablet = detector.isTablet();
        const desktop = detector.isDesktop();

        setScreenWidth(width);
        setIsMobile(mobile);
        setIsTablet(tablet);
        setIsDesktop(desktop);

        // Callback para mudança de breakpoint
        if (onBreakpointChange) {
          if (mobile) onBreakpointChange('mobile');
          else if (tablet) onBreakpointChange('tablet');
          else if (desktop) onBreakpointChange('desktop');
        }
      }
    };

    updateStates();

    // Listener para mudanças
    const removeListener = detector.addListener(() => {
      updateStates();
    });

    return removeListener;
  }, [breakpoints, onBreakpointChange]);

  // Breakpoint atual
  const currentBreakpoint: 'mobile' | 'tablet' | 'desktop' = 
    isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    screenWidth,
    breakpoints
  };
};

/**
 * Hook para animações da sidebar
 */
export const useSidebarAnimations = (
  isOpen: boolean,
  config?: {
    duration?: number;
    easing?: string;
    disabled?: boolean;
  }
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const duration = config?.duration ?? SIDEBAR_DEFAULTS.animations.duration;
  const easing = config?.easing ?? SIDEBAR_DEFAULTS.animations.easing;
  const disabled = config?.disabled ?? SIDEBAR_DEFAULTS.animations.disabled;

  useEffect(() => {
    if (disabled) return;

    setIsAnimating(true);

    // Limpar timeout anterior
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Definir fim da animação
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, duration);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, duration, disabled]);

  return {
    isAnimating,
    transition: disabled ? 'none' : `transform ${duration}ms ${easing}`,
    duration,
    easing
  };
};

/**
 * Hook para keyboard shortcuts da sidebar
 */
export const useSidebarKeyboard = (
  config: {
    onToggle?: () => void;
    onClose?: () => void;
    onEscape?: () => void;
    shortcuts?: {
      toggle?: string;
      close?: string;
    };
    enabled?: boolean;
  }
) => {
  const {
    onToggle,
    onClose,
    onEscape,
    shortcuts = { toggle: 'b', close: 'Escape' },
    enabled = true
  } = config;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + B para toggle
      if (shortcuts.toggle && 
          event.key.toLowerCase() === shortcuts.toggle.toLowerCase() && 
          (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onToggle?.();
        return;
      }

      // Escape para fechar
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape?.() || onClose?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggle, onClose, onEscape, shortcuts, enabled]);
};

/**
 * Hook para focus management da sidebar
 */
export const useSidebarFocus = (
  isOpen: boolean,
  config?: {
    autoFocus?: boolean;
    restoreFocus?: boolean;
    trapFocus?: boolean;
  }
) => {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  const autoFocus = config?.autoFocus ?? true;
  const restoreFocus = config?.restoreFocus ?? true;
  const trapFocus = config?.trapFocus ?? true;

  // Auto focus quando abre
  useEffect(() => {
    if (!autoFocus || !isOpen || !sidebarRef.current) return;

    // Salvar elemento ativo anterior
    if (restoreFocus && document.activeElement) {
      previousActiveElementRef.current = document.activeElement;
    }

    // Focar primeiro elemento focável
    const focusableElements = sidebarRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [isOpen, autoFocus, restoreFocus]);

  // Restaurar focus quando fecha
  useEffect(() => {
    if (!restoreFocus || isOpen) return;

    return () => {
      if (previousActiveElementRef.current && 
          typeof (previousActiveElementRef.current as HTMLElement).focus === 'function') {
        (previousActiveElementRef.current as HTMLElement).focus();
      }
    };
  }, [isOpen, restoreFocus]);

  // Trap focus
  useEffect(() => {
    if (!trapFocus || !isOpen || !sidebarRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !sidebarRef.current) return;

      const focusableElements = Array.from(
        sidebarRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, trapFocus]);

  return {
    sidebarRef,
    setFocus: (element: HTMLElement | null) => {
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    }
  };
};

/**
 * Hook para scroll management da sidebar
 */
export const useSidebarScroll = (isOpen: boolean) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Salvar posição do scroll ao fechar
  useEffect(() => {
    if (!isOpen && scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop);
    }
  }, [isOpen]);

  // Restaurar posição do scroll ao abrir
  useEffect(() => {
    if (isOpen && scrollContainerRef.current && scrollPosition > 0) {
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, [isOpen, scrollPosition]);

  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToElement = useCallback((elementId: string) => {
    if (scrollContainerRef.current) {
      const element = scrollContainerRef.current.querySelector(`#${elementId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, []);

  return {
    scrollContainerRef,
    scrollPosition,
    scrollToTop,
    scrollToElement
  };
};
