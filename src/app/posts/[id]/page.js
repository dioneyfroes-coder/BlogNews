// src/app/posts/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import sanitizeHtml from 'sanitize-html';
import CommentIcon from '@mui/icons-material/Comment';
import NavigationBar from '@/components/NavigationBar';

const PostPage = ({ params }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setPost(data.data);
          setLikes(data.data.likes);
          setComments(data.data.comments);
        } else {
          setError('Post não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar o post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [params.id]);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/like`, { method: 'PUT' });
      if (!res.ok) throw new Error('Falha ao curtir o post');
      const data = await res.json();
      setLikes(data.likes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/comment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, content: commentContent })
      });
      if (!res.ok) throw new Error('Falha ao postar comentário');
      const data = await res.json();
      setComments(data.comments);
      setCommentAuthor('');
      setCommentContent('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sanitizedContent = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'div', 'pre', 'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
      a: ['href'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be']
  });

  return (
    <Box>
      <NavigationBar />
      <Container component="main">
        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              By {post.author}
            </Typography>
            <Typography variant="body1" color="text.primary" component="div">
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </Typography>
            <Box>
              <Button onClick={handleLike}>Like ({likes})</Button>
              <IconButton onClick={() => setShowCommentBox(!showCommentBox)}>
                <CommentIcon /> ({comments.length})
              </IconButton>
            </Box>
            {showCommentBox && (
              <Box mt={2}>
                <List>
                  {comments.map((comment, index) => (
                    <ListItem key={index}>
                      <Typography variant="body2"><b>{comment.author}:</b> {comment.content}</Typography>
                    </ListItem>
                  ))}
                </List>
                <TextField
                  label="Name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <Button onClick={handleComment}>Add Comment</Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PostPage;
