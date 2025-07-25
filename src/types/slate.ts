// src/types/slate.ts
/**
 * Definições de tipos para o editor Slate.js
 * @fileoverview Tipos customizados para elementos e estrutura do editor
 */

import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

/**
 * Tipos de elementos suportados pelo editor
 */
export type ElementType = 
  | 'paragraph'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'block-quote'
  | 'bulleted-list'
  | 'numbered-list'
  | 'list-item'
  | 'image'
  | 'link';

/**
 * Tipos de formatação de texto suportados
 */
export type TextFormat = 
  | 'bold'
  | 'italic'
  | 'underline'
  | 'code';

/**
 * Interface base para elementos do Slate
 */
export interface BaseElement {
  type: ElementType;
  children: Descendant[];
}

/**
 * Elemento de parágrafo
 */
export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
}

/**
 * Elementos de cabeçalho
 */
export interface HeadingElement extends BaseElement {
  type: 'heading-one' | 'heading-two' | 'heading-three';
}

/**
 * Elemento de citação
 */
export interface BlockQuoteElement extends BaseElement {
  type: 'block-quote';
}

/**
 * Elementos de lista
 */
export interface ListElement extends BaseElement {
  type: 'bulleted-list' | 'numbered-list';
}

/**
 * Item de lista
 */
export interface ListItemElement extends BaseElement {
  type: 'list-item';
}

/**
 * Elemento de imagem
 */
export interface ImageElement extends BaseElement {
  type: 'image';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Elemento de link
 */
export interface LinkElement extends BaseElement {
  type: 'link';
  url: string;
}

/**
 * União de todos os tipos de elementos
 */
export type CustomElement = 
  | ParagraphElement
  | HeadingElement
  | BlockQuoteElement
  | ListElement
  | ListItemElement
  | ImageElement
  | LinkElement;

/**
 * Interface para texto formatado
 */
export interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

/**
 * Tipo customizado do editor que combina todas as funcionalidades
 */
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

/**
 * Declaração de módulo para estender os tipos do Slate
 */
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: FormattedText;
  }
}

/**
 * Props para componentes de renderização de elementos
 */
export interface RenderElementProps {
  attributes: any;
  children: any;
  element: CustomElement;
}

/**
 * Props para componentes de renderização de folhas (texto)
 */
export interface RenderLeafProps {
  attributes: any;
  children: any;
  leaf: FormattedText;
}

/**
 * Estado inicial padrão do editor
 */
export const INITIAL_VALUE: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];
