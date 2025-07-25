// src/types/postManagement.ts

import type { Post } from '@/services/postService';

/**
 * Props para o componente EditPost
 */
export interface EditPostProps {
  /** ID do post a ser editado */
  postId: string;
  /** Callback chamado quando o post é atualizado com sucesso */
  onPostUpdated?: (updatedPost: Post) => void;
  /** Callback chamado quando há erro */
  onError?: (error: string) => void;
  /** URL de redirecionamento após sucesso (padrão: /posts/{id}) */
  redirectUrl?: string;
  /** Modo de edição (inline, modal, page) */
  mode?: 'inline' | 'modal' | 'page';
}

/**
 * Props para o componente DeletePost
 */
export interface DeletePostProps {
  /** ID do post a ser deletado */
  postId: string;
  /** Callback chamado quando o post é deletado com sucesso */
  onPostDeleted?: (deletedPostId: string) => void;
  /** Callback chamado quando há erro */
  onError?: (error: string) => void;
  /** URL de redirecionamento após sucesso (padrão: /admin) */
  redirectUrl?: string;
  /** Modo de exibição (button, modal, page) */
  mode?: 'button' | 'modal' | 'page';
  /** Mostrar confirmação antes de deletar */
  confirmBeforeDelete?: boolean;
  /** Texto customizado do botão */
  buttonText?: string;
}

/**
 * Estado interno do hook useEditPost
 */
export interface EditPostState {
  /** Post sendo editado */
  post: Post | null;
  /** Dados do formulário */
  formData: {
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    excerpt: string;
    tags: string[];
  };
  /** Estado de loading */
  isLoading: boolean;
  /** Estado de salvamento */
  isSaving: boolean;
  /** Erros de validação */
  errors: Record<string, string>;
  /** Erro geral */
  error: string | null;
  /** Post foi modificado */
  isDirty: boolean;
}

/**
 * Estado interno do hook useDeletePost
 */
export interface DeletePostState {
  /** Estado de loading */
  isDeleting: boolean;
  /** Erro durante deleção */
  error: string | null;
  /** Modal de confirmação aberto */
  isConfirmModalOpen: boolean;
}

/**
 * Retorno do hook useEditPost
 */
export interface UseEditPostReturn extends EditPostState {
  /** Função para atualizar campo do formulário */
  updateField: (field: keyof EditPostState['formData'], value: any) => void;
  /** Função para submeter formulário */
  handleSubmit: () => Promise<void>;
  /** Função para resetar formulário */
  resetForm: () => void;
  /** Função para validar formulário */
  validateForm: () => boolean;
  /** Função para recarregar post */
  refreshPost: () => Promise<void>;
}

/**
 * Retorno do hook useDeletePost
 */
export interface UseDeletePostReturn extends DeletePostState {
  /** Função para deletar post */
  handleDelete: () => Promise<void>;
  /** Função para abrir modal de confirmação */
  openConfirmModal: () => void;
  /** Função para fechar modal de confirmação */
  closeConfirmModal: () => void;
  /** Função para confirmar deleção */
  confirmDelete: () => Promise<void>;
}

/**
 * Opções de configuração do hook useEditPost
 */
export interface EditPostHookOptions {
  /** Post inicial (para evitar fetch) */
  initialPost?: Post;
  /** Validação automática */
  autoValidate?: boolean;
  /** Callback ao carregar post */
  onPostLoaded?: (post: Post) => void;
  /** Callback ao salvar */
  onSaveSuccess?: (post: Post) => void;
  /** Callback ao erro */
  onSaveError?: (error: string) => void;
}

/**
 * Opções de configuração do hook useDeletePost
 */
export interface DeletePostHookOptions {
  /** Confirmação automática (sem modal) */
  autoConfirm?: boolean;
  /** Callback ao deletar */
  onDeleteSuccess?: (postId: string) => void;
  /** Callback ao erro */
  onDeleteError?: (error: string) => void;
}

/**
 * Configurações de validação para EditPost
 */
export interface PostValidationRules {
  title: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  content: {
    required: boolean;
    minLength?: number;
  };
  author: {
    required: boolean;
    pattern?: RegExp;
  };
  category: {
    required: boolean;
  };
  imageUrl: {
    required: boolean;
    pattern?: RegExp;
  };
}

/**
 * Labels customizáveis para os componentes
 */
export interface PostManagementLabels {
  editPost: {
    title: string;
    submitButton: string;
    submitButtonSaving: string;
    loadingText: string;
    notFoundText: string;
  };
  deletePost: {
    title: string;
    confirmText: string;
    deleteButton: string;
    deletingButton: string;
    helpText: string;
  };
}
