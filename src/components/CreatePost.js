"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
    <div>
      <h1>Criar Post</h1>
      <form onSubmit={handleCreate}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Conteúdo</label>
          <ReactQuill
            value={content}
            onChange={(value) => setContent(value)}
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, 
                 {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']                                         
              ],
            }}
            formats={[
              'header', 'font', 'size',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet', 'indent',
              'link', 'image', 'video'
            ]}
            placeholder="Escreva o conteúdo aqui..."
          />
        </div>
        <div>
          <label>Autor</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button type="submit">Criar Postagem</button>
      </form>
    </div>
  );
};

export default CreatePost;
