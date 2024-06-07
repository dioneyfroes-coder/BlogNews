// src/pages/EditPost.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

const EditPost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();
        setPost(data.data);
        setTitle(data.data.title);
        setContent(data.data.content);
        setAuthor(data.data.author);
        setCategory(data.data.category);
        setImageUrl(data.data.imageUrl || '');
      } catch (error) {
        console.error('Erro ao carregar o post:', error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
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
      console.error('Erro ao editar a postagem:', error.message);
    }
  };

  if (!post) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Editar Post</h1>
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
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditPost;
