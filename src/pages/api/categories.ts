// src/pages/api/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        // Garantir que existe categoria padrão
        await (Category as any).ensureDefaultCategory();
        
        // Buscar categorias ativas
        const categories = await (Category as any).getActiveCategories();
        
        res.status(200).json({
          success: true,
          data: categories
        });
      } catch (error: any) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      break;

    case 'POST':
      try {
        const { name, description, color, icon, order } = req.body;

        if (!name || !name.trim()) {
          return res.status(400).json({
            success: false,
            error: 'Nome da categoria é obrigatório'
          });
        }

        // Verificar se categoria já existe
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
        });

        if (existingCategory) {
          return res.status(409).json({
            success: false,
            error: 'Categoria já existe'
          });
        }

        const newCategory = await Category.create({
          name: name.trim(),
          description: description?.trim() || '',
          color: color || '#1976d2',
          icon: icon || 'Category',
          order: order || 0
        });

        res.status(201).json({
          success: true,
          data: newCategory
        });
      } catch (error: any) {
        console.error('Erro ao criar categoria:', error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            error: 'Dados inválidos',
            details: error.message
          });
        }

        res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      break;

    case 'PUT':
      try {
        const { id, name, description, color, icon, order, isActive } = req.body;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'ID da categoria é obrigatório'
          });
        }

        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Categoria não encontrada'
          });
        }

        // Não permitir desativar categoria padrão
        if (category.isDefault && isActive === false) {
          return res.status(400).json({
            success: false,
            error: 'Categoria padrão não pode ser desativada'
          });
        }

        // Verificar se novo nome já existe (exceto na categoria atual)
        if (name && name.trim() !== category.name) {
          const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            _id: { $ne: id }
          });

          if (existingCategory) {
            return res.status(409).json({
              success: false,
              error: 'Nome da categoria já existe'
            });
          }
        }

        // Atualizar campos
        if (name?.trim()) category.name = name.trim();
        if (description !== undefined) category.description = description?.trim() || '';
        if (color) category.color = color;
        if (icon) category.icon = icon;
        if (order !== undefined) category.order = order;
        if (isActive !== undefined) category.isActive = isActive;

        const updatedCategory = await category.save();

        res.status(200).json({
          success: true,
          data: updatedCategory
        });
      } catch (error: any) {
        console.error('Erro ao atualizar categoria:', error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            error: 'Dados inválidos',
            details: error.message
          });
        }

        res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'ID da categoria é obrigatório'
          });
        }

        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({
            success: false,
            error: 'Categoria não encontrada'
          });
        }

        // Não permitir deletar categoria padrão
        if (category.isDefault) {
          return res.status(400).json({
            success: false,
            error: 'Categoria padrão não pode ser deletada'
          });
        }

        // Verificar se categoria tem posts associados
        if (category.postCount > 0) {
          return res.status(400).json({
            success: false,
            error: 'Categoria possui posts associados e não pode ser deletada'
          });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
          success: true,
          message: 'Categoria deletada com sucesso'
        });
      } catch (error: any) {
        console.error('Erro ao deletar categoria:', error);
        res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        error: `Método ${method} não permitido`
      });
  }
}
