// src/pages/api/grouped-posts.js
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Buscar todos os posts publicados
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    // Agrupar posts por data
    const groupedPosts: { [date: string]: typeof posts } = {};
    
    posts.forEach(post => {
      const date = new Date(post.createdAt).toISOString().split('T')[0];
      if (!groupedPosts[date]) {
        groupedPosts[date] = [];
      }
      groupedPosts[date].push(post);
    });

    res.status(200).json({
      success: true,
      data: groupedPosts,
      total: posts.length
    });

  } catch (error) {
    console.error('Erro ao buscar posts agrupados:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
