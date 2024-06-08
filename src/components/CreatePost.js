// src/pages/CreatePost.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { categories } from '@/constants/categories';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Sem Categoria');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author,
          category,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      router.push(`/posts/${data.data._id}`);
    } catch (error) {
      console.error('Erro ao criar a postagem:', error.message);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Criar Novo Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Título"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Categoria</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Categoria"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          required
          fullWidth
          id="author"
          label="Autor"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="imageUrl"
          label="URL da Imagem para Miniatura"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Editor value={content} onChange={setContent} />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Criar Post
        </Button>
      </Box>
    </Container>
  );
};

export default CreatePost;
