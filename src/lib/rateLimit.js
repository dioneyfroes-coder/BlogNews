// lib/rateLimit.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite cada IP a 100 requisições por 'window' (15 minutos)
  message: {
    success: false,
    error: 'Excesso de requisições, Tente novamente.',
  },
});

export default limiter;
