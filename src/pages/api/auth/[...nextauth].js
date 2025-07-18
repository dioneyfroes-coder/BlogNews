import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          await dbConnect();

          if (!credentials?.username || !credentials?.password) {
            throw new Error('Por favor, preencha ambos os campos de usuário e senha.');
          }

          const user = await User.findOne({ username: credentials.username });
          if (!user) {
            throw new Error('Usuário não encontrado.');
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Senha incorreta.');
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email, // ou algum outro campo de email, se houver
            role: user.role,
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error'
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Debug desativado para produção
});
