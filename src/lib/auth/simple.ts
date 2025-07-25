// src/lib/auth/simple.ts
/**
 * Sistema de autenticação simples baseado em localStorage
 * @fileoverview Autenticação temporária sem dependências externas
 */

/**
 * Interface para dados do usuário
 */
export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

/**
 * Chave para armazenamento no localStorage
 */
const AUTH_STORAGE_KEY = 'blog_simple_auth';

/**
 * Usuário padrão para desenvolvimento
 */
const DEFAULT_ADMIN_USER: SimpleUser = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@blog.com',
  isAdmin: true,
  isAuthenticated: true,
};

/**
 * Obtém o usuário atual do localStorage
 */
export const getCurrentUser = (): SimpleUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  
  return null;
};

/**
 * Define o usuário atual no localStorage
 */
export const setCurrentUser = (user: SimpleUser): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
};

/**
 * Remove o usuário atual (logout)
 */
export const clearCurrentUser = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar usuário:', error);
  }
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return user?.isAuthenticated === true;
};

/**
 * Verifica se o usuário é administrador
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin === true && user?.isAuthenticated === true;
};

/**
 * Login simples - para desenvolvimento
 */
export const simpleLogin = (email: string, password: string): SimpleUser | null => {
  // Validação básica para desenvolvimento
  if (email === 'admin@blog.com' && password === 'admin123') {
    const user = { ...DEFAULT_ADMIN_USER };
    setCurrentUser(user);
    return user;
  }
  
  if (email === 'user@blog.com' && password === 'user123') {
    const user: SimpleUser = {
      id: 'user-1',
      name: 'Usuário',
      email: 'user@blog.com',
      isAdmin: false,
      isAuthenticated: true,
    };
    setCurrentUser(user);
    return user;
  }
  
  return null;
};

/**
 * Logout simples
 */
export const simpleLogout = (): void => {
  clearCurrentUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Hook para usar autenticação (simulação de hook)
 */
export const useSimpleAuth = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: simpleLogin,
      logout: simpleLogout,
    };
  }

  const user = getCurrentUser();
  
  return {
    user,
    isAuthenticated: user?.isAuthenticated === true,
    isAdmin: user?.isAdmin === true && user?.isAuthenticated === true,
    login: simpleLogin,
    logout: simpleLogout,
  };
};
