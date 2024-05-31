// src/pages/api/search.js
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await dbConnect();

  const { q } = req.query;

  if (!q) {
    res.status(200).json({ results: [] });
    return;
  }

  try {
    const searchQuery = new RegExp(q, 'i'); // 'i' para pesquisa case-insensitive
    const results = await Post.find({
      $or: [
        { title: searchQuery },
        { content: searchQuery }
      ]
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};