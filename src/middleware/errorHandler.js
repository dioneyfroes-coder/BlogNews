export default function errorHandler(req, res, next) {
    try {
      return next();
    } catch (error) {
      console.error('Error in middleware:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  