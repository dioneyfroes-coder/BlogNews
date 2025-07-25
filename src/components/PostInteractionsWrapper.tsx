/**
 * @fileoverview Wrapper de compatibilidade para PostInteractions
 * @module PostInteractionsWrapper
 * @deprecated Componente desabilitado - interações removidas conforme solicitado
 */

import React from 'react';
import { Comment } from '@/services/postService';

/**
 * Interface para props do wrapper (mantém compatibilidade)
 */
interface PostInteractionsWrapperProps {
  /** ID do post */
  postId: string;
  /** Número inicial de likes */
  initialLikes: number;
  /** Lista inicial de comentários */
  initialComments: Comment[];
  /** Callback quando likes mudam */
  onLikeChange?: (newCount: number) => void;
  /** Callback quando comentários mudam */
  onCommentChange?: (newComments: Comment[]) => void;
}

/**
 * Wrapper de compatibilidade para PostInteractions
 * @deprecated Componente desabilitado - interações foram removidas
 */
const PostInteractionsWrapper: React.FC<PostInteractionsWrapperProps> = ({
  postId,
  initialLikes,
  initialComments,
  onLikeChange,
  onCommentChange
}) => {
  // Componente desabilitado - interações foram removidas conforme solicitado pelo usuário
  return null;
};

export default PostInteractionsWrapper;
