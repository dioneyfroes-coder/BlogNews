// src/components/Navigation/MobileDrawer.tsx
'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const router = useRouter();

  const navigationItems = [
    { label: 'Home', icon: <HomeIcon />, href: '/' },
    { label: 'Buscar', icon: <SearchIcon />, href: '/search' },
    { label: 'Sobre', icon: <InfoIcon />, href: '/about' },
    { label: 'Contato', icon: <ContactIcon />, href: '/contact' },
    { label: 'Admin', icon: <AdminIcon />, href: '/admin' },
    { label: 'Login', icon: <LoginIcon />, href: '/login' },
  ];

  const categories = [
    { id: 'tecnologia', label: 'Tecnologia', color: '#1976d2' },
    { id: 'política', label: 'Política', color: '#d32f2f' },
    { id: 'esportes', label: 'Esportes', color: '#2e7d32' },
    { id: 'entretenimento', label: 'Entretenimento', color: '#f57c00' },
    { id: 'ciência', label: 'Ciência', color: '#7b1fa2' },
    { id: 'saúde', label: 'Saúde', color: '#d84315' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleCategoryNavigation = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #4285f4, #34a853, #fbbc04, #ea4335)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          BlogNews
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Navegação Principal */}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.href)}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Categorias */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1,
            fontWeight: 600,
          }}
        >
          <CategoryIcon fontSize="small" />
          Categorias
        </Typography>
      </Box>

      <List dense>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              onClick={() => handleCategoryNavigation(category.id)}
              sx={{
                pl: 4,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: category.color,
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <ListItemText 
                primary={category.label}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer do Drawer */}
      <Box sx={{ mt: 'auto', p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" align="center">
          BlogNews © 2025
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
