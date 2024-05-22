import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="username" type="text" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Sign in</button>
    </form>
  );
}
