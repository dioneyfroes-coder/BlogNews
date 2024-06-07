// src/components/PostCard.js

import { Card, CardActionArea, CardContent, Typography, Box, IconButton, Badge } from '@mui/material';
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
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1 }}>
        <ImageThumbnail imageUrl={post.imageUrl} altText={post.title} />
        <CardContent sx={{ flexGrow: 1 }}>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box display="flex" alignItems="center">
          <IconButton size="small" color="primary" disabled>
            <Badge badgeContent={post.likes} color="primary">
              <ThumbUp />
            </Badge>
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton size="small" color="primary" disabled>
            <Badge badgeContent={post.comments?.length || 0} color="primary">
              <Comment />
            </Badge>
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
