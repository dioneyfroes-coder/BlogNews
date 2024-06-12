const nodemailer = require('nodemailer');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Configura o transporte do nodemailer com as credenciais de autenticação
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

/**
 * Processa a fila de emails, enviando cada email na fila
 */
const processQueue = async () => {
  if (isProcessing) return; // Evita processamento simultâneo
  isProcessing = true;

  while (emailQueue.length > 0) {
    const mailOptions = emailQueue.shift();
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email enviado para: ${mailOptions.to}`);
    } catch (error) {
      console.error(`Erro ao enviar email para ${mailOptions.to}: ${error.message}`);
      // Re-adicionar o email na fila em caso de erro, opcional
      // emailQueue.push(mailOptions);
    }
  }

  isProcessing = false;
};

/**
 * Adiciona um email à fila e inicia o processamento
 * @param {Object} mailOptions - Opções de email para envio
 */
const addToQueue = (mailOptions) => {
  emailQueue.push(mailOptions);
  processQueue().catch(error => console.error(`Erro no processamento da fila: ${error.message}`));
};

module.exports = addToQueue;
