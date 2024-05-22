'use client';

import { useState } from 'react';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author }),
      });

      if (res.ok) {
        setMessage('Postagem criada com sucesso!');
        setTitle('');
        setContent('');
        setAuthor('');
      } else {
        const errorData = await res.json();
        setMessage(`Erro ao criar a postagem: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Erro ao criar a postagem.');
    }
  };

  return (
    <div>
      <h1>Página de Administração</h1>
      <form onSubmit={handleSubmit}>
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
