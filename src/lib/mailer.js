// src/lib/mailer.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNewPostEmail = (to, postTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Novo Post no Blog!',
    text: `Confira nosso novo post: ${postTitle}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Erro ao enviar email: ${error}`);
    } else {
      console.log(`Email enviado: ${info.response}`);
    }
  });
};

export const sendWelcomeEmail = (to) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Bem-vindo à nossa NewsLetter!',
    text: 'Obrigado por se inscrever na nossa NewsLetter. Você receberá atualizações de novos posts.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Erro ao enviar email: ${error}`);
    } else {
      console.log(`Email de boas-vindas enviado: ${info.response}`);
    }
  });
};

export const sendGoodbyeEmail = (to) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Você se desinscreveu da nossa NewsLetter',
    text: 'Você não receberá mais atualizações de novos posts. Sentiremos sua falta!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Erro ao enviar email: ${error}`);
    } else {
      console.log(`Email de desinscrição enviado: ${info.response}`);
    }
  });
};
