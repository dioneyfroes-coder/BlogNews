import React, { useState } from 'react';
import { Container, Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';

const PostSelector = ({ posts, loading, handlePostSelect }) => {
  const [selectedPost, setSelectedPost] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedPost(value);
    handlePostSelect(event);
  };

  return (
    <Container component="section" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h6">
          Selecione um Post
        </Typography>
        <Box
          sx={{
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: 2,
            width: '100%',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Carregando posts...</Typography>
            </Box>
          ) : (
            <Select
              variant="outlined"
              fullWidth
              size="medium"
              value={selectedPost}
              onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {posts.map((post) => (
                <MenuItem key={post._id} value={post._id}>
                  {post.title}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PostSelector;
