// src/lib/utils/categoryUtils.ts

import Category, { ICategory } from '@/models/Category';

/**
 * Cache para categorias para melhor performance
 */
let categoriesCache: ICategory[] = [];
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Utilitários para manipulação de categorias
 */
export class CategoryUtils {
  /**
   * Obtém categorias do cache ou do banco
   * @returns Array de categorias
   */
  private static async fetchCategories(): Promise<ICategory[]> {
    const now = Date.now();
    
    // Retornar do cache se ainda válido
    if (categoriesCache.length > 0 && now < cacheExpiry) {
      return categoriesCache;
    }

    try {
      // Verificar se estamos no lado do cliente
      if (typeof window === 'undefined') {
        console.warn('CategoryUtils: fetchCategories chamado no servidor, retornando categoria padrão');
        return [{
          _id: 'default',
          name: 'Sem Categoria',
          slug: 'sem-categoria',
          description: 'Categoria padrão',
          color: '#757575',
          icon: 'Help',
          isDefault: true,
          isActive: true,
          order: 999,
          postCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          incrementPostCount: async () => ({} as any),
          decrementPostCount: async () => ({} as any)
        }] as ICategory[];
      }

      // Garantir categoria padrão
      await (Category as any).ensureDefaultCategory();
      
      // Buscar categorias ativas
      const categories = await (Category as any).getActiveCategories();
      
      // Atualizar cache
      categoriesCache = categories;
      cacheExpiry = now + CACHE_DURATION;
      
      return categories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      
      // Retornar cache antigo se houver erro
      if (categoriesCache.length > 0) {
        return categoriesCache;
      }
      
      // Fallback para categoria padrão
      return [{
        _id: 'default',
        name: 'Sem Categoria',
        slug: 'sem-categoria',
        description: 'Categoria padrão',
        color: '#757575',
        icon: 'Help',
        isDefault: true,
        isActive: true,
        order: 999,
        postCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        incrementPostCount: async () => ({} as any),
        decrementPostCount: async () => ({} as any)
      }] as ICategory[];
    }
  }

  /**
   * Obtém todas as categorias disponíveis
   * @returns Array de strings com os nomes das categorias
   */
  static async getAllCategories(): Promise<string[]> {
    try {
      const categories = await this.fetchCategories();
      return categories.map(cat => cat.name);
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      return ['Sem Categoria'];
    }
  }

  /**
   * Obtém todas as categorias como objetos completos
   * @returns Array de objetos categoria
   */
  static async getAllCategoriesData(): Promise<ICategory[]> {
    return await this.fetchCategories();
  }

  /**
   * Limpa o cache de categorias (útil após mudanças)
   */
  static clearCache(): void {
    categoriesCache = [];
    cacheExpiry = 0;
  }

  /**
   * Verifica se uma categoria existe
   * @param category - Nome da categoria
   * @returns true se a categoria existe
   */
  static async categoryExists(category: string): Promise<boolean> {
    try {
      const categories = await this.fetchCategories();
      return categories.some(cat => 
        cat.name.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Erro ao verificar categoria:', error);
      return false;
    }
  }

  /**
   * Normaliza o nome de uma categoria
   * @param category - Nome da categoria
   * @returns Nome normalizado
   */
  static normalizeCategory(category: string): string {
    return category.trim();
  }

  /**
   * Valida se uma categoria é válida
   * @param category - Nome da categoria
   * @returns true se a categoria é válida
   */
  static async isValidCategory(category: string): Promise<boolean> {
    if (!category || typeof category !== 'string') {
      return false;
    }

    const normalized = this.normalizeCategory(category);
    return normalized.length > 0 && await this.categoryExists(normalized);
  }

  /**
   * Obtém categoria por slug
   * @param slug - Slug da categoria
   * @returns Categoria encontrada ou null
   */
  static async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    try {
      const categories = await this.fetchCategories();
      return categories.find(cat => cat.slug === slug) || null;
    } catch (error) {
      console.error('Erro ao buscar categoria por slug:', error);
      return null;
    }
  }

