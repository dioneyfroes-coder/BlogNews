// src/components/Editor.tsx
/**
 * Componente Editor usando Slate.js
 * @fileoverview Editor de texto rico moderno para substituir React-Quill
 */

import React from 'react';
import { Descendant } from 'slate';
import SlateEditor from '@/components/slate/SlateEditor';

/**
 * Props do componente Editor
 */
interface EditorProps {
  /** Valor atual do editor em HTML */
  value: string;
  /** Callback para mudanças no conteúdo */
  onChange: (value: string) => void;
  /** Placeholder para quando estiver vazio */
  placeholder?: string;
  /** Altura mínima do editor */
  height?: number;
  /** Se deve mostrar a toolbar */
  toolbar?: boolean;
}

/**
 * Componente Editor usando Slate.js
 * Substitui o React-Quill mantendo compatibilidade da interface
 */
const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  height = 200,
  toolbar = true,
}) => {
  /**
   * Converte HTML para formato Slate inicial
   */
  const getInitialValue = (): Descendant[] => {
    if (!value || value.trim() === '') {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ];
    }

    // Por enquanto, uma conversão simples
    // TODO: Implementar conversão HTML → Slate mais robusta
    return [
      {
        type: 'paragraph',
        children: [{ text: value.replace(/<[^>]*>/g, '') }],
      },
    ];
  };

  /**
   * Manipula mudanças no editor Slate
   */
  const handleChange = (slateValue: Descendant[]) => {
    // Converte Slate para HTML simples
    // TODO: Implementar conversão Slate → HTML mais robusta
    const textContent = slateValue
      .map(node => {
        if ('children' in node) {
          return node.children
            .map((child: any) => child.text || '')
            .join('');
        }
        return '';
      })
      .join('\n');

    onChange(textContent);
  };

  return (
    <SlateEditor
      initialValue={getInitialValue()}
      onChange={handleChange}
      placeholder={placeholder}
      minHeight={height}
      showToolbar={toolbar}
    />
  );
};

export default Editor;
