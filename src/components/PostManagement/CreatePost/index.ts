// src/components/CreatePost/index.ts
/**
 * Barrel export para componentes do CreatePost
 * @fileoverview Centraliza exportações dos módulos
 */

export { default as CreatePost } from './CreatePost';
export { default as BasicInfoSection } from './BasicInfoSection';
export { default as ContentSection } from './ContentSection';
export { default as MediaSection } from './MediaSection';
export { default as PublishSection } from './PublishSection';

// Re-exporta hooks relacionados
export {
  useCreatePostForm,
  type CreatePostData,
  type ValidationErrors,
  type LoadingState,
} from '@/hooks/useCreatePostForm';

export { useFormValidation } from '@/hooks/useFormValidation';
export { usePostSubmission } from '@/hooks/usePostSubmission';
