// src/pages/CreatePost.js

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author,
          category,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      router.push(`/posts/${data.data._id}`);
    } catch (error) {
      console.error('Erro ao criar a postagem:', error.message);
    }
  };

  return (
    <div>
      <h1>Criar Novo Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Conteúdo</label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div>
          <label>Autor</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div>
          <label>Categoria</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>URL da Imagem para Miniatura</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <button type="submit">Criar Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
