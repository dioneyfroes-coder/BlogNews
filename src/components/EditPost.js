"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const EditPost = ({ postId }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !['admin', 'editor', 'redator'].includes(session.user.role)) {
      toast.error('Access denied');
      router.push('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
          setTitle(data.data.title);
          setContent(data.data.content);
          setAuthor(data.data.author);
        } else {
          toast.error('Failed to load post');
          router.push('/admin');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load post');
        router.push('/admin');
        setLoading(false);
      }
    };

    fetchPost();
  }, [status, session, postId, router]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post._id, title, content, author }),
      });

      if (res.ok) {
        toast.success('Postagem editada com sucesso!');
        router.push('/admin');
      } else {
        const errorData = await res.json();
        toast.error(`Erro ao editar a postagem: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao editar a postagem.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleEdit}>
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
      <button type="submit">Editar Postagem</button>
    </form>
  );
};

export default EditPost;
