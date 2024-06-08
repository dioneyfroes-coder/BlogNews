// src/app/Home/page.js

"use client";

import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import NavigationBar from '@/components/NavigationBar';
import PostCard from '@/components/PostCard';

const Home = ({ initialPosts }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

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
