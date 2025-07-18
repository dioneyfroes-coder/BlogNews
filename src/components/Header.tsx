"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const Header = () => {
  const { data: session, status } = useSession();
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (status === 'authenticated' && session && session.user && !welcomeShown) {
      toast.success(`Bem-vindo, ${session.user.name}!`);
      setWelcomeShown(true);
      localStorage.setItem('welcomeShown', 'true');
    }
  }, [status, session, welcomeShown]);

  useEffect(() => {
    if (localStorage.getItem('welcomeShown') === 'true') {
      setWelcomeShown(true);
    }
  }, []);

  const menuItems = [
    <MenuItem key="home" onClick={handleMenuClose} component={Link} href="/">
      Home
    </MenuItem>,
    <MenuItem key="about" onClick={handleMenuClose} component={Link} href="/about">
      Sobre
    </MenuItem>,
    <MenuItem key="contact" onClick={handleMenuClose} component={Link} href="/contact">
      Contato
    </MenuItem>,
  ];

  if (session) {
    menuItems.push(
      <MenuItem key="admin" onClick={handleMenuClose} component={Link} href="/admin">
        Admin
      </MenuItem>,
      <MenuItem key="signout" onClick={() => { signOut(); handleMenuClose(); }}>
        Sair
      </MenuItem>
    );
  } else {
    menuItems.push(
      <MenuItem key="login" onClick={handleMenuClose} component={Link} href="/login">
        Entrar
      </MenuItem>
    );
  }

  return (
    <AppBar position="static" color="inherit" component="header">
      <Toolbar component="nav">
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: { xs: 'pointer', sm: 'default' },
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={(event) => {
            if (window.innerWidth < 600) {
              handleMenuOpen(event);
            }
          }}
        >
          Blog
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/about">
            Sobre
          </Button>
          <Button color="inherit" component={Link} href="/contact">
            Contato
          </Button>
          {session ? (
            <>
              <Button color="inherit" component={Link} href="/admin">
                Admin
              </Button>
              <Button color="inherit" onClick={() => signOut()}>
                Sair
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} href="/login">
              Entrar
            </Button>
          )}
        </Box>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuItems}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
