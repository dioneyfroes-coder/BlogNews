import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const post = await Post.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!post) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const deletedPost = await Post.deleteOne({ _id: id });
        if (!deletedPost) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
      break;
  }
};

export default handler;