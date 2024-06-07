import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    const apiKey = process.env.IMGBB_API_KEY;

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload`, null, {
        params: {
          key: apiKey,
          image: url,
        },
      });

      if (response.data && response.data.data && response.data.data.url) {
        return res.status(200).json({ imageUrl: response.data.data.url });
      } else {
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
