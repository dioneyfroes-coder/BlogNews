// src/pages/api/subscribe.ts

import mongoose from 'mongoose';
import { sendWelcomeEmail, sendGoodbyeEmail } from '../../lib/mailer';
import rateLimiter from '@/lib/rateLimit';
import { NextApiRequest, NextApiResponse } from 'next';

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI!);
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await rateLimiter(req, res, async () => {
        await connectDb();

        const { email } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email inválido.' });
        }

        if (req.method === 'POST') {
            try {
                const existingEmail = await Email.findOne({ email });
                if (existingEmail) {
                    return res.status(200).json({ message: 'Este email já está inscrito.' });
                }

                const newEmail = new Email({ email });
                await newEmail.save();
                sendWelcomeEmail(email);
                return res.status(201).json({ message: 'Inscrição realizada com sucesso' });
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao inscrever-se.' });
            }
        } else if (req.method === 'DELETE') {
            try {
                const emailDoc = await Email.findOneAndDelete({ email });
                if (!emailDoc) {
                    return res.status(400).json({ message: 'Email não encontrado.' });
                }
                sendGoodbyeEmail(email);
                return res.status(200).json({ message: 'Desinscrição realizada com sucesso' });
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao desinscrever-se.' });
            }
        } else {
            return res.status(405).end(); // Método não permitido
        }
    });
}
