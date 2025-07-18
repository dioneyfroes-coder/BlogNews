import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      post.likes += 1;
      await post.save();

      return res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
