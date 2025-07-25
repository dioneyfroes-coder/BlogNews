"use client";

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NavigationBar from '@/components/NavigationBar';
import { CreatePost } from '@/components/PostManagement/CreatePost';

/**
 * Página para criar novos posts
 */
const AdminCreatePost = () => {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();

  // Verifica autenticação
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handlePostCreated = (post: any) => {
    // Redireciona para a lista de posts após criar
    router.push('/admin/posts');
  };

  return (
    <>
      <NavigationBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/admin/posts')}
            variant="outlined"
          >
            Voltar para Posts
          </Button>
          <Box>
            <Typography variant="h4" component="h1">
              Criar Novo Post
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crie um novo post para o seu blog
            </Typography>
          </Box>
        </Box>

        {/* Componente de criação */}
        <CreatePost
          mode="create"
          onPostCreated={handlePostCreated}
        />
      </Container>
    </>
  );
};

export default AdminCreatePost;
