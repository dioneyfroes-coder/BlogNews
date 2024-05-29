// pages/api/posts/[id]/comment.js
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Post.findById(id).select('comments');
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json({ comments: post.comments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
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
  } else if (req.method === 'DELETE') {
    try {
      const { commentId } = req.body;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      comment.content = 'Comentário apagado';
      await post.save();
      res.status(200).json({ message: 'Comment deleted', post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  }
};
