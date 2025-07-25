// src/components/Sidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Container,
  Grid,
  Chip
} from '@mui/material';
import { 
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  Bookmark as BookmarkIcon 
} from '@mui/icons-material';
import Link from 'next/link';

interface PostSummary {
  _id: string;
  title: string;
  createdAt: string;
  category?: string;
}

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const quickCategories = [
    { id: 'tecnologia', label: 'Tecnologia', color: '#4285f4', icon: '💻' },
    { id: 'política', label: 'Política', color: '#ea4335', icon: '🏛️' },
    { id: 'esportes', label: 'Esportes', color: '#34a853', icon: '⚽' },
    { id: 'entretenimento', label: 'Entretenimento', color: '#fbbc04', icon: '🎬' },
    { id: 'ciência', label: 'Ciência', color: '#9c27b0', icon: '🔬' },
    { id: 'saúde', label: 'Saúde', color: '#ff5722', icon: '🏥' }
  ];

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Buscar posts recentes
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          if (postsData.success && postsData.data) {
            const recent = postsData.data.slice(0, 5).map((post: any) => ({
              _id: post._id,
              title: post.title,
              createdAt: post.createdAt,
              category: post.category
            }));
            setRecentPosts(recent);
          }
        }

        // Simular categorias trending (podemos implementar lógica real depois)
        setTrendingCategories(['tecnologia', 'política', 'esportes']);
        
      } catch (error) {
        console.error('Erro ao carregar dados da sidebar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  // Sidebar horizontal para mobile (acima do footer)
  if (isMobile) {
    return (
      <Box 
        sx={{ 
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 3,
          mb: 0
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Categorias Rápidas */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
                Acesso Rápido
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {quickCategories.map((category) => (
                  <Chip
                    key={category.id}
                    component={Link}
                    href={`/search?category=${category.id}`}
                    label={`${category.icon} ${category.label}`}
                    variant="outlined"
                    clickable
                    sx={{
                      borderColor: category.color,
                      color: category.color,
                      '&:hover': {
                        bgcolor: category.color + '20',
                        borderColor: category.color,
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Posts Recentes - Horizontal */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                Últimas Notícias
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                  {recentPosts.map((post) => (
                    <Card 
                      key={post._id}
                      component={Link}
                      href={`/posts/${post._id}`}
                      sx={{ 
                        minWidth: 280,
                        textDecoration: 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3,
                            height: '2.6em'
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Sidebar fixa para desktop
  return (
    <Box
      sx={{
        width: 320,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        p: 2
      }}
    >
      {/* Acesso Rápido */}
      <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
            Acesso Rápido
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickCategories.map((category) => (
              <Chip
                key={category.id}
                component={Link}
                href={`/search?category=${category.id}`}
                label={`${category.icon} ${category.label}`}
                size="small"
                variant="outlined"
                clickable
                sx={{
                  borderColor: category.color,
                  color: category.color,
                  '&:hover': {
                    bgcolor: category.color + '20',
                    borderColor: category.color,
                  }
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Posts Recentes */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
            Últimas Notícias
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense disablePadding>
              {recentPosts.map((post, index) => (
                <React.Fragment key={post._id}>
                  <ListItemButton 
                    component={Link}
                    href={`/posts/${post._id}`}
                    sx={{ 
                      px: 0,
                      py: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3
                          }}
                        >
                          {post.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  {index < recentPosts.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </React.Fragment>
              ))}
              {recentPosts.length === 0 && !loading && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  Nenhuma notícia recente encontrada
                </Typography>
              )}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BookmarkIcon sx={{ mr: 1, color: 'primary.main' }} />
            Mantenha-se Atualizado
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Receba as últimas notícias e atualizações diretamente em seu email.
          </Typography>
          <Typography 
            variant="body2" 
            color="primary" 
            component={Link}
            href="/newsletter"
            sx={{ 
              textDecoration: 'none',
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            📧 Inscrever-se na Newsletter
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;