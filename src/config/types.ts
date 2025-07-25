// src/config/types.ts
/**
 * Tipos TypeScript para configurações
 */

// Tipos para configurações de aplicação
export interface AppConfig {
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly baseUrl: string;
  readonly domain: string;
  readonly enableDebugLogs: boolean;
  readonly enableErrorReporting: boolean;
  readonly cacheTtl: number;
  readonly maxRequestsPerMinute: number;
  readonly seo: {
    readonly keywords: string;
    readonly robots: string;
    readonly language: string;
  };
  readonly ui: {
    readonly theme: string;
    readonly postsPerPage: number;
    readonly maxImageSize: number;
  };
  readonly security: {
    readonly enableCsrf: boolean;
    readonly enableCors: boolean;
    readonly allowedOrigins: readonly string[];
  };
}

// Tipos para configurações de autenticação
export interface AuthConfig {
  readonly secret: string;
  readonly url: string;
  readonly session: {
    readonly strategy: 'jwt';
    readonly maxAge: number;
    readonly updateAge: number;
  };
  readonly jwt: {
    readonly secret: string;
    readonly maxAge: number;
  };
  readonly pages: {
    readonly signIn: string;
    readonly signOut: string;
    readonly error: string;
    readonly verifyRequest: string;
    readonly newUser: string;
  };
  readonly cookies: {
    readonly sessionToken: {
      readonly name: string;
      readonly options: {
        readonly httpOnly: boolean;
        readonly sameSite: 'lax';
        readonly path: string;
        readonly secure: boolean;
      };
    };
    readonly csrfToken: {
      readonly name: string;
      readonly options: {
        readonly httpOnly: boolean;
        readonly sameSite: 'lax';
        readonly path: string;
        readonly secure: boolean;
      };
    };
  };
  readonly providers: {
    readonly credentials: {
      readonly enabled: boolean;
      readonly maxLoginAttempts: number;
      readonly lockoutDuration: number;
    };
  };
  readonly security: {
    readonly saltRounds: number;
    readonly enableBruteForceProtection: boolean;
    readonly enableIpWhitelist: boolean;
    readonly allowedIps: readonly string[];
  };
  readonly debug: {
    readonly enabled: boolean;
    readonly logLevel: string;
  };
}

// Tipos para configurações de banco de dados
export interface DatabaseConfig {
  readonly uri: string | undefined;
  readonly name: string;
  readonly connection: {
    readonly maxPoolSize: number;
    readonly minPoolSize: number;
    readonly maxIdleTimeMS: number;
    readonly serverSelectionTimeoutMS: number;
    readonly socketTimeoutMS: number;
    readonly connectTimeoutMS: number;
    readonly heartbeatFrequencyMS: number;
  };
  readonly retry: {
    readonly retryWrites: boolean;
    readonly retryReads: boolean;
    readonly maxRetries: number;
    readonly retryDelayMS: number;
  };
  readonly cache: {
    readonly enabled: boolean;
    readonly ttl: number;
    readonly maxSize: number;
  };
  readonly indexes: {
    readonly autoCreate: boolean;
    readonly background: boolean;
  };
  readonly monitoring: {
    readonly enabled: boolean;
    readonly logSlowQueries: boolean;
    readonly slowQueryThreshold: number;
  };
  readonly backup: {
    readonly enabled: boolean;
    readonly interval: string;
    readonly retention: number;
  };
  readonly collections: {
    readonly posts: {
      readonly name: string;
      readonly indexes: readonly string[];
    };
    readonly users: {
      readonly name: string;
      readonly indexes: readonly string[];
    };
    readonly subscribers: {
      readonly name: string;
      readonly indexes: readonly string[];
    };
    readonly about: {
      readonly name: string;
      readonly indexes: readonly string[];
    };
  };
  readonly debug: {
    readonly enabled: boolean;
    readonly logQueries: boolean;
    readonly logConnections: boolean;
  };
}

