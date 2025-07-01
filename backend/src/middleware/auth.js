import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token required',
        status: 401
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn('Invalid token:', { error: err.message, ip: req.ip });
      return res.status(403).json({
        success: false,
        error: {
          message: 'Invalid or expired token',
          status: 403
        }
      });
    }

    req.user = decoded;
    next();
  });
};

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          status: 401
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          status: 403
        }
      });
    }

    next();
  };
};