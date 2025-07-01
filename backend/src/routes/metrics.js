import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get system metrics overview
router.get('/overview', [
  query('timeRange').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Valid time range required')
], validateRequest, asyncHandler(async (req, res) => {
  const { timeRange = '24h' } = req.query;
  
  // Calculate time filter
  const timeMap = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };
  
  const hoursBack = timeMap[timeRange];
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  
  // Get metrics from database
  const allMetrics = req.services.database.select('metrics', {}, {
    orderBy: 'timestamp DESC'
  }).filter(metric => metric.timestamp >= since);
  
  // Get agents
  const agents = req.services.database.getAllAgents();
  
  // Get tasks
  const tasks = req.services.database.select('tasks', {}, {
    orderBy: 'created_at DESC'
  }).filter(task => task.created_at >= since);
  
  // Calculate overview metrics
  const overview = {
    timeRange,
    summary: {
      totalMetrics: allMetrics.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length
    },
    agentMetrics: {},
    systemHealth: {
      overall: 'healthy',
      components: []
    }
  };
  
  // Group metrics by agent
  agents.forEach(agent => {
    const agentMetrics = allMetrics.filter(m => m.agent_id === agent.id);
    
    overview.agentMetrics[agent.id] = {
      name: agent.name,
      type: agent.type,
      status: agent.status,
      metricsCount: agentMetrics.length,
      latestMetrics: agentMetrics.slice(0, 5).map(m => ({
        type: m.metric_type,
        name: m.metric_name,
        value: m.value,
        unit: m.unit,
        timestamp: m.timestamp
      }))
    };
    
    // Add to system health
    overview.systemHealth.components.push({
      name: agent.name,
      type: agent.type,
      status: agent.status,
      health: agent.status === 'active' ? 'healthy' : 'degraded'
    });
  });
  
  res.json({
    success: true,
    data: overview
  });
}));

// Get specific metrics
router.get('/', [
  query('agent_id').optional().notEmpty().withMessage('Agent ID cannot be empty'),
  query('metric_type').optional().notEmpty().withMessage('Metric type cannot be empty'),
  query('timeRange').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Valid time range required'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000')
], validateRequest, asyncHandler(async (req, res) => {
  const { agent_id, metric_type, timeRange = '24h', limit = 100 } = req.query;
  
  // Calculate time filter
  const timeMap = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };
  
  const hoursBack = timeMap[timeRange];
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  
  const filters = {};
  if (agent_id) filters.agent_id = agent_id;
  if (metric_type) filters.metric_type = metric_type;
  
  const metrics = req.services.database.getMetrics(filters, {
    orderBy: 'timestamp DESC',
    limit: parseInt(limit)
  }).filter(metric => metric.timestamp >= since);
  
  res.json({
    success: true,
    data: {
      timeRange,
      filters: { agent_id, metric_type },
      metrics,
      summary: {
        total: metrics.length,
        latest: metrics[0]?.timestamp,
        oldest: metrics[metrics.length - 1]?.timestamp
      }
    }
  });
}));

// Record new metric
router.post('/', [
  body('agent_id').optional().notEmpty().withMessage('Agent ID cannot be empty'),
  body('metric_type').notEmpty().withMessage('Metric type is required'),
  body('metric_name').notEmpty().withMessage('Metric name is required'),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('unit').optional().notEmpty().withMessage('Unit cannot be empty'),
  body('tags').optional().isObject().withMessage('Tags must be an object'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('coordination_id').optional().notEmpty().withMessage('Coordination ID cannot be empty')
], validateRequest, asyncHandler(async (req, res) => {
  const metricData = {
    id: uuidv4(),
    ...req.body
  };
  
  // Verify agent exists if agent_id provided
  if (metricData.agent_id) {
    const agent = req.services.database.getAgent(metricData.agent_id);
    if (!agent) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Agent not found',
          status: 400
        }
      });
    }
  }
  
  await req.services.database.recordMetric(metricData);
  
  res.status(201).json({
    success: true,
    data: {
      message: 'Metric recorded successfully',
      metricId: metricData.id
    }
  });
}));

