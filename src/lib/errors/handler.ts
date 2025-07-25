// src/lib/errors/handler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/logger';
import { BlogNewsError, ErrorCode } from './types';

/**
 * Handler centralizado de erros para APIs
 */
export class ErrorHandler {
  /**
   * Processa e responde erro em API routes
   */
  static async handleApiError(
    error: unknown, 
    res: NextApiResponse
  ): Promise<void> {
    const requestId = this.generateRequestId();
    
    // Log do erro
    logger.error('API Error', error as Error, {
      requestId
    });

    // Processa diferentes tipos de erro
    if (error instanceof BlogNewsError) {
      this.handleCustomError(error, res);
    } else if (error instanceof Error) {
      this.handleGenericError(error, res, requestId);
    } else {
      this.handleUnknownError(error, res, requestId);
    }
  }

  /**
   * Processa erros customizados do BlogNews
   */
  private static handleCustomError(error: BlogNewsError, res: NextApiResponse): void {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
      requestId: error.requestId
    });
  }

  /**
   * Processa erros genéricos do JavaScript
   */
  private static handleGenericError(error: Error, res: NextApiResponse, requestId: string): void {
    // Mapeamento de erros conhecidos
    if (error.message.includes('validation')) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        code: ErrorCode.VALIDATION_ERROR,
        requestId
      });
      return;
    }

    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      res.status(401).json({
        success: false,
        error: 'Acesso não autorizado',
        code: ErrorCode.UNAUTHORIZED,
        requestId
      });
      return;
    }

    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Recurso não encontrado',
        code: ErrorCode.RECORD_NOT_FOUND,
        requestId
      });
      return;
    }

    // Erro interno do servidor
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      requestId,
      ...(process.env.NODE_ENV === 'development' && { 
        details: { originalError: error.message } 
      })
    });
  }

  /**
   * Processa erros desconhecidos
   */
  private static handleUnknownError(error: unknown, res: NextApiResponse, requestId: string): void {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      requestId,
      ...(process.env.NODE_ENV === 'development' && { 
        details: { unknownError: String(error) } 
      })
    });
  }

  /**
   * Wrapper para APIs com tratamento automático de erro
   */
  static withErrorHandling<T = any>(
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<T>,
    context?: string
  ) {
    return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        await handler(req, res);
      } catch (error) {
        await this.handleApiError(error, res);
      }
    };
  }

  /**
   * Valida dados de entrada
   */
  static validateRequired(data: Record<string, any>, fields: string[], requestId?: string): void {
    const missing = fields.filter(field => !data[field] || data[field] === '');
    
    if (missing.length > 0) {
      throw new BlogNewsError(
        ErrorCode.MISSING_REQUIRED_FIELD,
        `Campos obrigatórios ausentes: ${missing.join(', ')}`,
        400,
        { missingFields: missing },
        requestId
      );
    }
  }

  /**
   * Gera ID único para request
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Middleware para captura de erros não tratados
   */
  static globalErrorHandler() {
    // Captura erros não tratados
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', reason as Error, {
        promise: promise.toString(),
        service: 'GlobalErrorHandler'
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error, {
        service: 'GlobalErrorHandler'
      });
      
      // Em produção, fechar gracefully
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
  }
}

/**
 * Utility functions para facilitar uso
 */
export const handleApiError = ErrorHandler.handleApiError.bind(ErrorHandler);
export const withErrorHandling = ErrorHandler.withErrorHandling.bind(ErrorHandler);
export const validateRequired = ErrorHandler.validateRequired.bind(ErrorHandler);
