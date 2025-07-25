// src/components/PostGrid.tsx
"use client";

import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import PostCard from './PostCard';
import { Post } from '@/types';

interface PostGridProps {
  posts: Post[];
  title?: string;
  featured?: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, title, featured = false }) => {
  if (!posts || posts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Nenhum post encontrado
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {title && (
        <Typography 
          variant="h4" 
          component="h2" 
          fontWeight="bold" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          {title}
        </Typography>
      )}
      
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        {posts.map((post, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={featured && index === 0 ? 12 : 4}
            lg={featured && index === 0 ? 8 : 3}
            key={post._id}
          >
            <PostCard 
              post={post} 
              variant={featured && index === 0 ? 'featured' : 'default'}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostGrid;
