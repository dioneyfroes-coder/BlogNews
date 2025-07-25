// src/components/CategoryFilter/CategorySelect.tsx

import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import type { CategoryFilterLabels, CategoryFilterStyles } from '@/types/categoryFilter';
import { CategoryUtils } from '@/lib/utils/categoryUtils';

interface CategorySelectProps {
  /** Valor selecionado */
  value: string;
  /** Callback para mudança */
  onChange: (value: string) => void;
  /** Lista de categorias */
  categories: string[];
  /** Labels personalizados */
  labels: CategoryFilterLabels;
  /** Configurações de estilo */
  styles: CategoryFilterStyles;
  /** Estado desabilitado */
  disabled?: boolean;
  /** Estado de loading */
  loading?: boolean;
}

/**
 * Componente de seleção de categoria
 * Responsável apenas pela renderização do select
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  categories,
  labels,
  styles,
  disabled = false,
  loading = false
}) => {
  /**
   * Manipula mudança no select
   */
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      fullWidth={styles.fullWidth}
      variant={styles.variant}
      disabled={disabled || loading}
      sx={{ mt: styles.margin }}
      aria-label={labels.ariaLabel}
    >
      <InputLabel id="category-filter-label">
        {labels.label}
      </InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter-select"
        value={value}
        onChange={handleSelectChange}
        label={labels.label}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <em>{labels.placeholder}</em>;
          }
          return CategoryUtils.formatCategoryDisplay(selected);
        }}
      >
        {/* Opção para "todas as categorias" */}
        <MenuItem value="">
          <em>{labels.placeholder}</em>
        </MenuItem>
        
        {/* Lista de categorias */}
        {categories.map((category) => (
          <MenuItem 
            key={category} 
            value={category}
            title={`Filtrar por ${category}`}
          >
            {CategoryUtils.formatCategoryDisplay(category)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
