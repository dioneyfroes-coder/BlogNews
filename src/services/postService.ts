import { BaseApiService } from '@/lib/api/base';

/**
 * Interface que define a estrutura de um post no blog
 * @interface Post
 */
export interface Post {
  /** ID único do post */
  _id: string;
  /** Título do post */
  title: string;
  /** Conteúdo em HTML/Markdown do post */
  content: string;
  /** Array de tags associadas ao post */
  tags: string[];
  /** Categoria do post */
  category: string;
  /** Nome do autor do post */
  author: string;
  /** Data de criação do post */
  createdAt: string;
  /** Data da última atualização */
  updatedAt: string;
  /** Número de curtidas */
  likes: number;
  /** Número de visualizações */
  views: number;
  /** Status de publicação do post */
  published: boolean;
  /** URL da imagem de destaque (opcional) */
  imageUrl?: string;
  /** Resumo do post (opcional) */
  excerpt?: string;
  /** Array de comentários (opcional) */
  comments?: Comment[];
}

/**
 * Interface que define a estrutura de um comentário
 * @interface Comment
 */
export interface Comment {
  /** ID único do comentário */
  _id: string;
  /** ID do post ao qual pertence */
  postId: string;
  /** Nome do autor do comentário */
  author: string;
  /** Conteúdo do comentário */
  content: string;
  /** Data de criação do comentário */
  createdAt: string;
  /** Status de aprovação do comentário */
  approved: boolean;
}

/**
 * Interface para filtros de busca de posts
 * @interface PostFilters
 */
export interface PostFilters {
  /** Filtrar por categoria específica */
  category?: string;
  /** Filtrar por tags específicas */
  tags?: string[];
  /** Filtrar por autor específico */
  author?: string;
  /** Filtrar por status de publicação */
  published?: boolean;
  /** Busca textual no título e conteúdo */
  search?: string;
  /** Data mínima de criação (formato ISO) */
  dateFrom?: string;
  /** Data máxima de criação (formato ISO) */
  dateTo?: string;
}

/**
 * Interface para dados de criação de um novo post
 * @interface CreatePostData
 */
export interface CreatePostData {
  /** Título do post (obrigatório) */
  title: string;
  /** Conteúdo do post (obrigatório) */
  content: string;
  /** Tags do post (obrigatório) */
  tags: string[];
  /** Categoria do post (obrigatório) */
  category: string;
  /** Autor do post (obrigatório) */
  author: string;
  /** Se deve ser publicado imediatamente (opcional, padrão: false) */
  published?: boolean;
  /** URL da imagem de destaque (opcional) */
  imageUrl?: string;
  /** Resumo do post (opcional, será gerado automaticamente se não fornecido) */
  excerpt?: string;
}

/**
 * Interface para dados de atualização de um post existente
 * @interface UpdatePostData
 */
export interface UpdatePostData extends Partial<CreatePostData> {
  /** ID do post a ser atualizado (obrigatório) */
  _id: string;
}

/**
 * Interface para interações com posts (likes, views)
 * @interface PostInteraction
 */
export interface PostInteraction {
  /** Tipo de interação */
  action: 'like' | 'unlike' | 'view';
  /** ID do usuário (opcional) */
  userId?: string;
}

/**
 * Interface para dados de um novo comentário
 * @interface CommentData
 */
export interface CommentData {
  /** Nome do autor do comentário */
  author: string;
  /** Conteúdo do comentário */
  content: string;
  /** ID do post ao qual pertence */
  postId: string;
}

/**
 * Serviço modernizado para gerenciamento de posts usando padrões RESTful
 * 
 * @class PostServiceV2
 * @extends {BaseApiService}
 * 
 * @description
 * Esta classe fornece uma interface completa para operações CRUD de posts,
 * incluindo recursos avançados como:
 * - Paginação nativa
 * - Filtros e busca avançada
 * - Gestão de comentários
 * - Sistema de likes e views
 * - Upload de imagens
 * - Estatísticas detalhadas
 * - Posts relacionados e populares
 * 
 * @example
 * ```typescript
 * // Buscar posts com paginação e filtros
 * const response = await postServiceV2.getAllPosts(1, 10, {
 *   category: 'tecnologia',
 *   published: true,
 *   search: 'Next.js'
 * });
 * 
 * // Criar novo post
 * const newPost = await postServiceV2.createPost({
 *   title: 'Meu Post',
 *   content: 'Conteúdo do post...',
 *   author: 'João Silva',
 *   category: 'tecnologia',
 *   tags: ['react', 'nextjs']
 * });
 * 
 * // Curtir um post
 * await postServiceV2.likePost('507f1f77bcf86cd799439011');
 * ```
 * 
 * @author BlogNews Team
 * @version 2.0
 * @since 2024-01-01
 */
