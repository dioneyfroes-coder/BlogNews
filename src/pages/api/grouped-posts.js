// src/pages/api/grouped-posts.js

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { groupPostsByDate } from '@/utils/groupPostsByDate';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const posts = await Post.find({});
        const groupedPosts = groupPostsByDate(posts);
        res.status(200).json({ success: true, data: groupedPosts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Método não permitido' });
      break;
  }
}
