import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
  await dbConnect();
  
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post não encontrado' });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método não permitido' });
  }
};
