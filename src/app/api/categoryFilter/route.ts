// src/app/api/categoryFilter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';

/**
 * Handler para filtrar posts por categoria
 * GET /api/categoryFilter - Filtra posts por categoria
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const categoryParam = searchParams.get('category');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!categoryParam) {
      return NextResponse.json({
        success: false,
        error: 'Parâmetro de categoria é obrigatório'
      }, { status: 400 });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Validar parâmetros
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return NextResponse.json({
        success: false,
        error: 'Parâmetros de paginação inválidos'
      }, { status: 400 });
    }

    try {
      // Conectar ao banco de dados
      await dbConnect();
      
      // Buscar categoria por nome ou slug
      let category = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${categoryParam}$`, 'i') } },
          { slug: categoryParam.toLowerCase() }
        ],
        isActive: true
      });

      // Se não encontrou categoria específica, buscar posts por regex (fallback)
      let filters: any = {
        published: true // Só posts publicados
      };

      if (category) {
        // Usar nome exato da categoria
        filters.category = category.name;
      } else {
        // Fallback: busca por regex como antes
        filters.category = { $regex: categoryParam, $options: 'i' };
      }
      
      // Buscar posts
      const total = await Post.countDocuments(filters);
      const skip = (pageNum - 1) * limitNum;
      
      const posts = await Post.find(filters)
        .sort({ createdAt: -1 }) // Mais recentes primeiro
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec();
      
      const totalPages = Math.ceil(total / limitNum);

      const response = {
        success: true,
        data: posts,
        pagination: {
          current: pageNum,
          total,
          pages: totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
          limit: limitNum
        },
        category: categoryParam,
        categoryData: category // Incluir dados da categoria se encontrada
      };

      console.log(`Filtro por categoria: "${categoryParam}" - ${total} resultados encontrados`);

      return NextResponse.json(response);
    } catch (error) {
      console.error('Erro ao filtrar posts por categoria:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao filtrar posts no banco de dados'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro na API de filtro por categoria:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
