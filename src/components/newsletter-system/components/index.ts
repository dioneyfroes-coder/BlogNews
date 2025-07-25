/**
 * @fileoverview Barrel export para componentes de Newsletter
 * @module newsletter/components
 */

// Componentes principais
export { Newsletter } from './Newsletter';
export { SubscribeForm } from './SubscribeForm';
export { UnsubscribeForm } from './UnsubscribeForm';
export { NewsletterStats } from './NewsletterStats';

// Re-exportar tipos relacionados aos componentes
export type {
  NewsletterProps,
  SubscribeFormProps,
  UnsubscribeFormProps,
  NewsletterStatsProps
} from '../types';
