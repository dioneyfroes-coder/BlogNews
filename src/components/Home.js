"use client";

import React, { useState, useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Collapse,
  IconButton,
  Badge,
} from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';

const Home = ({ initialPosts }) => {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleAddComment = async (postId, author, content) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <Container component="main">
      <Typography variant="h1" gutterBottom>
        Blog News
      </Typography>
      {posts.map((post) => {
        const sanitizedContent = sanitizeHtml(post.content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img', 'iframe', 'div', 'pre', 'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt'],
            a: ['href'],
            iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
          },
          allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be']
        });

        return (
          <section key={post._id}>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
                <Typography variant="caption" display="block" gutterBottom>
                  By {post.author}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<ThumbUp />}
                  onClick={() => handleLike(post._id)}
                >
                  Gostei! ({post.likes})
                </Button>
                <IconButton
                  onClick={() => toggleExpand(post._id)}
                  aria-expanded={expandedPostId === post._id}
                  aria-label="show comments"
                >
                  <Badge badgeContent={post.comments?.length || 0} color="primary">
                    <Comment />
                  </Badge>
                </IconButton>
              </CardActions>
              <Collapse in={expandedPostId === post._id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="h6" component="h3">
                    Comentários
                  </Typography>
                  {post.comments && post.comments.map((comment, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {comment.author}: {comment.content}
                    </Typography>
                  ))}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const author = e.target.author.value;
                    const content = e.target.content.value;
                    handleAddComment(post._id, author, content);
                    e.target.reset();
                  }}>
                    <TextField
                      name="author"
                      label="Seu nome"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      required
                    />
                    <TextField
                      name="content"
                      label="Seu comentário"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      required
                    />
                    <Button type="submit" variant="contained" color="primary">
                      Comentar
                    </Button>
                  </form>
                </CardContent>
              </Collapse>
            </Card>
          </section>
        );
      })}
    </Container>
  );
};

export default Home;
