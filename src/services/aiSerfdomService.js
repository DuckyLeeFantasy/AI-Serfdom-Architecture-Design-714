import { supabase } from '../lib/supabase';

export class AIAgentService {
  constructor(agentRole) {
    this.agentRole = agentRole;
  }

  // Get agent by role
  async getAgent() {
    try {
      const { data, error } = await supabase
        .from('agents_system_7x9k2m')
        .select('*')
        .eq('role', this.agentRole)
        .single();

      if (error) {
        console.warn(`Agent not found for role ${this.agentRole}, creating mock agent`);
        return {
          id: `mock_${this.agentRole}_${Date.now()}`,
          role: this.agentRole,
          name: `${this.agentRole.charAt(0).toUpperCase() + this.agentRole.slice(1)} Agent`,
          status: 'active'
        };
      }
      return data;
    } catch (error) {
      console.warn('Error getting agent, using mock:', error);
      return {
        id: `mock_${this.agentRole}_${Date.now()}`,
        role: this.agentRole,
        name: `${this.agentRole.charAt(0).toUpperCase() + this.agentRole.slice(1)} Agent`,
        status: 'active'
      };
    }
  }

  // Update agent metrics
  async updateMetrics(metrics) {
    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('agents_system_7x9k2m')
        .update({ metrics })
        .eq('id', agent.id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error updating metrics:', error);
      return null;
    }
  }

  // Log performance metric
  async logMetric(metricType, value, unit = null, metadata = {}) {
    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('system_metrics_7x9k2m')
        .insert([{
          agent_id: agent.id,
          metric_type: metricType,
          value,
          unit,
          metadata
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error logging metric:', error);
      // Return mock data for demonstration
      return [{
        id: `mock_metric_${Date.now()}`,
        agent_id: `mock_${this.agentRole}_agent`,
        metric_type: metricType,
        value,
        unit,
        metadata
      }];
    }
  }

  // Make a decision (King AI only)
  async makeDecision(decisionType, description, reasoning, confidenceScore) {
    if (this.agentRole !== 'king') {
      throw new Error('Only King AI can make decisions');
    }

    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('decisions_7x9k2m')
        .insert([{
          agent_id: agent.id,
          decision_type: decisionType,
          description,
          reasoning,
          confidence_score: confidenceScore,
          status: 'pending'
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error making decision:', error);
      // Return mock data for demonstration
      return [{
        id: `mock_decision_${Date.now()}`,
        agent_id: `mock_king_agent`,
        decision_type: decisionType,
        description,
        reasoning,
        confidence_score: confidenceScore,
        status: 'executed'
      }];
    }
  }

  // Assign task (King AI only)
  async assignTask(assignedToRole, title, description, priority = 3) {
    if (this.agentRole !== 'king') {
      throw new Error('Only King AI can assign tasks');
    }

    try {
      const [assignerAgent, assigneeAgent] = await Promise.all([
        this.getAgent(),
        supabase.from('agents_system_7x9k2m').select('*').eq('role', assignedToRole).single()
      ]);

      if (assigneeAgent.error) {
        console.warn('Assignee agent not found, using mock');
      }

      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .insert([{
          assigned_by: assignerAgent.id,
          assigned_to: assigneeAgent.data?.id || `mock_${assignedToRole}_agent`,
          title,
          description,
          priority,
          status: 'pending'
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error assigning task:', error);
      // Return mock data for demonstration
      return [{
        id: `mock_task_${Date.now()}`,
        assigned_by: `mock_king_agent`,
        assigned_to: `mock_${assignedToRole}_agent`,
        title,
        description,
        priority,
        status: 'assigned'
      }];
    }
  }

  // Update task progress
  async updateTaskProgress(taskId, progress, status = null) {
    try {
      const updateData = {
        progress,
        ...(status && { status }),
        ...(progress >= 100 && { completed_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .update(updateData)
        .eq('id', taskId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error updating task progress:', error);
      return null;
    }
  }

  // Send communication
  async sendMessage(receiverRole, messageType, content, channel = 'default', priority = 3) {
    try {
      const [senderAgent, receiverAgent] = await Promise.all([
        this.getAgent(),
        supabase.from('agents_system_7x9k2m').select('*').eq('role', receiverRole).single()
      ]);

      if (receiverAgent.error) {
        console.warn('Receiver agent not found, using mock');
      }

      const { data, error } = await supabase
        .from('communications_7x9k2m')
        .insert([{
          sender_id: senderAgent.id,
          receiver_id: receiverAgent.data?.id || `mock_${receiverRole}_agent`,
          message_type: messageType,
          content,
          channel,
          priority,
          status: 'sent'
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error sending message:', error);
      return null;
    }
  }

  // Get communications for this agent
  async getCommunications(limit = 50) {
    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('communications_7x9k2m')
        .select(`
          *,
          sender:sender_id(name, role),
          receiver:receiver_id(name, role)
        `)
        .or(`sender_id.eq.${agent.id},receiver_id.eq.${agent.id}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error getting communications:', error);
      return [];
    }
  }

  // Log security event
  async logSecurityEvent(eventType, severity, description, details = {}) {
    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('security_events_7x9k2m')
        .insert([{
          event_type: eventType,
          severity,
          agent_id: agent.id,
          description,
          details,
          resolved: false
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error logging security event:', error);
      return null;
    }
  }

  // Create workflow
  async createWorkflow(name, description, definition, status = 'pending') {
    try {
      const agent = await this.getAgent();
      const { data, error } = await supabase
        .from('workflows_7x9k2m')
        .insert([{
          name,
          description,
          definition,
          status,
          created_by: agent.id,
          progress: 0
        }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error creating workflow:', error);
      return null;
    }
  }

  // Update workflow progress
  async updateWorkflowProgress(workflowId, progress, currentStage, executionLog = []) {
    try {
      const updateData = {
        progress,
        current_stage: currentStage,
        execution_log: executionLog,
        status: progress >= 100 ? 'completed' : 'in_progress',
        ...(progress >= 100 && { completed_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('workflows_7x9k2m')
        .update(updateData)
        .eq('id', workflowId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Error updating workflow progress:', error);
      return null;
    }
  }
}

// Specific agent services
export const KingAIService = new AIAgentService('king');
export const SerfAgentService = new AIAgentService('serf');
export const PeasantAgentService = new AIAgentService('peasant');

// Utility functions
export const simulateRealTimeData = () => {
  const agents = [KingAIService, SerfAgentService, PeasantAgentService];

  // Simulate metrics every 30 seconds
  setInterval(async () => {
    for (const agent of agents) {
      try {
        // CPU usage
        await agent.logMetric(
          'cpu_usage',
          Math.random() * 30 + 50, // 50-80%
          '%',
          {
            core_count: 8,
            load_average: (Math.random() * 2 + 1).toFixed(2)
          }
        );

        // Memory usage
        await agent.logMetric(
          'memory_usage',
          Math.random() * 20 + 40, // 40-60%
          '%',
          {
            total_gb: 32,
            available_gb: (32 - (Math.random() * 20 + 12)).toFixed(1)
          }
        );

        // Response time
        await agent.logMetric(
          'response_time',
          Math.random() * 0.2 + 0.2, // 0.2-0.4 seconds
          'seconds',
          {
            avg_response: (Math.random() * 0.1 + 0.25).toFixed(3)
          }
        );
      } catch (error) {
        console.error(`Error simulating data for ${agent.agentRole}:`, error);
      }
    }
  }, 30000);
};

export default {
  KingAIService,
  SerfAgentService,
  PeasantAgentService,
  simulateRealTimeData
};