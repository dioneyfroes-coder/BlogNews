// src/utils/handleNewPost.ts

import Subscriber from '@/models/Subscriber';
import addToQueue from '@/lib/emailQueue'; // Importar a função de adicionar à fila
import { Post } from '@/types';

export const handleNewPost = async (post: Post) => {
  try {
    const subscribers = await Subscriber.find();
    subscribers.forEach((subscriber) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `Novo post: ${post.title}`,
        text: `Olá, temos um novo post: ${post.title}\n\n${post.content}\n\nVisite nosso blog para mais informações.`,
        html: `
          <h2>Novo post: ${post.title}</h2>
          <p>Olá,</p>
          <p>Temos um novo post no nosso blog:</p>
          <div style="padding: 15px; border-left: 4px solid #007cba;">
            ${post.content}
          </div>
          <p>Visite nosso blog para mais informações.</p>
        `,
      };
      addToQueue(mailOptions); // Adicionar à fila de emails
    });
  } catch (error) {
    console.error(`Erro ao enviar emails aos assinantes: ${error}`);
  }
};
