"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  if (status === 'unauthenticated' || !['admin', 'editor', 'redator'].includes(session.user.role)) {
    toast.error('Access denied');
    router.push('/');
    return null;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Adiciona o token de autenticação ao cabeçalho
          'Authorization': `Bearer ${session.user.id}`,
        },
        body: JSON.stringify({ title, content, author }),
      });

      if (res.ok) {
        toast.success('Postagem criada com sucesso!');
        router.push('/admin');
      } else {
        const errorData = await res.json();
        toast.error(`Erro ao criar a postagem: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar a postagem.');
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <div>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Conteúdo</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label>Autor</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <button type="submit">Criar Postagem</button>
    </form>
  );
};

export default CreatePost;
