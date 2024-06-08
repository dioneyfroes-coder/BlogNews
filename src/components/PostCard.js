// src/components/PostCard.js

import { Card, CardActionArea, CardContent, Typography, Box, IconButton, Badge, Grid } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import ImageThumbnail from './ImageThumbnail';

const PostCard = ({ post }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${post._id}`);
  };

  return (
    <Card 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: { xs: 'auto', md: '150px' }, // Altura fixa para telas maiores
        maxWidth: { xs: '100%', md: '950px' }, // Tamanho máximo para telas maiores
        margin: '10px auto' // Centraliza o card horizontalmente
      }}
    >
      <CardActionArea 
        onClick={handleClick} 
        sx={{ 
          display: 'flex', 
          alignItems: 'stretch', 
          flexGrow: 1 
        }}
      >
        <Box sx={{ width: '150px', flexShrink: 0 }}>
          <ImageThumbnail imageUrl={post.imageUrl} altText={post.title} />
        </Box>
        <CardContent 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content.substring(0, 100) + '...') }}
          />
        </CardContent>
      </CardActionArea>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={2}>
        <IconButton size="small" color="primary" disabled>
          <Badge badgeContent={post.likes} color="primary">
            <ThumbUp />
          </Badge>
        </IconButton>
        <IconButton size="small" color="primary" disabled>
          <Badge badgeContent={post.comments?.length || 0} color="primary">
            <Comment />
          </Badge>
        </IconButton>
      </Box>
    </Card>
  );
};

export default PostCard;
