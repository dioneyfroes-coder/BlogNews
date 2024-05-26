"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';

const Header = () => {
  const { data: session, status } = useSession();
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session && session.user && !welcomeShown) {
      const username = session.user.name;
      toast.success(`Bem-vindo, ${session.user.name}!`);
      setWelcomeShown(true);
    }
  }, [status, session, welcomeShown]);

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">Home</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/about">About</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/contact">Contact</Link>
        </Typography>
        {session ? (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/admin">Admin</Link>
            </Typography>
            <Button color="inherit" onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/login">Login</Link>
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
