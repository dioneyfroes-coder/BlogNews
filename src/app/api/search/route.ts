// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

/**
 * Handler para busca de posts
 * GET /api/search - Busca posts por palavra-chave
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const q = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!q.trim() || q.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Termo de busca deve ter pelo menos 2 caracteres'
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

    // Construir filtros de busca
    const filters: any = {
      published: true, // Só posts publicados
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { category: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    };

    try {
      // Conectar ao banco de dados
      await dbConnect();
      
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
        searchQuery: q
      };

      console.log(`Busca realizada: "${q}" - ${total} resultados encontrados`);

      return NextResponse.json(response);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar posts no banco de dados'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro na API de busca:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
