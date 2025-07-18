// Tipos para dados do Post
export interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  imageURL?: string;
}

// Tipos para comentários
export interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: Date;
}

// Tipos para dados About
export interface AboutData {
  _id?: string;
  title: string;
  text: string;
  imageURL: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  socialLinks: string[];
}

// Tipos para user session
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'redator';
}

// Tipos para componentes React
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

// Tipos para errors de formulário
export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Tipos para Query de pesquisa
export interface SearchQuery {
  q?: string;
  category?: string;
}

// Tipos para Props de páginas
export interface PageProps {
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para Email
export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

// Tipos para Theme Context
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Tipos para posts agrupados por data
export interface GroupedPosts {
  [year: string]: {
    [month: string]: {
      [day: string]: Post[];
    };
  };
}
