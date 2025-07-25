"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Grid, Typography, Box } from '@mui/material';
import PostCard from '@/components/PostCard';
import NavigationBar from '@/components/NavigationBar';
import { Post } from '@/types';

const SearchContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');
  const q = searchParams?.get('q');
  const date = searchParams?.get('date');
  const filterByDate = searchParams?.get('filterByDate');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let res;
        if (filterByDate === 'true' && date) {
          // Busca por data específica
          res = await fetch(`/api/grouped-posts`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data[date]) {
              setPosts(data.data[date]);
            } else {
              setPosts([]);
            }
          }
        } else if (q) {
          res = await fetch(`/api/search?q=${q}`);
          if (res) {
            const data = await res.json();
            if (data.success) {
              setPosts(data.data);
            } else {
              setPosts([]);
            }
          }
        } else if (category) {
          res = await fetch(`/api/categoryFilter?category=${category}`);
          if (res) {
            const data = await res.json();
            if (data.success) {
              setPosts(data.data);
            } else {
              setPosts([]);
            }
          }
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [category, q, date, filterByDate]);

  const getPageTitle = () => {
    if (filterByDate === 'true' && date) {
      const [year, month, day] = date.split('-');
      return `Posts de ${day}/${month}/${year}`;
    } else if (category) {
      return `Posts na categoria: ${category}`;
    } else if (q) {
      return `Resultados da pesquisa: ${q}`;
    }
    return 'Busca';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {getPageTitle()}
      </Typography>
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Grid item xs={12} key={post._id}>
                <PostCard post={post} />
              </Grid>
            ))
          ) : (
            <Typography>Sem resultados encontrados.</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

const Search = () => {
  return (
    <Container component="main" maxWidth="lg">
      <NavigationBar />
      <Suspense fallback={<Typography>Carregando...</Typography>}>
        <SearchContent />
      </Suspense>
    </Container>
  );
};

export default Search;
