// src/utils/handleNewPost.js

import Subscriber from '@/models/Subscriber';
import addToQueue from '@/lib/emailQueue'; // Importar a função de adicionar à fila

export const handleNewPost = async (post) => {
  try {
    const subscribers = await Subscriber.find();
    subscribers.forEach((subscriber) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `Novo post: ${post.title}`,
        text: `Olá, temos um novo post: ${post.title}\n\n${post.content}\n\nVisite nosso blog para mais informações.`,
      };
      addToQueue(mailOptions); // Adicionar à fila de emails
    });
  } catch (error) {
    console.error(`Erro ao enviar emails aos assinantes: ${error}`);
  }
};
