// src/hooks/useCategoryFilter.ts

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  UseCategoryFilterReturn, 
  CategoryFilterHookOptions,
  CategoryFilterState 
} from '@/types/categoryFilter';
import { CategoryUtils, CATEGORY_ERROR_MESSAGES } from '@/lib/utils/categoryUtils';

/**
 * Hook personalizado para gerenciar filtros de categoria
 * 
 * @param options - Opções de configuração do hook
 * @returns Estado e funções para controle do filtro de categoria
 * 
 * @example
 * ```tsx
 * const { 
 *   selectedCategory, 
 *   availableCategories, 
 *   handleCategoryChange,
 *   clearSelection 
 * } = useCategoryFilter({
 *   initialCategory: 'tecnologia',
 *   enableNavigation: true
 * });
 * ```
 */
export const useCategoryFilter = (
  options: CategoryFilterHookOptions = {}
): UseCategoryFilterReturn => {
  const {
    initialCategory = '',
    enableNavigation = true,
    redirectUrl = '/search',
    onCategoryChange
  } = options;

  const router = useRouter();

  // Estado interno
  const [state, setState] = useState<CategoryFilterState>({
    selectedCategory: initialCategory,
    availableCategories: [],
    isLoading: false,
    error: null
  });

  /**
   * Carrega as categorias disponíveis
   */
  const loadCategories = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const categories = await CategoryUtils.getAllCategories();
      
      setState(prev => ({
        ...prev,
        availableCategories: categories,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar categorias',
        isLoading: false
      }));
    }
  }, []);

  /**
   * Manipula mudança de categoria
   */
  const handleCategoryChange = useCallback(async (category: string) => {
    // Validação básica
    if (category && !category.trim()) {
      setState(prev => ({
        ...prev,
        error: CATEGORY_ERROR_MESSAGES.INVALID_CATEGORY
      }));
      return;
    }

    // Limpa erro anterior
    setState(prev => ({ ...prev, error: null }));

    // Atualiza categoria selecionada
    setState(prev => ({ ...prev, selectedCategory: category }));

    // Callback personalizado
    onCategoryChange?.(category);

    // Navegação automática
    if (enableNavigation) {
      try {
        const url = CategoryUtils.generateSearchUrl(category, redirectUrl);
        router.push(url);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: CATEGORY_ERROR_MESSAGES.NAVIGATION_ERROR
        }));
      }
    }
  }, [enableNavigation, redirectUrl, onCategoryChange, router]);

  /**
   * Limpa seleção de categoria
   */
  const clearSelection = useCallback(() => {
    handleCategoryChange('');
  }, [handleCategoryChange]);

  /**
   * Recarrega lista de categorias
   */
  const refreshCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  // Carrega categorias na inicialização
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Valida categoria inicial
  useEffect(() => {
    if (initialCategory && !initialCategory.trim()) {
      console.warn(`Categoria inicial inválida: ${initialCategory}`);
      setState(prev => ({ ...prev, selectedCategory: '' }));
    }
  }, [initialCategory]);

  // Memoização do retorno
  const returnValue = useMemo<UseCategoryFilterReturn>(() => ({
    ...state,
    handleCategoryChange,
    clearSelection,
    refreshCategories
  }), [state, handleCategoryChange, clearSelection, refreshCategories]);

  return returnValue;
};

/**
 * Hook simplificado para casos básicos
 * 
 * @param initialCategory - Categoria inicial
 * @returns Funções básicas de controle
 */
export const useCategoryFilterSimple = (initialCategory: string = '') => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const router = useRouter();

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    
    const url = CategoryUtils.generateSearchUrl(category);
    router.push(url);
  }, [router]);

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await CategoryUtils.getAllCategories();
      setAvailableCategories(categories);
    };
    loadCategories();
  }, []);

  return {
    selectedCategory,
    availableCategories,
    handleCategoryChange,
    setSelectedCategory
  };
};
