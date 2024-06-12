"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, Box, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import NavigationBar from '@/components/NavigationBar';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (name.length < 3) newErrors.name = 'O nome deve ter pelo menos 3 letras.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Email inválido.';
    if (message.length < 10) newErrors.message = 'A mensagem deve ter pelo menos 10 caracteres.';
    if (message.length > 500) newErrors.message = 'A mensagem não pode exceder 500 caracteres.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      toast.success('Mensagem enviada com sucesso!');
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
    } else {
      toast.error('Falha ao enviar a mensagem.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <NavigationBar />
      <Box component="section" sx={{ mt: 4, mb: 4 }}>
        <Typography component="header" variant="h3" gutterBottom>
          Me envie um e-mail diretamente daqui!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth margin="normal" error={Boolean(errors.message)}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="message"
              label="Mensagem"
              name="message"
              multiline
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              inputProps={{ maxLength: 500 }}
            />
            {errors.message && <FormHelperText>{errors.message}</FormHelperText>}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
