# 🎯 **TypeScript Best Practices - BlogNews**

Este documento define as melhores práticas de TypeScript adotadas no projeto BlogNews.

## 📋 **Índice**

1. [Configuração TypeScript](#configuração-typescript)
2. [Estrutura de Tipos](#estrutura-de-tipos)
3. [Naming Conventions](#naming-conventions)
4. [Component Patterns](#component-patterns)
5. [API Development](#api-development)
6. [Error Handling](#error-handling)
7. [Testing Strategies](#testing-strategies)
8. [Performance](#performance)

---

## 🔧 **Configuração TypeScript**

### **tsconfig.json Otimizado**
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### **Regras Fundamentais**
- ✅ **Strict mode sempre habilitado**
- ✅ **noImplicitAny** para evitar tipos implícitos
- ✅ **strictNullChecks** para null safety
- ✅ **noUnusedLocals** para código limpo

---

## 🏗️ **Estrutura de Tipos**

### **Organização de Tipos**
```typescript
// ✅ CORRETO: Tipos centralizados
// src/types/index.ts
export interface Post {
  _id: string;
  title: string;
  content: string;
  // ...
}

// ❌ INCORRETO: Tipos espalhados
// Evitar definir interfaces em múltiplos arquivos
```

### **Hierarquia de Interfaces**
```typescript
// Base interfaces
interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

// Extended interfaces
interface Post extends BaseEntity {
  title: string;
  content: string;
  author: string;
}

// Specialized interfaces
interface PostWithComments extends Post {
  comments: Comment[];
}
```

### **Union Types e Discriminated Unions**
```typescript
// ✅ CORRETO: Union types específicos
type Theme = 'light' | 'dark';
type UserRole = 'admin' | 'editor' | 'redator';

// ✅ CORRETO: Discriminated unions
type APIResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## 📝 **Naming Conventions**

### **Interfaces e Types**
```typescript
// ✅ CORRETO: PascalCase para interfaces
interface UserProfile { }
interface PostCardProps { }
type ComponentState = { };

// ❌ INCORRETO: camelCase ou snake_case
interface userProfile { }
interface post_card_props { }
```

### **Generics**
```typescript
// ✅ CORRETO: Nomes descritivos para generics
interface ApiResponse<TData> {
  data: TData;
  success: boolean;
}

interface Repository<TEntity, TKey> {
  findById(id: TKey): Promise<TEntity | null>;
}

// ❌ INCORRETO: Single letters não descritivas
interface ApiResponse<T> { }
```

### **Props Interfaces**
```typescript
// ✅ CORRETO: Sufixo Props
interface PostCardProps {
  post: Post;
  onLike?: () => void;
  className?: string;
}

// ✅ CORRETO: Event handlers tipados
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  onChange: (field: string, value: string) => void;
}
```

---

## ⚛️ **Component Patterns**

### **Functional Components**
```typescript
// ✅ CORRETO: Interface de props definida
interface PostCardProps {
  post: Post;
  className?: string;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  className,
  onLike 
}) => {
  return (
    <div className={className}>
      <h2>{post.title}</h2>
      {onLike && (
        <button onClick={onLike}>
          Like ({post.likes})
        </button>
      )}
    </div>
  );
};
```

### **Event Handlers**
```typescript
// ✅ CORRETO: Event types específicos
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Clicked:', e.currentTarget);
};
```

### **Hooks Customizados**
```typescript
// ✅ CORRETO: Return type tipado
interface UseAboutDataReturn {
  data: AboutData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useAboutData = (): UseAboutDataReturn => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Implementation...

  return { data, loading, error, refetch };
};
```

---

## 🌐 **API Development**

### **Next.js API Routes**
```typescript
// ✅ CORRETO: Tipos Next.js específicos
import type { NextApiRequest, NextApiResponse } from 'next';

interface PostsAPIResponse {
  success: boolean;
  data?: Post[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsAPIResponse>
) {
  if (req.method === 'GET') {
    try {
      const posts = await Post.find({});
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch posts' 
      });
    }
  } else {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }
}
```

### **Request Body Validation**
```typescript
// ✅ CORRETO: Validação de tipos
interface CreatePostBody {
  title: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
}

const isValidCreatePostBody = (body: any): body is CreatePostBody => {
  return (
    typeof body.title === 'string' &&
    typeof body.content === 'string' &&
    typeof body.author === 'string' &&
    typeof body.category === 'string'
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isValidCreatePostBody(req.body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  // Now req.body is typed as CreatePostBody
  const { title, content, author, category } = req.body;
}
```

---

## 🚨 **Error Handling**

### **Error Types**
```typescript
// ✅ CORRETO: Error classes específicas
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(
    message: string,
    public operation: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### **Result Pattern**
```typescript
// ✅ CORRETO: Result pattern para error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

const fetchUser = async (id: string): Promise<Result<User>> => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { 
        success: false, 
        error: new Error('User not found') 
      };
    }
    return { success: true, data: user };
  } catch (error) {
    return { 
      success: false, 
      error: error as Error 
    };
  }
};
```

### **Error Boundaries**
```typescript
// ✅ CORRETO: Error boundary tipado
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Implementation...
}
```

---

## 🧪 **Testing Strategies**

### **Component Testing**
```typescript
// ✅ CORRETO: Props mockadas tipadas
describe('PostCard Component', () => {
  const mockPost: Post = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Post',
    content: 'Test content',
    author: 'Test Author',
    category: 'Test',
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  it('should render post information', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.author)).toBeInTheDocument();
  });
});
```

### **API Testing**
```typescript
// ✅ CORRETO: Tipos para mocks de API
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

interface MockRequest extends NextApiRequest {
  body: CreatePostBody;
}

describe('/api/posts', () => {
  it('should create post with valid data', async () => {
    const { req, res } = createMocks<MockRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'Test Post',
        content: 'Test content',
        author: 'Test Author',
        category: 'Test',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });
});
```

---

## ⚡ **Performance**

### **Lazy Loading com Tipos**
```typescript
// ✅ CORRETO: Dynamic imports tipados
const DynamicCreatePost = dynamic(
  () => import('@/components/CreatePost'),
  { 
    loading: () => <CircularProgress />,
    ssr: false 
  }
) as React.ComponentType<{}>;

// ✅ CORRETO: Lazy loading com props
const DynamicPostEditor = dynamic(
  () => import('@/components/PostEditor'),
  { ssr: false }
) as React.ComponentType<PostEditorProps>;
```

### **Memoization**
```typescript
// ✅ CORRETO: useMemo tipado
const expensiveCalculation = useMemo((): ProcessedData => {
  return processLargeDataset(rawData);
}, [rawData]);

// ✅ CORRETO: useCallback tipado
const handleSubmit = useCallback(
  (data: FormData) => {
    onSubmit(data);
  },
  [onSubmit]
);
```

---

## 📚 **Utility Types**

### **Tipos Derivados**
```typescript
// ✅ CORRETO: Uso de utility types
type CreatePostData = Omit<Post, '_id' | 'createdAt' | 'likes' | 'comments'>;
type UpdatePostData = Partial<CreatePostData> & { _id: string };
type PostSummary = Pick<Post, '_id' | 'title' | 'author' | 'createdAt'>;

// ✅ CORRETO: Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResult<T> = T extends { success: true } ? T['data'] : never;
```

### **Mapped Types**
```typescript
// ✅ CORRETO: Mapped types para forms
type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

type ContactFormErrors = FormErrors<ContactForm>;
// Result: { name?: string; email?: string; message?: string; }
```

---

## 📖 **Documentation**

### **JSDoc com TypeScript**
```typescript
/**
 * Busca posts com filtros aplicados
 * @param filters - Filtros para busca
 * @param options - Opções de paginação
 * @returns Promise com resultados paginados
 * @throws {ValidationError} Quando filtros são inválidos
 * @example
 * ```typescript
 * const results = await searchPosts(
 *   { category: 'tech' },
 *   { page: 1, limit: 10 }
 * );
 * ```
 */
async function searchPosts(
  filters: PostFilters,
  options: PaginationOptions
): Promise<PaginatedResult<Post>> {
  // Implementation...
}
```

---

## ✅ **Checklist de Code Review**

### **Antes de Commit**
- [ ] **Type safety**: Todos os tipos estão definidos?
- [ ] **No any**: Evitamos uso de `any`?
- [ ] **Null safety**: Verificações de null/undefined?
- [ ] **Error handling**: Erros tratados adequadamente?
- [ ] **Testing**: Testes cobrem cenários principais?
- [ ] **Performance**: Memoization onde necessário?
- [ ] **Documentation**: JSDoc para funções complexas?

### **Durante Code Review**
- [ ] **Interface design**: Interfaces bem estruturadas?
- [ ] **Naming**: Nomes descritivos e consistentes?
- [ ] **Reusability**: Tipos reutilizáveis extraídos?
- [ ] **Complexity**: Tipos não são excessivamente complexos?
- [ ] **Standards**: Segue padrões do projeto?

---

**🎯 Este documento deve ser referência para todos os desenvolvedores do projeto BlogNews!**

*Mantido e atualizado pela equipe de desenvolvimento*