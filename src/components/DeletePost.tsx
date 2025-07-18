"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import HelpBalloon from './HelpBallon';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';

interface DeletePostProps {
  postId: string;
}

const DeletePost: React.FC<DeletePostProps> = ({ postId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!postId) {
      toast.error('Post ID is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao deletar post');
      }

      toast.success('Post deletado com sucesso');
      router.push('/admin');
    } catch (error: any) {
      console.error('Erro ao deletar post:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Deletar Post Selecionado ?
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDelete}
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Deletar'}
        </Button>
        <HelpBalloon message="A exclusão de posts é irreversível e pode levar alguns minutos para refletir nas alterações. Tem certeza que deseja continuar?" />
      </Box>
    </Container>
  );
};

export default DeletePost;
