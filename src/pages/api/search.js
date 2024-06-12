// src/pages/api/search.js

import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import rateLimiter from '@/lib/rateLimit';

export default async function handler(req, res) {
    await rateLimiter(req, res, async () => {
        await dbConnect();

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Método não permitido' });
        }

        const { query: { q } } = req;
        
        if (!q) {
            return res.status(400).json({ error: 'Parametro de Query é requerido.' });
        }

        try {
            const posts = await Post.find({ $text: { $search: q } });
            res.status(200).json({ success: true, data: posts });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Um erro ocorreu enquanto procurávamos os posts' });
        }
    });
}
