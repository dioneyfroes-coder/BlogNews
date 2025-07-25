/**
 * @fileoverview Barrel exports para componentes de Social Links
 * @module social-links/components
 */

export { SocialLinks } from './SocialLinks';
export { SocialLinkItem } from './SocialLinkItem';
export { SocialLinkForm } from './SocialLinkForm';
export { PlatformSelectorSimple as PlatformSelector } from './PlatformSelectorSimple';
export { SocialStats } from './SocialStats';

// Tipos relacionados aos componentes
export type {
  SocialLinksProps,
  SocialLinkItemProps,
  SocialLinkFormProps,
  PlatformSelectorProps,
  SocialStatsProps
} from '../types';
