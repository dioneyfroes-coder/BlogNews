import { NextApiRequest, NextApiResponse } from 'next';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

interface CustomError extends Error {
  details?: any;
}

export default function errorHandler(handler: ApiHandler) {
  return async function(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handler(req, res);
    } catch (error: unknown) {
      const customError = error as CustomError;
      
      console.error('Error in middleware:', {
        message: customError.message || 'Unknown error',
        stack: customError.stack || 'No stack trace',
        name: customError.name || 'Unknown error type',
      });

      if (customError.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation Error', 
          details: customError.details || 'Invalid data provided' 
        });
      }

      if (customError.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
