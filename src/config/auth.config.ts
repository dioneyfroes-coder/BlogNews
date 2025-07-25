// src/config/auth.config.ts
/**
 * Configurações de autenticação e autorização
 */

import { env } from './env';

export const authConfig = {
  // NextAuth configurações
  secret: env.NEXTAUTH_SECRET,
  url: env.NEXTAUTH_URL,
  
  // Configurações de sessão
  session: {
    strategy: 'jwt' as const,
    maxAge: 86400, // 24 horas em segundos
    updateAge: 3600, // 1 hora em segundos
  },
  
  // Configurações JWT
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    maxAge: parseInt(process.env.JWT_MAX_AGE || '86400'), // 24 horas em segundos
  },
  
  // Páginas personalizadas
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error',
    verifyRequest: '/verify-request',
    newUser: '/welcome',
  },
  
  // Configurações de cookies
  cookies: {
    sessionToken: {
      name: process.env.SESSION_COOKIE_NAME || 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.CSRF_COOKIE_NAME || 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  // Configurações de providers
  providers: {
    credentials: {
      enabled: true,
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
      lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900'), // 15 minutos em segundos
    },
  },
  
  // Configurações de segurança
  security: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    enableBruteForceProtection: process.env.ENABLE_BRUTE_FORCE_PROTECTION !== 'false',
    enableIpWhitelist: process.env.ENABLE_IP_WHITELIST === 'true',
    allowedIps: process.env.ALLOWED_IPS?.split(',') || [],
  },
  
  // Configurações de debug
  debug: {
    enabled: process.env.NEXTAUTH_DEBUG === 'true',
    logLevel: process.env.AUTH_LOG_LEVEL || 'info',
  },
} as const;

export default authConfig;
