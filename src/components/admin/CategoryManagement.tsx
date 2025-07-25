// src/components/admin/CategoryManagement.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useCategories } from '@/hooks/useCategories';
import { ICategory } from '@/models/Category';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const CategoryManagement: React.FC = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch
  } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#1976d2',
    icon: 'Category',
    order: 0,
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenDialog = (category?: ICategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
        icon: 'Category',
        order: 0,
        isActive: true
      });
    }
    setFormError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormError(null);
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError('Nome da categoria é obrigatório');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory._id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success) {
        handleCloseDialog();
        refetch();
      } else {
        setFormError(result.error || 'Erro ao salvar categoria');
      }
    } catch (error) {
      setFormError('Erro inesperado');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (category: ICategory) => {
    if (category.isDefault) {
      alert('Categoria padrão não pode ser deletada');
      return;
    }

    if (category.postCount > 0) {
      alert(`Esta categoria possui ${category.postCount} posts associados e não pode ser deletada`);
      return;
    }

    if (confirm(`Tem certeza que deseja deletar a categoria "${category.name}"?`)) {
      const result = await deleteCategory(category._id);
      if (result.success) {
        refetch();
      } else {
        alert(result.error || 'Erro ao deletar categoria');
      }
    }
  };

  const handleToggleActive = async (category: ICategory) => {
    if (category.isDefault && category.isActive) {
      alert('Categoria padrão não pode ser desativada');
      return;
    }

    const result = await updateCategory(category._id, {
      isActive: !category.isActive
    });
    
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Erro ao atualizar categoria');
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gerenciar Categorias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Categoria
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Posts</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ordem</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        bgcolor: category.color,
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}
                    >
                      {category.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {category.name}
                        {category.isDefault && (
                          <Tooltip title="Categoria padrão">
                            <StarIcon sx={{ ml: 0.5, fontSize: 16, color: 'gold' }} />
                          </Tooltip>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.slug}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.postCount}
                    size="small"
                    color={category.postCount > 0 ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Ativa' : 'Inativa'}
                    size="small"
                    color={category.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{category.order}</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleToggleActive(category)}
                    disabled={category.isDefault && category.isActive}
                  >
                    {category.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(category)}
                    disabled={category.isDefault || category.postCount > 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Criação/Edição */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={formLoading}
          />
          
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={formLoading}
          />
          
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Cor"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              disabled={formLoading}
              sx={{ width: 100 }}
            />
            
            <TextField
              label="Ícone"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              disabled={formLoading}
              placeholder="Category"
            />
            
            <TextField
              label="Ordem"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              disabled={formLoading}
              sx={{ width: 100 }}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={formLoading}
              />
            }
            label="Categoria ativa"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
