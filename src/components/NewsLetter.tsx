// src/components/Newsletter.js
"use client";

import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Erro ao inscrever-se.');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Erro ao desinscrever-se.');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Assine nossa Newsletter</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleSubscribe}>
          Subscribe
        </Button>
        <Button variant="contained" color="secondary" onClick={handleUnsubscribe}>
          Unsubscribe
        </Button>
      </Box>
      {message && <Typography variant="body2" color="textSecondary">{message}</Typography>}
    </Box>
  );
};

export default Newsletter;
