// src/config/index.ts
/**
 * Configurações centralizadas da aplicação
 * Gerencia todas as variáveis de ambiente e configurações do sistema
 */

// Importar configurações específicas
import { authConfig } from './auth.config';
import { databaseConfig } from './database.config';
import { emailConfig } from './email.config';
import { appConfig } from './app.config';
import { uploadConfig } from './upload.config';
import { validateConfig as validateConfigAdvanced } from './validator';
import { env, isServer } from './env';
import type { Config } from './types';

// Validar configurações na inicialização - apenas no servidor
const validateConfig = () => {
  // Só validar se estivermos no servidor (Node.js environment)
  if (!isServer) {
    // Estamos no cliente, pular validação
    return;
  }

  const missingVars: string[] = [];

  // Verificar variáveis obrigatórias
  if (!env.MONGODB_URI) missingVars.push('MONGODB_URI');
  if (!env.NEXTAUTH_SECRET) missingVars.push('NEXTAUTH_SECRET');
  if (!env.EMAIL_USER) missingVars.push('EMAIL_USER');
  if (!env.EMAIL_PASS) missingVars.push('EMAIL_PASS');

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Configuração inválida! Variáveis de ambiente faltando: ${missingVars.join(', ')}\n` +
      `📋 Verifique seu arquivo .env.local`
    );
  }

  // Validação avançada usando o validador
  const configToValidate = { app: appConfig, auth: authConfig, database: databaseConfig, email: emailConfig, upload: uploadConfig };
  const validationResult = validateConfigAdvanced(configToValidate);

  if (!validationResult.isValid) {
    const errors = validationResult.errors.map(error => 
      `❌ [${error.section}.${error.field}] ${error.message}`
    ).join('\n');
    
    throw new Error(
      `❌ Configuração inválida!\n${errors}\n` +
      `📋 Verifique seu arquivo .env.local`
    );
  }

  // Exibir avisos se houver
  if (validationResult.warnings.length > 0) {
    const warnings = validationResult.warnings.map(warning => 
      `⚠️  [${warning.section}.${warning.field}] ${warning.message}`
    ).join('\n');
    
    console.warn(`⚠️  Avisos de configuração:\n${warnings}`);
  }

  console.log('✅ Todas as configurações validadas com sucesso');
};

// Exportar configurações consolidadas
export const config: Config = {
  app: appConfig,
  auth: authConfig,
  database: databaseConfig,
  email: emailConfig,
  upload: uploadConfig,
  
  // Função utilitária para validação
  validate: validateConfig,
  
  // Informações do ambiente
  isDevelopment: env.isDevelopment,
  isProduction: env.isProduction,
  isTest: env.isTest,
};

// Validar configurações apenas no servidor e em produção
if (isServer && env.isProduction) {
  validateConfig();
}

export default config;

// Re-exportar configurações específicas para facilitar importações
export { authConfig, databaseConfig, emailConfig, appConfig, uploadConfig };
