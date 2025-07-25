// src/app/Home/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import PostCard from '@/components/PostCard';

// Configuração para forçar renderização apenas no cliente
export const dynamic = 'force-dynamic';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Erro ao buscar posts');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setPosts(data.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container component="main" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <Typography>
          Carregando posts...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <Typography color="error">
          Erro ao carregar posts: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Últimas Notícias
        </Typography>
        
        {loading && (
          <Typography>
            Carregando posts...
          </Typography>
        )}

        {error && (
          <Typography color="error">
            Erro ao carregar posts: {error}
          </Typography>
        )}

        {!loading && !error && posts && posts.length > 0 && (
          <Box sx={{ mt: 3 }}>
            {posts.map((post) => (
              <Box key={post._id} sx={{ mb: 2 }}>
                <PostCard post={post} />
              </Box>
            ))}
          </Box>
        )}

        {!loading && !error && (!posts || posts.length === 0) && (
          <Typography align="center" sx={{ py: 4 }}>
            Nenhum post encontrado.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home;
