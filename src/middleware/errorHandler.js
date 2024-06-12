export default function errorHandler(handler) {
  return async function(req, res) {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Error in middleware:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });


      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', details: error.details });
      }

      if (error.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
