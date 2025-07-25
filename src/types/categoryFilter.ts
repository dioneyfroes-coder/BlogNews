// src/types/categoryFilter.ts

/**
 * Props para o componente CategoryFilter
 */
export interface CategoryFilterProps {
  /** Categoria selecionada atualmente */
  searchCategory: string;
  /** Função para atualizar a categoria selecionada */
  setSearchCategory: (category: string) => void;
  /** Labels personalizados (opcional) */
  labels?: CategoryFilterLabels;
  /** Configurações de estilo (opcional) */
  styleConfig?: CategoryFilterStyles;
  /** Desabilitar o filtro (opcional) */
  disabled?: boolean;
}

/**
 * Labels personalizáveis do CategoryFilter
 */
export interface CategoryFilterLabels {
  /** Label principal do select */
  label: string;
  /** Placeholder para "sem categoria" */
  placeholder: string;
  /** Label para acessibilidade */
  ariaLabel?: string;
}

/**
 * Configurações de estilo do CategoryFilter
 */
export interface CategoryFilterStyles {
  /** Variante do FormControl */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Margens customizadas */
  margin?: string | number;
  /** Largura customizada */
  fullWidth?: boolean;
}

/**
 * Estado interno do hook useCategoryFilter
 */
export interface CategoryFilterState {
  /** Categoria selecionada */
  selectedCategory: string;
  /** Lista de categorias disponíveis */
  availableCategories: string[];
  /** Estado de loading */
  isLoading: boolean;
  /** Estado de erro */
  error: string | null;
}

/**
 * Retorno do hook useCategoryFilter
 */
export interface UseCategoryFilterReturn extends CategoryFilterState {
  /** Função para alterar categoria */
  handleCategoryChange: (category: string) => void;
  /** Função para limpar seleção */
  clearSelection: () => void;
  /** Função para recarregar categorias */
  refreshCategories: () => void;
}

/**
 * Opções de configuração do hook useCategoryFilter
 */
export interface CategoryFilterHookOptions {
  /** Categoria inicial */
  initialCategory?: string;
  /** Habilitar navegação automática */
  enableNavigation?: boolean;
  /** URL de redirecionamento personalizada */
  redirectUrl?: string;
  /** Callback ao mudar categoria */
  onCategoryChange?: (category: string) => void;
}
