import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all agents
router.get('/', asyncHandler(async (req, res) => {
  const agents = req.services.database.getAllAgents();
  
  res.json({
    success: true,
    data: agents
  });
}));

// Get specific agent
router.get('/:agentId', [
  param('agentId').notEmpty().withMessage('Agent ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  
  const agent = req.services.database.getAgent(agentId);
  
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  res.json({
    success: true,
    data: agent
  });
}));

// Create new agent
router.post('/', [
  body('name').notEmpty().withMessage('Agent name is required'),
  body('type').isIn(['king', 'serf', 'peasant']).withMessage('Valid agent type required'),
  body('role').notEmpty().withMessage('Agent role is required'),
  body('capabilities').optional().isArray().withMessage('Capabilities must be an array'),
  body('configuration').optional().isObject().withMessage('Configuration must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const agentData = {
    id: uuidv4(),
    ...req.body
  };
  
  const agent = await req.services.database.createAgent(agentData);
  
  res.status(201).json({
    success: true,
    data: agent
  });
}));

// Update agent
router.put('/:agentId', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  body('name').optional().notEmpty().withMessage('Agent name cannot be empty'),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Valid status required'),
  body('capabilities').optional().isArray().withMessage('Capabilities must be an array'),
  body('configuration').optional().isObject().withMessage('Configuration must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  const updateData = { ...req.body };
  if (updateData.capabilities) {
    updateData.capabilities = JSON.stringify(updateData.capabilities);
  }
  if (updateData.configuration) {
    updateData.configuration = JSON.stringify(updateData.configuration);
  }
  
  req.services.database.update('agents', updateData, { id: agentId });
  
  const updatedAgent = req.services.database.getAgent(agentId);
  
  res.json({
    success: true,
    data: updatedAgent
  });
}));

// Get agent metrics
router.get('/:agentId/metrics', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  query('timeRange').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Valid time range required'),
  query('metricType').optional().notEmpty().withMessage('Metric type cannot be empty')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { timeRange = '24h', metricType } = req.query;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  // Calculate time filter
  const timeMap = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };
  
  const hoursBack = timeMap[timeRange];
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  
  const filters = { agent_id: agentId };
  if (metricType) {
    filters.metric_type = metricType;
  }
  
  // Get metrics from database
  const metrics = req.services.database.select('metrics', filters, {
    orderBy: 'timestamp DESC'
  }).filter(metric => metric.timestamp >= since);
  
  res.json({
    success: true,
    data: {
      agentId,
      timeRange,
      metricType,
      metrics: metrics.map(metric => ({
        id: metric.id,
        metric_type: metric.metric_type,
        metric_name: metric.metric_name,
        value: metric.value,
        unit: metric.unit,
        tags: JSON.parse(metric.tags || '{}'),
        metadata: JSON.parse(metric.metadata || '{}'),
        timestamp: metric.timestamp
      })),
      summary: {
        total: metrics.length,
        latest: metrics[0]?.timestamp,
        oldest: metrics[metrics.length - 1]?.timestamp
      }
    }
  });
}));

// Record agent metric
router.post('/:agentId/metrics', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  body('metric_type').notEmpty().withMessage('Metric type is required'),
  body('metric_name').notEmpty().withMessage('Metric name is required'),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('unit').optional().notEmpty().withMessage('Unit cannot be empty'),
  body('tags').optional().isObject().withMessage('Tags must be an object'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  const metricData = {
    id: uuidv4(),
    agent_id: agentId,
    ...req.body
  };
  
  await req.services.database.recordMetric(metricData);
  
  res.status(201).json({
    success: true,
    data: {
      message: 'Metric recorded successfully',
      metricId: metricData.id
    }
  });
}));

// Get agent tasks
router.get('/:agentId/tasks', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'failed']).withMessage('Valid status required')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { status } = req.query;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  const filters = { assigned_to: agentId };
  if (status) {
    filters.status = status;
  }
  
  const tasks = req.services.database.select('tasks', filters, {
    orderBy: 'created_at DESC'
  });
  
  res.json({
    success: true,
    data: tasks.map(task => ({
      ...task,
      metadata: JSON.parse(task.metadata || '{}'),
      execution_steps: JSON.parse(task.execution_steps || '[]'),
      result: task.result ? JSON.parse(task.result) : null
    }))
  });
}));

// Get agent communications
router.get('/:agentId/communications', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  // Get communications where agent is sender or receiver
  const sentCommunications = req.services.database.select('communications', 
    { sender_id: agentId }, 
    { orderBy: 'created_at DESC', limit: Math.ceil(limit / 2) }
  );
  
  const receivedCommunications = req.services.database.select('communications', 
    { receiver_id: agentId }, 
    { orderBy: 'created_at DESC', limit: Math.ceil(limit / 2) }
  );
  
  const allCommunications = [...sentCommunications, ...receivedCommunications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
  
  res.json({
    success: true,
    data: allCommunications.map(comm => ({
      ...comm,
      metadata: JSON.parse(comm.metadata || '{}')
    }))
  });
}));

// Send message from agent
router.post('/:agentId/send-message', [
  param('agentId').notEmpty().withMessage('Agent ID is required'),
  body('receiver_id').notEmpty().withMessage('Receiver ID is required'),
  body('message_type').notEmpty().withMessage('Message type is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('channel').optional().notEmpty().withMessage('Channel cannot be empty'),
  body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5')
], validateRequest, asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  
  const agent = req.services.database.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Agent not found',
        status: 404
      }
    });
  }
  
  const receiver = req.services.database.getAgent(req.body.receiver_id);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Receiver agent not found',
        status: 404
      }
    });
  }
  
  const communicationData = {
    id: uuidv4(),
    sender_id: agentId,
    ...req.body
  };
  
  await req.services.database.recordCommunication(communicationData);
  
  // Also send through message broker
  await req.services.messageBroker.sendToAgent(receiver.type, {
    from: agent.name,
    content: req.body.content,
    messageType: req.body.message_type
  });
  
  res.status(201).json({
    success: true,
    data: {
      message: 'Message sent successfully',
      communicationId: communicationData.id
    }
  });
}));

export default router;