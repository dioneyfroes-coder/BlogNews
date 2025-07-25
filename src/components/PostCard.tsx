// src/components/PostCard.tsx
"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  const theme = useTheme();

  // Configurações de categoria com cores do Google Material
  const getCategoryConfig = (category?: string) => {
    const configs: Record<string, { color: string; bgcolor: string }> = {
      'tecnologia': { color: '#1a73e8', bgcolor: '#e8f0fe' },
      'política': { color: '#d93025', bgcolor: '#fce8e6' },
      'esportes': { color: '#137333', bgcolor: '#e6f4ea' },
      'entretenimento': { color: '#f9ab00', bgcolor: '#fef7e0' },
      'ciência': { color: '#9334e6', bgcolor: '#f3e8ff' },
      'saúde': { color: '#ea4335', bgcolor: '#fce8e6' },
      'economia': { color: '#ff6d01', bgcolor: '#fff4e5' },
      'cultura': { color: '#7c3aed', bgcolor: '#ede9fe' }
    };
    
    return configs[category?.toLowerCase() || ''] || { color: '#5f6368', bgcolor: '#f1f3f4' };
  };

  const categoryConfig = getCategoryConfig(post.category);

  // Função para formatar tempo relativo
  const getRelativeTime = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR');
    }
  };

  // Função para extrair primeira imagem do content se não houver imageUrl
  const getPostImage = () => {
    if (post.imageUrl) return post.imageUrl;
    
    // Tentar extrair primeira imagem do conteúdo HTML
    const imgMatch = post.content?.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '/default-image.jpg';
  };

  // Função para limpar HTML e criar summary
  const getCleanSummary = () => {
    const cleanContent = post.content?.replace(/<[^>]*>?/gm, '').trim() || '';
    return cleanContent.length > 120 ? cleanContent.substring(0, 120) + '...' : cleanContent;
  };

  // Variante compacta (para listas laterais)
  if (variant === 'compact') {
    return (
      <Card 
        component={Link}
        href={`/posts/${post._id}`}
        sx={{ 
          display: 'flex',
          textDecoration: 'none',
          mb: 2,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[4],
            '& .post-title': {
              color: 'primary.main'
            }
          },
          transition: 'all 0.2s ease'
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 100, height: 80, objectFit: 'cover' }}
          image={getPostImage()}
          alt={post.title}
        />
        <CardContent sx={{ p: 2, flexGrow: 1 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            className="post-title"
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              mb: 1
            }}
          >
            {post.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {getRelativeTime(post.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Variante featured (destaque)
  if (variant === 'featured') {
    return (
      <Card 
        component={Link}
        href={`/posts/${post._id}`}
        sx={{ 
          textDecoration: 'none',
          mb: 4,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8],
            '& .post-image': {
              transform: 'scale(1.05)'
            },
            '& .post-title': {
              color: 'primary.main'
            }
          },
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="300"
            image={getPostImage()}
            alt={post.title}
            className="post-image"
            sx={{ 
              transition: 'transform 0.3s ease',
              objectFit: 'cover'
            }}
          />
          {post.category && (
            <Chip
              label={post.category}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: categoryConfig.bgcolor,
                color: categoryConfig.color,
                fontWeight: 'medium',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          )}
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h4" 
            component="h2"
            fontWeight="bold"
            className="post-title"
            sx={{ 
              mb: 2,
              lineHeight: 1.3,
              transition: 'color 0.2s ease'
            }}
          >
            {post.title}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ 
              lineHeight: 1.6,
              mb: 3
            }}
          >
            {getCleanSummary()}
          </Typography>

          {/* Info do autor e data */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {post.author || 'Redação'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Postado {getRelativeTime(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Variante padrão
  return (
    <Card 
      component={Link}
      href={`/posts/${post._id}`}
      sx={{ 
        textDecoration: 'none',
        mb: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: theme.shadows[2],
        maxHeight: 280,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          '& .post-image': {
            transform: 'scale(1.05)'
          },
          '& .post-title': {
            color: 'primary.main'
          }
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 140 }}>
        <CardMedia
          component="img"
          height="140"
          image={getPostImage()}
          alt={post.title}
          className="post-image"
          sx={{ 
            transition: 'transform 0.3s ease',
            objectFit: 'cover'
          }}
        />
        {post.category && (
          <Chip
            label={post.category}
            size="small"
            icon={<CategoryIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: categoryConfig.bgcolor,
              color: categoryConfig.color,
              fontWeight: 'medium',
              backdropFilter: 'blur(8px)',
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-label': { px: 1 },
              '& .MuiChip-icon': { ml: 0.5 }
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ p: 2, height: 140, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="subtitle1" 
          component="h3"
          fontWeight="bold"
          className="post-title"
          sx={{ 
            mb: 1,
            lineHeight: 1.3,
            fontSize: '0.95rem',
            transition: 'color 0.2s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {post.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            lineHeight: 1.4,
            fontSize: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1
          }}
        >
          {getCleanSummary()}
        </Typography>

        {/* Informações do post */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mt: 'auto',
          pt: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 12 }} />
            </Avatar>
            <Typography variant="caption" fontWeight="medium" color="text.primary">
              {post.author || 'Redação'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {getRelativeTime(post.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
