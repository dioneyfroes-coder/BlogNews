import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';
import HelpBalloon from './HelpBallon';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditPost = ({ postId }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
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
        body: JSON.stringify({ id: post._id, title, content, author }),
      });

      if (res.ok) {
        toast.success('Postagem editada com sucesso!');
        router.push('/admin');
      } else {
        const errorData = await res.json();
        toast.error(`Erro ao editar a postagem: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao editar a postagem.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">Editar Post</Typography>
        <form onSubmit={handleEdit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }} ref={quillRef}>
            <Typography component="label" variant="body1">Conteúdo</Typography>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ size: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' },
                  { 'indent': '-1' }, { 'indent': '+1' }],
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
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Autor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">Editar Postagem</Button>
          <HelpBalloon message="Pode levar alguns minutos para as alterações terem efeito." />
        </form>
      </Box>
    </Container>
  );
};

export default EditPost;
