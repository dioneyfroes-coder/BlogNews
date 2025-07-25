// src/components/PostManagement/EditPost/index.ts

/**
 * Barrel exports para EditPost
 * Facilita importações e mantém API limpa
 */

// Componente principal
export { EditPost as default } from './EditPost';
export { EditPost } from './EditPost';

// Componentes modulares
export { EditPostForm } from './EditPostForm';
export { EditPostContent } from './EditPostContent';
export { EditPostLoading } from './EditPostLoading';
export { EditPostError } from './EditPostError';

// Re-exports de types e hooks relacionados
export type { EditPostProps } from '@/types/postManagement';
export { useEditPost, useEditPostSimple } from '@/hooks/useEditPost';
