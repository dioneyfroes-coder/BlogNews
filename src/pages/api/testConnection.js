import dbConnect from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ message: 'Conexão bem-sucedida com o MongoDB' });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({
      message: 'Falha na conexão com o MongoDB',
      error: error.message,
    });
  }
};
