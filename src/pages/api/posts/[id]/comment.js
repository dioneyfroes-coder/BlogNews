import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post não encontrado' });
      }

      const { author, content } = req.body;
      const newComment = { author, content, date: new Date() };
      post.comments.push(newComment);
      await post.save();

      return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post não encontrado' });
      }

      return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { commentId } = req.body;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post não encontrado' });
      }

      const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Comentário não encontrado' });
      }

      post.comments.splice(commentIndex, 1);
      await post.save();

      return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
};
