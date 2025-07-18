// src/pages/api/search.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import rateLimiter from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await rateLimiter(req, res, async () => {
        await dbConnect();

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Método não permitido' });
        }

        const { query: { q } } = req;
        
        if (!q) {
            return res.status(400).json({ error: 'Parametro de Query é requerido.' });
        }

        // Converter array para string se necessário
        const searchQuery = Array.isArray(q) ? q[0] : q;

        try {
            const posts = await Post.find({ $text: { $search: searchQuery } });
            res.status(200).json({ success: true, data: posts });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Um erro ocorreu enquanto procurávamos os posts' });
        }
    });
}
