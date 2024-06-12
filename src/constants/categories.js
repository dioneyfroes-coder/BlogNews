// src/constants/categories.js

export const categories = ["Sem Categoria", "Importante", "Novidade", "Divertido", "Curiosidade"]; // Inicialmente, uma categoria padrão

export const addCategory = (newCategory) => {
  if (!categories.includes(newCategory)) {
    categories.push(newCategory);
  }
};

export const removeCategory = (categoryToRemove) => {
  const index = categories.indexOf(categoryToRemove);
  if (index > -1) {
    categories.splice(index, 1);
  }
};