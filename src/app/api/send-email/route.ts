import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import addToQueue from '@/lib/emailQueue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

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

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      error: 'Falha ao enviar o e-mail' 
    }, { status: 500 });
  }
}
