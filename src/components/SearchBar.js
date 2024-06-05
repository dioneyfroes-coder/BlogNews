// src/components/SearchBar.js

"use client";

import { useState } from 'react';
import { OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '16px 8px' }}>
      <OutlinedInput
        placeholder="Procurar…"
        inputProps={{ 'aria-label': 'procurar' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ flex: 1 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default SearchBar;
