/**
 * @fileoverview Tipos para sistema de Newsletter
 * @module newsletter/types
 */

import type { SxProps, Theme, PaperProps } from '@mui/material';

/**
 * Interface para dados do assinante
 */
export interface SubscriberData {
  /** Email do assinante */
  email: string;
  /** Nome do assinante (opcional) */
  name?: string;
  /** Data de inscrição */
  subscribedAt?: Date;
  /** Data de desinscrição */
  unsubscribedAt?: Date;
  /** Status ativo da inscrição */
  isActive?: boolean;
  /** Preferências de email */
  preferences?: SubscriberPreferences;
}

/**
 * Interface para preferências de assinatura
 */
export interface SubscriberPreferences {
  /** Receber notificações por email */
  emailNotifications: boolean;
  /** Receber resumo semanal */
  weeklyDigest: boolean;
  /** Frequência de emails (diário, semanal, mensal) */
  frequency: 'daily' | 'weekly' | 'monthly';
  /** Categorias de interesse */
  categories: string[];
  /** Aceita emails promocionais */
  acceptsPromotional?: boolean;
  /** Formato preferido (HTML ou texto) */
  format?: 'html' | 'text';
}

/**
 * Interface para estatísticas da newsletter
 */
export interface NewsletterStats {
  /** Total de assinantes ativos */
  totalSubscribers: number;
  /** Assinantes desta semana */
  weeklySubscribers: number;
  /** Assinantes deste mês */
  monthlySubscribers: number;
  /** Taxa de cancelamento */
  unsubscribeRate: number;
  /** Taxa de crescimento */
  growthRate: number;
}

/**
 * Interface para props do componente de inscrição
 */
export interface NewsletterSubscribeProps {
  /** Título do componente */
  title?: string;
  /** Descrição/subtítulo */
  description?: string;
  /** Placeholder do campo email */
  emailPlaceholder?: string;
  /** Texto do botão de inscrição */
  subscribeButtonText?: string;
  /** Se deve mostrar campo nome */
  showNameField?: boolean;
  /** Se deve mostrar opções de preferências */
  showPreferences?: boolean;
  /** Layout do componente */
  layout?: 'horizontal' | 'vertical' | 'compact';
  /** Callback quando inscrição é realizada */
  onSubscribe?: (subscriberData: SubscriberData) => void;
  /** Callback quando erro ocorre */
  onError?: (error: string) => void;
  /** Classe CSS customizada */
  className?: string;
}

/**
 * Interface para props do componente de desinscrição
 */
export interface NewsletterUnsubscribeProps {
  /** Email pré-preenchido */
  initialEmail?: string;
  /** Título do componente */
  title?: string;
  /** Texto do botão de desinscrição */
  unsubscribeButtonText?: string;
  /** Se deve mostrar motivo da desinscrição */
  showReasonField?: boolean;
  /** Callback quando desinscrição é realizada */
  onUnsubscribe?: (email: string, reason?: string) => void;
  /** Callback quando erro ocorre */
  onError?: (error: string) => void;
  /** Classe CSS customizada */
  className?: string;
}

/**
 * Interface para props do componente principal
 */
export interface NewsletterProps {
  /** Modo do componente */
  mode?: 'subscribe' | 'unsubscribe' | 'both';
  /** Configurações de inscrição */
  subscribeConfig?: Partial<NewsletterSubscribeProps>;
  /** Configurações de desinscrição */
  unsubscribeConfig?: Partial<NewsletterUnsubscribeProps>;
  /** Layout geral */
  layout?: 'tabs' | 'stacked' | 'side-by-side';
  /** Tema visual */
  theme?: 'light' | 'dark' | 'brand';
  /** Se deve mostrar estatísticas */
  showStats?: boolean;
  /** Classe CSS customizada */
  className?: string;
}

/**
 * Interface para estado do hook de newsletter
 */
export interface UseNewsletterState {
  /** Status da operação */
  status: 'idle' | 'loading' | 'success' | 'error';
  /** Mensagem de feedback */
  message: string;
  /** Detalhes do erro */
  error: string | null;
  /** Dados do último assinante */
  lastSubscriber: SubscriberData | null;
  /** Estatísticas (se disponíveis) */
  stats: NewsletterStats | null;
}

/**
 * Interface para retorno do hook de newsletter
 */
export interface UseNewsletterReturn extends UseNewsletterState {
  /** Função para inscrever assinante */
  subscribe: (subscriberData: Omit<SubscriberData, 'subscribedAt' | 'isActive'>) => Promise<void>;
  /** Função para desinscrever assinante */
  unsubscribe: (email: string, reason?: string) => Promise<void>;
  /** Função para verificar se email está inscrito */
  checkSubscription: (email: string) => Promise<boolean>;
  /** Função para carregar estatísticas */
  loadStats: () => Promise<void>;
  /** Função para limpar mensagens */
  clearMessage: () => void;
  /** Função para resetar estado */
  reset: () => void;
}

/**
 * Interface para validação de email
 */
export interface EmailValidation {
  /** Se o email é válido */
  isValid: boolean;
  /** Mensagem de erro (se inválido) */
  error?: string;
  /** Sugestões de correção */
  suggestions?: string[];
}

/**
 * Interface para dados do formulário de inscrição
 */
export interface SubscriptionFormData {
  /** Email do assinante */
  email: string;
  /** Nome do assinante */
  name: string;
  /** Aceita termos de uso */
  acceptsTerms: boolean;
  /** Preferências selecionadas */
  preferences: Partial<SubscriberPreferences>;
}

