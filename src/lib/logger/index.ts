// src/lib/logger/index.ts
/**
 * Sistema de logging estruturado para o BlogNews
 * Centraliza todos os logs com níveis, formatação e persistência
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, { error, metadata });
  }

  /**
   * Log de warning
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, { metadata });
  }

  /**
   * Log de informação
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, { metadata });
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, metadata?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, { metadata });
    }
  }

  /**
   * Log estruturado principal
   */
  private log(
    level: LogLevel, 
    message: string, 
    options: { 
      error?: Error; 
      metadata?: Record<string, any>;
      service?: string;
      userId?: string;
    } = {}
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: options.service,
      userId: options.userId,
      metadata: options.metadata,
      error: options.error
    };

    // Console output (sempre)
    this.outputToConsole(logEntry);

    // Em produção, enviar para serviço de log externo
    if (this.isProduction) {
      this.sendToExternalService(logEntry);
    }
  }

  /**
   * Output formatado para console
   */
  private outputToConsole(entry: LogEntry): void {
    const color = this.getLevelColor(entry.level);
    const prefix = `[${entry.timestamp}] [${entry.level}]`;
    
    let output = `${color}${prefix} ${entry.message}`;
    
    if (entry.service) {
      output += ` [Service: ${entry.service}]`;
    }
    
    if (entry.userId) {
      output += ` [User: ${entry.userId}]`;
    }

    console.log(output + '\x1b[0m'); // Reset color

    // Log metadata se existir
    if (entry.metadata) {
      console.log('Metadata:', entry.metadata);
    }

    // Log error stack se existir
    if (entry.error) {
      console.error('Error Details:', entry.error);
    }
  }

  /**
   * Cores para diferentes níveis de log
   */
  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.INFO:
        return '\x1b[36m'; // Cyan
      case LogLevel.DEBUG:
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m'; // Reset
    }
  }

  /**
   * Envio para serviço externo (implementação futura)
   */
  private sendToExternalService(entry: LogEntry): void {
    // TODO: Implementar envio para serviços como Winston, Sentry, etc.
    // Por enquanto, apenas armazena localmente em desenvolvimento
    if (this.isDevelopment) {
      this.storeLocally(entry);
    }
  }

  /**
   * Armazenamento local dos logs
   */
  private storeLocally(entry: LogEntry): void {
    // TODO: Implementar armazenamento em arquivo ou banco local
    // Para desenvolvimento, apenas console é suficiente
  }

  /**
   * Log específico para API requests
   */
  apiRequest(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    this.info(`API Request: ${method} ${url}`, {
      statusCode,
      duration,
      userId,
      service: 'API'
    });
  }

  /**
   * Log específico para operações de banco
   */
  database(operation: string, collection: string, duration: number, error?: Error): void {
    if (error) {
      this.error(`Database Error: ${operation} on ${collection}`, error, {
        operation,
        collection,
        duration,
        service: 'Database'
      });
    } else {
      this.debug(`Database: ${operation} on ${collection}`, {
        operation,
        collection,
        duration,
        service: 'Database'
      });
    }
  }

  /**
   * Log específico para autenticação
   */
  auth(action: string, userId?: string, success: boolean = true, error?: Error): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    const message = `Auth: ${action} ${success ? 'successful' : 'failed'}`;
    
    this.log(level, message, {
      error,
      userId,
      metadata: { action, success },
      service: 'Auth'
    });
  }
}

// Singleton instance
export const logger = new Logger();

// Utility functions para facilitar o uso
export const logError = (message: string, error?: Error, metadata?: Record<string, any>) => 
  logger.error(message, error, metadata);

export const logWarn = (message: string, metadata?: Record<string, any>) => 
  logger.warn(message, metadata);

export const logInfo = (message: string, metadata?: Record<string, any>) => 
  logger.info(message, metadata);

export const logDebug = (message: string, metadata?: Record<string, any>) => 
  logger.debug(message, metadata);
