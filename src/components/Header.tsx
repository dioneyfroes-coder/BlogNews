"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme as useCustomTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import CollapsibleSearch from './CollapsibleSearch';
import MobileDrawer from './Navigation/MobileDrawer';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleMode } = useCustomTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const categories = [
    { id: 'tecnologia', label: 'Tecnologia', color: '#4285f4' },
    { id: 'política', label: 'Política', color: '#ea4335' },
    { id: 'esportes', label: 'Esportes', color: '#34a853' },
    { id: 'entretenimento', label: 'Entretenimento', color: '#fbbc04' },
    { id: 'ciência', label: 'Ciência', color: '#9c27b0' },
    { id: 'saúde', label: 'Saúde', color: '#ff5722' }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    if (categoryId !== selectedCategory) {
      router.push(`/search?category=${categoryId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        borderRadius: 0,
        boxShadow: theme.shadows[1]
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}>
          {/* Menu Button - Mobile */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4285f4, #34a853, #fbbc04, #ea4335)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 3,
                cursor: 'pointer',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              BlogNews
            </Typography>
          </Link>

          {/* Category Chips - Desktop */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mr: 2, 
              flexWrap: 'wrap', 
              flexGrow: 1,
              maxWidth: '600px'
            }}>
              {categories.slice(0, 5).map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  onClick={() => handleCategorySelect(category.id)}
                  size="small"
                  sx={{
                    bgcolor: selectedCategory === category.id ? category.color : 'transparent',
                    color: selectedCategory === category.id ? 'white' : category.color,
                    borderColor: category.color,
                    borderRadius: 4,
                    fontWeight: 'medium',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: category.color + '20',
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {/* Search and Theme Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <CollapsibleSearch />
            
            <IconButton 
              onClick={toggleMode}
              sx={{ 
                ml: 1,
                bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.700',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
              size="small"
            >
              {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Category Chips */}
        {isMobile && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  size="small"
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  onClick={() => handleCategorySelect(category.id)}
                  sx={{
                    bgcolor: selectedCategory === category.id ? category.color : 'transparent',
                    color: selectedCategory === category.id ? 'white' : category.color,
                    borderColor: category.color,
                    borderRadius: 4,
                    fontWeight: 'medium',
                    '&:hover': {
                      bgcolor: category.color + '20',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Mobile Drawer */}
      <MobileDrawer 
        open={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)} 
      />
    </AppBar>
  );
};

export default Header;
