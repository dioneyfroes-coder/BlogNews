/**
 * @fileoverview Exports principais do sistema de Social Links
 * @module social-links
 */

// Componentes principais
export {
  SocialLinks,
  SocialLinkItem,
  SocialLinkForm,
  PlatformSelector,
  SocialStats
} from './components';

// Hooks
export {
  useSocialLinks,
  useSocialUrlValidation,
  usePlatformDetection,
  useSocialAppearance,
  useSocialDragDrop,
  useSocialPersistence,
  useSocialAnalytics,
  useSocialImportExport,
  useSocialDebounce,
  useSocialLinkForm
} from './hooks';

// Utilitários
export {
  SocialPlatformDetector,
  SocialLinkValidator,
  SocialLinkFormatter,
  SocialIconResolver,
  SocialPlatformRegistry,
  SocialLinksCache
} from './utils';

// Tipos
export type {
  SocialPlatformName,
  SocialPlatformCategory,
  SocialPlatform,
  SocialLinkData,
  SocialLinkConfig,
  SocialLinksVariant,
  SocialIconSize,
  SocialHoverEffect,
  SocialLinksProps,
  SocialLinkItemProps,
  SocialLinkFormProps,
  PlatformSelectorProps,
  SocialStatsProps,
  SocialAppearanceConfig,
  SocialBehaviorConfig,
  SocialAnalyticsConfig,
  SocialLinksConfig,
  PlatformDetectionResult,
  SocialLinksImportExport
} from './types';
