// src/components/slate/index.ts
/**
 * Barrel export para componentes do editor Slate.js
 * @fileoverview Centraliza exportações dos componentes do editor
 */

export { default as SlateEditor } from './SlateEditor';
export { default as SlateElement } from './SlateElement';
export { default as SlateLeaf } from './SlateLeaf';
export { default as SlateToolbar } from './SlateToolbar';

// Re-exporta tipos e utilitários relacionados
export type { 
  CustomEditor, 
  CustomElement, 
  ElementType, 
  FormattedText,
  RenderElementProps,
  RenderLeafProps,
} from '@/types/slate';

export {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  slateToHtml,
  htmlToSlate,
  insertImage,
  insertLink,
} from '@/lib/slate/utils';
