// src/components/PostsManagement.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Pagination,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { postService, authService } from '@/services';
import { Post } from '@/services/postService';
import { FilterOptions } from '@/lib/api/base';
import { logger } from '@/lib/logger';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Componente avançado de gerenciamento de posts
 * Demonstra o uso completo dos serviços RESTful migrados
 */
const PostsManagement: React.FC = () => {
  // Estados para posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  
  // Estados de filtros
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    published: undefined,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Estados de estatísticas
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Estados da interface
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de autenticação
  const [user, setUser] = useState(authService.getCurrentUser());
  const [permissions, setPermissions] = useState<any>({});

  /**
   * Carrega posts com filtros e paginação
   */
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info('Carregando posts com filtros', { 
        page: currentPage, 
        filters,
        component: 'PostsManagement' 
      });

      const response = await postService.getAllPosts(
        currentPage,
        10,
        filters
      );

      if (response.success && response.data) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
        setTotalPages(response.data.pagination.pages);
        
        logger.info('Posts carregados com sucesso', { 
          count: response.data.posts.length,
          total: response.data.pagination.total 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar posts';
      setError(errorMessage);
      logger.error('Erro ao carregar posts', error as Error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega estatísticas dos posts
   */
  const loadStats = async () => {
    setStatsLoading(true);
    
    try {
      const response = await postService.getPostStats();
      
      if (response.success && response.data) {
        setStats(response.data);
        logger.info('Estatísticas carregadas', { component: 'PostsManagement' });
      }
    } catch (error) {
      logger.error('Erro ao carregar estatísticas', error as Error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * Verifica permissões do usuário
   */
  const checkPermissions = async () => {
    try {
      const perms = await authService.hasPermissions([
        'posts.create',
        'posts.edit',
        'posts.delete',
        'posts.publish'
      ]);
      setPermissions(perms);
    } catch (error) {
      logger.error('Erro ao verificar permissões', error as Error);
    }
  };

  /**
   * Aplica filtros de busca
   */
  const handleSearch = (searchValue: string) => {
    setFilters((prev: FilterOptions) => ({ ...prev, search: searchValue }));
    setCurrentPage(1);
  };

  /**
   * Altera filtro de categoria
   */
  const handleCategoryFilter = (category: string) => {
    setFilters((prev: FilterOptions) => ({ ...prev, category }));
    setCurrentPage(1);
  };

  /**
   * Altera filtro de publicação
   */
  const handlePublishedFilter = (published: boolean | undefined) => {
    setFilters((prev: FilterOptions) => ({ ...prev, published }));
    setCurrentPage(1);
  };

  /**
   * Remove post
   */
  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!permissions['posts.delete']) {
      toast.error('Você não tem permissão para deletar posts');
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar o post "${postTitle}"?`)) {
      return;
    }

    try {
      const response = await postService.deletePost(postId);
      
      if (response.success) {
        toast.success('Post deletado com sucesso');
        loadPosts(); // Recarregar lista
      }
    } catch (error) {
      logger.error('Erro ao deletar post', error as Error);
      toast.error('Erro ao deletar post');
    }
  };

  /**
   * Alterna publicação do post
   */
  const handleTogglePublication = async (postId: string, currentState: boolean) => {
    if (!permissions['posts.publish']) {
      toast.error('Você não tem permissão para alterar publicação');
      return;
    }

    try {
      const response = await postService.togglePostPublication(postId, !currentState);
      
      if (response.success) {
        toast.success(`Post ${!currentState ? 'publicado' : 'despublicado'} com sucesso`);
        loadPosts(); // Recarregar lista
      }
    } catch (error) {
      logger.error('Erro ao alterar publicação', error as Error);
      toast.error('Erro ao alterar publicação do post');
    }
  };

  // Effects
  useEffect(() => {
    checkPermissions();
    loadStats();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [currentPage, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Posts
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Demonstração dos serviços RESTful migrados
      </Typography>

      {/* Tabs de navegação */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Lista de Posts" icon={<EditIcon />} />
          <Tab label="Estatísticas" icon={<TrendingUpIcon />} />
        </Tabs>
      </Box>

      {/* Tab Panel - Lista de Posts */}
      <TabPanel value={tabValue} index={0}>
        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Título, conteúdo ou tags"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filters.category || ''}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="tecnologia">Tecnologia</MenuItem>
                  <MenuItem value="programacao">Programação</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="tutoriais">Tutoriais</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.published?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handlePublishedFilter(
                      value === '' ? undefined : value === 'true'
                    );
                  }}
                  label="Status"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Publicados</MenuItem>
                  <MenuItem value="false">Rascunhos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              {permissions['posts.create'] && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => toast.info('Função criar post em desenvolvimento')}
                >
                  Novo Post
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Informações da listagem */}
        {pagination && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {posts.length} de {pagination.total} posts
              {filters.search && ` para "${filters.search}"`}
            </Typography>
            <Chip 
              label={`Página ${currentPage} de ${totalPages}`} 
              variant="outlined" 
              size="small"
            />
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Lista de Posts */}
        {!loading && posts.length > 0 && (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center" mb={2}>
                          <Chip label={post.category} size="small" />
                          <Chip 
                            label={post.published ? 'Publicado' : 'Rascunho'} 
                            size="small" 
                            color={post.published ? 'success' : 'warning'}
                          />
                          {post.tags?.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                        <Box display="flex" gap={2} alignItems="center">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <VisibilityIcon fontSize="small" />
                            <Typography variant="caption">{post.views}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <ThumbUpIcon fontSize="small" />
                            <Typography variant="caption">{post.likes}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CommentIcon fontSize="small" />
                            <Typography variant="caption">{post.comments?.length || 0}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            por {post.author} • {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" flexDirection="column" gap={1} ml={2}>
                        {permissions['posts.edit'] && (
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => toast.info('Função editar em desenvolvimento')}
                          >
                            Editar
                          </Button>
                        )}
                        {permissions['posts.publish'] && (
                          <Button
                            size="small"
                            color={post.published ? 'warning' : 'success'}
                            onClick={() => handleTogglePublication(post._id, post.published)}
                          >
                            {post.published ? 'Despublicar' : 'Publicar'}
                          </Button>
                        )}
                        {permissions['posts.delete'] && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeletePost(post._id, post.title)}
                          >
                            Deletar
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mensagem quando não há posts */}
        {!loading && posts.length === 0 && (
          <Alert severity="info">
            Nenhum post encontrado com os filtros aplicados.
          </Alert>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </TabPanel>

      {/* Tab Panel - Estatísticas */}
      <TabPanel value={tabValue} index={1}>
        {statsLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : stats ? (
          <Grid container spacing={3}>
            {/* Cards de overview */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total de Posts
                  </Typography>
                  <Typography variant="h4">
                    {stats.overview?.totalPosts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total de Visualizações
                  </Typography>
                  <Typography variant="h4">
                    {stats.overview?.totalViews?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total de Likes
                  </Typography>
                  <Typography variant="h4">
                    {stats.overview?.totalLikes?.toLocaleString() || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total de Comentários
                  </Typography>
                  <Typography variant="h4">
                    {stats.overview?.totalComments || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Adicionar mais seções de estatísticas aqui */}
            <Grid item xs={12}>
              <Alert severity="info">
                Demonstração de estatísticas com dados simulados dos serviços RESTful migrados.
              </Alert>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="warning">
            Erro ao carregar estatísticas.
          </Alert>
        )}
      </TabPanel>
    </Container>
  );
};

export default PostsManagement;
