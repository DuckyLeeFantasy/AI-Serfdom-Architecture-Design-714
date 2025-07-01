import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Start a coordination scenario
router.post('/start', [
  body('scenarioId').notEmpty().withMessage('Scenario ID is required'),
  body('options').optional().isObject().withMessage('Options must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const { scenarioId, options } = req.body;
  
  const coordination = await req.services.coordinationEngine.startCoordination(scenarioId, options);
  
  res.json({
    success: true,
    data: coordination
  });
}));

// Get coordination status
router.get('/:coordinationId', [
  param('coordinationId').notEmpty().withMessage('Coordination ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { coordinationId } = req.params;
  
  const coordination = req.services.coordinationEngine.getCoordination(coordinationId);
  
  if (!coordination) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Coordination not found',
        status: 404
      }
    });
  }
  
  res.json({
    success: true,
    data: coordination
  });
}));

// Get available scenarios
router.get('/scenarios/list', asyncHandler(async (req, res) => {
  const scenarios = req.services.coordinationEngine.getAvailableScenarios();
  
  res.json({
    success: true,
    data: scenarios
  });
}));

// Get active coordinations
router.get('/active/list', asyncHandler(async (req, res) => {
  const active = req.services.coordinationEngine.getActiveCoordinations();
  
  res.json({
    success: true,
    data: active
  });
}));

// Get coordination history
router.get('/history/list', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const history = req.services.coordinationEngine.getCoordinationHistory(limit);
  
  res.json({
    success: true,
    data: history
  });
}));

// Execute a specific coordination task
router.post('/execute-task', [
  body('taskData').notEmpty().withMessage('Task data is required'),
  body('taskData.title').notEmpty().withMessage('Task title is required'),
  body('taskData.description').notEmpty().withMessage('Task description is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskData } = req.body;
  
  // For demonstration, we'll simulate task execution
  const result = {
    taskId: `task_${Date.now()}`,
    status: 'completed',
    result: 'Task executed successfully through coordination engine',
    executionTime: Math.random() * 2000 + 1000,
    timestamp: new Date().toISOString()
  };
  
  logger.info('Task executed via coordination:', { taskData, result });
  
  res.json({
    success: true,
    data: result
  });
}));

// Send a message between agents in coordination
router.post('/message', [
  body('coordinationId').notEmpty().withMessage('Coordination ID is required'),
  body('fromAgent').notEmpty().withMessage('From agent is required'),
  body('toAgent').notEmpty().withMessage('To agent is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('type').optional().isString().withMessage('Type must be a string')
], validateRequest, asyncHandler(async (req, res) => {
  const { coordinationId, fromAgent, toAgent, message, type } = req.body;
  
  const coordination = req.services.coordinationEngine.getCoordination(coordinationId);
  if (!coordination) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Coordination not found',
        status: 404
      }
    });
  }
  
  // Send message through coordination engine
  await req.services.coordinationEngine.sendMessage(coordinationId, fromAgent, toAgent, message, type);
  
  res.json({
    success: true,
    data: {
      message: 'Message sent successfully',
      coordinationId,
      fromAgent,
      toAgent
    }
  });
}));

// Get coordination metrics
router.get('/:coordinationId/metrics', [
  param('coordinationId').notEmpty().withMessage('Coordination ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { coordinationId } = req.params;
  
  const coordination = req.services.coordinationEngine.getCoordination(coordinationId);
  if (!coordination) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Coordination not found',
        status: 404
      }
    });
  }
  
  res.json({
    success: true,
    data: {
      coordinationId,
      metrics: coordination.metrics,
      duration: coordination.duration,
      efficiency: coordination.efficiencyScore,
      status: coordination.status
    }
  });
}));

// Handle coordination requests (WebSocket alternative)
router.post('/request', [
  body('action').notEmpty().withMessage('Action is required'),
  body('data').optional().isObject().withMessage('Data must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const request = req.body;
  
  const result = await req.services.coordinationEngine.handleCoordinationRequest(request);
  
  res.json({
    success: true,
    data: result
  });
}));

export default router;