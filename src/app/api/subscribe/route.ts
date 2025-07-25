/**
 * API Handler para gerenciamento de assinantes da newsletter
 * 
 * @description
 * Este endpoint gerencia inscrições e desinscrições na newsletter:
 * - POST: Inscreve um novo email na newsletter
 * - DELETE: Remove email da newsletter
 * 
 * @methods
 * - POST /api/subscribe - Inscreve email na newsletter
 * - DELETE /api/subscribe - Remove email da newsletter
 * 
 * @example
 * ```javascript
 * // Inscrever na newsletter
 * const response = await fetch('/api/subscribe', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * 
 * // Desinscrever da newsletter
 * const response = await fetch('/api/subscribe', {
 *   method: 'DELETE',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * ```
 * 
 * @features
 * - Rate limiting para prevenir spam
 * - Validação robusta de email
 * - Prevenção de duplicatas
 * - Envio automático de emails de boas-vindas/despedida
 * - Logging detalhado de operações
 * - Tratamento de erro abrangente
 * 
 * @author BlogNews Team
 * @version 2.0
 */

import mongoose from 'mongoose';
import { sendWelcomeEmail, sendGoodbyeEmail } from '@/lib/mailer';
// import rateLimiter from '@/lib/rateLimit'; // Comentado para App Router
import { logger } from '@/lib/logger';
import { BlogNewsError, ErrorCode } from '@/lib/errors';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting simples para App Router
const rateLimitMap = new Map();

const rateLimit = async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    throw new Error('rate limit');
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
};

// Schema do assinante com validações aprimoradas
const subscriberSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Formato de email inválido'
    }
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    categories: [{
      type: String
    }]
  },
  source: {
    type: String,
    default: 'website'
  },
  metadata: {
    userAgent: String,
    ip: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Índices para performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ subscribedAt: -1 });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

/**
 * Conecta ao banco de dados MongoDB
 */
const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error as Error);
    throw new BlogNewsError(
      ErrorCode.DATABASE_CONNECTION_ERROR,
      'Falha na conexão com banco de dados'
    );
  }
};

/**
 * Validação avançada de email
 * @param {string} email - Email para validar
 * @returns {object} Resultado da validação
 */
const validateEmail = (email: string) => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email é obrigatório');
    return { isValid: false, errors };
  }
  
  if (typeof email !== 'string') {
    errors.push('Email deve ser uma string');
    return { isValid: false, errors };
  }
  
  const emailTrimmed = email.trim().toLowerCase();
  
  if (emailTrimmed.length === 0) {
    errors.push('Email não pode estar vazio');
  }
  
  if (emailTrimmed.length > 254) {
    errors.push('Email muito longo (máximo 254 caracteres)');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed)) {
    errors.push('Formato de email inválido');
  }
  
  // Validações adicionais
  const domainBlacklist = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const domain = emailTrimmed.split('@')[1];
  if (domain && domainBlacklist.includes(domain)) {
    errors.push('Domínio de email não permitido');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    normalizedEmail: emailTrimmed
  };
};

/**
 * Coleta metadados da requisição para análise
 * @param {NextRequest} request - Request object
 * @returns {object} Metadados coletados
 */
const collectMetadata = (request: NextRequest) => {
  return {
    userAgent: request.headers.get('user-agent') || '',
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    referrer: request.headers.get('referer') || '',
    timestamp: new Date().toISOString()
  };
};

/**
 * Handler principal da API - POST
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // Log da requisição
    logger.info('API Request: POST /api/subscribe', {
      method: 'POST',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      body: { email: body?.email ? '***' : undefined }
    });

    // Rate limiting
    await rateLimit(request);
    await connectDb();
    
    const { email, preferences } = body;
    
    // Valida email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new BlogNewsError(
        ErrorCode.VALIDATION_ERROR,
        'Email inválido',
        400,
        { errors: emailValidation.errors }
      );
    }
    
    const normalizedEmail = emailValidation.normalizedEmail!;
    const metadata = collectMetadata(request);

    await handleSubscribe(request, normalizedEmail, preferences, metadata);
    
    // Log de sucesso
    const duration = Date.now() - startTime;
    logger.info('API Success: POST /api/subscribe', {
      method: 'POST',
      email: normalizedEmail,
      duration,
      statusCode: 200
    });
    
  } catch (error: any) {
    return handleError(error, 'POST', startTime);
  }
}

/**
 * Handler principal da API - DELETE
 */
export async function DELETE(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // Log da requisição
    logger.info('API Request: DELETE /api/subscribe', {
      method: 'DELETE',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      body: { email: body?.email ? '***' : undefined }
    });

    // Rate limiting
    await rateLimit(request);
    await connectDb();
    
    const { email } = body;
    
    // Valida email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new BlogNewsError(
        ErrorCode.VALIDATION_ERROR,
        'Email inválido',
        400,
        { errors: emailValidation.errors }
      );
    }
    
    const normalizedEmail = emailValidation.normalizedEmail!;
    const metadata = collectMetadata(request);

    await handleUnsubscribe(request, normalizedEmail, metadata);
    
    // Log de sucesso
    const duration = Date.now() - startTime;
    logger.info('API Success: DELETE /api/subscribe', {
      method: 'DELETE',
      email: normalizedEmail,
      duration,
      statusCode: 200
    });
    
  } catch (error: any) {
    return handleError(error, 'DELETE', startTime);
  }
}

