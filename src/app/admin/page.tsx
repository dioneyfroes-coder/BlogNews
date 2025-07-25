"use client";

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
} from '@mui/material';
import {
  PostAdd,
  Edit,
  Category,
  Info,
  Analytics,
  Comment,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NavigationBar from '@/components/NavigationBar';

/**
 * Hub principal do painel administrativo
 * Centraliza todas as funcionalidades de administração
 */
const AdminHub = () => {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();

  // Verifica autenticação e permissões
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const adminModules = [
    {
      title: 'Gerenciar Posts',
      description: 'Criar, editar e excluir posts do blog',
      icon: <PostAdd sx={{ fontSize: 40 }} />,
      href: '/admin/posts',
      color: 'primary' as const,
      actions: ['Criar', 'Editar', 'Excluir']
    },
    {
      title: 'Categorias',
      description: 'Gerenciar categorias dos posts',
      icon: <Category sx={{ fontSize: 40 }} />,
      href: '/admin/categories',
      color: 'secondary' as const,
      actions: ['Criar', 'Editar', 'Organizar']
    },
    {
      title: 'Página Sobre',
      description: 'Editar informações da página About',
      icon: <Info sx={{ fontSize: 40 }} />,
      href: '/admin/about',
      color: 'info' as const,
      actions: ['Editar', 'Imagens', 'Links']
    },
    {
      title: 'Comentários',
      description: 'Moderar comentários dos usuários',
      icon: <Comment sx={{ fontSize: 40 }} />,
      href: '/admin/comments',
      color: 'warning' as const,
      actions: ['Aprovar', 'Rejeitar', 'Responder'],
      disabled: true // Funcionalidade desabilitada
    },
    {
      title: 'Estatísticas',
      description: 'Ver estatísticas e analytics do site',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      href: '/admin/analytics',
      color: 'success' as const,
      actions: ['Posts', 'Visitantes', 'Newsletter'],
      disabled: true // Funcionalidade futura
    }
  ];

  return (
    <>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Painel Administrativo
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bem-vindo, {user?.name || user?.email || 'Admin'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie o conteúdo e configurações do seu blog
          </Typography>
        </Box>

        {/* Grid de Módulos */}
        <Grid container spacing={3}>
          {adminModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: module.disabled ? 0.6 : 1,
                  '&:hover': {
                    transform: module.disabled ? 'none' : 'translateY(-4px)',
                    boxShadow: module.disabled ? 'inherit' : 8,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pb: 2 }}>
                  <Box sx={{ color: `${module.color}.main`, mb: 2 }}>
                    {module.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {module.description}
                  </Typography>
                  
                  {/* Tags de Ações */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {module.actions.map((action, idx) => (
                      <Chip 
                        key={idx}
                        label={action}
                        size="small"
                        color={module.color}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                  <Button
                    variant="contained"
                    color={module.color}
                    disabled={module.disabled}
                    onClick={() => router.push(module.href)}
                    startIcon={<Edit />}
                    sx={{ minWidth: 120 }}
                  >
                    {module.disabled ? 'Em Breve' : 'Acessar'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Ações Rápidas */}
        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ações Rápidas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<PostAdd />}
              onClick={() => router.push('/admin/posts/create')}
            >
              Novo Post
            </Button>
            <Button
              variant="outlined"
              startIcon={<Category />}
              onClick={() => router.push('/admin/categories')}
            >
              Nova Categoria
            </Button>
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={() => router.push('/admin/about')}
            >
              Editar Sobre
            </Button>
          </Box>
        </Box>

        {/* Informações do Sistema */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.200' }}>
          <Typography variant="caption" color="info.main" display="block" gutterBottom>
            <strong>Sistema:</strong> BlogNews v1.7 | Usuário: {user?.name || user?.email || 'Admin'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Algumas funcionalidades estão em desenvolvimento e serão habilitadas em breve.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default AdminHub;
