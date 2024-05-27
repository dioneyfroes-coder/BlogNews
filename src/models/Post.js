import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [
    {
      author: String,
      content: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
