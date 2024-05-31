"use client";

import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material'; // Removido SearchIcon
import SearchBar from './SearchBar';

const NavigationBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', top: '64px', left: 0, zIndex: 1300 }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        PaperProps={{ sx: { width: 250, top: '64px', height: 'calc(100% - 64px)', zIndex: 1200 } }}
      >
        <List>
          <ListItem sx={{ padding: '16px 8px' }}>
            <SearchBar />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Categorias" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Histórico" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default NavigationBar;
