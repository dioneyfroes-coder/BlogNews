// src/config/database.config.ts
/**
 * Configurações de banco de dados MongoDB
 */

import { env } from './env';

export const databaseConfig = {
  // String de conexão
  uri: env.MONGODB_URI,
  
  // Nome do banco de dados (extraído da URI ou padrão)
  name: env.DB_NAME,
  
  // Configurações de conexão
  connection: {
    maxPoolSize: env.DB_MAX_POOL_SIZE,
    minPoolSize: env.DB_MIN_POOL_SIZE,
    maxIdleTimeMS: 30000, // 30 segundos
    serverSelectionTimeoutMS: env.DB_SERVER_SELECTION_TIMEOUT, // 5 segundos
    socketTimeoutMS: 45000, // 45 segundos
    connectTimeoutMS: 10000, // 10 segundos
    heartbeatFrequencyMS: 10000, // 10 segundos
  },
  
  // Configurações de retry
  retry: {
    retryWrites: true,
    retryReads: true,
    maxRetries: 3,
    retryDelayMS: 1000, // 1 segundo
  },
  
  // Configurações de cache
  cache: {
    enabled: process.env.DB_CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.DB_CACHE_TTL || '300'), // 5 minutos em segundos
    maxSize: parseInt(process.env.DB_CACHE_MAX_SIZE || '100'),
  },
  
  // Configurações de índices
  indexes: {
    autoCreate: process.env.DB_AUTO_CREATE_INDEXES !== 'false',
    background: process.env.DB_BACKGROUND_INDEXES !== 'false',
  },
  
  // Configurações de monitoramento
  monitoring: {
    enabled: process.env.DB_MONITORING_ENABLED === 'true',
    logSlowQueries: process.env.DB_LOG_SLOW_QUERIES === 'true',
    slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000'), // 1 segundo em ms
  },
  
  // Configurações de backup
  backup: {
    enabled: process.env.DB_BACKUP_ENABLED === 'true',
    interval: process.env.DB_BACKUP_INTERVAL || '0 2 * * *', // Todo dia às 2h (cron)
    retention: parseInt(process.env.DB_BACKUP_RETENTION || '30'), // 30 dias
  },
  
  // Configurações específicas por coleção
  collections: {
    posts: {
      name: process.env.POSTS_COLLECTION || 'posts',
      indexes: ['title', 'category', 'author', 'createdAt'],
    },
    users: {
      name: process.env.USERS_COLLECTION || 'users',
      indexes: ['username', 'email', 'role'],
    },
    subscribers: {
      name: process.env.SUBSCRIBERS_COLLECTION || 'subscribers',
      indexes: ['email', 'createdAt'],
    },
    about: {
      name: process.env.ABOUT_COLLECTION || 'about',
      indexes: ['version', 'updatedAt'],
    },
  },
  
  // Configurações de debug
  debug: {
    enabled: process.env.DB_DEBUG === 'true' || process.env.NODE_ENV === 'development',
    logQueries: process.env.DB_LOG_QUERIES === 'true',
    logConnections: process.env.DB_LOG_CONNECTIONS === 'true',
  },
} as const;

export default databaseConfig;
