/**
 * @fileoverview Índice principal do sistema de Newsletter
 * @module newsletter
 */

// Componentes
export * from './components';

// Hooks
export * from './hooks';

// Tipos (exportações explícitas para evitar conflitos)
export type {
  SubscriberData,
  SubscriberPreferences,
  NewsletterStats as NewsletterStatsData,
  ValidationConfig,
  NewsletterConfig,
  UseNewsletterReturn,
  UseNewsletterState,
  // Props dos componentes
  NewsletterProps,
  SubscribeFormProps,
  UnsubscribeFormProps,
  NewsletterStatsProps,
  SubscriptionStatusProps
} from './types';

// Utilitários
export * from './utils';

// Export padrão do componente principal
export { Newsletter as default } from './components/Newsletter';
