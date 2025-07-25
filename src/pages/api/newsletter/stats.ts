// src/pages/api/newsletter/stats.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

/**
 * API para obter estatísticas da newsletter
 * GET /api/newsletter/stats
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método não permitido' 
    });
  }

  try {
    // Obter data de referência (30 dias atrás)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Obter data de referência (7 dias atrás)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Obter data de referência (60 dias atrás para calcular taxa de crescimento)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Consultas paralelas para otimizar performance
    const [
      totalSubscribers,
      weeklySubscribers,
      monthlySubscribers,
      subscribersLastMonth,
      recentUnsubscribes
    ] = await Promise.all([
      // Total de assinantes ativos
      Subscriber.countDocuments({ active: true }),
      
      // Novos assinantes na última semana
      Subscriber.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
        active: true
      }),
      
      // Novos assinantes no último mês
      Subscriber.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
        active: true
      }),
      
      // Assinantes há 30-60 dias atrás (para calcular crescimento)
      Subscriber.countDocuments({
        createdAt: { 
          $gte: sixtyDaysAgo,
          $lt: thirtyDaysAgo
        },
        active: true
      }),
      
      // Desinscrições recentes (última semana)
      Subscriber.countDocuments({
        active: false,
        updatedAt: { $gte: sevenDaysAgo }
      })
    ]);

    // Calcular taxa de crescimento
    const growthRate = subscribersLastMonth > 0 
      ? ((monthlySubscribers - subscribersLastMonth) / subscribersLastMonth) 
      : monthlySubscribers > 0 ? 1 : 0;

    // Calcular taxa de cancelamento
    const totalActiveLastWeek = totalSubscribers + recentUnsubscribes;
    const unsubscribeRate = totalActiveLastWeek > 0 
      ? recentUnsubscribes / totalActiveLastWeek 
      : 0;

    const stats = {
      totalSubscribers,
      weeklySubscribers,
      monthlySubscribers,
      unsubscribeRate: Number((unsubscribeRate * 100).toFixed(2)), // Em porcentagem
      growthRate: Number((growthRate * 100).toFixed(2)) // Em porcentagem
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas da newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
