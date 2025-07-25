// src/components/CategoryFilter/CategoryFilter.tsx

"use client";

import React, { useMemo } from 'react';
import type { CategoryFilterProps } from '@/types/categoryFilter';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';
import { CATEGORY_FILTER_DEFAULTS } from '@/lib/utils/categoryUtils';
import { CategorySelect } from './CategorySelect';
import { CategoryError } from './CategoryError';
import { CategoryLoading } from './CategoryLoading';

/**
 * Componente CategoryFilter refatorado
 * 
 * Responsabilidades:
 * - Orquestrar os componentes filhos
 * - Gerenciar estado através do hook
 * - Aplicar configurações padrão
 * 
 * @example
 * ```tsx
 * <CategoryFilter 
 *   searchCategory={category}
 *   setSearchCategory={setCategory}
 *   labels={{ label: "Filtrar por:", placeholder: "Todas" }}
 * />
 * ```
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  searchCategory,
  setSearchCategory,
  labels,
  styleConfig,
  disabled = false
}) => {
  // Proteção SSR - retornar null no servidor
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Configurações mescladas com padrões
  const finalLabels = useMemo(() => ({
    ...CATEGORY_FILTER_DEFAULTS.labels,
    ...labels
  }), [labels]);

  const finalStyles = useMemo(() => ({
    ...CATEGORY_FILTER_DEFAULTS.styles,
    ...styleConfig
  }), [styleConfig]);

  // Hook para gerenciar estado
  const {
    availableCategories,
    isLoading,
    error,
    refreshCategories
  } = useCategoryFilter({
    initialCategory: searchCategory,
    enableNavigation: false, // Deixa navegação para o pai
    onCategoryChange: setSearchCategory
  });

  // Manipula mudança de categoria
  const handleCategoryChange = (category: string) => {
    setSearchCategory(category);
  };

  // Renderização condicional baseada no estado
  if (isLoading) {
    return (
      <CategoryLoading 
        styles={finalStyles}
        label={finalLabels.label}
      />
    );
  }

  if (error) {
    return (
      <CategoryError 
        error={error}
        onRetry={refreshCategories}
        showRetry
      />
    );
  }

  return (
    <CategorySelect
      value={searchCategory}
      onChange={handleCategoryChange}
      categories={availableCategories}
      labels={finalLabels}
      styles={finalStyles}
      disabled={disabled}
      loading={isLoading}
    />
  );
};

export default CategoryFilter;
