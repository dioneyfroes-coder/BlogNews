"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  List as ListIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';

// Importação dinâmica dos componentes
const EditPost = dynamic(() => import('@/components/PostManagement/EditPost'), {
  loading: () => <CircularProgress />,
  ssr: false
});

const DeletePost = dynamic(() => import('@/components/PostManagement/DeletePost'), {
  loading: () => <CircularProgress />,
  ssr: false
});

const PostSelector = dynamic(() => import('@/components/PostSelector'), {
  loading: () => <CircularProgress />,
  ssr: false
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`post-management-tabpanel-${index}`}
      aria-labelledby={`post-management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `post-management-tab-${index}`,
    'aria-controls': `post-management-tabpanel-${index}`,
  };
}

const PostManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Erro ao buscar posts');
      }
      
      const data = await response.json();
      if (data.success) {
        setPosts(data.data || []);
      } else {
        throw new Error(data.message || 'Erro ao carregar posts');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedPostId(null); // Reset selection when changing tabs
  };

  const handlePostSelect = (event: any) => {
    setSelectedPostId(event.target.value);
  };

  const handlePostUpdated = () => {
    // Refresh posts list after update
    fetchPosts();
  };

  const handlePostDeleted = () => {
    // Refresh posts list after deletion and reset selection
    fetchPosts();
    setSelectedPostId(null);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Navegação por abas */}
      <Paper elevation={0} sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ListIcon />} 
            label="Listar Posts" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<EditIcon />} 
            label="Editar Post" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<DeleteIcon />} 
            label="Excluir Post" 
            {...a11yProps(2)} 
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das abas */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Lista de Posts
        </Typography>
        <PostSelector 
          posts={posts} 
          loading={loading} 
          handlePostSelect={handlePostSelect}
          selectedPostId={selectedPostId}
        />
        {selectedPostId && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Post selecionado. Use as abas "Editar" ou "Excluir" para fazer alterações.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Editar Post
        </Typography>
        {!selectedPostId ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Selecione um post para editar
            </Alert>
            <PostSelector 
              posts={posts} 
              loading={loading} 
              handlePostSelect={handlePostSelect}
              selectedPostId={selectedPostId}
            />
          </Box>
        ) : (
          <EditPost 
            postId={selectedPostId} 
            onPostUpdated={handlePostUpdated}
          />
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Excluir Post
        </Typography>
        {!selectedPostId ? (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Selecione um post para excluir
            </Alert>
            <PostSelector 
              posts={posts} 
              loading={loading} 
              handlePostSelect={handlePostSelect}
              selectedPostId={selectedPostId}
            />
          </Box>
        ) : (
          <DeletePost 
            postId={selectedPostId} 
            onPostDeleted={handlePostDeleted}
          />
        )}
      </TabPanel>
    </Box>
  );
};

export default PostManagement;
