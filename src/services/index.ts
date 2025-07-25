// src/services/index.ts
/**
 * Barrel export para todos os services
 * Centraliza as importações e facilita o uso dos serviços RESTful
 */

// Services principais
export { PostServiceV2 as PostService } from './postService';
export { EmailService } from './emailService';
export { AuthService } from './authService';
export { AboutService } from './aboutService';

// Instâncias singleton para uso direto
export { postServiceV2 as postService } from './postService';
export { emailService } from './emailService';
export { authService } from './authService';
export { aboutService } from './aboutService';

// Re-export para facilitar imports
export * from './postService';
export * from './emailService';
export * from './authService';
export * from './aboutService';

// Tipos e interfaces comuns
export type { ApiResponse, FilterOptions, PaginationOptions } from '@/lib/api/base';
