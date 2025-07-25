// src/lib/errors/types.ts
/**
 * Tipos customizados de erro para o BlogNews
 * Hierarquia estruturada para diferentes tipos de erro
 */

export enum ErrorCode {
  // Validação
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Autenticação e Autorização
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Banco de Dados
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  NOT_FOUND = 'NOT_FOUND',
  
  // API
  API_ERROR = 'API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  
  // Sistema
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  
  // Negócio
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT'
}

/**
 * Interface base para erros estruturados
 */
export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
  timestamp: string;
  requestId?: string;
  userId?: string;
}

/**
 * Classe base para erros customizados
 */
export class BlogNewsError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;
  public readonly requestId?: string;
  public readonly userId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>,
    requestId?: string,
    userId?: string
  ) {
    super(message);
    this.name = 'BlogNewsError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    this.userId = userId;

    // Captura stack trace
    Error.captureStackTrace(this, BlogNewsError);
  }

  /**
   * Converte erro para objeto JSON
   */
  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      requestId: this.requestId,
      userId: this.userId
    };
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends BlogNewsError {
  constructor(message: string, details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details, requestId);
    this.name = 'ValidationError';
  }
}

/**
 * Erro de autorização
 */
export class UnauthorizedError extends BlogNewsError {
  constructor(message: string = 'Acesso não autorizado', details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.UNAUTHORIZED, message, 401, details, requestId);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Erro de permissão
 */
export class ForbiddenError extends BlogNewsError {
  constructor(message: string = 'Acesso proibido', details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.FORBIDDEN, message, 403, details, requestId);
    this.name = 'ForbiddenError';
  }
}

/**
 * Erro de recurso não encontrado
 */
export class NotFoundError extends BlogNewsError {
  constructor(resource: string, id?: string, requestId?: string) {
    const message = id 
      ? `${resource} com ID '${id}' não encontrado` 
      : `${resource} não encontrado`;
    
    super(ErrorCode.RECORD_NOT_FOUND, message, 404, { resource, id }, requestId);
    this.name = 'NotFoundError';
  }
}

/**
 * Erro de banco de dados
 */
export class DatabaseError extends BlogNewsError {
  constructor(message: string, operation?: string, details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.DATABASE_ERROR, message, 500, { operation, ...details }, requestId);
    this.name = 'DatabaseError';
  }
}

/**
 * Erro de rate limiting
 */
export class RateLimitError extends BlogNewsError {
  constructor(limit: number, window: string, requestId?: string) {
    const message = `Rate limit excedido: máximo ${limit} requests por ${window}`;
    super(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429, { limit, window }, requestId);
    this.name = 'RateLimitError';
  }
}

/**
 * Erro de regra de negócio
 */
export class BusinessRuleError extends BlogNewsError {
  constructor(rule: string, message: string, details?: Record<string, any>, requestId?: string) {
    super(ErrorCode.BUSINESS_RULE_VIOLATION, message, 422, { rule, ...details }, requestId);
    this.name = 'BusinessRuleError';
  }
}
