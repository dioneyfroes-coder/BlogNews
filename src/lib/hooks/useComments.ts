// src/hooks/useComments.ts
import { useState, useEffect } from 'react';
import { Comment } from '@/types';

interface UseCommentsReturn {
  comments: Comment[];
  addComment: (author: string, content: string) => Promise<boolean>;
  removeComment: (commentId: string, author: string) => Promise<boolean>;
  isLoading: boolean;
}

export const useComments = (postId: string, initialComments: Comment[] = []): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const addComment = async (author: string, content: string): Promise<boolean> => {
    if (isLoading) return false;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, content })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeComment = async (commentId: string, author: string): Promise<boolean> => {
    if (isLoading) return false;

    // Verificar se o usuário pode remover (mesmo autor)
    const userAuthor = localStorage.getItem('blog_user_name');
    if (userAuthor !== author) {
      alert('Você só pode remover seus próprios comentários');
      return false;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    comments,
    addComment,
    removeComment,
    isLoading
  };
};
