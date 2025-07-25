// src/hooks/useAuth.ts
/**
 * Hook para gerenciar autenticação simples
 * @fileoverview Hook personalizado para sistema de auth simples
 */

import { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  isAuthenticated, 
  isAdmin,
  simpleLogout,
  type SimpleUser 
} from '@/lib/auth/simple';

/**
 * Interface para retorno do hook
 */
interface UseAuthReturn {
  user: SimpleUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

/**
 * Hook para gerenciar estado de autenticação
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Atualiza o estado de autenticação
   */
  const refreshAuth = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };

  /**
   * Função de logout
   */
  const logout = () => {
    simpleLogout();
    setUser(null);
  };

  /**
   * Efeito para carregar dados iniciais
   */
  useEffect(() => {
    refreshAuth();

    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blog_simple_auth') {
        refreshAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isLoading,
    logout,
    refreshAuth,
  };
};
