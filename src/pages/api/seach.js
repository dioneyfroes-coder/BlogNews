// pages/api/search.js
import { connectToDatabase } from '../../lib/mongodb';

export default async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const { db } = await connectToDatabase();
  const results = await db
    .collection('posts')
    .find({ $text: { $search: q } })
    .project({ title: 1, excerpt: 1 }) // Assuming you have a 'title' and 'excerpt' field
    .toArray();

  res.status(200).json({ results });
};
