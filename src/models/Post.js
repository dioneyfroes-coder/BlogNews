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
  ],
}, { timestamps: true });

// Adiciona um índice de texto para os campos `title` e `content`
PostSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
