"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { data: session, status } = useSession();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session && session.user && !welcomeShown) {
      const username = session.user.name;
      toast.success(`Bem-vindo, ${session.user.name}!`);
      setWelcomeShown(true);
    }
  }, [status, session, welcomeShown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">Home</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/about">Sobre</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/contact">Contato</Link>
          </Typography>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Procurar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </form>
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
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
