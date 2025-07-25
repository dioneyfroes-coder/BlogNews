// src/lib/api/base.ts
/**
 * Base class para serviços de API RESTful
 * Fornece funcionalidades comuns para todas as APIs
 */

import { logger } from '@/lib/logger';
import { BlogNewsError, ErrorCode } from '@/lib/errors';
import { appConfig } from '@/config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export class BaseApiService {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Define token de autenticação para requisições
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove token de autenticação
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Executa requisição HTTP com tratamento de erros padrão
   */
  protected async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      logger.info('API Request', {
        method: config.method || 'GET',
        url,
        hasBody: !!config.body,
      });

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new BlogNewsError(
          this.mapHttpStatusToErrorCode(response.status),
          data.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      logger.info('API Response Success', {
        method: config.method || 'GET',
        url,
        status: response.status,
        hasData: !!data.data,
      });

      return data;
    } catch (error) {
      logger.error('API Request Failed', error as Error, {
        method: config.method || 'GET',
        url,
      });

      if (error instanceof BlogNewsError) {
        throw error;
      }

      throw new BlogNewsError(
        ErrorCode.API_ERROR,
        error instanceof Error ? error.message : 'Erro de rede desconhecido',
        500
      );
    }
  }

  /**
   * Requisição GET com suporte a paginação e filtros
   */
  protected async get<T = any>(
    endpoint: string,
    options: {
      pagination?: PaginationOptions;
      filters?: FilterOptions;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { pagination, filters, headers } = options;
    
    const params = new URLSearchParams();
    
    // Adicionar parâmetros de paginação
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
    }
    
    // Adicionar filtros
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Requisição POST
   */
  protected async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * Requisição PUT
   */
  protected async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * Requisição PATCH
   */
  protected async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * Requisição DELETE
   */
  protected async delete<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  /**
   * Upload de arquivo
   */
  protected async upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const uploadHeaders = { ...headers };
    // Remove Content-Type para deixar o browser definir o boundary
    delete uploadHeaders['Content-Type'];

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
    });
  }

  /**
   * Mapeia status HTTP para códigos de erro internos
   */
  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.NOT_FOUND;
      case 409:
        return ErrorCode.RESOURCE_CONFLICT;
      case 429:
        return ErrorCode.RATE_LIMIT_EXCEEDED;
      case 500:
        return ErrorCode.INTERNAL_SERVER_ERROR;
      default:
        return ErrorCode.API_ERROR;
    }
  }

  /**
   * Adiciona header de autenticação
   */
  protected addAuthHeader(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove header de autenticação
   */
  protected removeAuthHeader(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Define headers personalizados
   */
  protected setHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Obtém informações de configuração da API
   */
  protected getApiConfig() {
    return {
      baseUrl: this.baseUrl,
      timeout: appConfig.cacheTtl * 1000, // Converter para ms
      retries: 3,
      retryDelay: 1000,
    };
  }
}

export default BaseApiService;
