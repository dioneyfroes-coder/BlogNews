// src/hooks/useCategories.ts
import { useState, useEffect, useCallback } from 'react';
import { ICategory } from '@/models/Category';

interface CategoriesState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
}

interface CategoryWithCount {
  category: string;
  count: number;
  data: ICategory;
}

export const useCategories = () => {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    loading: false,
    error: null
  });

  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setState({
          categories: data.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(data.error || 'Erro ao carregar categorias');
      }
    } catch (error) {
      setState({
        categories: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }, []);

  const createCategory = useCallback(async (categoryData: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    order?: number;
  }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (data.success) {
        // Recarregar categorias após criar
        await fetchCategories();
        return { success: true, category: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, updateData: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    order?: number;
    isActive?: boolean;
  }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updateData }),
      });

      const data = await response.json();

      if (data.success) {
        // Recarregar categorias após atualizar
        await fetchCategories();
        return { success: true, category: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Recarregar categorias após deletar
        await fetchCategories();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }, [fetchCategories]);

  // Utilitários derivados
  const getCategoryNames = useCallback((): string[] => {
    return state.categories.map(cat => cat.name);
  }, [state.categories]);

  const getCategoriesWithCount = useCallback((): CategoryWithCount[] => {
    return state.categories.map(cat => ({
      category: cat.name,
      count: cat.postCount,
      data: cat
    }));
  }, [state.categories]);

  const getCategoryByName = useCallback((name: string): ICategory | undefined => {
    return state.categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  }, [state.categories]);

  const getCategoryBySlug = useCallback((slug: string): ICategory | undefined => {
    return state.categories.find(cat => cat.slug === slug);
  }, [state.categories]);

  const getDefaultCategory = useCallback((): ICategory | undefined => {
    return state.categories.find(cat => cat.isDefault);
  }, [state.categories]);

  const searchCategories = useCallback((searchTerm: string): ICategory[] => {
    if (!searchTerm.trim()) return state.categories || [];
    
    const term = searchTerm.toLowerCase();
    return (state.categories || []).filter(cat =>
      cat.name.toLowerCase().includes(term) ||
      cat.description?.toLowerCase().includes(term)
    );
  }, [state.categories]);

  // Carregar categorias na inicialização
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    // Estado
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    
    // Ações
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Utilitários
    getCategoryNames,
    getCategoriesWithCount,
    getCategoryByName,
    getCategoryBySlug,
    getDefaultCategory,
    searchCategories,
    
    // Estados derivados
    hasCategories: state.categories.length > 0,
    categoryCount: state.categories.length
  };
};
