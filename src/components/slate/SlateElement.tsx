// src/components/slate/SlateElement.tsx
/**
 * Componente para renderização de elementos do Slate.js
 * @fileoverview Renderiza diferentes tipos de elementos do editor
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { RenderElementProps } from '@/types/slate';

/**
 * Componente que renderiza elementos do Slate baseado no tipo
 * @param props - Props de renderização do elemento
 * @returns Elemento React renderizado
 */
const SlateElement: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
  const style = { margin: 0 };

  switch (element.type) {
    case 'paragraph':
      return (
        <Typography 
          {...attributes} 
          component="p" 
          variant="body1" 
          sx={{ mb: 1, ...style }}
        >
          {children}
        </Typography>
      );
      
    case 'heading-one':
      return (
        <Typography 
          {...attributes} 
          component="h1" 
          variant="h4" 
          sx={{ mb: 2, mt: 2, fontWeight: 'bold', ...style }}
        >
          {children}
        </Typography>
      );
      
    case 'heading-two':
      return (
        <Typography 
          {...attributes} 
          component="h2" 
          variant="h5" 
          sx={{ mb: 1.5, mt: 1.5, fontWeight: 'bold', ...style }}
        >
          {children}
        </Typography>
      );
      
    case 'heading-three':
      return (
        <Typography 
          {...attributes} 
          component="h3" 
          variant="h6" 
          sx={{ mb: 1, mt: 1, fontWeight: 'bold', ...style }}
        >
          {children}
        </Typography>
      );
      
    case 'block-quote':
      return (
        <Box 
          {...attributes}
          component="blockquote"
          sx={{
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            paddingLeft: 2,
            marginLeft: 0,
            marginRight: 0,
            marginY: 2,
            fontStyle: 'italic',
            backgroundColor: 'grey.50',
            padding: 2,
            borderRadius: 1,
            ...style
          }}
        >
          {children}
        </Box>
      );
      
    case 'bulleted-list':
      return (
        <Box 
          {...attributes}
          component="ul"
          sx={{ 
            paddingLeft: 3, 
            marginY: 1,
            ...style 
          }}
        >
          {children}
        </Box>
      );
      
    case 'numbered-list':
      return (
        <Box 
          {...attributes}
          component="ol"
          sx={{ 
            paddingLeft: 3, 
            marginY: 1,
            ...style 
          }}
        >
          {children}
        </Box>
      );
      
    case 'list-item':
      return (
        <Box 
          {...attributes}
          component="li"
          sx={{ 
            marginY: 0.5,
            ...style 
          }}
        >
          {children}
        </Box>
      );
      
    case 'link':
      return (
        <Box
          {...attributes}
          component="a"
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'none',
            },
            ...style
          }}
        >
          {children}
        </Box>
      );
      
    case 'image':
      return (
        <Box {...attributes} sx={{ textAlign: 'center', my: 2 }}>
          <Box
            component="img"
            src={element.url}
            alt={element.alt || ''}
            sx={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
          {children}
        </Box>
      );
      
    default:
      return (
        <Typography {...attributes} component="p" sx={style}>
          {children}
        </Typography>
      );
  }
};

export default SlateElement;
