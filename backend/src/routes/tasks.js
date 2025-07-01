import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all tasks
router.get('/', [
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'failed']).withMessage('Valid status required'),
  query('assigned_to').optional().notEmpty().withMessage('Assigned to cannot be empty'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, asyncHandler(async (req, res) => {
  const { status, assigned_to, limit = 50 } = req.query;
  
  const filters = {};
  if (status) filters.status = status;
  if (assigned_to) filters.assigned_to = assigned_to;
  
  const tasks = req.services.database.select('tasks', filters, {
    orderBy: 'created_at DESC',
    limit: parseInt(limit)
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

// Get specific task
router.get('/:taskId', [
  param('taskId').notEmpty().withMessage('Task ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  res.json({
    success: true,
    data: task
  });
}));

// Create new task
router.post('/', [
  body('title').notEmpty().withMessage('Task title is required'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('type').notEmpty().withMessage('Task type is required'),
  body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Priority must be between 1 and 5'),
  body('assigned_by').notEmpty().withMessage('Assigned by is required'),
  body('assigned_to').notEmpty().withMessage('Assigned to is required'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('execution_steps').optional().isArray().withMessage('Execution steps must be an array')
], validateRequest, asyncHandler(async (req, res) => {
  const taskData = {
    id: uuidv4(),
    ...req.body
  };
  
  // Verify assigned_by and assigned_to agents exist
  const assignerAgent = req.services.database.getAgent(taskData.assigned_by);
  const assigneeAgent = req.services.database.getAgent(taskData.assigned_to);
  
  if (!assignerAgent) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Assigner agent not found',
        status: 400
      }
    });
  }
  
  if (!assigneeAgent) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Assignee agent not found',
        status: 400
      }
    });
  }
  
  const task = await req.services.database.createTask(taskData);
  
  // Notify assignee agent
  await req.services.messageBroker.sendToAgent(assigneeAgent.type, {
    type: 'task_assigned',
    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedBy: assignerAgent.name
    }
  });
  
  res.status(201).json({
    success: true,
    data: task
  });
}));

// Update task
router.put('/:taskId', [
  param('taskId').notEmpty().withMessage('Task ID is required'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'failed']).withMessage('Valid status required'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('result').optional().isObject().withMessage('Result must be an object'),
  body('error_message').optional().notEmpty().withMessage('Error message cannot be empty')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  const updateData = { ...req.body };
  
  // Handle result serialization
  if (updateData.result) {
    updateData.result = JSON.stringify(updateData.result);
  }
  
  // Handle status changes
  if (updateData.status) {
    if (updateData.status === 'in_progress' && !task.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    if (['completed', 'failed'].includes(updateData.status) && !task.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }
  }
  
  req.services.database.update('tasks', updateData, { id: taskId });
  
  const updatedTask = req.services.database.getTask(taskId);
  
  // Notify relevant agents of task update
  if (updateData.status) {
    const assignerAgent = req.services.database.getAgent(task.assigned_by);
    if (assignerAgent) {
      await req.services.messageBroker.sendToAgent(assignerAgent.type, {
        type: 'task_updated',
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          progress: updatedTask.progress
        }
      });
    }
  }
  
  res.json({
    success: true,
    data: updatedTask
  });
}));

// Update task progress
router.patch('/:taskId/progress', [
  param('taskId').notEmpty().withMessage('Task ID is required'),
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'failed']).withMessage('Valid status required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { progress, status } = req.body;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  // Determine status based on progress if not provided
  let newStatus = status;
  if (!newStatus) {
    if (progress === 0) newStatus = 'pending';
    else if (progress === 100) newStatus = 'completed';
    else newStatus = 'in_progress';
  }
  
  req.services.database.updateTaskProgress(taskId, progress, newStatus);
  
  const updatedTask = req.services.database.getTask(taskId);
  
  res.json({
    success: true,
    data: updatedTask
  });
}));

// Execute task (simulate task execution)
router.post('/:taskId/execute', [
  param('taskId').notEmpty().withMessage('Task ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  if (task.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Task is not in pending status',
        status: 400
      }
    });
  }
  
  // Update task to in_progress
  req.services.database.updateTaskProgress(taskId, 10, 'in_progress');
  
  // Simulate task execution
  const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
  
  setTimeout(() => {
    // Complete the task
    const result = {
      message: `Task "${task.title}" completed successfully`,
      executionTime: Math.round(executionTime),
      completedBy: 'AI Agent System',
      timestamp: new Date().toISOString()
    };
    
    req.services.database.update('tasks', {
      progress: 100,
      status: 'completed',
      result: JSON.stringify(result),
      completed_at: new Date().toISOString()
    }, { id: taskId });
    
    // Notify completion (in real implementation, this would be through WebSocket)
    req.services.messageBroker.sendToAgent('king', {
      type: 'task_completed',
      task: {
        id: taskId,
        title: task.title,
        result
      }
    });
    
  }, executionTime);
  
  res.json({
    success: true,
    data: {
      message: 'Task execution started',
      taskId,
      estimatedTime: Math.round(executionTime),
      status: 'in_progress'
    }
  });
}));

// Delete task
router.delete('/:taskId', [
  param('taskId').notEmpty().withMessage('Task ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  req.services.database.delete('tasks', { id: taskId });
  
  res.json({
    success: true,
    data: {
      message: 'Task deleted successfully',
      taskId
    }
  });
}));

// Get task execution steps
router.get('/:taskId/steps', [
  param('taskId').notEmpty().withMessage('Task ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  res.json({
    success: true,
    data: {
      taskId,
      executionSteps: task.execution_steps || [],
      currentStep: task.progress > 0 ? Math.floor(task.progress / (100 / (task.execution_steps?.length || 1))) : 0
    }
  });
}));

// Get task metrics/analytics
router.get('/:taskId/analytics', [
  param('taskId').notEmpty().withMessage('Task ID is required')
], validateRequest, asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = req.services.database.getTask(taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Task not found',
        status: 404
      }
    });
  }
  
  // Calculate task analytics
  const analytics = {
    taskId,
    duration: null,
    efficiency: null,
    complexity: task.execution_steps?.length || 1,
    priority: task.priority,
    status: task.status
  };
  
  if (task.started_at && task.completed_at) {
    const duration = new Date(task.completed_at) - new Date(task.started_at);
    analytics.duration = duration;
    analytics.efficiency = Math.max(0, 100 - (duration / (1000 * 60 * 5)) * 100); // 5 min baseline
  }
  
  res.json({
    success: true,
    data: analytics
  });
}));

export default router;