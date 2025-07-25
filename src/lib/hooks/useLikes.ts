// src/hooks/useLikes.ts
import { useState, useEffect } from 'react';

interface UseLikesReturn {
  hasLiked: boolean;
  likesCount: number;
  toggleLike: () => Promise<void>;
  isLoading: boolean;
}

export const useLikes = (postId: string, initialLikes: number = 0): UseLikesReturn => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // Chave para localStorage
  const storageKey = `blog_like_${postId}`;

  useEffect(() => {
    // Verificar se o usuário já curtiu este post
    const liked = localStorage.getItem(storageKey) === 'true';
    setHasLiked(liked);
  }, [storageKey]);

  const toggleLike = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (hasLiked) {
        // Remove o like
        const response = await fetch(`/api/posts/${postId}/unlike`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.likes);
          setHasLiked(false);
          localStorage.removeItem(storageKey);
        }
      } else {
        // Adiciona o like
        const response = await fetch(`/api/posts/${postId}/like`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.likes);
          setHasLiked(true);
          localStorage.setItem(storageKey, 'true');
        }
      }
    } catch (error) {
      console.error('Erro ao alterar like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasLiked,
    likesCount,
    toggleLike,
    isLoading
  };
};
