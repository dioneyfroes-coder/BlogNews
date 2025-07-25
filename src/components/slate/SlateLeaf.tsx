// src/components/slate/SlateLeaf.tsx
/**
 * Componente para renderização de folhas (texto formatado) do Slate.js
 * @fileoverview Renderiza formatação de texto como negrito, itálico, etc.
 */

import React from 'react';
import { RenderLeafProps } from '@/types/slate';

/**
 * Componente que renderiza texto formatado do Slate
 * @param props - Props de renderização da folha
 * @returns Elemento React com formatação aplicada
 */
const SlateLeaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  let formattedChildren = children;

  // Aplica formatação de negrito
  if (leaf.bold) {
    formattedChildren = <strong>{formattedChildren}</strong>;
  }

  // Aplica formatação de itálico
  if (leaf.italic) {
    formattedChildren = <em>{formattedChildren}</em>;
  }

  // Aplica formatação de sublinhado
  if (leaf.underline) {
    formattedChildren = <u>{formattedChildren}</u>;
  }

  // Aplica formatação de código
  if (leaf.code) {
    formattedChildren = (
      <code
        style={{
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          padding: '2px 4px',
          borderRadius: '3px',
          fontSize: '0.9em',
        }}
      >
        {formattedChildren}
      </code>
    );
  }

  return <span {...attributes}>{formattedChildren}</span>;
};

export default SlateLeaf;
