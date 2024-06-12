import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getToken } from 'next-auth/jwt';
import sanitizeHtml from 'sanitize-html';
import { handleNewPost } from '@/utils/handleNewPost';
import addToQueue from '@/lib/emailQueue';
import rateLimit from '@/lib/rateLimit';

export default async function handler(req, res) {
  await rateLimit(req, res, () => {});
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !['admin', 'editor', 'redator'].includes(token.role)) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  const sanitizeInput = (input) => {
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
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false, error: `Erro ao buscar posts: ${error.message}` });
      }
      break;

    case 'POST':
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
      } catch (error) {
        res.status(400).json({ success: false, error: `Erro ao criar o post: ${error.message}` });
      }
      break;

    case 'PUT':
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
      } catch (error) {
        res.status(400).json({ success: false, error: `Erro ao editar o post: ${error.message}` });
      }
      break;

    case 'DELETE':
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
      } catch (error) {
        res.status(400).json({ success: false, error: `Erro ao deletar o post: ${error.message}` });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Método não permitido' });
      break;
  }
}
