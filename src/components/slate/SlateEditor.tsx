// src/components/slate/SlateEditor.tsx
/**
 * Editor principal do Slate.js com funcionalidade completa
 * @fileoverview Editor de texto rico com formatação e controles avançados
 */

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box } from '@mui/material';
import SlateToolbar from './SlateToolbar';
import SlateElement from './SlateElement';
import SlateLeaf from './SlateLeaf';
import { RenderElementProps, RenderLeafProps, CustomEditor } from '@/types/slate';

/**
 * Props do componente SlateEditor
 */
interface SlateEditorProps {
  /** Valor inicial do editor */
  initialValue?: Descendant[];
  /** Callback para mudanças no conteúdo */
  onChange?: (value: Descendant[]) => void;
  /** Placeholder para texto vazio */
  placeholder?: string;
  /** Se deve mostrar a toolbar */
  showToolbar?: boolean;
  /** Altura mínima do editor */
  minHeight?: number;
}

/**
 * Valor inicial padrão do editor
 */
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

/**
 * Componente principal do editor Slate
 * @param props - Props do editor
 * @returns Elemento React do editor
 */
const SlateEditor: React.FC<SlateEditorProps> = ({
  initialValue: propInitialValue = initialValue,
  onChange,
  placeholder = 'Digite aqui...',
  showToolbar = true,
  minHeight = 200,
}) => {
  // Estado interno do editor
  const [value, setValue] = useState<Descendant[]>(propInitialValue);

  // Criação do editor com plugins
  const editor = useMemo(
    () => withHistory(withReact(createEditor())) as CustomEditor,
    []
  );

  /**
   * Manipula mudanças no conteúdo do editor
   */
  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  /**
   * Renderiza elementos do Slate
   */
  const renderElement = useCallback((props: RenderElementProps) => {
    return <SlateElement {...props} />;
  }, []);

  /**
   * Renderiza folhas (texto formatado) do Slate
   */
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <SlateLeaf {...props} />;
  }, []);

  /**
   * Manipula teclas de atalho
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!event.ctrlKey) return;

    switch (event.key) {
      case 'b':
        event.preventDefault();
        editor.addMark('bold', true);
        break;
      case 'i':
        event.preventDefault();
        editor.addMark('italic', true);
        break;
      case 'u':
        event.preventDefault();
        editor.addMark('underline', true);
        break;
      case '`':
        event.preventDefault();
        editor.addMark('code', true);
        break;
    }
  }, [editor]);

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Slate editor={editor} initialValue={value} onValueChange={handleChange}>
        {showToolbar && <SlateToolbar />}
        <Box
          sx={{
            p: 2,
            minHeight,
            '& > div': {
              minHeight: minHeight - 32,
            },
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            style={{
              outline: 'none',
              minHeight: minHeight - 32,
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
};

export default SlateEditor;
