import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configura o transporte do nodemailer
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let emailQueue: MailOptions[] = [];
let isProcessing = false;

const processQueue = async (): Promise<void> => {
  if (isProcessing || emailQueue.length === 0) return;
  isProcessing = true;
  
  while (emailQueue.length > 0) {
    const mailOptions = emailQueue.shift();
    if (!mailOptions) break;

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${mailOptions.to}`);
    } catch (error: any) {
      console.error(`Erro ao enviar email para ${mailOptions.to}: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  isProcessing = false;
};

const addToQueue = (mailOptions: MailOptions): void => {
  emailQueue.push(mailOptions);
  processQueue();
};

export default addToQueue;