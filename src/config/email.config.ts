// src/config/email.config.ts
/**
 * Configurações de email e notificações
 */

import { env } from './env';

export const emailConfig = {
  // Configurações SMTP
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para outros ports
    auth: {
      user: env.EMAIL_USER || '',
      pass: env.EMAIL_PASS || '',
    },
    tls: {
      rejectUnauthorized: true,
    },
  },
  
  // Configurações de remetente
  from: {
    name: process.env.EMAIL_FROM_NAME || 'BlogNews',
    address: process.env.EMAIL_USER || 'noreply@blognews.com',
  },
  
  // Configurações de destinatários
  to: {
    admin: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@blognews.com',
    support: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER || 'support@blognews.com',
    noreply: process.env.NOREPLY_EMAIL || process.env.EMAIL_USER || 'noreply@blognews.com',
  },
  
  // Configurações de templates
  templates: {
    baseUrl: process.env.EMAIL_TEMPLATE_BASE_URL || '/email-templates',
    defaultLanguage: process.env.EMAIL_DEFAULT_LANGUAGE || 'pt-br',
    enableHtml: process.env.EMAIL_ENABLE_HTML !== 'false',
    enableText: process.env.EMAIL_ENABLE_TEXT !== 'false',
  },
  
  // Configurações de queue (fila de emails)
  queue: {
    enabled: process.env.EMAIL_QUEUE_ENABLED === 'true',
    maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || '60000'), // 1 minuto em ms
    batchSize: parseInt(process.env.EMAIL_BATCH_SIZE || '10'),
    processInterval: parseInt(process.env.EMAIL_PROCESS_INTERVAL || '30000'), // 30 segundos em ms
  },
  
  // Configurações de rate limiting
  rateLimit: {
    enabled: process.env.EMAIL_RATE_LIMIT_ENABLED !== 'false',
    maxEmailsPerHour: parseInt(process.env.EMAIL_MAX_PER_HOUR || '100'),
    maxEmailsPerDay: parseInt(process.env.EMAIL_MAX_PER_DAY || '1000'),
  },
  
  // Configurações de notificações
  notifications: {
    // Newsletter
    newsletter: {
      enabled: process.env.NEWSLETTER_ENABLED !== 'false',
      subject: process.env.NEWSLETTER_SUBJECT || 'Nova postagem no BlogNews',
      template: process.env.NEWSLETTER_TEMPLATE || 'newsletter',
    },
    
    // Contato
    contact: {
      enabled: process.env.CONTACT_EMAIL_ENABLED !== 'false',
      subject: process.env.CONTACT_EMAIL_SUBJECT || 'Nova mensagem de contato - BlogNews',
      template: process.env.CONTACT_EMAIL_TEMPLATE || 'contact',
      autoReply: process.env.CONTACT_AUTO_REPLY === 'true',
    },
    
    // Comentários
    comments: {
      enabled: process.env.COMMENT_EMAIL_ENABLED === 'true',
      subject: process.env.COMMENT_EMAIL_SUBJECT || 'Novo comentário no BlogNews',
      template: process.env.COMMENT_EMAIL_TEMPLATE || 'comment',
    },
    
    // Administrativas
    admin: {
      enabled: process.env.ADMIN_EMAIL_ENABLED !== 'false',
      newUser: process.env.ADMIN_NEW_USER_EMAIL === 'true',
      newPost: process.env.ADMIN_NEW_POST_EMAIL === 'true',
      systemErrors: process.env.ADMIN_ERROR_EMAIL === 'true',
    },
  },
  
  // Configurações de attachments
  attachments: {
    enabled: process.env.EMAIL_ATTACHMENTS_ENABLED === 'true',
    maxSize: parseInt(process.env.EMAIL_MAX_ATTACHMENT_SIZE || '10485760'), // 10MB em bytes
    allowedTypes: process.env.EMAIL_ALLOWED_ATTACHMENT_TYPES?.split(',') || [
      'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'
    ],
  },
  
  // Configurações de debug e logs
  debug: {
    enabled: process.env.EMAIL_DEBUG === 'true' || process.env.NODE_ENV === 'development',
    logEmails: process.env.EMAIL_LOG_EMAILS === 'true',
    logErrors: process.env.EMAIL_LOG_ERRORS !== 'false',
    saveToFile: process.env.EMAIL_SAVE_TO_FILE === 'true',
  },
  
  // Configurações de teste
  test: {
    enabled: process.env.EMAIL_TEST_MODE === 'true',
    interceptAddress: process.env.EMAIL_TEST_INTERCEPT_ADDRESS,
    logOnly: process.env.EMAIL_TEST_LOG_ONLY === 'true',
  },
} as const;

export default emailConfig;