// Get metrics analytics
router.get('/analytics', [
  query('metric_type').optional().notEmpty().withMessage('Metric type cannot be empty'),
  query('timeRange').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Valid time range required'),
  query('aggregation').optional().isIn(['avg', 'sum', 'min', 'max', 'count']).withMessage('Valid aggregation required')
], validateRequest, asyncHandler(async (req, res) => {
  const { metric_type, timeRange = '24h', aggregation = 'avg' } = req.query;
  
  // Calculate time filter
  const timeMap = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };
  
  const hoursBack = timeMap[timeRange];
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  
  const filters = {};
  if (metric_type) filters.metric_type = metric_type;
  
  const metrics = req.services.database.getMetrics(filters, {
    orderBy: 'timestamp DESC'
  }).filter(metric => metric.timestamp >= since);
  
  // Perform analytics
  const analytics = {
    timeRange,
    metricType: metric_type,
    aggregation,
    totalDataPoints: metrics.length,
    analytics: {}
  };
  
  if (metrics.length > 0) {
    const values = metrics.map(m => m.value);
    
    analytics.analytics = {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      sum: values.reduce((a, b) => a + b, 0),
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
      latest: values[0],
      trend: values.length > 1 ? (values[0] - values[values.length - 1]) : 0
    };
    
    // Time-series data (hourly buckets)
    const timeSeries = {};
    metrics.forEach(metric => {
      const hour = new Date(metric.timestamp).toISOString().slice(0, 13) + ':00:00.000Z';
      if (!timeSeries[hour]) {
        timeSeries[hour] = [];
      }
      timeSeries[hour].push(metric.value);
    });
    
    analytics.timeSeries = Object.keys(timeSeries).map(hour => ({
      timestamp: hour,
      value: timeSeries[hour].reduce((a, b) => a + b, 0) / timeSeries[hour].length,
      count: timeSeries[hour].length
    })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  
  res.json({
    success: true,
    data: analytics
  });
}));

// Get performance metrics
router.get('/performance', [
  query('timeRange').optional().isIn(['1h', '24h', '7d', '30d']).withMessage('Valid time range required')
], validateRequest, asyncHandler(async (req, res) => {
  const { timeRange = '24h' } = req.query;
  
  // Calculate time filter
  const timeMap = {
    '1h': 1,
    '24h': 24,
    '7d': 24 * 7,
    '30d': 24 * 30
  };
  
  const hoursBack = timeMap[timeRange];
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  
  // Get performance-related metrics
  const performanceMetrics = req.services.database.select('metrics', {}, {
    orderBy: 'timestamp DESC'
  }).filter(metric => {
    return metric.timestamp >= since && 
           ['cpu_usage', 'memory_usage', 'response_time', 'throughput', 'error_rate'].includes(metric.metric_type);
  });
  
  // Group by metric type
  const groupedMetrics = {};
  performanceMetrics.forEach(metric => {
    if (!groupedMetrics[metric.metric_type]) {
      groupedMetrics[metric.metric_type] = [];
    }
    groupedMetrics[metric.metric_type].push(metric);
  });
  
  // Calculate performance summary
  const performance = {
    timeRange,
    summary: {},
    details: groupedMetrics,
    alerts: []
  };
  
  Object.keys(groupedMetrics).forEach(metricType => {
    const metrics = groupedMetrics[metricType];
    const values = metrics.map(m => m.value);
    
    const summary = {
      current: values[0],
      average: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      trend: values.length > 1 ? ((values[0] - values[values.length - 1]) / values[values.length - 1] * 100) : 0
    };
    
    performance.summary[metricType] = summary;
    
    // Generate alerts based on thresholds
    if (metricType === 'cpu_usage' && summary.current > 80) {
      performance.alerts.push({
        type: 'warning',
        metric: metricType,
        message: 'High CPU usage detected',
        value: summary.current,
        threshold: 80
      });
    }
    
    if (metricType === 'memory_usage' && summary.current > 85) {
      performance.alerts.push({
        type: 'warning',
        metric: metricType,
        message: 'High memory usage detected',
        value: summary.current,
        threshold: 85
      });
    }
    
    if (metricType === 'response_time' && summary.current > 1000) {
      performance.alerts.push({
        type: 'warning',
        metric: metricType,
        message: 'High response time detected',
        value: summary.current,
        threshold: 1000
      });
    }
  });
  
  res.json({
    success: true,
    data: performance
  });
}));

// Get coordination metrics
router.get('/coordination/:coordinationId', [
  param('coordinationId').notEmpty().withMessage('Coordination ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { coordinationId } = req.params;
  
  const metrics = req.services.database.getMetrics({ coordination_id: coordinationId }, {
    orderBy: 'timestamp DESC'
  });
  
  // Get coordination info from coordination engine
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
      coordination: {
        status: coordination.status,
        scenario: coordination.scenario?.name,
        duration: coordination.duration,
        efficiency: coordination.efficiencyScore
      },
      metrics,
      summary: {
        totalMetrics: metrics.length,
        participantMetrics: metrics.reduce((acc, metric) => {
          const agentId = metric.agent_id;
          if (!acc[agentId]) acc[agentId] = 0;
          acc[agentId]++;
          return acc;
        }, {})
      }
    }
  });
}));

export default router;