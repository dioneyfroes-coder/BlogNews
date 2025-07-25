// src/config/validator.ts
/**
 * Utilitário para validação de configurações
 */

import type { 
  ConfigValidationError, 
  ConfigValidationResult, 
  ConfigSection 
} from './types';

class ConfigValidator {
  private errors: ConfigValidationError[] = [];
  private warnings: ConfigValidationError[] = [];

  /**
   * Valida uma seção específica da configuração
   */
  validateSection(section: ConfigSection, config: any): this {
    switch (section) {
      case 'app':
        this.validateAppConfig(config);
        break;
      case 'auth':
        this.validateAuthConfig(config);
        break;
      case 'database':
        this.validateDatabaseConfig(config);
        break;
      case 'email':
        this.validateEmailConfig(config);
        break;
      case 'upload':
        this.validateUploadConfig(config);
        break;
      default:
        this.addError(section, 'unknown', 'Seção de configuração desconhecida');
    }
    return this;
  }

  /**
   * Valida configurações da aplicação
   */
  private validateAppConfig(config: any): void {
    if (!config.name || typeof config.name !== 'string') {
      this.addError('app', 'name', 'Nome da aplicação é obrigatório');
    }

    if (!config.baseUrl || typeof config.baseUrl !== 'string') {
      this.addError('app', 'baseUrl', 'URL base da aplicação é obrigatória');
    }

    if (config.ui?.postsPerPage && (config.ui.postsPerPage < 1 || config.ui.postsPerPage > 100)) {
      this.addWarning('app', 'ui.postsPerPage', 'Posts por página deve estar entre 1 e 100');
    }

    if (config.ui?.maxImageSize && config.ui.maxImageSize > 10485760) { // 10MB
      this.addWarning('app', 'ui.maxImageSize', 'Tamanho máximo de imagem muito alto (>10MB)');
    }
  }

  /**
   * Valida configurações de autenticação
   */
  private validateAuthConfig(config: any): void {
    if (!config.secret) {
      this.addError('auth', 'secret', 'NEXTAUTH_SECRET é obrigatório');
    } else if (config.secret.length < 32) {
      this.addWarning('auth', 'secret', 'NEXTAUTH_SECRET deve ter pelo menos 32 caracteres');
    }

    if (!config.url || typeof config.url !== 'string') {
      this.addError('auth', 'url', 'NEXTAUTH_URL é obrigatória');
    } else if (!this.isValidUrl(config.url)) {
      this.addError('auth', 'url', 'NEXTAUTH_URL deve ser uma URL válida');
    }

    if (config.security?.saltRounds && (config.security.saltRounds < 10 || config.security.saltRounds > 15)) {
      this.addWarning('auth', 'security.saltRounds', 'Salt rounds recomendado entre 10 e 15');
    }

    if (config.session?.maxAge && config.session.maxAge < 3600) {
      this.addWarning('auth', 'session.maxAge', 'Tempo de sessão muito curto (<1 hora)');
    }
  }

  /**
   * Valida configurações do banco de dados
   */
  private validateDatabaseConfig(config: any): void {
    if (!config.uri) {
      this.addError('database', 'uri', 'MONGODB_URI é obrigatória');
    } else if (!this.isValidMongoUri(config.uri)) {
      this.addError('database', 'uri', 'MONGODB_URI deve ser uma URI válida do MongoDB');
    }

    if (!config.name || typeof config.name !== 'string') {
      this.addWarning('database', 'name', 'Nome do banco de dados não especificado');
    }

    if (config.connection?.maxPoolSize && config.connection.maxPoolSize > 50) {
      this.addWarning('database', 'connection.maxPoolSize', 'Pool size muito alto (>50)');
    }

    if (config.connection?.serverSelectionTimeoutMS && config.connection.serverSelectionTimeoutMS < 1000) {
      this.addWarning('database', 'connection.serverSelectionTimeoutMS', 'Timeout de seleção muito baixo (<1s)');
    }
  }

  /**
   * Valida configurações de email
   */
  private validateEmailConfig(config: any): void {
    if (!config.smtp?.auth?.user) {
      this.addError('email', 'smtp.auth.user', 'EMAIL_USER é obrigatório');
    } else if (!this.isValidEmail(config.smtp.auth.user)) {
      this.addError('email', 'smtp.auth.user', 'EMAIL_USER deve ser um email válido');
    }

    if (!config.smtp?.auth?.pass) {
      this.addError('email', 'smtp.auth.pass', 'EMAIL_PASS é obrigatória');
    }

    if (!config.smtp?.host) {
      this.addWarning('email', 'smtp.host', 'Host SMTP não especificado');
    }

    if (config.smtp?.port && (config.smtp.port < 1 || config.smtp.port > 65535)) {
      this.addError('email', 'smtp.port', 'Porta SMTP inválida');
    }

    if (config.rateLimit?.maxEmailsPerHour && config.rateLimit.maxEmailsPerHour > 1000) {
      this.addWarning('email', 'rateLimit.maxEmailsPerHour', 'Limite de emails por hora muito alto');
    }
  }

