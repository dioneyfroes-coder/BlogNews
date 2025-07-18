import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ message: 'Conexão bem-sucedida com o MongoDB' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Falha na conexão com o MongoDB',
      error: errorMessage,
    });
  }
}