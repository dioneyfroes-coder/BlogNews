import React, { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem } from '@mui/material';

const PostInteractions = ({ postId, initialLikes, initialComments }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to like the post');
      const data = await res.json();
      setLikes(data.likes);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleComment = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, content: commentContent })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const data = await res.json();
      setComments(data.comments);
      setCommentAuthor('');
      setCommentContent('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleLike}>Like ({likes})</Button>
      <Box>
        <Typography variant="h6">Comments ({comments.length})</Typography>
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
    </Box>
  );
};

export default PostInteractions;
