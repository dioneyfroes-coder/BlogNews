import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !['admin', 'editor', 'redator'].includes(token.role)) {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { title, content, author } = req.body;
        const post = new Post({ title, content, author });
        await post.save();
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, title, content, author } = req.body;
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false, error: 'Post não encontrado' });
        }
        post.title = title;
        post.content = content;
        post.author = author;
        await post.save();
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;  // Mudar para `req.query` ao invés de `req.body`
        if (!id) {
          return res.status(400).json({ success: false, error: 'ID do post é necessário' });
        }

        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false, error: 'Post não encontrado' });
        }
        await post.deleteOne();  // Usar deleteOne em vez de remove
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Método não permitido' });
      break;
  }
};
