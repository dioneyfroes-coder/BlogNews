// src/components/slate/SlateToolbar.tsx
/**
 * Barra de ferramentas para o editor Slate.js
 * @fileoverview Fornece controles de formatação e estrutura para o editor
 */

import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';
import {
  Box,
  ButtonGroup,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Image,
  Link,
  Undo,
  Redo,
} from '@mui/icons-material';
import { Editor, Element } from 'slate';
import { HistoryEditor } from 'slate-history';
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  insertImage,
  insertLink,
} from '@/lib/slate/utils';
import { ElementType, CustomElement } from '@/types/slate';

/**
 * Componente da barra de ferramentas do editor Slate
 * @returns Elemento React com controles do editor
 */
const SlateToolbar: React.FC = () => {
  const editor = useSlate();

  /**
   * Manipula mudança de tipo de bloco via select
   */
  const handleBlockChange = useCallback((type: ElementType) => {
    toggleBlock(editor, type);
  }, [editor]);

  /**
   * Manipula inserção de imagem
   */
  const handleImageInsert = useCallback(() => {
    const url = window.prompt('Digite a URL da imagem:');
    if (url) {
      insertImage(editor, url);
    }
  }, [editor]);

  /**
   * Manipula inserção de link
   */
  const handleLinkInsert = useCallback(() => {
    const url = window.prompt('Digite a URL do link:');
    if (url) {
      const text = window.prompt('Digite o texto do link:') || url;
      insertLink(editor, url, text);
    }
  }, [editor]);

  /**
   * Obtém o tipo de bloco atual
   */
  const getCurrentBlockType = (): ElementType => {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type !== undefined,
    });
    
    if (match) {
      const [node] = match;
      return (node as CustomElement).type || 'paragraph';
    }
    
    return 'paragraph';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
        flexWrap: 'wrap',
      }}
    >
      {/* Controles de histórico */}
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Desfazer (Ctrl+Z)">
          <span>
            <IconButton
              onClick={() => HistoryEditor.undo(editor)}
              disabled={!(editor as any).history?.undos?.length}
              size="small"
            >
              <Undo />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Refazer (Ctrl+Y)">
          <span>
            <IconButton
              onClick={() => HistoryEditor.redo(editor)}
              disabled={!(editor as any).history?.redos?.length}
              size="small"
            >
              <Redo />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Seletor de tipo de bloco */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={getCurrentBlockType()}
          onChange={(e) => handleBlockChange(e.target.value as ElementType)}
          displayEmpty
        >
          <MenuItem value="paragraph">Parágrafo</MenuItem>
          <MenuItem value="heading-one">Título 1</MenuItem>
          <MenuItem value="heading-two">Título 2</MenuItem>
          <MenuItem value="heading-three">Título 3</MenuItem>
          <MenuItem value="block-quote">Citação</MenuItem>
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem />

      {/* Controles de formatação de texto */}
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Negrito (Ctrl+B)">
          <IconButton
            onClick={() => toggleMark(editor, 'bold')}
            color={isMarkActive(editor, 'bold') ? 'primary' : 'default'}
            size="small"
          >
            <FormatBold />
          </IconButton>
        </Tooltip>
        <Tooltip title="Itálico (Ctrl+I)">
          <IconButton
            onClick={() => toggleMark(editor, 'italic')}
            color={isMarkActive(editor, 'italic') ? 'primary' : 'default'}
            size="small"
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sublinhado (Ctrl+U)">
          <IconButton
            onClick={() => toggleMark(editor, 'underline')}
            color={isMarkActive(editor, 'underline') ? 'primary' : 'default'}
            size="small"
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Código">
          <IconButton
            onClick={() => toggleMark(editor, 'code')}
            color={isMarkActive(editor, 'code') ? 'primary' : 'default'}
            size="small"
          >
            <Code />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Controles de lista */}
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Lista com marcadores">
          <IconButton
            onClick={() => toggleBlock(editor, 'bulleted-list')}
            color={isBlockActive(editor, 'bulleted-list') ? 'primary' : 'default'}
            size="small"
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>
        <Tooltip title="Lista numerada">
          <IconButton
            onClick={() => toggleBlock(editor, 'numbered-list')}
            color={isBlockActive(editor, 'numbered-list') ? 'primary' : 'default'}
            size="small"
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Controles de mídia */}
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Inserir imagem">
          <IconButton onClick={handleImageInsert} size="small">
            <Image />
          </IconButton>
        </Tooltip>
        <Tooltip title="Inserir link">
          <IconButton onClick={handleLinkInsert} size="small">
            <Link />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default SlateToolbar;
