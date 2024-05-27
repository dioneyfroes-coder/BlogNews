// pages/api/posts/[id]/comment.js
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { author, content } = req.body;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      post.comments.push({ author, content });
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