export class PostServiceV2 extends BaseApiService {
  /** Caminho base para as APIs de posts */
  private readonly basePath = '/api/posts';

  /**
   * Construtor da classe PostServiceV2
   * 
   * @constructor
   * @description Inicializa o serviço de posts com configurações padrão
   */
  constructor() {
    super(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  }

  /**
   * Busca todos os posts com paginação e filtros
   * 
   * @method getAllPosts
   * @async
   * 
   * @param {number} [page=1] - Número da página a ser buscada
   * @param {number} [limit=10] - Número de posts por página
   * @param {PostFilters} [filters] - Filtros opcionais para a busca
   * 
   * @returns {Promise<ApiResponse<{posts: Post[], pagination: PaginationInfo}>>} 
   * Promise com posts paginados e informações de paginação
   * 
   * @example
   * ```typescript
   * // Buscar primeira página com 10 posts
   * const response = await postServiceV2.getAllPosts();
   * 
   * // Buscar posts de uma categoria específica
   * const response = await postServiceV2.getAllPosts(1, 10, {
   *   category: 'tecnologia',
   *   published: true
   * });
   * 
   * // Buscar posts com pesquisa textual
   * const response = await postServiceV2.getAllPosts(1, 10, {
   *   search: 'React Next.js'
   * });
   * ```
   * 
   * @throws {BlogNewsError} Quando há erro na requisição ou validação
   * 
   * @since 2.0.0
   */
  async getAllPosts(
    page: number = 1,
    limit: number = 10,
    filters?: PostFilters
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Adiciona filtros válidos aos parâmetros
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return this.get<{
      posts: Post[];
      pagination: {
        current: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`${this.basePath}?${params}`);
  }

  /**
   * Busca posts agrupados por data
   * 
   * @method getGroupedPosts
   * @async
   * 
   * @param {PostFilters} [filters] - Filtros opcionais para a busca
   * 
   * @returns {Promise<ApiResponse<{[date: string]: Post[]}>>} 
   * Promise com posts agrupados por data
   * 
   * @example
   * ```typescript
   * const response = await postServiceV2.getGroupedPosts({
   *   category: 'tecnologia',
   *   published: true
   * });
   * 
   * // Resultado: { '2024-01-15': [post1, post2], '2024-01-14': [post3] }
   * ```
   * 
   * @since 2.0.0
   */
  async getGroupedPosts(filters?: PostFilters) {
    let params = '';
    if (filters) {
      const urlParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            urlParams.append(key, value.join(','));
          } else {
            urlParams.append(key, String(value));
          }
        }
      });
      params = urlParams.toString();
    }
    
    return this.get<{
      [date: string]: Post[];
    }>(`${this.basePath}/grouped${params ? `?${params}` : ''}`);
  }

  /**
   * Busca um post específico por ID
   * 
   * @method getPostById
   * @async
   * 
   * @param {string} id - ID único do post
   * 
   * @returns {Promise<ApiResponse<Post>>} Promise com dados do post
   * 
   * @example
   * ```typescript
   * const response = await postServiceV2.getPostById('507f1f77bcf86cd799439011');
   * if (response.success) {
   *   console.log('Título:', response.data.title);
   * }
   * ```
   * 
   * @throws {BlogNewsError} Quando post não encontrado ou ID inválido
   * 
   * @since 2.0.0
   */
  async getPostById(id: string) {
    return this.get<Post>(`${this.basePath}/${id}`);
  }

  /**
   * Cria um novo post
   * 
   * @method createPost
   * @async
   * 
   * @param {CreatePostData} postData - Dados do post a ser criado
   * 
   * @returns {Promise<ApiResponse<Post>>} Promise com dados do post criado
   * 
   * @example
   * ```typescript
   * const response = await postServiceV2.createPost({
   *   title: 'Introdução ao Next.js 14',
   *   content: '<p>Next.js é um framework React...</p>',
   *   author: 'João Silva',
   *   category: 'tecnologia',
   *   tags: ['nextjs', 'react', 'frontend'],
   *   published: true,
   *   imageUrl: 'https://example.com/image.jpg'
   * });
   * ```
   * 
   * @throws {BlogNewsError} Quando dados são inválidos ou há erro na criação
   * 
   * @since 2.0.0
   */
  async createPost(postData: CreatePostData) {
    return this.post<Post>(this.basePath, postData);
  }

  /**
   * Atualiza um post existente
   */
  async updatePost(id: string, updateData: Partial<UpdatePostData>) {
    return this.put<Post>(`${this.basePath}/${id}`, updateData);
  }

  /**
   * Atualização parcial de um post
   */
  async patchPost(id: string, patchData: Partial<UpdatePostData>) {
    return this.patch<Post>(`${this.basePath}/${id}`, patchData);
  }

  /**
   * Remove um post
   */
  async deletePost(id: string) {
    return this.delete(`${this.basePath}/${id}`);
  }

  /**
   * Busca posts por categoria
   */
  async getPostsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getAllPosts(page, limit, { category });
  }

  /**
   * Busca posts por tags
   */
  async getPostsByTags(
    tags: string[],
    page: number = 1,
    limit: number = 10
  ) {
    return this.getAllPosts(page, limit, { tags });
  }

  /**
   * Busca posts por autor
   */
  async getPostsByAuthor(
    author: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getAllPosts(page, limit, { author });
  }

  /**
   * Busca posts com pesquisa textual
   */
  async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getAllPosts(page, limit, { search: query });
  }

  /**
   * Interações com posts (like, unlike, view)
   */
  async interactWithPost(postId: string, interaction: PostInteraction) {
    return this.post<Post>(
      `${this.basePath}/${postId}/interactions`,
      interaction
    );
  }

  /**
   * Adiciona like a um post
   */
  async likePost(postId: string, userId?: string) {
    return this.interactWithPost(postId, { action: 'like', userId });
  }

  /**
   * Remove like de um post
   */
  async unlikePost(postId: string, userId?: string) {
    return this.interactWithPost(postId, { action: 'unlike', userId });
  }

  /**
   * Registra visualização de um post
   */
  async viewPost(postId: string, userId?: string) {
    return this.interactWithPost(postId, { action: 'view', userId });
  }

  /**
   * Busca comentários de um post
   */
  async getPostComments(
    postId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return this.get<{
      comments: Comment[];
      pagination: {
        current: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`${this.basePath}/${postId}/comments?page=${page}&limit=${limit}`);
  }

  /**
   * Adiciona comentário a um post
   */
  async addComment(postId: string, commentData: Omit<CommentData, 'postId'>) {
    return this.post<Comment>(
      `${this.basePath}/${postId}/comments`,
      { ...commentData, postId }
    );
  }

  /**
   * Atualiza um comentário
   */
  async updateComment(
    postId: string,
    commentId: string,
    updateData: Partial<Omit<CommentData, 'postId'>>
  ) {
    return this.put<Comment>(
      `${this.basePath}/${postId}/comments/${commentId}`,
      updateData
    );
  }

  /**
   * Remove um comentário
   */
  async deleteComment(postId: string, commentId: string) {
    return this.delete(`${this.basePath}/${postId}/comments/${commentId}`);
  }

  /**
   * Modera comentários (aprova/rejeita)
   */
  async moderateComment(
    postId: string,
    commentId: string,
    approved: boolean
  ) {
    return this.patch<Comment>(
      `${this.basePath}/${postId}/comments/${commentId}`,
      { approved }
    );
  }

  /**
   * Upload de imagem para post
   */
  async uploadPostImage(file: File) {
    return this.upload<{ imageUrl: string }>('/api/upload-image', file);
  }

  /**
   * Publica ou despublica um post
   */
  async togglePostPublication(postId: string, published: boolean) {
    return this.patchPost(postId, { published });
  }

  /**
   * Busca estatísticas de posts
   */
  async getPostStats(postId?: string) {
    const endpoint = postId 
      ? `${this.basePath}/${postId}/stats`
      : `${this.basePath}/stats`;
    
    return this.get<{
      totalPosts: number;
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      categoryStats?: { [category: string]: number };
      monthlyStats?: { [month: string]: number };
    }>(endpoint);
  }

  /**
   * Busca posts relacionados
   */
  async getRelatedPosts(postId: string, limit: number = 5) {
    return this.get<Post[]>(`${this.basePath}/${postId}/related?limit=${limit}`);
  }

  /**
   * Busca posts populares
   */
  async getPopularPosts(
    period: 'week' | 'month' | 'year' = 'month',
    limit: number = 10
  ) {
    return this.get<Post[]>(`${this.basePath}/popular?period=${period}&limit=${limit}`);
  }

  /**
   * Busca posts recentes
   */
  async getRecentPosts(limit: number = 10) {
    return this.get<Post[]>(`${this.basePath}/recent?limit=${limit}`);
  }
}

// Instância singleton do serviço
export const postServiceV2 = new PostServiceV2();

// Export da classe para casos que precisem de múltiplas instâncias
export default PostServiceV2;
