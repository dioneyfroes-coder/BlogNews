// src/lib/rateLimit.js
import rateLimit from 'express-rate-limit';

const getIP = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip;
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req, res) => getIP(req),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again later.",
    });
  },
});

export default rateLimiter;
