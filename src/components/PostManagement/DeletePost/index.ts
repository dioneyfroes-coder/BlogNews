// src/components/PostManagement/DeletePost/index.ts

/**
 * Barrel exports para DeletePost
 * Facilita importações e mantém API limpa
 */

// Componente principal
export { DeletePost as default } from './DeletePost';
export { DeletePost } from './DeletePost';

// Componentes modulares
export { DeletePostButton } from './DeletePostButton';
export { DeletePostModal } from './DeletePostModal';

// Re-exports de types e hooks relacionados
export type { DeletePostProps } from '@/types/postManagement';
export { useDeletePost, useDeletePostSimple, useBulkDeletePosts } from '@/hooks/useDeletePost';
