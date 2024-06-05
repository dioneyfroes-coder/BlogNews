"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem
} from '@mui/material';
import { categories, addCategory } from '@/constants/categories';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [categoria, setCategoria] = useState('Sem Categoria'); // Categoria padrão
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  if (status === 'unauthenticated' || !['admin', 'editor', 'redator'].includes(session.user.role)) {
    toast.error('Access denied');
    router.push('/');
    return null;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.id}`,
        },
        body: JSON.stringify({ title, content, author, categoria }),
      });

      if (res.ok) {
        addCategory(categoria); // Adiciona a nova categoria à lista global
        toast.success('Postagem criada com sucesso!');
        router.push('/admin');
      } else {
        const errorData = await res.json();
        toast.error(`Erro ao criar a postagem: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar a postagem.');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Criar Post
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                required
                fullWidth
                id="title"
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="label" htmlFor="content">
                Conteúdo
              </Typography>
              <ReactQuill
                value={content}
                onChange={(value) => setContent(value)}
                modules={{
                  toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                     {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'font', 'size',
                  'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent',
                  'link', 'image', 'video'
                ]}
                placeholder="Escreva o conteúdo aqui..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="author"
                label="Autor"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                id="categoria"
                label="Categoria"
                name="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Criar Postagem
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePost;
