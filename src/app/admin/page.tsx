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
  SelectChangeEvent,
} from '@mui/material';
import dynamic from 'next/dynamic';
import NavigationBar from '@/components/NavigationBar';
import StatusPanel from '@/components/StatusPanel';
import styles from '@/styles/admin.module.css';

const DynamicCreatePost = dynamic(() => import('@/components/CreatePost'), { ssr: false });
const DynamicEditPost = dynamic(() => import('@/components/EditPost'), { ssr: false });
const DynamicDeletePost = dynamic(() => import('@/components/DeletePost'), { ssr: false });
const DynamicModerateComments = dynamic(() => import('@/components/ModerateComments'), { ssr: false });
const DynamicCategoryManager = dynamic(() => import('@/components/CategoryManager'), { ssr: false });
const DynamicPostSelector = dynamic(() => import('@/components/PostSelector'), { ssr: false });

const Admin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showModerateComments, setShowModerateComments] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    } else if (status === 'authenticated' && session?.user?.role && !['admin', 'editor', 'redator'].includes(session.user.role)) {
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
    setShowCategoryManager(false);
  };

  const handleEditClick = () => {
    setShowEditMenu(true);
    setShowCreateForm(false);
    setShowDeleteMenu(false);
    setShowModerateComments(false);
    setShowCategoryManager(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteMenu(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
    setShowModerateComments(false);
    setShowCategoryManager(false);
  };

  const handleModerateCommentsClick = () => {
    setShowModerateComments(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
    setShowDeleteMenu(false);
    setShowCategoryManager(false);
  };

  const handleManageCategoriesClick = () => {
    setShowCategoryManager(true);
    setShowCreateForm(false);
    setShowEditMenu(false);
    setShowDeleteMenu(false);
    setShowModerateComments(false);
  };

  const handlePostSelect = (event: SelectChangeEvent<string>) => {
    setSelectedPostId(event.target.value);
  };

  return (
    <Container className={styles.adminContainer}>
      <NavigationBar />
      <Typography variant="h3" className={styles.adminHeader}>
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
        <Button variant="contained" color="primary" onClick={handleManageCategoriesClick}>
          Gerenciar Categorias
        </Button>
      </div>
      {showCreateForm && <DynamicCreatePost />}
      {showEditMenu && (
        <div className={styles.sectionContainer}>
          <Typography variant="h4" className={styles.sectionHeader}>
            Selecionar Post para Editar
          </Typography>
          <DynamicPostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <DynamicEditPost postId={selectedPostId} />}
        </div>
      )}
      {showDeleteMenu && (
        <div className={styles.sectionContainer}>
          <Typography variant="h4" className={styles.sectionHeader}>
            Selecionar Post para Excluir
          </Typography>
          <DynamicPostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <DynamicDeletePost postId={selectedPostId} />}
        </div>
      )}
      {showModerateComments && (
        <div className={styles.sectionContainer}>
          <Typography variant="h4" className={styles.sectionHeader}>
            Selecionar Post para Moderar Comentários
          </Typography>
          <DynamicPostSelector posts={posts} loading={loading} handlePostSelect={handlePostSelect} />
          {selectedPostId && <DynamicModerateComments postId={selectedPostId} />}
        </div>
      )}
      {showCategoryManager && (
        <div className={styles.sectionContainer}>
          <Typography variant="h4" className={styles.sectionHeader}>
            Gerenciar Categorias
          </Typography>
          <DynamicCategoryManager />
        </div>
      )}
      {loading && <CircularProgress />}
      <StatusPanel className={styles.statusPanel} />
    </Container>
  );
};

export default Admin;
