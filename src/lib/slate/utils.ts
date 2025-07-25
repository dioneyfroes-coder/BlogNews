// src/lib/slate/utils.ts
/**
 * Utilitários para o editor Slate.js
 * @fileoverview Funções auxiliares para manipulação do editor Slate
 */

import { Editor, Element as SlateElement, Transforms, Text } from 'slate';
import { CustomEditor, ElementType, TextFormat, CustomElement } from '@/types/slate';

/**
 * Verifica se um bloco é do tipo especificado
 * @param editor - Instância do editor
 * @param format - Tipo do elemento a verificar
 * @returns True se o bloco atual é do tipo especificado
 */
export const isBlockActive = (editor: CustomEditor, format: ElementType): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  );

  return !!match;
};

/**
 * Verifica se uma marca de texto está ativa
 * @param editor - Instância do editor
 * @param format - Formato de texto a verificar
 * @returns True se o formato está ativo na seleção atual
 */
export const isMarkActive = (editor: CustomEditor, format: TextFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

/**
 * Alterna um formato de bloco
 * @param editor - Instância do editor
 * @param format - Tipo do elemento a alternar
 */
export const toggleBlock = (editor: CustomEditor, format: ElementType): void => {
  const isActive = isBlockActive(editor, format);
  const isList = ['numbered-list', 'bulleted-list'].includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['numbered-list', 'bulleted-list'].includes(n.type) &&
      !['heading-one', 'heading-two', 'heading-three'].includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (['numbered-list', 'bulleted-list'].includes(format)) {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<CustomElement>;
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : format,
    } as Partial<CustomElement>;
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement;
    Transforms.wrapNodes(editor, block);
  }
};

/**
 * Alterna uma marca de texto
 * @param editor - Instância do editor
 * @param format - Formato de texto a alternar
 */
export const toggleMark = (editor: CustomEditor, format: TextFormat): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

/**
 * Converte o conteúdo do Slate para HTML
 * @param nodes - Nós do Slate a serem convertidos
 * @returns String HTML
 */
export const slateToHtml = (nodes: any[]): string => {
  return nodes.map(node => serializeToHtml(node)).join('');
};

/**
 * Serializa um nó do Slate para HTML
 * @param node - Nó a ser serializado
 * @returns String HTML do nó
 */
const serializeToHtml = (node: any): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    
    return string;
  }

  const children = node.children.map((n: any) => serializeToHtml(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    case 'image':
      return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt || '')}" />`;
    default:
      return children;
  }
};

/**
 * Converte HTML para formato Slate
 * @param html - String HTML a ser convertida
 * @returns Array de nós Slate
 */
export const htmlToSlate = (html: string): any[] => {
  // Implementação básica - pode ser expandida conforme necessário
  if (!html || html.trim() === '') {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  // Por agora, retorna um parágrafo simples com o HTML como texto
  // Em uma implementação completa, seria necessário um parser HTML -> Slate
  return [
    {
      type: 'paragraph',
      children: [{ text: html.replace(/<[^>]*>/g, '') }] // Remove tags HTML básicas
    }
  ];
};

/**
 * Escapa caracteres HTML especiais
 * @param text - Texto a ser escapado
 * @returns Texto escapado
 */
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (m: string) => map[m]);
};

/**
 * Insere uma imagem no editor
 * @param editor - Instância do editor
 * @param url - URL da imagem
 * @param alt - Texto alternativo da imagem
 */
export const insertImage = (editor: CustomEditor, url: string, alt?: string): void => {
  const image: CustomElement = {
    type: 'image',
    url,
    alt,
    children: [{ text: '' }],
  };
  
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  } as CustomElement);
};

/**
 * Insere um link no editor
 * @param editor - Instância do editor
 * @param url - URL do link
 * @param text - Texto do link (opcional)
 */
export const insertLink = (editor: CustomEditor, url: string, text?: string): void => {
  if (editor.selection) {
    const link: CustomElement = {
      type: 'link',
      url,
      children: [{ text: text || url }],
    };
    
    if (Editor.string(editor, editor.selection)) {
      Transforms.wrapNodes(editor, link, { split: true });
    } else {
      Transforms.insertNodes(editor, link);
    }
  }
};

/**
 * Remove link da seleção atual
 * @param editor - Instância do editor
 */
export const removeLink = (editor: CustomEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};
