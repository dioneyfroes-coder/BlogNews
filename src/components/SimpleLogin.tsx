// src/components/SimpleLogin.tsx
/**
 * Componente de login simples para desenvolvimento
 * @fileoverview Sistema básico de autenticação sem dependências externas
 */

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { simpleLogin } from '@/lib/auth/simple';

/**
 * Componente de login simples
 */
const SimpleLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  /**
   * Manipula o submit do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = simpleLogin(email, password);
      
      if (user) {
        // Redireciona baseado no tipo de usuário
        if (user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError('Erro inesperado durante o login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login rápido como admin
   */
  const quickAdminLogin = () => {
    setEmail('admin@blog.com');
    setPassword('admin123');
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  /**
   * Login rápido como usuário
   */
  const quickUserLogin = () => {
    setEmail('user@blog.com');
    setPassword('user123');
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Blog News
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Sistema de autenticação simples para desenvolvimento
          </Typography>
        </Box>

        {/* Alerta de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Formulário de login */}
        <Box component="form" id="login-form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !email || !password}
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Logins para Desenvolvimento
          </Typography>
        </Divider>

        {/* Botões de login rápido */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2">Administrador</Typography>
                    <Typography variant="caption" color="text.secondary">
                      admin@blog.com
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={quickAdminLogin}
                  disabled={loading}
                >
                  Login Rápido
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="secondary" />
                  <Box>
                    <Typography variant="subtitle2">Usuário</Typography>
                    <Typography variant="caption" color="text.secondary">
                      user@blog.com
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={quickUserLogin}
                  disabled={loading}
                >
                  Login Rápido
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Informações de desenvolvimento */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            <strong>Credenciais de Desenvolvimento:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Admin: admin@blog.com / admin123
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Usuário: user@blog.com / user123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleLogin;
