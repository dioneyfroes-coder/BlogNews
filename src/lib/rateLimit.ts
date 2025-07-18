// src/lib/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

const getIP = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return ip || req.socket.remoteAddress || 'unknown';
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req: NextApiRequest) => getIP(req),
  handler: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(429).json({
      success: false,
      error: "Too many requests, please try again later.",
    });
  },
});

export default rateLimiter;
