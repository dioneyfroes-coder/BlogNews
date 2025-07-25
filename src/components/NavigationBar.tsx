// src/components/NavigationBar.tsx
"use client";

import React, { useState } from 'react';
import { Drawer, List, ListItem, IconButton, Divider, Box, Typography, TextField, Button } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Login as LoginIcon, Logout as LogoutIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '../lib/auth';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

// Carregar os componentes dinamicamente para evitar problemas de hidratação
const NewsLetter = dynamic(() => import('@/components/NewsLetter'), { ssr: false });
const CategoryFilter = dynamic(() => import('@/components/CategoryFilter'), { ssr: false });
const DateFilter = dynamic(() => import('@/components/DateFilter'), { ssr: false });

const NavigationBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query: Record<string, string> = {};
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

  const handleSignOut = async () => {
    try {
      logout();
      setUser(null);
      toast.success('Logout realizado com sucesso!');
      toggleDrawer();
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleAdminAccess = () => {
    router.push('/admin');
    toggleDrawer();
  };

  const handleLoginAccess = () => {
    router.push('/login');
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
                <DateFilter />
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="h6"></Typography>
              </ListItem>
              <ListItem>
                <NewsLetter />
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="h6">Conta</Typography>
              </ListItem>
              {user ? (
                <>
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      Olá, {user.username || 'Usuário'}!
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AdminIcon />}
                      onClick={handleAdminAccess}
                      sx={{ mb: 1 }}
                    >
                      Painel Admin
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={handleSignOut}
                    >
                      Sair
                    </Button>
                  </ListItem>
                </>
              ) : (
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<LoginIcon />}
                    onClick={handleLoginAccess}
                  >
                    Entrar
                  </Button>
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavigationBar;
