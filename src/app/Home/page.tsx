// src/app/Home/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import NavigationBar from '@/components/NavigationBar';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar posts da API
    const fetchPosts = async () => {
      try {
        console.log('Buscando posts...');
        const response = await fetch('/api/posts');
        console.log('Resposta da API:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Dados recebidos:', result);
          
          // A API retorna { success: true, data: posts }
          if (result.success && result.data) {
            setPosts(result.data);
            console.log('Posts carregados:', result.data.length);
          }
        } else {
          console.error('Erro na resposta da API:', response.status);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container component="main">
        <NavigationBar />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Carregando posts...
        </div>
      </Container>
    );
  }

  return (
    <Container component="main">
      <NavigationBar />
      <Grid container spacing={3}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Nenhum post encontrado.
            </div>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
