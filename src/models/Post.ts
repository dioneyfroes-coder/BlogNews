// src/models/Post.js

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  published: { type: Boolean, default: true }, // Campo para controlar se o post está publicado
  views: { type: Number, default: 0 }, // Campo para contagem de visualizações
  tags: { type: [String], default: [] }, // Campo para tags do post
  excerpt: { type: String, default: '' }, // Campo para resumo do post
  comments: [
    {
      author: String,
      content: String,
      date: { type: Date, default: Date.now }
    }
  ],
  category: { type: String, default: 'Sem Categoria', required: false }, // Campo de categoria
  imageUrl: { type: String, default: '' }, // Campo opcional para a URL da imagem
}, { timestamps: true });

// Adiciona um índice de texto para os campos `title`, `content` e `category`
PostSchema.index({ title: 'text', content: 'text', category: 'text' });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
