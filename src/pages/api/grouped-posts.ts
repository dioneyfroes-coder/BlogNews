// src/pages/api/grouped-posts.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { groupPostsByDate } from '@/utils/groupPostsByDate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const posts = await Post.find({});
        const groupedPosts = groupPostsByDate(posts);
        res.status(200).json({ success: true, data: groupedPosts });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Método não permitido' });
      break;
  }
}
