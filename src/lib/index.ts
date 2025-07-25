// src/lib/index.ts
/**
 * Biblioteca principal da aplicação BlogNews
 * Centraliza todos os exports das funcionalidades principais
 */

// API Services
export * from './api/base';

// Logging
export * from './logger';

// Error handling
export * from './errors';

// Constants
export * from './constants';

// Theme system
export * from './theme/materialTheme';

// Custom Hooks
export * from './hooks';

// Utilities
export { default as mongodb } from './mongodb';
export * from './mailer';
export * from './emailQueue';
export * from './rateLimit';
export * from './sanitization';