/**
 * Função auxiliar para tratamento de erros
 */
function handleError(error: any, method: string, startTime: number) {
  const duration = Date.now() - startTime;
  logger.error(`API Error: ${method} /api/subscribe`, error);
  
  // Trata diferentes tipos de erro
  if (error instanceof BlogNewsError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    }, { status: error.statusCode });
  }
  
  // Erro de rate limiting
  if (error.message?.includes('rate limit')) {
    return NextResponse.json({
      success: false,
      error: 'Muitas tentativas. Tente novamente em alguns minutos.',
      code: ErrorCode.RATE_LIMIT_EXCEEDED
    }, { status: 429 });
  }
  
  // Erro de validação do Mongoose
  if (error.name === 'ValidationError') {
    return NextResponse.json({
      success: false,
      error: 'Dados inválidos',
      code: ErrorCode.VALIDATION_ERROR,
      details: Object.values(error.errors).map((e: any) => e.message)
    }, { status: 400 });
  }
  
  // Erro de duplicata do MongoDB
  if (error.code === 11000) {
    return NextResponse.json({
      success: false,
      error: 'Este email já está inscrito na newsletter',
      code: ErrorCode.RESOURCE_CONFLICT
    }, { status: 409 });
  }
  
  // Erro genérico
  return NextResponse.json({
    success: false,
    error: 'Erro interno do servidor',
    code: ErrorCode.INTERNAL_SERVER_ERROR
  }, { status: 500 });
}

/**
 * Processa inscrição na newsletter
 */
const handleSubscribe = async (
  request: NextRequest, 
  email: string, 
  preferences: any,
  metadata: any
) => {
  try {
    // Verifica se já existe
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        logger.info('Subscriber already exists and is active', { email });
        return NextResponse.json({
          success: true,
          message: 'Este email já está inscrito na nossa newsletter',
          data: {
            email,
            subscribedAt: existingSubscriber.subscribedAt,
            alreadySubscribed: true
          }
        });
      } else {
        // Reativa assinante inativo
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        if (preferences) {
          existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
        }
        await existingSubscriber.save();
        
        logger.info('Subscriber reactivated', { email });
        
        // Envia email de boas-vindas
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          logger.error('Failed to send welcome email', emailError as Error);
          // Não falha a operação se o email não for enviado
        }
        
        return NextResponse.json({
          success: true,
          message: 'Inscrição reativada com sucesso!',
          data: {
            email,
            subscribedAt: existingSubscriber.subscribedAt,
            reactivated: true
          }
        });
      }
    }
    
    // Cria novo assinante
    const newSubscriber = new Subscriber({
      email,
      preferences: preferences || {},
      metadata,
      source: 'website'
    });
    
    await newSubscriber.save();
    
    logger.info('New subscriber created', { 
      email,
      subscribedAt: newSubscriber.subscribedAt,
      preferences: newSubscriber.preferences
    });
    
    // Envia email de boas-vindas
    try {
      await sendWelcomeEmail(email);
      logger.info('Welcome email sent successfully', { email });
    } catch (emailError) {
      logger.error('Failed to send welcome email', emailError as Error);
      // Não falha a operação se o email não for enviado
    }
    
    return NextResponse.json({
      success: true,
      message: 'Inscrição realizada com sucesso! Verifique seu email.',
      data: {
        email,
        subscribedAt: newSubscriber.subscribedAt,
        preferences: newSubscriber.preferences
      }
    }, { status: 201 });
    
  } catch (error) {
    throw error;
  }
};

/**
 * Processa cancelamento de inscrição
 */
const handleUnsubscribe = async (
  request: NextRequest,
  email: string,
  metadata: any
) => {
  try {
    const subscriber = await Subscriber.findOne({ email, isActive: true });
    
    if (!subscriber) {
      logger.info('Subscriber not found for unsubscribe', { email });
      return NextResponse.json({
        success: false,
        error: 'Email não encontrado na lista de assinantes',
        code: ErrorCode.NOT_FOUND
      }, { status: 404 });
    }
    
    // Marca como inativo ao invés de deletar (para estatísticas)
    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    subscriber.metadata = { ...subscriber.metadata, ...metadata };
    await subscriber.save();
    
    logger.info('Subscriber unsubscribed', { 
      email,
      unsubscribedAt: subscriber.unsubscribedAt
    });
    
    // Envia email de despedida
    try {
      await sendGoodbyeEmail(email);
      logger.info('Goodbye email sent successfully', { email });
    } catch (emailError) {
      logger.error('Failed to send goodbye email', emailError as Error);
      // Não falha a operação se o email não for enviado
    }
    
    return NextResponse.json({
      success: true,
      message: 'Desinscrição realizada com sucesso',
      data: {
        email,
        unsubscribedAt: subscriber.unsubscribedAt
      }
    });
    
  } catch (error) {
    throw error;
  }
};
