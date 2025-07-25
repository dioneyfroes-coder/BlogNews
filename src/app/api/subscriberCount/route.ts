// src/app/api/subscriberCount/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

/**
 * API para contar subscribers
 * GET /api/subscriberCount - Retorna número total de subscribers
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const count = await Subscriber.countDocuments({});
    
    console.log(`Total de subscribers: ${count}`);
    
    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Erro ao contar subscribers:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao contar subscribers',
      count: 0
    }, { status: 500 });
  }
}
