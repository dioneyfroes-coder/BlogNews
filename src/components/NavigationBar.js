// src/components/NavigationBar.js
"use client";

import React, { useState } from 'react';
import { Drawer, List, ListItem, IconButton, Divider, Box, Typography, TextField } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Carregar os componentes dinamicamente para evitar problemas de hidratação
const NewsLetter = dynamic(() => import('@/components/NewsLetter'), { ssr: false });
const CategoryFilter = dynamic(() => import('@/components/CategoryFilter'), { ssr: false });
const HistoryNavigation = dynamic(() => import('@/components/HistoryNavigation'), { ssr: false });

const NavigationBar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const router = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = {};
    if (searchQuery.trim()) {
      query.q = searchQuery;
    }
    if (searchCategory) {
      query.category = searchCategory;
    }
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
    toggleDrawer();
  };

  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', left: 0, top: 64 }}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer} anchor="left">
        <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <List>
              <ListItem>
                <Typography variant="h6">Pesquisar no Blog</Typography>
              </ListItem>
              <ListItem>
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton type="submit">
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </form>
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="h6">Filtrar Posts</Typography>
              </ListItem>
              <ListItem>
                <CategoryFilter searchCategory={searchCategory} setSearchCategory={setSearchCategory} />
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="h6">Histórico</Typography>
              </ListItem>
              <ListItem>
                <HistoryNavigation />
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="h6"></Typography>
              </ListItem>
              <ListItem>
                <NewsLetter />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationBar;
