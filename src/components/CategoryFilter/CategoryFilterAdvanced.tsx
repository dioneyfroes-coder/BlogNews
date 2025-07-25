// src/components/CategoryFilter/CategoryFilterAdvanced.tsx

"use client";

import React, { useMemo } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Chip,
  Box,
  Typography
} from '@mui/material';
import type { CategoryFilterProps } from '@/types/categoryFilter';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';
import { useCategories } from '@/hooks/useCategories';
import { CATEGORY_FILTER_DEFAULTS } from '@/lib/utils/categoryUtils';
import { CategoryError } from './CategoryError';
import { CategoryLoading } from './CategoryLoading';

interface CategoryFilterAdvancedProps extends CategoryFilterProps {
  /** Mostrar contador de posts por categoria */
  showPostCount?: boolean;
  /** Permitir múltipla seleção */
  multiSelect?: boolean;
  /** Categorias selecionadas (para multi-select) */
  selectedCategories?: string[];
  /** Callback para multi-select */
  onMultiSelectChange?: (categories: string[]) => void;
}

/**
 * Versão avançada do CategoryFilter
 * 
 * Funcionalidades extras:
 * - Contador de posts por categoria
 * - Seleção múltipla
 * - Visualização com chips
 */
export const CategoryFilterAdvanced: React.FC<CategoryFilterAdvancedProps> = ({
  searchCategory,
  setSearchCategory,
  labels,
  styleConfig,
  disabled = false,
  showPostCount = false,
  multiSelect = false,
  selectedCategories = [],
  onMultiSelectChange
}) => {
  // Configurações mescladas
  const finalLabels = useMemo(() => ({
    ...CATEGORY_FILTER_DEFAULTS.labels,
    ...labels
  }), [labels]);

  const finalStyles = useMemo(() => ({
    ...CATEGORY_FILTER_DEFAULTS.styles,
    ...styleConfig
  }), [styleConfig]);

  // Hook para categorias
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    getCategoriesWithCount
  } = useCategories();

  // Hook para estado
  const {
    availableCategories,
    isLoading,
    error,
    refreshCategories
  } = useCategoryFilter({
    initialCategory: searchCategory,
    enableNavigation: false,
    onCategoryChange: setSearchCategory
  });

  // Categorias com contador
  const categoriesWithCount = useMemo(() => {
    if (!showPostCount) return null;
    return getCategoriesWithCount();
  }, [showPostCount, getCategoriesWithCount]);

  // Manipula seleção simples
  const handleSingleSelect = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSearchCategory(category);
  };

  // Manipula seleção múltipla
  const handleMultiSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const categories = typeof value === 'string' ? value.split(',') : value;
    onMultiSelectChange?.(categories);
  };

  // Remove categoria da seleção múltipla
  const removeCategory = (categoryToRemove: string) => {
    const newCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    onMultiSelectChange?.(newCategories);
  };

  // Estados de loading e erro
  if (isLoading) {
    return <CategoryLoading styles={finalStyles} label={finalLabels.label} />;
  }

  if (error) {
    return <CategoryError error={error} onRetry={refreshCategories} />;
  }

  // Renderização para seleção múltipla
  if (multiSelect) {
    return (
      <Box>
        <FormControl 
          fullWidth={finalStyles.fullWidth}
          variant={finalStyles.variant}
          disabled={disabled}
          sx={{ mt: finalStyles.margin }}
        >
          <InputLabel>{finalLabels.label}</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={handleMultiSelect}
            label={finalLabels.label}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() => removeCategory(value)}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {categories.map((category) => {
              return (
                <MenuItem key={category.slug} value={category.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{category.name}</Typography>
                    {showPostCount && category.postCount > 0 && (
                      <Chip label={category.postCount} size="small" variant="outlined" />
                    )}
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // Renderização para seleção simples com contador
  return (
    <FormControl 
      fullWidth={finalStyles.fullWidth}
      variant={finalStyles.variant}
      disabled={disabled}
      sx={{ mt: finalStyles.margin }}
    >
      <InputLabel>{finalLabels.label}</InputLabel>
      <Select
        value={searchCategory}
        onChange={handleSingleSelect}
        label={finalLabels.label}
        displayEmpty
      >
        <MenuItem value="">
          <em>{finalLabels.placeholder}</em>
        </MenuItem>
        
        {categories.map((category) => {
          return (
            <MenuItem key={category.slug} value={category.name}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>{category.name}</Typography>
                {showPostCount && category.postCount > 0 && (
                  <Chip label={`${category.postCount} posts`} size="small" variant="outlined" />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
