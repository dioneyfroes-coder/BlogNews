// src/components/PostManagement/index.ts

/**
 * Barrel exports para PostManagement
 * Facilita importações e mantém API limpa
 */

// CreatePost
export { CreatePost } from './CreatePost';
export { BasicInfoSection, ContentSection, MediaSection, PublishSection } from './CreatePost';

// EditPost
export { EditPost, EditPostForm, EditPostContent, EditPostLoading, EditPostError } from './EditPost';
export { EditPost as default } from './EditPost';

// DeletePost
export { DeletePost, DeletePostButton, DeletePostModal } from './DeletePost';

// Types
export type { 
  EditPostProps,
  DeletePostProps,
  EditPostState,
  DeletePostState,
  UseEditPostReturn,
  UseDeletePostReturn,
  EditPostHookOptions,
  DeletePostHookOptions,
  PostValidationRules,
  PostManagementLabels
} from '@/types/postManagement';

// Hooks
export { 
  useEditPost, 
  useEditPostSimple
} from '@/hooks/useEditPost';

export { 
  useDeletePost,
  useDeletePostSimple,
  useBulkDeletePosts
} from '@/hooks/useDeletePost';

// Utils
export { 
  PostManagementUtils,
  DEFAULT_VALIDATION_RULES,
  DEFAULT_LABELS,
  POST_ERROR_MESSAGES
} from '@/lib/utils/postManagementUtils';
