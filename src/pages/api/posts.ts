// src/pages/api/posts.ts
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getToken } from 'next-auth/jwt';
import sanitizeHtml from 'sanitize-html';
import { handleNewPost } from '@/utils/handleNewPost';
import rateLimiter from '@/lib/rateLimit';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const sanitizeInput = (input: string) => {
    return sanitizeHtml(input, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'div', 'pre', 'ul', 'ol', 'li', 'a', 'b', 'i', 'u', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt'],
        a: ['href'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
      },
      allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be'],
    });
  };

  switch (req.method) {
    case 'GET':
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
      } catch (error: any) {
        res.status(400).json({ success: false, error: `Erro ao buscar posts: ${error.message}` });
      }
      break;

    case 'POST':
      // Para operações de escrita, verificar autenticação
      const tokenPost = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!tokenPost || !['admin', 'editor', 'redator'].includes((tokenPost as any).role)) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      await rateLimiter(req, res, async () => {
        try {
          const { title, content, author, category, imageUrl } = req.body;
          if (!category) {
            return res.status(400).json({ success: false, error: 'A categoria é obrigatória' });
          }
          const sanitizedTitle = sanitizeInput(title);
          const sanitizedContent = sanitizeInput(content);
          const sanitizedAuthor = sanitizeInput(author);
          const sanitizedCategory = sanitizeInput(category);

          const post = new Post({ title: sanitizedTitle, content: sanitizedContent, author: sanitizedAuthor, category: sanitizedCategory, imageUrl });
          await post.save();
          await handleNewPost(post);

          res.status(201).json({ success: true, data: post });
        } catch (error: any) {
          res.status(400).json({ success: false, error: `Erro ao criar o post: ${error.message}` });
        }
      });
      break;

    case 'PUT':
      // Para operações de escrita, verificar autenticação
      const tokenPut = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!tokenPut || !['admin', 'editor', 'redator'].includes((tokenPut as any).role)) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }
      await rateLimiter(req, res, async () => {
        try {
          const { id, title, content, author, category, imageUrl } = req.body;
          if (!category) {
            return res.status(400).json({ success: false, error: 'A categoria é obrigatória' });
          }
          const post = await Post.findById(id);
          if (!post) {
            return res.status(404).json({ success: false, error: 'Post não encontrado' });
          }
          post.title = sanitizeInput(title);
          post.content = sanitizeInput(content);
          post.author = sanitizeInput(author);
          post.category = sanitizeInput(category);
          post.imageUrl = imageUrl;
          await post.save();
          res.status(200).json({ success: true, data: post });
        } catch (error: any) {
          res.status(400).json({ success: false, error: `Erro ao editar o post: ${error.message}` });
        }
      });
      break;

    case 'DELETE':
      // Para operações de escrita, verificar autenticação
      const tokenDelete = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!tokenDelete || !['admin', 'editor', 'redator'].includes((tokenDelete as any).role)) {
        return res.status(401).json({ success: false, error: 'Não autorizado' });
      }

      await rateLimiter(req, res, async () => {
        try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ success: false, error: 'ID do post é necessário' });
          }

          const post = await Post.findById(id);
          if (!post) {
            return res.status(404).json({ success: false, error: 'Post não encontrado' });
          }
          await post.deleteOne();
          res.status(200).json({ success: true, data: {} });
        } catch (error: any) {
          res.status(400).json({ success: false, error: `Erro ao deletar o post: ${error.message}` });
        }
      });
      break;

    default:
      res.status(405).json({ success: false, error: 'Método não permitido' });
      break;
  }
};
