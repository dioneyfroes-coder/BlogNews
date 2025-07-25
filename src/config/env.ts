// src/config/env.ts
/**
 * Utilitário para acessar variáveis de ambiente de forma segura
 * Funciona tanto no servidor quanto no cliente
 */

/**
 * Verifica se estamos executando no servidor
 */
export const isServer = typeof window === 'undefined';

/**
 * Obtém uma variável de ambiente de forma segura
 * Se estiver no cliente, retorna undefined para variáveis não públicas
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
  // No servidor, podemos acessar todas as variáveis
  if (isServer) {
    return process.env[key] || defaultValue;
  }
  
  // No cliente, só podemos acessar variáveis que começam com NEXT_PUBLIC_
  if (key.startsWith('NEXT_PUBLIC_')) {
    return process.env[key] || defaultValue;
  }
  
  // Para outras variáveis no cliente, retornar o valor padrão
  return defaultValue;
}

/**
 * Obtém uma variável de ambiente requerida
 * Lança erro apenas no servidor se não encontrar
 */
export function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key);
  
  if (!value && isServer) {
    console.warn(`⚠️ Variável de ambiente obrigatória não encontrada: ${key}`);  
  }
  
  return value;
}

/**
 * Variáveis de ambiente centralizadas e seguras
 */
export const env = {
  // MongoDB
  MONGODB_URI: getEnvVar('MONGODB_URI', ''),
  DB_NAME: getEnvVar('DB_NAME', 'blognews'),
  
  // Auth
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET', ''),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  
  // Email  
  EMAIL_USER: getEnvVar('EMAIL_USER', ''),
  EMAIL_PASS: getEnvVar('EMAIL_PASS', ''),
  ADMIN_EMAIL: getEnvVar('ADMIN_EMAIL', ''),
  
  // Upload
  IMGBB_API_KEY: getEnvVar('IMGBB_API_KEY', ''),
  
  // App
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  APP_NAME: getEnvVar('APP_NAME', 'BlogNews'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
  
  // Features
  ENABLE_DEBUG_LOGS: getEnvVar('ENABLE_DEBUG_LOGS') === 'true' || getEnvVar('NODE_ENV') === 'development',
  ENABLE_ERROR_REPORTING: getEnvVar('ENABLE_ERROR_REPORTING') === 'true',
  
  // Performance
  CACHE_TTL: parseInt(getEnvVar('CACHE_TTL', '3600')),
  MAX_REQUESTS_PER_MINUTE: parseInt(getEnvVar('MAX_REQUESTS_PER_MINUTE', '100')),
  
  // Database settings
  DB_MAX_POOL_SIZE: parseInt(getEnvVar('DB_MAX_POOL_SIZE', '10')),
  DB_MIN_POOL_SIZE: parseInt(getEnvVar('DB_MIN_POOL_SIZE', '1')),
  DB_SERVER_SELECTION_TIMEOUT: parseInt(getEnvVar('DB_SERVER_SELECTION_TIMEOUT', '5000')),
  
  // Computed values
  get isDevelopment() { return this.NODE_ENV === 'development'; },
  get isProduction() { return this.NODE_ENV === 'production'; },
  get isTest() { return this.NODE_ENV === 'test'; },
} as const;