  /**
   * Valida configurações de upload
   */
  private validateUploadConfig(config: any): void {
    if (config.maxFileSize && config.maxFileSize > 52428800) { // 50MB
      this.addWarning('upload', 'maxFileSize', 'Tamanho máximo de arquivo muito alto (>50MB)');
    }

    if (config.images?.maxWidth && config.images.maxWidth > 4096) {
      this.addWarning('upload', 'images.maxWidth', 'Largura máxima de imagem muito alta (>4096px)');
    }

    if (config.images?.quality && (config.images.quality < 1 || config.images.quality > 100)) {
      this.addError('upload', 'images.quality', 'Qualidade de imagem deve estar entre 1 e 100');
    }

    // Validar configurações específicas do provedor
    if (config.storage?.provider === 'imgbb' && !config.storage.imgbb?.apiKey) {
      this.addError('upload', 'storage.imgbb.apiKey', 'IMGBB_API_KEY é obrigatória quando usando ImgBB');
    }

    if (config.storage?.provider === 's3') {
      if (!config.storage.s3?.bucket) {
        this.addError('upload', 'storage.s3.bucket', 'S3_BUCKET é obrigatório quando usando S3');
      }
      if (!config.storage.s3?.accessKeyId) {
        this.addError('upload', 'storage.s3.accessKeyId', 'S3_ACCESS_KEY_ID é obrigatório quando usando S3');
      }
      if (!config.storage.s3?.secretAccessKey) {
        this.addError('upload', 'storage.s3.secretAccessKey', 'S3_SECRET_ACCESS_KEY é obrigatório quando usando S3');
      }
    }

    if (config.storage?.provider === 'cloudinary') {
      if (!config.storage.cloudinary?.cloudName) {
        this.addError('upload', 'storage.cloudinary.cloudName', 'CLOUDINARY_CLOUD_NAME é obrigatório quando usando Cloudinary');
      }
      if (!config.storage.cloudinary?.apiKey) {
        this.addError('upload', 'storage.cloudinary.apiKey', 'CLOUDINARY_API_KEY é obrigatório quando usando Cloudinary');
      }
      if (!config.storage.cloudinary?.apiSecret) {
        this.addError('upload', 'storage.cloudinary.apiSecret', 'CLOUDINARY_API_SECRET é obrigatório quando usando Cloudinary');
      }
    }
  }

  /**
   * Adiciona um erro de validação
   */
  private addError(section: ConfigSection, field: string, message: string, value?: unknown): void {
    this.errors.push({ section, field, message, value });
  }

  /**
   * Adiciona um aviso de validação
   */
  private addWarning(section: ConfigSection, field: string, message: string, value?: unknown): void {
    this.warnings.push({ section, field, message, value });
  }

  /**
   * Valida se é uma URL válida
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Valida se é um email válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida se é uma URI válida do MongoDB
   */
  private isValidMongoUri(uri: string): boolean {
    return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
  }

  /**
   * Retorna o resultado da validação
   */
  getResult(): ConfigValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
    };
  }

  /**
   * Limpa os resultados da validação
   */
  reset(): this {
    this.errors = [];
    this.warnings = [];
    return this;
  }

  /**
   * Formata os erros para exibição
   */
  formatErrors(): string {
    if (this.errors.length === 0) return '';

    const errorMessages = this.errors.map(error => 
      `❌ [${error.section}.${error.field}] ${error.message}`
    );

    return `Erros de configuração encontrados:\n${errorMessages.join('\n')}`;
  }

  /**
   * Formata os avisos para exibição
   */
  formatWarnings(): string {
    if (this.warnings.length === 0) return '';

    const warningMessages = this.warnings.map(warning => 
      `⚠️  [${warning.section}.${warning.field}] ${warning.message}`
    );

    return `Avisos de configuração:\n${warningMessages.join('\n')}`;
  }
}

/**
 * Cria uma nova instância do validador
 */
export const createValidator = (): ConfigValidator => new ConfigValidator();

/**
 * Função utilitária para validar configurações rapidamente
 */
export const validateConfig = (config: any): ConfigValidationResult => {
  const validator = createValidator();
  
  // Valida todas as seções
  validator
    .validateSection('app', config.app)
    .validateSection('auth', config.auth)
    .validateSection('database', config.database)
    .validateSection('email', config.email)
    .validateSection('upload', config.upload);

  return validator.getResult();
};

export default ConfigValidator;
