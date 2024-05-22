import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      // Configure seu provedor de autenticação personalizado aqui
      async authorize(credentials) {
        const user = { id: 1, name: 'Admin', email: 'admin@example.com' };
        if (credentials.username === 'admin' && credentials.password === 'password') {
          return user;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  }
});
