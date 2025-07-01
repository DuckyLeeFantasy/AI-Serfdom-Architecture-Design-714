import { validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed:', {
      errors: errors.array(),
      url: req.url,
      method: req.method,
      body: req.body
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array(),
        status: 400
      }
    });
  }
  
  next();
};