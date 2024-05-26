import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Configurar o transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: 'hotmail', // ou outro serviço de e-mail que você esteja usando
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configurar o e-mail
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Nova mensagem de contato de ${name}`,
        text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
      };

    try {
      // Enviar o e-mail
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Falha ao enviar o e-mail' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método não permitido' });
  }
}
