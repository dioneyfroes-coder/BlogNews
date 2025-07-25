// src/services/authService.ts
import { BaseApiService, FilterOptions } from '@/lib/api/base';
import { logger } from '@/lib/logger';

/**
 * Interface para dados do usuário
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  permissions: string[];
  lastLogin?: string;
}

/**
 * Enum para roles de usuário
 */
export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  SUBSCRIBER = 'subscriber'
}

/**
 * Interface para dados de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Interface para dados de registro
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

/**
 * Interface para resposta de autenticação
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Interface para verificação de permissões
 */
export interface PermissionCheck {
  [permission: string]: boolean;
}

/**
 * Serviço de autenticação e autorização
 * Gerencia usuários, login, logout, permissões e sessões
 */
export class AuthService extends BaseApiService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    super('/api/auth');
  }

  /**
   * Singleton pattern para garantir uma única instância
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      logger.info('Tentativa de login', { email: credentials.email });
      
      const response = await this.post<AuthResponse>('/login', credentials);
      
      if (response.success && response.data) {
        this.currentUser = response.data.user;
        this.token = response.data.token;
        this.setAuthToken(response.data.token);
        
        // Salvar no localStorage se "lembrar-me" estiver marcado
        if (credentials.rememberMe) {
          this.saveTokenToStorage(response.data.token, response.data.refreshToken);
        }
        
        logger.info('Login realizado com sucesso', { 
          userId: response.data.user._id,
          role: response.data.user.role 
        });
        
        return response.data;
      }
      
      throw new Error(response.error || 'Falha no login');
    } catch (error) {
      logger.error('Erro no login', error as Error);
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      logger.info('Tentativa de registro', { email: userData.email });
      
      const response = await this.post<AuthResponse>('/register', userData);
      
      if (response.success && response.data) {
        logger.info('Registro realizado com sucesso', { 
          userId: response.data.user._id 
        });
        return response.data;
      }
      
      throw new Error(response.error || 'Falha no registro');
    } catch (error) {
      logger.error('Erro no registro', error as Error);
      throw error;
    }
  }

  /**
   * Logout do usuário
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.post('/logout', { token: this.token });
      }
      
      this.currentUser = null;
      this.token = null;
      this.clearTokenFromStorage();
      
      logger.info('Logout realizado com sucesso');
    } catch (error) {
      logger.error('Erro no logout', error as Error);
      // Mesmo com erro, limpar dados locais
      this.currentUser = null;
      this.token = null;
      this.clearTokenFromStorage();
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  /**
   * Obtém usuário atual
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Verifica se usuário tem permissões específicas
   */
  async hasPermissions(permissions: string[]): Promise<PermissionCheck> {
    try {
      if (!this.isAuthenticated()) {
        return permissions.reduce((acc, permission) => {
          acc[permission] = false;
          return acc;
        }, {} as PermissionCheck);
      }

      const response = await this.post<PermissionCheck>('/check-permissions', {
        permissions
      });

      return response.data || {};
    } catch (error) {
      logger.error('Erro ao verificar permissões', error as Error);
      return permissions.reduce((acc, permission) => {
        acc[permission] = false;
        return acc;
      }, {} as PermissionCheck);
    }
  }

  /**
   * Verifica se usuário tem role específica
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Verifica se usuário é admin
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Verifica se usuário é autor
   */
  isAuthor(): boolean {
    return this.hasRole(UserRole.AUTHOR) || this.isAdmin();
  }

  /**
   * Verifica se usuário é moderador
   */
  isModerator(): boolean {
    return this.hasRole(UserRole.MODERATOR) || this.isAdmin();
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      if (!this.currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const response = await this.put<User>(`/profile/${this.currentUser._id}`, userData);
      
      if (response.success && response.data) {
        this.currentUser = response.data;
        logger.info('Perfil atualizado com sucesso');
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao atualizar perfil');
    } catch (error) {
      logger.error('Erro ao atualizar perfil', error as Error);
      throw error;
    }
  }

  /**
   * Lista todos os usuários (apenas admins)
   */
  async getAllUsers(page = 1, limit = 20, filters?: FilterOptions): Promise<{
    users: User[];
    pagination: {
      current: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      if (!this.isAdmin()) {
        throw new Error('Acesso negado - apenas administradores');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await this.get<{
        users: User[];
        pagination: any;
      }>(`/users?${queryParams}`);

      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao carregar usuários');
    } catch (error) {
      logger.error('Erro ao carregar usuários', error as Error);
      throw error;
    }
  }

  /**
   * Atualiza role de um usuário
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    try {
      if (!this.isAdmin()) {
        throw new Error('Acesso negado - apenas administradores');
      }

      const response = await this.put<User>(`/users/${userId}/role`, { role });
      
      if (response.success && response.data) {
        logger.info('Role atualizada com sucesso', { userId, role });
        return response.data;
      }
      
      throw new Error(response.error || 'Falha ao atualizar role');
    } catch (error) {
      logger.error('Erro ao atualizar role', error as Error);
      throw error;
    }
  }

  /**
   * Salva tokens no localStorage
   */
  private saveTokenToStorage(token: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Remove tokens do localStorage
   */
  private clearTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * Obtém refresh token do localStorage
   */
  private getRefreshTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * Inicializa serviço verificando tokens salvos
   */
  async initialize(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          this.token = token;
          this.setAuthToken(token);
          
          // Verificar se token é válido
          const isValid = await this.validateToken();
          if (!isValid) {
            // Tentar renovar token
            await this.refreshToken();
          }
        }
      }
    } catch (error) {
      logger.error('Erro ao inicializar AuthService', error as Error);
      this.clearTokenFromStorage();
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshTokenFromStorage();
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await this.post<{ token: string; refreshToken: string }>('/refresh', {
        refreshToken
      });

      if (response.success && response.data) {
        this.token = response.data.token;
        this.setAuthToken(response.data.token);
        this.saveTokenToStorage(response.data.token, response.data.refreshToken);
        
        return response.data.token;
      }
      
      throw new Error(response.error || 'Falha ao renovar token');
    } catch (error) {
      logger.error('Erro ao renovar token', error as Error);
      this.logout(); // Logout se não conseguir renovar
      throw error;
    }
  }

  /**
   * Verifica se token está válido
   */
  async validateToken(): Promise<boolean> {
    try {
      if (!this.token) return false;

      const response = await this.get('/validate');
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Export da instância singleton
export const authService = AuthService.getInstance();
