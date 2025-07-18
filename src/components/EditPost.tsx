// src/components/EditPost.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { categories } from '@/constants/categories';
import { Post } from '@/types';

interface EditPostProps {
  postId: string;
}

const EditPost: React.FC<EditPostProps> = ({ postId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();
        setPost(data.data);
        setTitle(data.data.title);
        setContent(data.data.content);
        setAuthor(data.data.author);
        setCategory(data.data.category || 'Sem Categoria');
        setImageUrl(data.data.imageUrl || '');
      } catch (error: any) {
        console.error('Erro ao carregar o post:', error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
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
    } catch (error: any) {
      console.error('Erro ao editar a postagem:', error.message);
    }
  };

  if (!post) return <Container component="main" maxWidth="md"><Typography>Carregando...</Typography></Container>;

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Post
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
          Salvar Alterações
        </Button>
      </Box>
    </Container>
  );
};

export default EditPost;
