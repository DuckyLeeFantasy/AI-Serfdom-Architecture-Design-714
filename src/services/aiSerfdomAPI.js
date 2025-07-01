import { supabase } from '../lib/supabase';
import { KingAIService, SerfAgentService, PeasantAgentService } from './aiSerfdomService';

class AISerfdomAPI {
  constructor() {
    this.baseURL = 'http://localhost:5002/api';
  }

  // Get all agents with their current status
  async getAgents() {
    try {
      const { data, error } = await supabase
        .from('agents_system_7x9k2m')
        .select('*')
        .order('role');

      if (error) throw error;

      // Transform data to match the expected format
      const agents = data.map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.role,
        status: agent.status,
        capabilities: agent.capabilities || [],
        metrics: agent.metrics || {}
      }));

      return { success: true, agents };
    } catch (error) {
      console.error('Error fetching agents:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all tasks
  async getTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .select(`
          *,
          assigned_by_agent:assigned_by(name, role),
          assigned_to_agent:assigned_to(name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      const tasks = data.map(task => ({
        id: task.id,
        description: task.description,
        status: task.status,
        priority: task.priority,
        steps: task.execution_steps || [],
        result: task.result,
        createdAt: task.created_at,
        assignedBy: task.assigned_by_agent,
        assignedTo: task.assigned_to_agent
      }));

      return { success: true, tasks };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new task
  async createTask(taskData) {
    try {
      // Get the King AI agent first
      const { data: kingAgent } = await supabase
        .from('agents_system_7x9k2m')
        .select('*')
        .eq('role', 'king')
        .single();

      if (!kingAgent) {
        throw new Error('King AI Overseer not found');
      }

      // Determine which agent should handle this task
      const assignedToRole = this.determineTaskAssignment(taskData.description);
      
      const { data: assignedAgent } = await supabase
        .from('agents_system_7x9k2m')
        .select('*')
        .eq('role', assignedToRole)
        .single();

      // Create the task
      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .insert([{
          title: `Task: ${taskData.description.substring(0, 50)}...`,
          description: taskData.description,
          priority: this.mapPriority(taskData.priority),
          status: 'pending',
          assigned_by: kingAgent.id,
          assigned_to: assignedAgent?.id || kingAgent.id,
          execution_steps: this.generateExecutionSteps(taskData.description, assignedToRole)
        }])
        .select()
        .single();

      if (error) throw error;

      // Log the decision made by King AI
      await KingAIService.makeDecision(
        'task_assignment',
        `Assigned task to ${assignedToRole} agent`,
        `Task analysis indicates this requires ${assignedToRole} capabilities`,
        85.0
      );

      return { success: true, task: data };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: error.message };
    }
  }

  // Execute a task
  async executeTask(taskId) {
    try {
      // Get the task details
      const { data: task, error: taskError } = await supabase
        .from('tasks_7x9k2m')
        .select(`
          *,
          assigned_to_agent:assigned_to(name, role)
        `)
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      // Update task status to in_progress
      await supabase
        .from('tasks_7x9k2m')
        .update({ 
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', taskId);

      // Simulate task execution based on assigned agent
      const result = await this.simulateTaskExecution(task);

      // Update task with results
      const { data: updatedTask, error: updateError } = await supabase
        .from('tasks_7x9k2m')
        .update({ 
          status: 'completed',
          result: result.message,
          completed_at: new Date().toISOString(),
          progress: 100
        })
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log metrics based on the agent type
      const agentRole = task.assigned_to_agent?.role;
      if (agentRole) {
        const service = this.getAgentService(agentRole);
        await service.logMetric(
          'task_completion',
          1,
          'count',
          { task_id: taskId, execution_time: result.executionTime }
        );
      }

      return { success: true, task: updatedTask, result };
    } catch (error) {
      console.error('Error executing task:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to determine task assignment
  determineTaskAssignment(description) {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('user') || lowerDesc.includes('interface') || lowerDesc.includes('frontend')) {
      return 'serf';
    } else if (lowerDesc.includes('data') || lowerDesc.includes('database') || lowerDesc.includes('backend')) {
      return 'peasant';
    } else {
      return 'king'; // Strategic decisions go to the King
    }
  }

  // Helper method to map priority
  mapPriority(priority) {
    const priorityMap = {
      'low': 1,
      'medium': 3,
      'high': 4,
      'critical': 5
    };
    return priorityMap[priority] || 3;
  }

  // Helper method to generate execution steps
  generateExecutionSteps(description, assignedRole) {
    const steps = [];
    
    // King AI always starts with analysis
    steps.push({
      agent: 'king_overseer',
      action: 'Analyze task requirements and develop execution strategy'
    });

    // Add role-specific steps
    if (assignedRole === 'serf') {
      steps.push({
        agent: 'serf_frontend',
        action: 'Design and implement user interface solution'
      });
    } else if (assignedRole === 'peasant') {
      steps.push({
        agent: 'peasant_backend',
        action: 'Process data and implement backend logic'
      });
    }

    // King AI concludes with review
    steps.push({
      agent: 'king_overseer',
      action: 'Review implementation and ensure quality standards'
    });

    return steps;
  }

  // Simulate task execution
  async simulateTaskExecution(task) {
    const executionTime = Math.random() * 3000 + 1000; // 1-4 seconds
    
    await new Promise(resolve => setTimeout(resolve, executionTime));

    const agentRole = task.assigned_to_agent?.role;
    let message = '';

    switch (agentRole) {
      case 'king':
        message = `Strategic analysis completed. Task has been evaluated and strategic recommendations have been formulated.`;
        break;
      case 'serf':
        message = `User interface task completed successfully. Enhanced user experience and implemented requested features.`;
        break;
      case 'peasant':
        message = `Backend processing completed. Data has been processed and business logic implemented according to requirements.`;
        break;
      default:
        message = `Task processed successfully by the AI-Serfdom system.`;
    }

    return {
      message,
      executionTime: Math.round(executionTime),
      success: true
    };
  }

  // Get appropriate agent service
  getAgentService(role) {
    switch (role) {
      case 'king': return KingAIService;
      case 'serf': return SerfAgentService;
      case 'peasant': return PeasantAgentService;
      default: return KingAIService;
    }
  }

  // Get system statistics
  async getSystemStats() {
    try {
      const [agentsResult, tasksResult, metricsResult] = await Promise.all([
        supabase.from('agents_system_7x9k2m').select('*'),
        supabase.from('tasks_7x9k2m').select('*'),
        supabase.from('system_metrics_7x9k2m').select('*').gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const stats = {
        totalAgents: agentsResult.data?.length || 0,
        activeAgents: agentsResult.data?.filter(a => a.status === 'active').length || 0,
        totalTasks: tasksResult.data?.length || 0,
        completedTasks: tasksResult.data?.filter(t => t.status === 'completed').length || 0,
        pendingTasks: tasksResult.data?.filter(t => t.status === 'pending').length || 0,
        recentMetrics: metricsResult.data?.length || 0
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return { success: false, error: error.message };
    }
  }
}

export const aiSerfdomAPI = new AISerfdomAPI();
export default aiSerfdomAPI;