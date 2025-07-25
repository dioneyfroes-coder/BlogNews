// src/app/api/posts/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

/**
 * GET /api/posts
 * Retorna todos os posts ordenados por data de criação (mais recentes primeiro)
 */
export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length
    });

  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Cria um novo post
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validações básicas
    if (!data.title || !data.content) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título e conteúdo são obrigatórios' 
        },
        { status: 400 }
      );
    }

    const post = new Post(data);
    await post.save();

    // Populate autor para retorno
    await post.populate('author', 'name email');

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
