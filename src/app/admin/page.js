"use client";

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CreatePost from '@/components/CreatePost';
import EditPost from '@/components/EditPost';
import DeletePost from '@/components/DeletePost';
import PostSelector from '@/components/PostSelector';
import styles from './Admin.module.css';

const Admin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    } else if (status === 'authenticated' && !['admin', 'editor', 'redator'].includes(session.user.role)) {
      toast.error('Access denied');
      router.push('/');
    } else if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, session, router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      setPosts(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setShowEditMenu(false);
    setShowDeleteMenu(false);
  };

  const handleEditClick = () => {
    setShowEditMenu(true);
    setShowCreateForm(false);
    setShowDeleteMenu(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteMenu(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
  };

  const handlePostSelect = (e) => {
    setSelectedPostId(e.target.value);
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminHeader}>Página de Administração</h1>
      <div className={styles.buttonGroup}>
        <button onClick={handleCreateClick}>Criar Post</button>
        <button onClick={handleEditClick}>Editar Post</button>
        <button onClick={handleDeleteClick}>Excluir Post</button>
      </div>
      {showCreateForm && <CreatePost />}
      {showEditMenu && (
        <div>
          <h2>Selecionar Post para Editar</h2>
          <PostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <EditPost postId={selectedPostId} />}
        </div>
      )}
      {showDeleteMenu && (
        <div>
          <h2>Selecionar Post para Excluir</h2>
          <PostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <DeletePost postId={selectedPostId} />}
        </div>
      )}
    </div>
  );
};

export default Admin;
