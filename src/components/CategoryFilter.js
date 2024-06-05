// src/components/CategoryFilter.js
"use client";

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { categories } from '@/constants/categories';

const CategoryFilter = ({ searchCategory, setSearchCategory }) => {
  const router = useRouter();

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSearchCategory(category);
    router.push(`/search?category=${category}`);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel>Categoria</InputLabel>
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
