# 🎨 **BlogNews - Material Design Blog Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.0-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

**Uma plataforma de blog moderna e responsiva construída com Next.js 15 e Material Design autêntico do Google.**

## ✨ **Características Principais**

### 🎨 **Design e UX**
- **Material Design 3.0** autêntico seguindo diretrizes Google
- **Modo escuro/claro** com persistência automática
- **Responsividade total** com breakpoints Material-UI
- **Tipografia Roboto** oficial via Google Fonts
- **Navegação móvel nativa** com Drawer Material
- **Animações suaves** e transições profissionais

### 🚀 **Tecnologias**
- **Next.js 15** com App Router e Server Components
- **TypeScript** para type safety completo
- **Material-UI (MUI)** como sistema de design único
- **MongoDB** com Mongoose para persistência
- **NextAuth.js** para autenticação
- **React Toastify** integrado com Material Design

### 📱 **Funcionalidades**
- **Sistema de Posts** completo (CRUD)
- **Categorias dinâmicas** com filtros
- **Sistema de comentários** e likes
- **Upload de imagens** com otimização
- **Busca avançada** por conteúdo e categoria
- **Newsletter** com gestão de assinantes
- **Painel administrativo** completo
- **SEO otimizado** com meta tags dinâmicas

---

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### **1. Clone e Instale**
```bash
git clone https://github.com/dioneyfroes-coder/BlogNews.git
cd BlogNews
npm install
```

### **2. Configure Ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/blognews
# ou MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/blognews

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **3. Execute**
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

Acesse: **http://localhost:3000**

---

## 🏗️ **Arquitetura**

### **📁 Estrutura do Projeto**
```
src/
├── app/                          # App Router (Next.js 15)
│   ├── api/                      # API Routes
│   ├── admin/                    # Painel administrativo
│   └── posts/[id]/               # Páginas dinâmicas
├── components/
│   ├── Navigation/               # Componentes de navegação
│   ├── Common/                   # Componentes reutilizáveis
│   └── ...                      # Componentes específicos
├── lib/
│   ├── theme/                    # Tema Material Design
│   ├── api/                      # Utilitários de API
│   └── utils/                    # Utilitários gerais
├── providers/                    # Context Providers
├── models/                       # Modelos MongoDB
├── types/                        # Definições TypeScript
└── styles/                       # CSS mínimo
```

### **🎨 Sistema de Design**
- **Tema centralizado** em `src/lib/theme/materialTheme.ts`
- **Cores Material Design 3.0** oficiais
- **Componentes customizados** seguindo diretrizes Google
- **Zero CSS modules** - 100% Material-UI
- **Responsividade automática** com breakpoints padrão

---

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção  
npm run start            # Servidor de produção
npm run lint             # ESLint
npm run type-check       # Verificação TypeScript

# Database
npm run db:seed          # Popular banco com dados de exemplo
npm run db:reset         # Reset completo do banco
```

---

## 📱 **Funcionalidades Detalhadas**

### **🔐 Autenticação**
- Login/logout com NextAuth.js
- Gestão de sessões segura
- Proteção de rotas administrativas

### **📝 Sistema de Posts**
- Editor rico com validação
- Upload de imagens com otimização
- Categorias e tags dinâmicas
- Preview em tempo real
- SEO automático

### **💬 Interações**
- Sistema de comentários hierárquico
- Likes/dislikes em tempo real
- Moderação de comentários
- Notificações Material

### **🔍 Busca e Filtros**
- Busca full-text MongoDB
- Filtros por categoria
- Filtros por data
- Resultados paginados

### **📊 Painel Admin**
- Dashboard com estatísticas
- Gestão completa de posts
- Moderação de comentários
- Gestão de usuários
- Analytics de newsletter

---

## 🌐 **Deploy**

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no dashboard
```

### **Docker**
```bash
# Build
docker build -t blognews .

# Run
docker run -p 3000:3000 blognews
```

### **Manual**
```bash
npm run build
npm start
```

---

## 🤝 **Contribuição**

1. **Fork** o projeto
2. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
3. **Commit** suas mudanças: `git commit -m 'Add nova funcionalidade'`
4. **Push** para a branch: `git push origin feature/nova-funcionalidade`
5. **Abra** um Pull Request

### **📋 Guidelines**
- Siga o padrão Material Design
- Use TypeScript para type safety
- Escreva testes para novas funcionalidades
- Mantenha commits semânticos
- Documente mudanças importantes

---

## 📄 **Licença**

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 **Autor**

**Dioney Froes Januario**
- GitHub: [@dioneyfroes-coder](https://github.com/dioneyfroes-coder)
- LinkedIn: [dioneyfroes](https://linkedin.com/in/dioneyfroes)
- Email: dioneyfroes@gmail.com

---

## 🙏 **Agradecimentos**

- [Next.js](https://nextjs.org/) pela incrível framework
- [Material-UI](https://mui.com/) pelo sistema de design
- [MongoDB](https://mongodb.com/) pela flexibilidade
- [Vercel](https://vercel.com/) pela plataforma de deploy

---

**⭐ Se este projeto te ajudou, considere dar uma estrela!**
