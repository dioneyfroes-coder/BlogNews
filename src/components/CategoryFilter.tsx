// src/components/CategoryFilter.tsx
"use client";

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import { categories } from '@/constants/categories';

interface CategoryFilterProps {
  searchCategory: string;
  setSearchCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ searchCategory, setSearchCategory }) => {
  const router = useRouter();

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSearchCategory(category);
    router.push(`/search?category=${category}`);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel>Categorias</InputLabel>
      <Select
        value={searchCategory}
        onChange={handleCategoryChange}
        label="Categoria"
      >
        <MenuItem value="">
          <em>Categoria</em>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;
