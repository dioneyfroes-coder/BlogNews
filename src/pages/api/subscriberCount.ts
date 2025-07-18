import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const count = await Subscriber.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Erro ao obter contagem de inscritos:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter contagem de inscritos' });
  }
}
