// src/utils/handleNewPost.js

import Subscriber from '@/models/Subscriber';
import { sendNewPostEmail } from '@/lib/mailer';

export const handleNewPost = async (post) => {
  try {
    const subscribers = await Subscriber.find();
    subscribers.forEach((subscriber) => {
      sendNewPostEmail(subscriber.email, post.title);
    });
  } catch (error) {
    console.error(`Erro ao enviar emails aos assinantes: ${error}`);
  }
};
