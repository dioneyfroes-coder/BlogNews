// src/app/posts/[id]/page.tsx
/**
 * Página de Post Individual
 * @description Exibe um post específico com seus detalhes completos
 */

"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Category,
  Visibility,
  ThumbUp,
} from '@mui/icons-material';

/**
 * Componente principal da página de post individual
 */
export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string;

  if (!postId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Post não encontrado
        </Typography>
      </Container>
    );
  }

  // Mock data - substituir por hook de fetch real
  const post = {
    id: postId,
    title: 'Post de Exemplo',
    content: '<p>Este é o conteúdo do post...</p>',
    excerpt: 'Resumo do post',
    author: 'Autor',
    category: 'Tecnologia',
    tags: ['tech', 'web', 'desenvolvimento'],
    createdAt: new Date().toISOString(),
    views: 100,
    likes: 5,
    featuredImage: '',
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Cabeçalho do Post */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        {/* Metadados */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Person fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {post.author}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Category fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {post.category}
            </Typography>
          </Stack>
        </Stack>

        {/* Estatísticas */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Visibility fontSize="small" color="action" />
            <Typography variant="caption">
              {post.views} visualizações
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ThumbUp fontSize="small" color="action" />
            <Typography variant="caption">
              {post.likes} curtidas
            </Typography>
          </Stack>
        </Stack>

        {/* Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Stack>
      </Box>

      {/* Imagem Destacada */}
      {post.featuredImage && (
        <Box sx={{ mb: 4 }}>
          <Box
            component="img"
            src={post.featuredImage}
            alt={post.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Box>
      )}

      {/* Conteúdo Principal */}
      <Card elevation={1}>
        <CardContent sx={{ p: 4 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: post.content }}
            sx={{
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: 'primary.main',
                mb: 2,
                mt: 3,
              },
              '& p': {
                mb: 2,
                lineHeight: 1.8,
                fontSize: '1.1rem',
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2,
              },
              '& li': {
                mb: 1,
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                fontStyle: 'italic',
                color: 'text.secondary',
                bgcolor: 'grey.50',
                borderRadius: '0 4px 4px 0',
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 2,
              },
              '& pre': {
                bgcolor: 'grey.900',
                color: 'common.white',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
              },
              '& code': {
                bgcolor: 'grey.100',
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                fontFamily: 'monospace',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Informações do Autor */}
      <Card elevation={1} sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sobre o Autor
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{post.author.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Autor do BlogNews
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
