// src/constants/categories.js

export const categories = ["Sem Categoria", "Importante", "Novidade", "Divertido", "Curiosidade"]; // Inicialmente, uma categoria padrão

export const addCategory = (newCategory) => {
  if (!categories.includes(newCategory)) {
    categories.push(newCategory);
  }
};
