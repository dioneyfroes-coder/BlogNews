const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Carregar variáveis de ambiente do .env

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const User = require('./src/models/User'); // Ajuste o caminho se necessário

// Certifique-se de que a variável de ambiente está carregada corretamente
const dbURI = "precisa definir";

if (!dbURI) {
  throw new Error('MONGODB_URI não está definida em .env.local');
}

const updateUserPasswords = async () => {
  try {
    await mongoose.connect(dbURI);

    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'editor', password: 'editor123', role: 'editor' },
      { username: 'redator', password: 'redator123', role: 'redator' },
    ];

    for (let user of users) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      await User.updateOne(
        { username: user.username },
        { $set: { password: hashedPassword, role: user.role } },
        { upsert: true }
      );
    }

    console.log('Usuários atualizados com sucesso!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Erro ao atualizar os usuários:', error);
  }
};

updateUserPasswords();
