// src/components/CollapsibleSearch.tsx
"use client";

import React, { useState, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Collapse,
  Paper,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const CollapsibleSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focar no input quando abrir
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      // Limpar busca quando fechar
      setSearchQuery('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Botão de busca */}
      <IconButton
        onClick={handleToggle}
        sx={{
          color: 'inherit',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
        aria-label="Buscar"
      >
        {isOpen ? <CloseIcon /> : <SearchIcon />}
      </IconButton>

      {/* Campo de busca colapsável */}
      <Collapse
        in={isOpen}
        orientation="horizontal"
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1300
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: 250, sm: 300 },
            height: 40,
            px: 1,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[4],
            borderRadius: 2,
            ml: 1
          }}
        >
          <TextField
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar notícias..."
            variant="standard"
            size="small"
            sx={{ 
              flex: 1,
              '& .MuiInput-underline:before': { display: 'none' },
              '& .MuiInput-underline:after': { display: 'none' },
              '& .MuiInputBase-input': {
                py: 1,
                fontSize: '0.9rem'
              }
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <IconButton
            type="submit"
            size="small"
            disabled={!searchQuery.trim()}
            sx={{ 
              ml: 1,
              color: searchQuery.trim() ? 'primary.main' : 'text.disabled'
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSearch;
