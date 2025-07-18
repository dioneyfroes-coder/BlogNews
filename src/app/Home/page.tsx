// src/app/Home/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import NavigationBar from '@/components/NavigationBar';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Buscar posts da API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container component="main">
      <NavigationBar />
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
