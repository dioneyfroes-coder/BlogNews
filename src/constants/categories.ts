// src/constants/categories.ts

export const categories: string[] = ["Sem Categoria"]; // Inicialmente, uma categoria padrão

export const addCategory = (newCategory: string): void => {
  if (!categories.includes(newCategory)) {
    categories.push(newCategory);
  }
};

export const removeCategory = (categoryToRemove: string): void => {
  const index = categories.indexOf(categoryToRemove);
  if (index > -1) {
    categories.splice(index, 1);
  }
};