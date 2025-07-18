"use client"

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Container component="main" maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <NavigationBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Página não encontrada
        </Typography>
        <Typography variant="body1" gutterBottom>
          A página que você procura não existe.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome} sx={{ mt: 4 }}>
          Voltar para a Página Inicial
        </Button>
      </Box>
    </Container>
  );
}
