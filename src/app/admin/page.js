"use client";

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CreatePost from '@/components/CreatePost';
import EditPost from '@/components/EditPost';
import DeletePost from '@/components/DeletePost';
import PostSelector from '@/components/PostSelector';
import ModerateComments from '@/components/ModerateComments';
import styles from '../../styles/admin.module.css';
import NavigationBar from '@/components/NavigationBar';

const Admin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showModerateComments, setShowModerateComments] = useState(false);

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
    setShowModerateComments(false);
  };

  const handleEditClick = () => {
    setShowEditMenu(true);
    setShowCreateForm(false);
    setShowDeleteMenu(false);
    setShowModerateComments(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteMenu(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
    setShowModerateComments(false);
  };

  const handleModerateCommentsClick = () => {
    setShowModerateComments(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
    setShowDeleteMenu(false);
  };

  const handlePostSelect = (e) => {
    setSelectedPostId(e.target.value);
  };

  return (
    <Container className={styles.adminContainer}>
      <NavigationBar />
      <Typography variant="h1" className={styles.adminHeader}>
        Página de Administração
      </Typography>
      <div className={styles.buttonGroup}>
        <Button variant="contained" color="primary" onClick={handleCreateClick}>
          Criar Post
        </Button>
        <Button variant="contained" color="primary" onClick={handleEditClick}>
          Editar Post
        </Button>
        <Button variant="contained" color="primary" onClick={handleDeleteClick}>
          Excluir Post
        </Button>
        <Button variant="contained" color="primary" onClick={handleModerateCommentsClick}>
          Moderação de Comentários
        </Button>
      </div>
      {showCreateForm && <CreatePost />}
      {showEditMenu && (
        <div className={styles.sectionContainer}>
          <Typography variant="h2" className={styles.sectionHeader}>
            Selecionar Post para Editar
          </Typography>
          <PostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <EditPost postId={selectedPostId} />}
        </div>
      )}
      {showDeleteMenu && (
        <div className={styles.sectionContainer}>
          <Typography variant="h2" className={styles.sectionHeader}>
            Selecionar Post para Excluir
          </Typography>
          <PostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <DeletePost postId={selectedPostId} />}
        </div>
      )}
      {showModerateComments && (
        <div className={styles.sectionContainer}>
          <Typography variant="h2" className={styles.sectionHeader}>
            Selecionar Post para Moderar Comentários
          </Typography>
          <PostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <ModerateComments postId={selectedPostId} />}
        </div>
      )}
      {loading && <CircularProgress />}
    </Container>
  );
};

export default Admin;
