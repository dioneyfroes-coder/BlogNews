// lib/emailQueue.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  rateLimit: true,
  maxConnections: 1, // Limite de conexões simultâneas
  maxMessages: 2, // Limite de mensagens por conexão
});

let emailQueue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (emailQueue.length > 0) {
    const mailOptions = emailQueue.shift();
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email enviado para: ${mailOptions.to}`);
    } catch (error) {
      console.error(`Erro ao enviar email: ${error}`);
    }
  }

  isProcessing = false;
};

const addToQueue = (mailOptions) => {
  emailQueue.push(mailOptions);
  processQueue();
};

module.exports = addToQueue;
