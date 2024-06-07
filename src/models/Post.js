// src/models/Post.js

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
  category: { type: String, required: true }, // Campo de categoria
  imageUrl: { type: String, default: '' }, // Campo opcional para a URL da imagem
}, { timestamps: true });

// Adiciona um índice de texto para os campos `title`, `content` e `category`
PostSchema.index({ title: 'text', content: 'text', category: 'text' });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
