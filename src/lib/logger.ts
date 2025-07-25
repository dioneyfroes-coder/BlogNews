/**
 * Sistema de Logging - BlogNews
 * 
 * @description
 * Sistema centralizado de logging para toda a aplicação,
 * com diferentes níveis de log e formatação adequada
 * 
 * @version 1.0
 */

interface LogData {
  [key: string]: any;
}

/**
 * Classe de logging centralizada
 */
export class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Log de informação
   */
  info(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  /**
   * Log de aviso
   */
  warn(message: string, data?: LogData): void {
    console.warn(`[WARN] ${message}`, data || '');
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error, data?: LogData): void {
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}`, {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...data
      });
    } else {
      console.error(`[ERROR] ${message}`, error || '', data || '');
    }
  }

  /**
   * Log de debug (apenas desenvolvimento)
   */
  debug(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}

// Instância singleton
export const logger = new Logger();

// Export default
export default logger;
