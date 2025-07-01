import { supabase } from '../lib/supabase';
import { KingAIService, SerfAgentService, PeasantAgentService } from './aiSerfdomService';

export class CoordinationService {
  constructor() {
    this.activeCoordinations = new Map();
    this.messageQueue = [];
    this.coordinationHistory = [];
  }

  // Initialize coordination session
  async initializeCoordination(scenarioId, participants) {
    const coordination = {
      id: `coord_${Date.now()}`,
      scenario_id: scenarioId,
      participants,
      status: 'initializing',
      created_at: new Date().toISOString(),
      messages: [],
      tasks: [],
      decisions: [],
      metrics: {
        start_time: Date.now(),
        messages_sent: 0,
        tasks_completed: 0,
        decisions_made: 0
      }
    };

    this.activeCoordinations.set(coordination.id, coordination);
    
    // Log coordination start
    await this.logCoordinationEvent(coordination.id, 'coordination_started', {
      scenario: scenarioId,
      participants: participants.length
    });

    return coordination;
  }

  // Send message between agents
  async sendAgentMessage(coordinationId, fromAgent, toAgent, message, type = 'command') {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) throw new Error('Coordination not found');

    const messageObj = {
      id: `msg_${Date.now()}`,
      coordination_id: coordinationId,
      from_agent: fromAgent,
      to_agent: toAgent,
      message,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Add to coordination messages
    coordination.messages.push(messageObj);
    coordination.metrics.messages_sent++;

    // Log to database
    await supabase
      .from('communications_7x9k2m')
      .insert([{
        sender_id: await this.getAgentId(fromAgent),
        receiver_id: await this.getAgentId(toAgent),
        message_type: type,
        content: message,
        channel: 'coordination',
        priority: this.getMessagePriority(type),
        status: 'sent',
        metadata: { coordination_id: coordinationId }
      }]);

    await this.logCoordinationEvent(coordinationId, 'message_sent', {
      from: fromAgent,
      to: toAgent,
      type,
      message: message.substring(0, 100)
    });

    return messageObj;
  }

