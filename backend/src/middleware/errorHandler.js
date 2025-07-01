import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Set default error status
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    status = 400;
    message = 'Duplicate field value';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal Server Error';
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};

export const notFoundHandler = (req, res) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn('Route not found:', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  res.status(404).json({
    success: false,
    error: {
      message,
      status: 404
    }
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};