  /**
   * Gera URL de busca com categoria
   * @param category - Categoria selecionada
   * @param baseUrl - URL base (padrão: '/search')
   * @returns URL completa com parâmetro de categoria
   */
  static generateSearchUrl(category: string, baseUrl: string = '/search'): string {
    if (!category) {
      return baseUrl;
    }

    const encodedCategory = encodeURIComponent(category);
    return `${baseUrl}?category=${encodedCategory}`;
  }

  /**
   * Extrai categoria da URL
   * @param url - URL para extrair categoria
   * @returns Categoria extraída ou string vazia
   */
  static extractCategoryFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('category') || '';
    } catch {
      return '';
    }
  }

  /**
   * Formata nome da categoria para exibição
   * @param category - Nome da categoria
   * @returns Nome formatado
   */
  static formatCategoryDisplay(category: string): string {
    if (!category) return '';
    
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Obtém categorias com contador de posts
   * @returns Array de objetos com categoria e contagem
   */
  static async getCategoriesWithCount(): Promise<Array<{ category: string; count: number; data: ICategory }>> {
    try {
      const categories = await this.fetchCategories();
      return categories.map(cat => ({
        category: cat.name,
        count: cat.postCount,
        data: cat
      }));
    } catch (error) {
      console.error('Erro ao obter categorias com contador:', error);
      return [{
        category: 'Sem Categoria',
        count: 0,
        data: {
          name: 'Sem Categoria',
          slug: 'sem-categoria',
          description: 'Categoria padrão',
          color: '#757575',
          icon: 'Help',
          isDefault: true,
          postCount: 0
        } as ICategory
      }];
    }
  }

  /**
   * Filtra categorias por termo de busca
   * @param searchTerm - Termo para filtrar
   * @returns Array de categorias filtradas
   */
  static async filterCategories(searchTerm: string): Promise<string[]> {
    try {
      const allCategories = await this.getAllCategories();
      
      if (!searchTerm) {
        return allCategories;
      }

      const normalizedTerm = searchTerm.toLowerCase();
      return allCategories.filter(category =>
        category && category.toLowerCase().includes(normalizedTerm)
      );
    } catch (error) {
      console.error('Erro ao filtrar categorias:', error);
      return ['Sem Categoria'];
    }
  }

  /**
   * Incrementa contador de posts de uma categoria
   * @param categoryName - Nome da categoria
   */
  static async incrementPostCount(categoryName: string): Promise<void> {
    try {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        await category.incrementPostCount();
        this.clearCache(); // Limpar cache após atualização
      }
    } catch (error) {
      console.error('Erro ao incrementar contador de posts:', error);
    }
  }

  /**
   * Decrementa contador de posts de uma categoria
   * @param categoryName - Nome da categoria
   */
  static async decrementPostCount(categoryName: string): Promise<void> {
    try {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        await category.decrementPostCount();
        this.clearCache(); // Limpar cache após atualização
      }
    } catch (error) {
      console.error('Erro ao decrementar contador de posts:', error);
    }
  }
}

/**
 * Constantes padrão para o CategoryFilter
 */
export const CATEGORY_FILTER_DEFAULTS = {
  labels: {
    label: 'Categorias',
    placeholder: 'Todas as categorias',
    ariaLabel: 'Selecionar categoria para filtrar posts'
  },
  styles: {
    variant: 'outlined' as const,
    margin: 2,
    fullWidth: true
  },
  navigation: {
    baseUrl: '/search',
    enableAutoRedirect: true
  }
} as const;

/**
 * Mensagens de erro para validação
 */
export const CATEGORY_ERROR_MESSAGES = {
  INVALID_CATEGORY: 'Categoria inválida selecionada',
  CATEGORY_NOT_FOUND: 'Categoria não encontrada',
  NAVIGATION_ERROR: 'Erro ao navegar para categoria'
} as const;
