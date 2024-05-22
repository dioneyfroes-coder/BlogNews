import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { title, content, author } = req.body;
      const post = new Post({ title, content, author });
      await post.save();
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
