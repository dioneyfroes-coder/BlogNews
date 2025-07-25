// src/lib/auth.ts
export interface User {
  username: string;
  isAdmin?: boolean;
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const login = (username: string, password: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Simples autenticação para admin
  if (username === 'admin' && password === 'admin123') {
    const user: User = { username: 'admin', isAdmin: true };
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }
  
  return false;
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin === true;
};
