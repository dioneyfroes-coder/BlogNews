// src/components/CategoryFilter/index.ts

/**
 * Barrel exports para CategoryFilter
 * Facilita importações e mantém API limpa
 */

// Componente principal
export { CategoryFilter as default } from './CategoryFilter';
export { CategoryFilter } from './CategoryFilter';

// Componentes modulares
export { CategorySelect } from './CategorySelect';
export { CategoryError } from './CategoryError';
export { CategoryLoading } from './CategoryLoading';
export { CategoryFilterAdvanced } from './CategoryFilterAdvanced';

// Re-exports de types e utils relacionados
export type { 
  CategoryFilterProps,
  CategoryFilterLabels,
  CategoryFilterStyles,
  UseCategoryFilterReturn,
  CategoryFilterHookOptions
} from '@/types/categoryFilter';

export { 
  CategoryUtils,
  CATEGORY_FILTER_DEFAULTS,
  CATEGORY_ERROR_MESSAGES 
} from '@/lib/utils/categoryUtils';

export { 
  useCategoryFilter,
  useCategoryFilterSimple 
} from '@/hooks/useCategoryFilter';
