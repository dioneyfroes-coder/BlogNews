// src/components/CategoryManager.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { categories, addCategory, removeCategory } from '../constants/categories';

const CategoryManager: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const [categoryList, setCategoryList] = useState([...categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categoryList.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setCategoryList([...categoryList, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    removeCategory(category);
    setCategoryList(categoryList.filter(cat => cat !== category));
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Gerenciar Categorias</Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          label="Nova Categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ ml: 2 }}>
          Adicionar
        </Button>
      </Box>
      <List>
        {categoryList.map((category, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCategory(category)}>
              <Delete />
            </IconButton>
          }>
            {category}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryManager;
