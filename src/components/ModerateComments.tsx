import React, { useState, useEffect } from 'react';
import { Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { toast } from 'react-toastify';
import styles from '../styles/ModerateComments.module.css';
import { Comment } from '../types';

interface ModerateCommentsProps {
  postId: string;
}

const ModerateComments: React.FC<ModerateCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      if (!res.ok) {
        throw new Error('Erro ao encontrar comentários');
      }
      const data = await res.json();
      setComments(data.comments || []);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao encontrar comentários:', error);
      toast.error('Falha ao carregar comentários');
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      if (!res.ok) {
        throw new Error('Falha ao apagar comentário');
      }
      const updatedComments = comments.map(comment =>
        comment._id === commentId ? { ...comment, content: 'Comentário apagado' } : comment
      );
      setComments(updatedComments);
      toast.success('Comentário apagado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast.error('Falha ao apagar comentário');
    }
  };

  return (
    <div>
      <Typography variant="h6">Comentários</Typography>
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <List className={styles.commentList}>
          {comments.map((comment: Comment) => (
            <ListItem key={comment._id} className={styles.commentListItem}>
              <ListItemText
                primary={comment.author}
                secondary={comment.content}
                className={styles.commentContent}
              />
              <ListItemSecondaryAction className={styles.commentActions}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Apagar
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default ModerateComments;
