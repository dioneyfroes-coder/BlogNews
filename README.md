# Projeto: Blog News

## Descrição
O Blog News é uma aplicação web construída com Next.js, React e MongoDB. Ele permite aos usuários visualizar, criar, editar e excluir postagens de blog. A aplicação também inclui autenticação de usuário com NextAuth.js e funcionalidades de administração para usuários autorizados.

## Recursos
- Visualizar postagens de blog na página inicial.
- Criar novas postagens de blog.
- Editar postagens existentes.
- Excluir postagens de blog.
- Autenticação de usuário com NextAuth.js.
- Funcionalidades de administração para usuários autorizados.

## Instruções de Instalação
1. Clone o repositório para sua máquina local.
2. Instale as dependências utilizando npm ou yarn: `npm install` ou `yarn install`.
3. Configure as variáveis de ambiente no arquivo `.env.local`.
4. Inicie o servidor de desenvolvimento com o comando `npm run dev` ou `yarn dev`.

## Estrutura do Projeto
- `app/`: Contém as páginas da aplicação.
- `components/`: Contém os componentes reutilizáveis da aplicação.
- `pages/`: Contém as rotas da API.
- `lib/`: Contém funções e utilitários.
- `models/`: Contém os modelos de dados MongoDB.

## Tecnologias Utilizadas
- Next.js
- React
- MongoDB
- NextAuth.js
- Material UI
- Toast

## Autor
dioney froes januario

## Licença: CC BY-NC (Creative Commons Atribuição-NãoComercial)
Este projeto está licenciado sob a Licença Creative Commons Atribuição-NãoComercial (CC BY-NC).
Isso significa que você tem permissão para usar, copiar, distribuir e modificar o projeto, desde que não o utilize para fins comerciais.
Para qualquer uso comercial do projeto, entre em contato com o autor para obter permissão.

## Histórico de Versões

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
- Introdução da função de envio de comentários por e-mail.
- Estilização das tags para uma melhor experiência de usuário.
- Adicionado suporte para formatação de texto nos posts usando Quill.

### Versão 1.1 (15 de Maio de 2024)
#### Alterações
- Implementação de um componente de balão de aviso para exclusão de posts.
- Melhoria da experiência do criador e editor de posts com a adição do editor Quill.
- Configuração da API para permitir a formatação de texto nos posts e a inclusão de vídeos do YouTube.
