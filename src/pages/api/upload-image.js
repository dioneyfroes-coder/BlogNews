export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    const apiKey = process.env.IMGBB_API_KEY;

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}&image=${url}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      if (data && data.data && data.data.url) {
        return res.status(200).json({ imageUrl: data.data.url });
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
