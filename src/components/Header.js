"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const Header = () => {
  const { data: session, status } = useSession();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (status === 'authenticated' && session && session.user && !welcomeShown) {
      toast.success(`Bem-vindo, ${session.user.name}!`);
      setWelcomeShown(true);
    }
  }, [status, session, welcomeShown]);

  return (
    <AppBar position="static" color="inherit" component="header">
      <Toolbar component="nav">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">Home</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/about">Sobre</Link>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/contact">Contato</Link>
        </Typography>
        {session ? (
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/admin">Admin</Link>
            </Typography>
            <Button color="inherit" onClick={() => signOut()}>Sair</Button>
          </>
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/login">Entrar</Link>
          </Typography>
        )}
        <IconButton onClick={toggleTheme} color="inherit">
          {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
