# Projeto: Blog 

## Descrição
O Blog  é uma aplicação web construída com Next.js, React e MongoDB. Ele permite aos usuários autorizados visualizar, criar, editar e excluir postagens de blog. A aplicação também inclui autenticação de usuário com NextAuth.js e funcionalidades de administração para usuários autorizados.

[Veja a aplicação online](https://blog-two-sable-17.vercel.app/)

## Recursos
- Visualizar cards dos posts na página inicial e abri-los numa página própria.
- Criar novas postagens de blog.
- Editar postagens existentes.
- Excluir postagens de blog.
- Autenticação de usuário com NextAuth.js.
- Funcionalidades de administração para usuários autorizados.
- Curtir e comentar nas postagens.
- Filtro de postagens por categorias.
- Navegação de histórico de postagens por datas.
- Newsletter funcional.

## Instruções de Instalação
1. Clone o repositório para sua máquina local:
    ```bash
    git clone https://github.com/dioneyfroes-coder/BlogNews.git
    cd BlogNews
    ```
2. Instale as dependências utilizando npm ou yarn:
    ```bash
    npm install
    # ou
    yarn install
    ```
3. Configure as variáveis de ambiente no arquivo `.env.local`:
    ```plaintext
    NEXT_PUBLIC_API_URL=http://example.com/api
    NEXTAUTH_URL=http://localhost:3000
    DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blognews?retryWrites=true&w=majority
    NEXTAUTH_SECRET=your-secret-key
    ```

## Uso

### Rodando Localmente
Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev

## Estrutura do Projeto
- `app/`: Contém as páginas da aplicação.
- `components/`: Contém os componentes reutilizáveis da aplicação.
- `pages/`: Contém as rotas da API.
- `lib/`: Contém funções e utilitários.
- `models/`: Contém os modelos de dados MongoDB.
- `utils/`: Contém funções utilitárias reutilizáveis.
- `styles/`: Contém os arquivos de estilo global da aplicação.
- `middleware/`: Contém os middlewares da aplicação.
- `constants/`: Contém constantes usadas na aplicação.
- `contexts/`: Contém os contextos de estado global da aplicação.
- `hooks/`: Contém os hooks.

## Dependencias
    @emotion/react: 11.11.4
    @emotion/styled: 11.11.5
    @fontsource/roboto: 5.0.13
    @mui/icons-material: 5.15.18
    @mui/material: 5.15.19
    bcryptjs: 2.4.3
    bull: 4.12.9
    dompurify: 3.1.5
    dotenv: 16.4.5
    express-rate-limit: 7.3.1
    html-react-parser: 5.1.10
    mongoose: 8.4.0
    next: 14.2.3
    next-auth: 4.24.7
    nodemailer: 6.9.13
    quill: 2.0.2
    react: 18
    react-dom: 18
    react-quill: 2.0.0
    react-toastify: 10.0.5
    react-virtualized: 9.22.5
    react-window: 1.8.10
    sanitize-html: 2.13.0

## Contribuição

# Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

Faça um fork do repositório.
Crie uma branch para sua feature (git checkout -b feature/MinhaFeature).
Faça commit das suas alterações (git commit -m 'Adiciona minha feature').
Faça push para a branch (git push origin feature/MinhaFeature).
Abra um Pull Request.

## Autor
dioney froes januario

Licença: CC BY-NC-ND (Creative Commons Atribuição-NãoComercial-SemDerivações)

Este projeto está licenciado sob a Licença Creative Commons Atribuição-NãoComercial-SemDerivações (CC BY-NC-ND). Isso significa que você tem permissão para usar**, copiar e distribuir o projeto para fins não comerciais, desde que o material seja passado adiante sem modificações e em formato integral, e que o crédito seja dado a você. Não é permitido o uso comercial deste projeto sem a permissão expressa do autor. Para qualquer uso comercial ou para postar este projeto na internet para uso pessoal ou comercial, entre em contato com o autor para negociações e obtenção de permissão.

"Usar o projeto", se refere a qualquer interação com o conteúdo do projeto que vai além da simples visualização. Isso pode incluir, mas não se limita a:

Estudar: Isso envolve ler, aprender e entender o projeto. Pode incluir a análise do código, estrutura, conteúdo, etc.
Copiar: Isso envolve fazer uma cópia exata do projeto.
Distribuir: Isso envolve compartilhar o projeto com outras pessoas.
Modificar: Isso envolve fazer alterações no projeto, como adicionar novas funcionalidades, corrigir erros, melhorar o design, etc.

Qualquer uso comercial ou postagem deste projeto na internet para uso pessoal ou comercial requer a permissão expressa do autor.

## Histórico de Versões

### Versão 1.7 (10 de Junho de 2024)
#### Alterações
- Correções de erros e melhorias gerais no código.
- Implementação de Rate Limiting para melhorar a segurança e desempenho da API.
- Melhorias no sistema de fila para envio de emails.
- Atualização de dependências e remoção de opções de conexão MongoDB depreciadas.
- Correção de aviso de imagem no Next.js e ajuste de prioridade de carregamento para LCP.
- Sanitização de HTML usando a biblioteca DOMPurify.
- Função sanitizeAndFixHtml para sanitizar, corrigir o HTML renderizado e para corrigir parágrafos aninhados, prevenindo o erro de hidratação no React.
- Biblioteca html-react-parser para renderizar HTML sanitizado de forma segura.
- Implementação de um componente Editor para edição de texto usando Quill.
- Desenvolvimento de um componente SocialLinks para exibir e editar links de redes sociais.
- Adição de lógica para exibir diferentes layouts dependendo do modo de visualização (leitura ou edição) e do status de autenticação do usuário.
- Ajustes de layout e estilo para tornar toda a aplicação responsiva e esteticamente agradável em diferentes tamanhos de tela.

### Versão 1.6 (7 de Junho de 2024)
#### Alterações
- Correções na criação e edição de posts para permitir a inserção de imagens corretamente.
- Implementação de sistema de fila para envio de emails, limitando o número de conexões simultâneas.
- Refatoração do código para melhorar a organização e manutenção.

### Versão 1.5 (5 de Junho de 2024)
#### Alterações
- Nova página inicial com exibição de cards de miniaturas dos posts.
- Página de resultados de busca reformulada para exibir cards de miniaturas dos posts.
- Adição de filtro de postagens por categorias.
- Implementação de navegação de histórico de postagens por datas.
- Correção de bugs que impediam a atualização de likes e comentários dos posts.
- Reestruturação do projeto para separar responsabilidades do frontend e backend.
- Newsletter totalmente funcional.

### Versão 1.4 (30 de Maio de 2024)
#### Alterações
- Inserida função administrativa de moderação de comentários (apagar).
- Uniformização total do visual para Material UI em todas as páginas do projeto.
- Inserida função de procurar/search, funcional e com páginas de resultados.
- Inserida função dark mode/light mode.

### Versão 1.3 (27 de Maio de 2024)
#### Alterações
- Atualização do componente Home para lidar com likes e comentários de forma dinâmica.
- Correção de erros relacionados à renderização de posts e comentários.
- Adição de verificação para a existência de `comments` antes de iterar sobre eles.

### Versão 1.2 (20 de Maio de 2024)
#### Alterações
- Introdução da função de envio de e-mail do usuário para os administradores dentro do blog.
- Estilização das tags para uma melhor experiência de usuário.
- Adicionado suporte para formatação de texto nos posts usando Quill.

### Versão 1.1 (15 de Maio de 2024)
#### Alterações
- Implementação de um componente de balão de aviso para exclusão de posts.
- Melhoria da experiência do criador e editor de posts com a adição do editor Quill.
- Configuração da API para permitir a formatação de texto nos posts e a inclusão de vídeos do YouTube.
