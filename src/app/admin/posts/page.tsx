"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  ArrowBack,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NavigationBar from '@/components/NavigationBar';

/**
 * Interface para um post
 */
interface Post {
  _id: string;
  title: string;
  content: string;
  published: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Página de gerenciamento de posts
 */
const AdminPosts = () => {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Verifica autenticação
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Carrega posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Erro ao carregar posts');
        
        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        setError('Erro ao carregar posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchPosts();
    }
  }, [isAuthenticated, isAdmin]);

  // Filtra posts baseado na busca
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formata data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/admin')}
            variant="outlined"
          >
            Voltar
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              Gerenciar Posts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crie, edite e gerencie todos os posts do blog
            </Typography>
          </Box>
        </Box>

        {/* Barra de Busca */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar posts por título ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Lista de Posts */}
        {loading ? (
          <Typography>Carregando posts...</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPosts.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchTerm ? 'Nenhum post encontrado' : 'Nenhum post criado ainda'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {searchTerm 
                        ? 'Tente ajustar os termos de busca'
                        : 'Comece criando seu primeiro post'
                      }
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => router.push('/admin/posts/create')}
                        sx={{ mt: 2 }}
                      >
                        Criar Primeiro Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              filteredPosts.map((post) => (
                <Grid item xs={12} md={6} lg={4} key={post._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip
                          icon={post.published ? <Visibility /> : <VisibilityOff />}
                          label={post.published ? 'Publicado' : 'Rascunho'}
                          color={post.published ? 'success' : 'default'}
                          size="small"
                        />
                        <Chip
                          label={post.category}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {post.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {post.content.length > 100 
                          ? `${post.content.substring(0, 100)}...`
                          : post.content
                        }
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        Criado: {formatDate(post.createdAt)}
                      </Typography>
                      {post.updatedAt !== post.createdAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Atualizado: {formatDate(post.updatedAt)}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          // TODO: Implementar confirmação de exclusão
                          console.log('Deletar post:', post._id);
                        }}
                      >
                        Excluir
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* FAB para criar novo post */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => router.push('/admin/posts/create')}
        >
          <Add />
        </Fab>

        {/* Estatísticas */}
        {posts.length > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" color="primary">
                  {posts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Posts
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" color="success.main">
                  {posts.filter(p => p.published).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publicados
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" color="warning.main">
                  {posts.filter(p => !p.published).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rascunhos
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h4" color="info.main">
                  {[...new Set(posts.map(p => p.category))].length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categorias
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdminPosts;
