// src/config/upload.config.ts
/**
 * Configurações de upload de arquivos e imagens
 */

import { env } from './env';

export const uploadConfig = {
  // Configurações gerais
  enabled: true,
  maxFileSize: 10485760, // 10MB em bytes
  maxFiles: 5,
  
  // Configurações de imagens
  images: {
    enabled: true,
    maxSize: 5242880, // 5MB em bytes
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 85, // 0-100
    
    // Formatos permitidos
    allowedFormats: [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'
    ],
    
    // Configurações de redimensionamento
    resize: {
      enabled: true,
      thumbnails: true,
      sizes: {
        thumbnail: 150,
        small: 300,
        medium: 600,
        large: 1200,
      },
    },
  },
  
  // Configurações de armazenamento
  storage: {
    // Provedor principal (local, s3, cloudinary, imgbb)
    provider: 'imgbb',
    
    // Configurações locais
    local: {
      enabled: false,
      uploadPath: './public/uploads',
      publicPath: '/uploads',
      createDirectories: true,
    },
    
    // Configurações ImgBB
    imgbb: {
      enabled: true,
      apiKey: env.IMGBB_API_KEY,
      baseUrl: 'https://api.imgbb.com/1/upload',
      expiration: undefined, // em segundos (opcional)
    },
    
    // Configurações AWS S3
    s3: {
      enabled: false,
      bucket: undefined,
      region: 'us-east-1',
      accessKeyId: undefined,
      secretAccessKey: undefined,
      endpoint: undefined,
      publicUrl: undefined,
    },
    
    // Configurações Cloudinary
    cloudinary: {
      enabled: false,
      cloudName: undefined,
      apiKey: undefined,
      apiSecret: undefined,
      folder: 'blognews',
    },
  },
  
  // Configurações de segurança
  security: {
    // Validação de tipo de arquivo
    validateMimeType: process.env.VALIDATE_MIME_TYPE !== 'false',
    validateExtension: process.env.VALIDATE_EXTENSION !== 'false',
    
    // Proteção contra malware
    enableAntiVirus: process.env.ENABLE_ANTIVIRUS === 'true',
    
    // Tipos de arquivo bloqueados
    blockedExtensions: process.env.BLOCKED_EXTENSIONS?.split(',') || [
      'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar'
    ],
    
    // MIME types permitidos
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
  },
  
  // Configurações de processamento
  processing: {
    // Processamento assíncrono
    async: process.env.ASYNC_PROCESSING === 'true',
    queueName: process.env.UPLOAD_QUEUE_NAME || 'file-processing',
    
    // Otimização de imagens
    optimize: process.env.OPTIMIZE_IMAGES !== 'false',
    removeExif: process.env.REMOVE_EXIF !== 'false',
    
    // Watermark
    watermark: {
      enabled: process.env.WATERMARK_ENABLED === 'true',
      imagePath: process.env.WATERMARK_IMAGE_PATH,
      position: process.env.WATERMARK_POSITION || 'bottom-right',
      opacity: parseFloat(process.env.WATERMARK_OPACITY || '0.5'),
    },
  },
  
  // Configurações de CDN
  cdn: {
    enabled: process.env.CDN_ENABLED === 'true',
    baseUrl: process.env.CDN_BASE_URL,
    cacheTtl: parseInt(process.env.CDN_CACHE_TTL || '86400'), // 24 horas em segundos
  },
  
  // Configurações de backup
  backup: {
    enabled: process.env.BACKUP_UPLOADS === 'true',
    provider: process.env.BACKUP_PROVIDER || 's3',
    schedule: process.env.BACKUP_SCHEDULE || '0 3 * * *', // Todo dia às 3h (cron)
    retention: parseInt(process.env.BACKUP_RETENTION || '90'), // 90 dias
  },
  
  // Configurações de debug e logs
  debug: {
    enabled: process.env.UPLOAD_DEBUG === 'true' || process.env.NODE_ENV === 'development',
    logUploads: process.env.LOG_UPLOADS !== 'false',
    logErrors: process.env.LOG_UPLOAD_ERRORS !== 'false',
    verbose: process.env.UPLOAD_VERBOSE === 'true',
  },
} as const;

export default uploadConfig;
