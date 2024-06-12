// src/app/page.js

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Home from '@/app/Home/page';

export const dynamic = 'force-dynamic'; // Para garantir renderização dinâmica

// Função utilitária para converter _id e datas para string
const convertDocument = (doc) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toISOString();
  doc.updatedAt = doc.updatedAt ? doc.updatedAt.toISOString() : null;
  if (doc.comments) {
    doc.comments.forEach(comment => {
      comment._id = comment._id.toString();
    });
  }
  return doc;
};

export default async function Page() {
  try {
    await dbConnect();

    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    const formattedPosts = posts.map(convertDocument);

    return <Home initialPosts={formattedPosts} />;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    // Aqui você pode renderizar uma mensagem de erro ou uma página de erro
    return <div>Falha ao carregar Posts. Por favor tente novamente.</div>;
  }
};
