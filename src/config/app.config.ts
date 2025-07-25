// src/config/app.config.ts
/**
 * Configurações gerais da aplicação
 */

import { env } from './env';

export const appConfig = {
  // Informações básicas da aplicação
  name: env.APP_NAME,
  description: 'Um blog construído com Next.js',
  version: env.APP_VERSION,
  
  // URLs e domínios
  baseUrl: env.NEXTAUTH_URL,
  domain: 'localhost',
  
  // Configurações de desenvolvimento
  enableDebugLogs: env.ENABLE_DEBUG_LOGS,
  enableErrorReporting: env.ENABLE_ERROR_REPORTING,
  
  // Configurações de performance
  cacheTtl: env.CACHE_TTL, // 1 hora em segundos
  maxRequestsPerMinute: env.MAX_REQUESTS_PER_MINUTE,
  
  // Configurações de SEO
  seo: {
    keywords: 'aplicação web, blog, tecnologia, programação',
    robots: 'index, follow',
    language: 'pt-br',
  },
  
  // Configurações de UI
  ui: {
    theme: process.env.DEFAULT_THEME || 'dark',
    postsPerPage: parseInt(process.env.POSTS_PER_PAGE || '10'),
    maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE || '5242880'), // 5MB em bytes
  },
  
  // Configurações de segurança
  security: {
    enableCsrf: process.env.ENABLE_CSRF !== 'false',
    enableCors: process.env.ENABLE_CORS === 'true',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  }
} as const;

export default appConfig;
