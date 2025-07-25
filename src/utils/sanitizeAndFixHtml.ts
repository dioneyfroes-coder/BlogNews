/**
 * @deprecated Use SanitizationService.sanitizePostContent() em vez disso
 * 
 * Este arquivo está mantido apenas para compatibilidade retroativa.
 * Migre seu código para usar @/lib/sanitization
 */

import { SanitizationService } from '@/lib/sanitization';

/**
 * @deprecated Use SanitizationService.sanitizePostContent()
 */
const sanitizeAndFixHtml = (html: string): string => {
  console.warn('sanitizeAndFixHtml está deprecated. Use SanitizationService.sanitizePostContent()');
  
  // Delega para o novo serviço
  const result = SanitizationService.sanitizePostContent(html);
  return result.content;
};

export default sanitizeAndFixHtml;
