import dbConnect from '@/lib/mongodb';
import About from '@/models/About';
import sanitizeHtml from 'sanitize-html';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const about = await About.findOne({});
      res.status(200).json({ success: true, data: about });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    const {
      title = '',
      text = '',
      imageURL = '',
      phone = '',
      whatsapp = '',
      address = '',
      email = '',
      socialLinks = [],
    } = req.body;

    const sanitizedText = sanitizeHtml(text);

    const newData = {
      title,
      text: sanitizedText,
      imageURL,
      phone,
      whatsapp,
      address,
      email,
      socialLinks: socialLinks.map(link => (typeof link === 'string' ? link.trim() : '')), // Verifica se é string antes de aplicar trim
    };

    try {
      if (req.method === 'POST') {
        const result = await About.create(newData);
        res.status(201).json({ success: true, data: result });
      } else if (req.method === 'PUT') {
        const result = await About.findOneAndUpdate({}, newData, { new: true, upsert: true });
        res.status(200).json({ success: true, data: result });
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      res.status(500).json({ success: false, message: 'Failed to save data' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
