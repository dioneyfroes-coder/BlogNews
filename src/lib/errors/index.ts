// src/lib/errors/index.ts
/**
 * Barrel export para sistema de erros
 * Centraliza todas as exportações relacionadas a tratamento de erros
 */

// Types
export * from './types';

// Handler
export * from './handler';

// Utility functions para uso direto
export {
  BlogNewsError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  DatabaseError,
  RateLimitError,
  BusinessRuleError,
  ErrorCode
} from './types';

export {
  ErrorHandler,
  handleApiError,
  withErrorHandling,
  validateRequired
} from './handler';