// Tipos para configurações de email
export interface EmailConfig {
  readonly smtp: {
    readonly host: string;
    readonly port: number;
    readonly secure: boolean;
    readonly auth: {
      readonly user: string;
      readonly pass: string;
    };
    readonly tls: {
      readonly rejectUnauthorized: boolean;
    };
  };
  readonly from: {
    readonly name: string;
    readonly address: string;
  };
  readonly to: {
    readonly admin: string;
    readonly support: string;
    readonly noreply: string;
  };
  readonly templates: {
    readonly baseUrl: string;
    readonly defaultLanguage: string;
    readonly enableHtml: boolean;
    readonly enableText: boolean;
  };
  readonly queue: {
    readonly enabled: boolean;
    readonly maxRetries: number;
    readonly retryDelay: number;
    readonly batchSize: number;
    readonly processInterval: number;
  };
  readonly rateLimit: {
    readonly enabled: boolean;
    readonly maxEmailsPerHour: number;
    readonly maxEmailsPerDay: number;
  };
  readonly notifications: {
    readonly newsletter: {
      readonly enabled: boolean;
      readonly subject: string;
      readonly template: string;
    };
    readonly contact: {
      readonly enabled: boolean;
      readonly subject: string;
      readonly template: string;
      readonly autoReply: boolean;
    };
    readonly comments: {
      readonly enabled: boolean;
      readonly subject: string;
      readonly template: string;
    };
    readonly admin: {
      readonly enabled: boolean;
      readonly newUser: boolean;
      readonly newPost: boolean;
      readonly systemErrors: boolean;
    };
  };
  readonly attachments: {
    readonly enabled: boolean;
    readonly maxSize: number;
    readonly allowedTypes: readonly string[];
  };
  readonly debug: {
    readonly enabled: boolean;
    readonly logEmails: boolean;
    readonly logErrors: boolean;
    readonly saveToFile: boolean;
  };
  readonly test: {
    readonly enabled: boolean;
    readonly interceptAddress: string | undefined;
    readonly logOnly: boolean;
  };
}

// Tipos para configurações de upload
export interface UploadConfig {
  readonly enabled: boolean;
  readonly maxFileSize: number;
  readonly maxFiles: number;
  readonly images: {
    readonly enabled: boolean;
    readonly maxSize: number;
    readonly maxWidth: number;
    readonly maxHeight: number;
    readonly quality: number;
    readonly allowedFormats: readonly string[];
    readonly resize: {
      readonly enabled: boolean;
      readonly thumbnails: boolean;
      readonly sizes: {
        readonly thumbnail: number;
        readonly small: number;
        readonly medium: number;
        readonly large: number;
      };
    };
  };
  readonly storage: {
    readonly provider: string;
    readonly local: {
      readonly enabled: boolean;
      readonly uploadPath: string;
      readonly publicPath: string;
      readonly createDirectories: boolean;
    };
    readonly imgbb: {
      readonly enabled: boolean;
      readonly apiKey: string | undefined;
      readonly baseUrl: string;
      readonly expiration: string | undefined;
    };
    readonly s3: {
      readonly enabled: boolean;
      readonly bucket: string | undefined;
      readonly region: string;
      readonly accessKeyId: string | undefined;
      readonly secretAccessKey: string | undefined;
      readonly endpoint: string | undefined;
      readonly publicUrl: string | undefined;
    };
    readonly cloudinary: {
      readonly enabled: boolean;
      readonly cloudName: string | undefined;
      readonly apiKey: string | undefined;
      readonly apiSecret: string | undefined;
      readonly folder: string;
    };
  };
  readonly security: {
    readonly validateMimeType: boolean;
    readonly validateExtension: boolean;
    readonly enableAntiVirus: boolean;
    readonly blockedExtensions: readonly string[];
    readonly allowedMimeTypes: readonly string[];
  };
  readonly processing: {
    readonly async: boolean;
    readonly queueName: string;
    readonly optimize: boolean;
    readonly removeExif: boolean;
    readonly watermark: {
      readonly enabled: boolean;
      readonly imagePath: string | undefined;
      readonly position: string;
      readonly opacity: number;
    };
  };
  readonly cdn: {
    readonly enabled: boolean;
    readonly baseUrl: string | undefined;
    readonly cacheTtl: number;
  };
  readonly backup: {
    readonly enabled: boolean;
    readonly provider: string;
    readonly schedule: string;
    readonly retention: number;
  };
  readonly debug: {
    readonly enabled: boolean;
    readonly logUploads: boolean;
    readonly logErrors: boolean;
    readonly verbose: boolean;
  };
}

// Tipo principal que agrupa todas as configurações
export interface Config {
  readonly app: AppConfig;
  readonly auth: AuthConfig;
  readonly database: DatabaseConfig;
  readonly email: EmailConfig;
  readonly upload: UploadConfig;
  readonly validate: () => void;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
}

// Tipos utilitários
export type ConfigSection = keyof Omit<Config, 'validate' | 'isDevelopment' | 'isProduction' | 'isTest'>;

export type ConfigEnvironment = 'development' | 'production' | 'test';

// Tipos para validação de configuração
export interface ConfigValidationError {
  readonly section: ConfigSection;
  readonly field: string;
  readonly message: string;
  readonly value?: unknown;
}

export interface ConfigValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ConfigValidationError[];
  readonly warnings: readonly ConfigValidationError[];
}