/**
 * Interface para dados do formulário de desinscrição
 */
export interface UnsubscriptionFormData {
  /** Email para desinscrever */
  email: string;
  /** Motivo da desinscrição */
  reason: string;
  /** Feedback adicional */
  feedback?: string;
}

/**
 * Tipo para status de inscrição
 */
export type SubscriptionStatus = 'active' | 'inactive' | 'pending' | 'unsubscribed';

/**
 * Tipo para tipos de ação
 */
export type NewsletterAction = 'subscribe' | 'unsubscribe' | 'update_preferences' | 'check_status';

/**
 * Interface para evento de newsletter
 */
export interface NewsletterEvent {
  /** Tipo da ação */
  action: NewsletterAction;
  /** Email do assinante */
  email: string;
  /** Dados adicionais */
  data?: Record<string, any>;
  /** Timestamp do evento */
  timestamp: Date;
  /** IP do usuário */
  userIP?: string;
  /** User agent */
  userAgent?: string;
}

/**
 * Interface para configuração de validação
 */
export interface ValidationConfig {
  /** Domínios de email bloqueados */
  blockedDomains?: string[];
  /** Domínios de email permitidos */
  allowedDomains?: string[];
  /** Regex customizado para validação */
  customPattern?: RegExp;
  /** Se deve verificar se email existe */
  checkEmailExists?: boolean;
}

/**
 * Interface para configuração de mensagens
 */
export interface MessagesConfig {
  /** Mensagens de sucesso */
  success: {
    subscribe: string;
    unsubscribe: string;
    updatePreferences: string;
  };
  /** Mensagens de erro */
  error: {
    invalidEmail: string;
    alreadySubscribed: string;
    notSubscribed: string;
    networkError: string;
    generic: string;
  };
  /** Mensagens de loading */
  loading: {
    subscribe: string;
    unsubscribe: string;
    checking: string;
  };
}

/**
 * Interface para configuração geral da newsletter
 */
export interface NewsletterConfig {
  /** Configurações de validação */
  validation: ValidationConfig;
  /** Configurações de mensagens */
  messages: MessagesConfig;
  /** Configurações de cache */
  cache: {
    /** TTL padrão em milissegundos */
    defaultTTL: number;
    /** Se deve usar cache */
    enabled: boolean;
  };
  /** Configurações de analytics */
  analytics: {
    /** Se deve fazer tracking */
    enabled: boolean;
    /** Provider de analytics */
    provider?: 'google' | 'custom';
  };
}

// ===========================
// PROPS DOS COMPONENTES
// ===========================

/**
 * Props para o componente SubscribeForm
 */
export interface SubscribeFormProps extends Omit<PaperProps, 'onSuccess' | 'onError' | 'variant'> {
  /** Variante do layout do formulário */
  variant?: 'default' | 'compact' | 'inline';
  /** Se deve mostrar opções de preferências */
  showPreferences?: boolean;
  /** Se o nome é opcional */
  allowNameOptional?: boolean;
  /** Lista de categorias disponíveis */
  categories?: string[];
  /** Callback para sucesso na inscrição */
  onSuccess?: (subscriberData: Omit<SubscriberData, 'subscribedAt' | 'isActive'>) => void;
  /** Callback para erro na inscrição */
  onError?: (error: string) => void;
  /** Configuração de validação customizada */
  customValidation?: ValidationConfig;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Props para o componente UnsubscribeForm
 */
export interface UnsubscribeFormProps extends Omit<PaperProps, 'onSuccess' | 'onError' | 'variant'> {
  /** Email inicial (se conhecido) */
  initialEmail?: string;
  /** Se deve mostrar formulário de motivo */
  showReasonForm?: boolean;
  /** Se deve mostrar dialog de confirmação */
  showConfirmDialog?: boolean;
  /** Se permite campo de feedback */
  allowFeedback?: boolean;
  /** Callback para sucesso na desinscrição */
  onSuccess?: (email: string, reason?: string) => void;
  /** Callback para erro na desinscrição */
  onError?: (error: string) => void;
  /** Callback para cancelar */
  onCancel?: () => void;
  /** Configuração de validação customizada */
  customValidation?: ValidationConfig;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Props para o componente Newsletter principal
 */
export interface NewsletterProps {
  /** Modo de exibição */
  mode?: 'subscribe' | 'unsubscribe' | 'both';
  /** Variante do layout */
  variant?: 'default' | 'compact' | 'inline';
  /** Se deve mostrar estatísticas */
  showStats?: boolean;
  /** Se deve carregar dados automaticamente */
  autoLoad?: boolean;
  /** Configurações personalizadas */
  config?: Partial<NewsletterConfig>;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
  /** Classe CSS customizada */
  className?: string;
}

/**
 * Props para componentes de estatísticas
 */
export interface NewsletterStatsProps {
  /** Dados das estatísticas */
  stats?: NewsletterStats;
  /** Se deve carregar automaticamente */
  autoLoad?: boolean;
  /** Variante de exibição */
  variant?: 'card' | 'inline' | 'minimal';
  /** Se deve mostrar gráficos */
  showCharts?: boolean;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}

/**
 * Props para componente de status de inscrição
 */
export interface SubscriptionStatusProps {
  /** Email para verificar */
  email?: string;
  /** Se deve verificar automaticamente */
  autoCheck?: boolean;
  /** Callback para mudança de status */
  onStatusChange?: (isSubscribed: boolean) => void;
  /** Estilos customizados */
  sx?: SxProps<Theme>;
}
