"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';

// Importação dinâmica dos componentes para otimizar o carregamento
const CategoryManagement = dynamic(() => import('@/components/admin/CategoryManagement'), {
  loading: () => <CircularProgress />,
  ssr: false
});

const CreatePost = dynamic(() => import('@/components/PostManagement/CreatePost').then(mod => ({ default: mod.CreatePost })), {
  loading: () => <CircularProgress />,
  ssr: false
});

const PostManagement = dynamic(() => import('@/components/PostManagement'), {
  loading: () => <CircularProgress />,
  ssr: false
});

// Interface para as abas
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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

interface AdminContentProps {
  user: any;
}

const AdminContent: React.FC<AdminContentProps> = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho */}
      <Paper elevation={2} sx={{ mb: 3, p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Painel Administrativo
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Bem-vindo, {user?.username || 'Administrador'}
            </Typography>
          </Box>
          <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
      </Paper>

      {/* Navegação por Abas */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<CreateIcon />} 
            label="Criar Post" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<EditIcon />} 
            label="Gerenciar Posts" 
            {...a11yProps(2)} 
          />
          <Tab 
            icon={<CategoryIcon />} 
            label="Categorias" 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das Abas */}
      <Paper elevation={1}>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            Bem-vindo ao painel administrativo do BlogNews! Aqui você pode:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" paragraph>
              • Criar novos posts com editor avançado
            </Typography>
            <Typography variant="body2" paragraph>
              • Gerenciar posts existentes (editar, excluir)
            </Typography>
            <Typography variant="body2" paragraph>
              • Administrar categorias do blog
            </Typography>
            <Typography variant="body2" paragraph>
              • Moderar comentários (em desenvolvimento)
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            Use as abas acima para navegar entre as diferentes funcionalidades administrativas.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Criar Novo Post
          </Typography>
          <CreatePost />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Gerenciar Posts
          </Typography>
          <PostManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Gerenciar Categorias
          </Typography>
          <CategoryManagement />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminContent;
