// src/components/CategoryFilter/CategoryLoading.tsx

import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  Skeleton, 
  Box 
} from '@mui/material';
import type { CategoryFilterStyles } from '@/types/categoryFilter';

interface CategoryLoadingProps {
  /** Configurações de estilo */
  styles: CategoryFilterStyles;
  /** Label para o loading */
  label: string;
}

/**
 * Componente de loading para CategoryFilter
 * Mostra um skeleton durante o carregamento das categorias
 */
export const CategoryLoading: React.FC<CategoryLoadingProps> = ({
  styles,
  label
}) => {
  return (
    <Box sx={{ mt: styles.margin }}>
      <FormControl 
        fullWidth={styles.fullWidth}
        variant={styles.variant}
        disabled
      >
        <InputLabel shrink>{label}</InputLabel>
        <Select
          value=""
          displayEmpty
          label={label}
        >
          {/* Skeleton para simular opções */}
          <Box sx={{ p: 1 }}>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={20} 
              sx={{ mb: 1 }}
            />
            <Skeleton 
              variant="text" 
              width="80%" 
              height={20} 
              sx={{ mb: 1 }}
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={20} 
            />
          </Box>
        </Select>
      </FormControl>
    </Box>
  );
};
