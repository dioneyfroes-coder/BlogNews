import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, TextField, Button, Container, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';
import HelpBalloon from './HelpBallon';
import { categories, addCategory } from '@/constants/categories';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditPost = ({ postId }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [categoria, setCategoria] = useState('Sem Categoria'); // Categoria padrão
  const quillRef = useRef(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !['admin', 'editor', 'redator'].includes(session.user.role)) {
      toast.error('Access denied');
      router.push('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
          setTitle(data.data.title);
          setContent(data.data.content);
          setAuthor(data.data.author);
          setCategoria(data.data.category || 'Sem Categoria'); // Carrega a categoria do post ou a padrão
        } else {
          toast.error('Failed to load post');
          router.push('/admin');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load post');
        router.push('/admin');
        setLoading(false);
      }
    };

    fetchPost();
  }, [status, session, postId, router]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log('Mutation observed:', mutation);
      });
    });

    if (quillRef.current) {
      observer.observe(quillRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
          title,
          content,
          author,
          category: categoria,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Postagem editada com sucesso!');
        router.push('/admin');
      } else {
        toast.error(`Erro ao editar a postagem: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao editar a postagem');
    }
  };

  if (loading) return <div>Loading...</div>;

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
          Editar Post
        </Typography>
        <Box component="form" onSubmit={handleEdit} sx={{ mt: 3 }}>
          <TextField
            name="title"
            required
            fullWidth
            id="title"
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
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
            ref={quillRef}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            id="author"
            label="Autor"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            required
            fullWidth
            id="categoria"
            label="Categoria"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Editar Postagem
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditPost;