  // Create and assign task during coordination
  async createCoordinationTask(coordinationId, assignedByAgent, assignedToAgent, taskData) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) throw new Error('Coordination not found');

    const task = {
      id: `task_${Date.now()}`,
      coordination_id: coordinationId,
      assigned_by: assignedByAgent,
      assigned_to: assignedToAgent,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 3,
      status: 'assigned',
      created_at: new Date().toISOString(),
      metadata: taskData.metadata || {}
    };

    // Add to coordination tasks
    coordination.tasks.push(task);

    // Create task in database
    const { data, error } = await supabase
      .from('tasks_7x9k2m')
      .insert([{
        assigned_by: await this.getAgentId(assignedByAgent),
        assigned_to: await this.getAgentId(assignedToAgent),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'pending',
        metadata: { ...task.metadata, coordination_id: coordinationId }
      }])
      .select()
      .single();

    if (error) throw error;

    await this.logCoordinationEvent(coordinationId, 'task_assigned', {
      assignedBy: assignedByAgent,
      assignedTo: assignedToAgent,
      taskId: data.id
    });

    return { ...task, database_id: data.id };
  }

  // Record agent decision during coordination
  async recordCoordinationDecision(coordinationId, agentId, decisionData) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) throw new Error('Coordination not found');

    const decision = {
      id: `decision_${Date.now()}`,
      coordination_id: coordinationId,
      agent_id: agentId,
      decision_type: decisionData.type,
      description: decisionData.description,
      reasoning: decisionData.reasoning,
      confidence_score: decisionData.confidence || 85,
      timestamp: new Date().toISOString(),
      status: 'made'
    };

    // Add to coordination decisions
    coordination.decisions.push(decision);
    coordination.metrics.decisions_made++;

    // Record decision in database
    const { data, error } = await supabase
      .from('decisions_7x9k2m')
      .insert([{
        agent_id: await this.getAgentId(agentId),
        decision_type: decision.decision_type,
        description: decision.description,
        reasoning: decision.reasoning,
        confidence_score: decision.confidence_score,
        status: 'executed',
        metadata: { coordination_id: coordinationId }
      }])
      .select()
      .single();

    if (error) throw error;

    await this.logCoordinationEvent(coordinationId, 'decision_made', {
      agent: agentId,
      decisionType: decision.decision_type,
      confidence: decision.confidence_score
    });

    return { ...decision, database_id: data.id };
  }

  // Log metrics during coordination
  async logCoordinationMetric(coordinationId, agentId, metricType, value, unit = null) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) throw new Error('Coordination not found');

    // Log metric to database
    await supabase
      .from('system_metrics_7x9k2m')
      .insert([{
        agent_id: await this.getAgentId(agentId),
        metric_type: metricType,
        value,
        unit,
        metadata: { coordination_id: coordinationId }
      }]);

    await this.logCoordinationEvent(coordinationId, 'metric_logged', {
      agent: agentId,
      metric: metricType,
      value
    });
  }

  // Complete coordination session
  async completeCoordination(coordinationId, outcome) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) throw new Error('Coordination not found');

    // Calculate final metrics
    const endTime = Date.now();
    const duration = endTime - coordination.metrics.start_time;

    const finalMetrics = {
      ...coordination.metrics,
      end_time: endTime,
      duration_ms: duration,
      duration_formatted: this.formatDuration(duration),
      outcome,
      efficiency_score: this.calculateEfficiencyScore(coordination)
    };

    // Update coordination status
    coordination.status = 'completed';
    coordination.completed_at = new Date().toISOString();
    coordination.outcome = outcome;
    coordination.final_metrics = finalMetrics;

    // Move to history
    this.coordinationHistory.push(coordination);
    this.activeCoordinations.delete(coordinationId);

    await this.logCoordinationEvent(coordinationId, 'coordination_completed', {
      outcome,
      duration: finalMetrics.duration_formatted,
      efficiency: finalMetrics.efficiency_score
    });

    return finalMetrics;
  }

  // Get coordination status
  getCoordinationStatus(coordinationId) {
    return this.activeCoordinations.get(coordinationId) || 
           this.coordinationHistory.find(c => c.id === coordinationId);
  }

  // Get all active coordinations
  getActiveCoordinations() {
    return Array.from(this.activeCoordinations.values());
  }

  // Get coordination history
  getCoordinationHistory(limit = 10) {
    return this.coordinationHistory.slice(-limit);
  }

  // Helper methods
  async getAgentId(agentRole) {
    const { data, error } = await supabase
      .from('agents_system_7x9k2m')
      .select('id')
      .eq('role', agentRole)
      .single();

    if (error) throw error;
    return data.id;
  }

  getMessagePriority(messageType) {
    const priorityMap = {
      emergency: 5,
      escalation: 4,
      command: 3,
      delegation: 3,
      request: 2,
      info: 1
    };
    return priorityMap[messageType] || 2;
  }

  calculateEfficiencyScore(coordination) {
    const { metrics } = coordination;
    const durationMinutes = metrics.duration_ms / (1000 * 60);
    
    // Base score starts at 100
    let score = 100;
    
    // Deduct points for longer duration
    if (durationMinutes > 5) score -= (durationMinutes - 5) * 2;
    
    // Add points for successful task completion
    if (metrics.tasks_completed > 0) {
      score += metrics.tasks_completed * 5;
    }
    
    // Add points for effective communication
    if (metrics.messages_sent > 0 && metrics.messages_sent < 20) {
      score += 10; // Efficient communication
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  async logCoordinationEvent(coordinationId, eventType, details) {
    await supabase
      .from('coordination_events_7x9k2m')
      .insert([{
        coordination_id: coordinationId,
        event_type: eventType,
        details,
        timestamp: new Date().toISOString()
      }]);
  }
}

export const coordinationService = new CoordinationService();
export default CoordinationService;