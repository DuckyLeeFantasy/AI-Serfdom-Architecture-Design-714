import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export class CoordinationEngine extends EventEmitter {
  constructor(messageBroker) {
    super();
    this.messageBroker = messageBroker;
    this.activeCoordinations = new Map();
    this.coordinationHistory = [];
    this.scenarios = new Map();
    
    // Initialize scenarios
    this.initializeScenarios();
    
    // Set up message handlers
    this.setupMessageHandlers();
  }

  initializeScenarios() {
    this.scenarios.set('customer_service', {
      id: 'customer_service',
      name: 'Customer Service Escalation',
      description: 'Complex customer inquiry requiring multi-agent collaboration',
      participants: ['king', 'serf', 'peasant'],
      estimatedTime: '45s',
      complexity: 'high',
      steps: [
        { agent: 'serf', action: 'Receive and analyze customer inquiry' },
        { agent: 'serf', action: 'Determine escalation necessity' },
        { agent: 'king', action: 'Develop strategic response plan' },
        { agent: 'king', action: 'Delegate data analysis to backend' },
        { agent: 'peasant', action: 'Process customer data and identify patterns' },
        { agent: 'king', action: 'Synthesize final resolution strategy' },
        { agent: 'serf', action: 'Implement customer resolution' }
      ]
    });

    this.scenarios.set('data_analysis', {
      id: 'data_analysis',
      name: 'Real-time Data Analysis',
      description: 'Large dataset processing with visualization requirements',
      participants: ['king', 'serf', 'peasant'],
      estimatedTime: '30s',
      complexity: 'medium',
      steps: [
        { agent: 'king', action: 'Initiate data analysis strategy' },
        { agent: 'king', action: 'Delegate processing to backend' },
        { agent: 'peasant', action: 'Process dataset with statistical analysis' },
        { agent: 'king', action: 'Delegate visualization to frontend' },
        { agent: 'serf', action: 'Create interactive data visualization' },
        { agent: 'king', action: 'Validate and approve results' }
      ]
    });

    this.scenarios.set('system_optimization', {
      id: 'system_optimization',
      name: 'System Performance Optimization',
      description: 'Comprehensive system analysis and optimization',
      participants: ['king', 'serf', 'peasant'],
      estimatedTime: '60s',
      complexity: 'high',
      steps: [
        { agent: 'king', action: 'Analyze system performance metrics' },
        { agent: 'king', action: 'Coordinate optimization tasks' },
        { agent: 'peasant', action: 'Optimize database performance' },
        { agent: 'serf', action: 'Optimize user interface responsiveness' },
        { agent: 'king', action: 'Validate optimization results' },
        { agent: 'king', action: 'Document performance improvements' }
      ]
    });

    this.scenarios.set('security_incident', {
      id: 'security_incident',
      name: 'Security Incident Response',
      description: 'Coordinated response to security threat detection',
      participants: ['king', 'serf', 'peasant'],
      estimatedTime: '90s',
      complexity: 'critical',
      steps: [
        { agent: 'system', action: 'Security threat detected' },
        { agent: 'king', action: 'Initiate emergency response protocol' },
        { agent: 'king', action: 'Coordinate security measures' },
        { agent: 'peasant', action: 'Implement security lockdown procedures' },
        { agent: 'serf', action: 'Activate user notification protocols' },
        { agent: 'king', action: 'Validate security response effectiveness' }
      ]
    });
  }

  setupMessageHandlers() {
    this.messageBroker.on('message', ({ channel, message }) => {
      if (channel.startsWith('coordination.')) {
        this.handleCoordinationMessage(channel, message);
      }
    });
  }

  async startCoordination(scenarioId, options = {}) {
    try {
      const scenario = this.scenarios.get(scenarioId);
      if (!scenario) {
        throw new Error(`Unknown scenario: ${scenarioId}`);
      }

      const coordinationId = options.coordinationId || uuidv4();
      
      const coordination = {
        id: coordinationId,
        scenarioId,
        scenario,
        status: 'initializing',
        participants: [...scenario.participants],
        startTime: Date.now(),
        currentStep: 0,
        steps: [...scenario.steps],
        messages: [],
        tasks: [],
        decisions: [],
        metrics: {
          messagesExchanged: 0,
          tasksCompleted: 0,
          decisionsExecuted: 0,
          errors: 0
        },
        logs: [],
        options
      };

      this.activeCoordinations.set(coordinationId, coordination);

      // Log coordination start
      await this.logCoordinationEvent(coordinationId, 'coordination_started', {
        scenario: scenarioId,
        participants: coordination.participants.length
      });

      // Notify participants
      await this.notifyParticipants(coordinationId, 'coordination_started', {
        scenario,
        coordinationId,
        yourRole: 'participant'
      });

      // Start execution
      coordination.status = 'active';
      await this.executeNextStep(coordinationId);

      this.emit('coordination_started', coordination);

      logger.info(`Coordination started: ${coordinationId} (${scenarioId})`);

      return coordination;
    } catch (error) {
      logger.error('Failed to start coordination:', error);
      throw error;
    }
  }

  async executeNextStep(coordinationId) {
    try {
      const coordination = this.activeCoordinations.get(coordinationId);
      if (!coordination) {
        throw new Error(`Coordination not found: ${coordinationId}`);
      }

      if (coordination.currentStep >= coordination.steps.length) {
        return this.completeCoordination(coordinationId, 'success');
      }

      const step = coordination.steps[coordination.currentStep];
      coordination.status = 'executing_step';

      await this.logCoordinationEvent(coordinationId, 'step_started', {
        stepIndex: coordination.currentStep,
        agent: step.agent,
        action: step.action
      });

      // Execute step based on agent type
      await this.executeStepForAgent(coordinationId, step);

      // Move to next step after delay
      setTimeout(() => {
        this.moveToNextStep(coordinationId);
      }, this.getStepDelay(step));

    } catch (error) {
      logger.error(`Failed to execute step for coordination ${coordinationId}:`, error);
      await this.handleCoordinationError(coordinationId, error);
    }
  }

  async executeStepForAgent(coordinationId, step) {
    const coordination = this.activeCoordinations.get(coordinationId);
    
    switch (step.agent) {
      case 'king':
        await this.executeKingStep(coordinationId, step);
        break;
      case 'serf':
        await this.executeSerfStep(coordinationId, step);
        break;
      case 'peasant':
        await this.executePeasantStep(coordinationId, step);
        break;
      case 'system':
        await this.executeSystemStep(coordinationId, step);
        break;
      default:
        logger.warn(`Unknown agent type in step: ${step.agent}`);
    }
  }

  async executeKingStep(coordinationId, step) {
    const actions = {
      'Receive and analyze customer inquiry': async () => {
        await this.sendMessage(coordinationId, 'king', 'serf', 
          'Provide customer inquiry details for strategic analysis', 'request');
      },
      'Develop strategic response plan': async () => {
        await this.makeDecision(coordinationId, 'king', 'strategic_response', 
          'Customer service strategy formulated', 'Customer satisfaction priority with system learning', 92.5);
      },
      'Delegate data analysis to backend': async () => {
        await this.assignTask(coordinationId, 'king', 'peasant', 
          'Customer Data Analysis', 'Analyze billing patterns for improvements', 4);
      },
      'Initiate data analysis strategy': async () => {
        await this.makeDecision(coordinationId, 'king', 'data_analysis_strategy',
          'Data analysis approach determined', 'Statistical analysis with visualization requirements', 94.0);
      },
      'Delegate processing to backend': async () => {
        await this.assignTask(coordinationId, 'king', 'peasant',
          'Dataset Processing', 'Process large dataset with statistical analysis', 5);
      },
      'Analyze system performance metrics': async () => {
        await this.makeDecision(coordinationId, 'king', 'performance_analysis',
          'System performance assessment completed', 'Identified optimization opportunities', 89.5);
      },
      'Coordinate optimization tasks': async () => {
        await this.sendMessage(coordinationId, 'king', 'peasant',
          'Optimize database performance', 'command');
        await this.sendMessage(coordinationId, 'king', 'serf',
          'Optimize user interface responsiveness', 'command');
      },
      'Initiate emergency response protocol': async () => {
        await this.makeDecision(coordinationId, 'king', 'emergency_response',
          'Emergency response protocol activated', 'Security threat requires immediate coordinated response', 98.0);
      }
    };

    const action = actions[step.action];
    if (action) {
      await action();
    } else {
      logger.warn(`Unknown king action: ${step.action}`);
    }
  }

  async executeSerfStep(coordinationId, step) {
    const actions = {
      'Receive and analyze customer inquiry': async () => {
        await this.logMetric(coordinationId, 'serf', 'inquiry_received', 1, 'count');
      },
      'Determine escalation necessity': async () => {
        await this.sendMessage(coordinationId, 'serf', 'king',
          'Customer inquiry requires strategic decision', 'escalation');
      },
      'Create interactive data visualization': async () => {
        await this.logMetric(coordinationId, 'serf', 'visualization_created', 1, 'count', {
          charts_created: 5,
          interactivity_level: 'high'
        });
      },
      'Optimize user interface responsiveness': async () => {
        await this.logMetric(coordinationId, 'serf', 'ui_optimization', 40, '% improvement', {
          load_time_reduction: 40,
          responsive_design: true
        });
      },
      'Activate user notification protocols': async () => {
        await this.logMetric(coordinationId, 'serf', 'security_communication', 1, 'count', {
          users_notified: 1543,
          transparency_level: 'appropriate'
        });
      },
      'Implement customer resolution': async () => {
        await this.logMetric(coordinationId, 'serf', 'customer_satisfaction', 98.5, '%', {
          resolution_time: '12 minutes',
          escalation_successful: true
        });
      }
    };

    const action = actions[step.action];
    if (action) {
      await action();
    } else {
      logger.warn(`Unknown serf action: ${step.action}`);
    }
  }

  async executePeasantStep(coordinationId, step) {
    const actions = {
      'Process customer data and identify patterns': async () => {
        await this.logMetric(coordinationId, 'peasant', 'data_analysis_completion', 1, 'count', {
          records_analyzed: 15000,
          patterns_found: 3,
          recommendations: 5
        });
      },
      'Process dataset with statistical analysis': async () => {
        await this.logMetric(coordinationId, 'peasant', 'data_processing_rate', 2.3, 'GB/s', {
          total_records: 500000,
          processing_time: '18 seconds'
        });
      },
      'Optimize database performance': async () => {
        await this.logMetric(coordinationId, 'peasant', 'database_optimization', 25, '% improvement', {
          query_speed_improvement: 25,
          index_optimization: true
        });
      },
      'Implement security lockdown procedures': async () => {
        await this.logMetric(coordinationId, 'peasant', 'security_measures', 1, 'count', {
          access_restrictions: 'activated',
          audit_logging: 'enhanced'
        });
      }
    };

    const action = actions[step.action];
    if (action) {
      await action();
    } else {
      logger.warn(`Unknown peasant action: ${step.action}`);
    }
  }

  async executeSystemStep(coordinationId, step) {
    const actions = {
      'Security threat detected': async () => {
        await this.logCoordinationEvent(coordinationId, 'security_threat_detected', {
          threat_type: 'unusual_access_patterns',
          severity: 'high',
          automated_detection: true
        });
      }
    };

    const action = actions[step.action];
    if (action) {
      await action();
    } else {
      logger.warn(`Unknown system action: ${step.action}`);
    }
  }

  async moveToNextStep(coordinationId) {
    try {
      const coordination = this.activeCoordinations.get(coordinationId);
      if (!coordination) return;

      coordination.currentStep++;
      
      await this.logCoordinationEvent(coordinationId, 'step_completed', {
        stepIndex: coordination.currentStep - 1,
        nextStep: coordination.currentStep < coordination.steps.length ? 
          coordination.steps[coordination.currentStep] : null
      });

      if (coordination.currentStep >= coordination.steps.length) {
        await this.completeCoordination(coordinationId, 'success');
      } else {
        await this.executeNextStep(coordinationId);
      }
    } catch (error) {
      logger.error(`Failed to move to next step for coordination ${coordinationId}:`, error);
      await this.handleCoordinationError(coordinationId, error);
    }
  }

  async completeCoordination(coordinationId, outcome) {
    try {
      const coordination = this.activeCoordinations.get(coordinationId);
      if (!coordination) return;

      const endTime = Date.now();
      const duration = endTime - coordination.startTime;

      coordination.status = 'completed';
      coordination.endTime = endTime;
      coordination.duration = duration;
      coordination.outcome = outcome;

      // Calculate efficiency score
      const efficiency = this.calculateEfficiencyScore(coordination);
      coordination.efficiencyScore = efficiency;

      await this.logCoordinationEvent(coordinationId, 'coordination_completed', {
        outcome,
        duration: this.formatDuration(duration),
        efficiency,
        metrics: coordination.metrics
      });

      // Notify participants
      await this.notifyParticipants(coordinationId, 'coordination_completed', {
        outcome,
        duration,
        efficiency,
        metrics: coordination.metrics
      });

      // Move to history
      this.coordinationHistory.push({...coordination});
      this.activeCoordinations.delete(coordinationId);

      this.emit('coordination_completed', {
        coordinationId,
        outcome,
        duration,
        efficiency,
        scenario: coordination.scenario
      });

      logger.info(`Coordination completed: ${coordinationId} (${outcome}) in ${this.formatDuration(duration)}`);

      return {
        coordinationId,
        outcome,
        duration,
        efficiency,
        metrics: coordination.metrics
      };
    } catch (error) {
      logger.error(`Failed to complete coordination ${coordinationId}:`, error);
      throw error;
    }
  }

  async handleCoordinationError(coordinationId, error) {
    try {
      const coordination = this.activeCoordinations.get(coordinationId);
      if (!coordination) return;

      coordination.status = 'error';
      coordination.error = error.message;
      coordination.metrics.errors++;

      await this.logCoordinationEvent(coordinationId, 'coordination_error', {
        error: error.message,
        step: coordination.currentStep,
        stepAction: coordination.steps[coordination.currentStep]?.action
      });

      await this.completeCoordination(coordinationId, 'error');
    } catch (err) {
      logger.error(`Failed to handle coordination error for ${coordinationId}:`, err);
    }
  }

  // Helper methods for coordination actions
  async sendMessage(coordinationId, fromAgent, toAgent, message, type = 'command') {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) return;

    const messageObj = {
      id: uuidv4(),
      coordinationId,
      fromAgent,
      toAgent,
      message,
      type,
      timestamp: new Date().toISOString()
    };

    coordination.messages.push(messageObj);
    coordination.metrics.messagesExchanged++;

    await this.logCoordinationEvent(coordinationId, 'message_sent', {
      from: fromAgent,
      to: toAgent,
      type,
      message: message.substring(0, 100)
    });

    // Publish message
    await this.messageBroker.publishCoordinationEvent(coordinationId, 'message', messageObj);

    return messageObj;
  }

  async assignTask(coordinationId, assignedBy, assignedTo, title, description, priority = 3) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) return;

    const task = {
      id: uuidv4(),
      coordinationId,
      assignedBy,
      assignedTo,
      title,
      description,
      priority,
      status: 'assigned',
      createdAt: new Date().toISOString()
    };

    coordination.tasks.push(task);
    coordination.metrics.tasksCompleted++;

    await this.logCoordinationEvent(coordinationId, 'task_assigned', {
      assignedBy,
      assignedTo,
      taskId: task.id,
      title
    });

    return task;
  }

  async makeDecision(coordinationId, agent, decisionType, description, reasoning, confidence) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) return;

    const decision = {
      id: uuidv4(),
      coordinationId,
      agent,
      decisionType,
      description,
      reasoning,
      confidence,
      timestamp: new Date().toISOString()
    };

    coordination.decisions.push(decision);
    coordination.metrics.decisionsExecuted++;

    await this.logCoordinationEvent(coordinationId, 'decision_made', {
      agent,
      decisionType,
      confidence,
      description
    });

    return decision;
  }

  async logMetric(coordinationId, agent, metricType, value, unit, metadata = {}) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) return;

    await this.logCoordinationEvent(coordinationId, 'metric_logged', {
      agent,
      metric: metricType,
      value,
      unit,
      metadata
    });
  }

  async logCoordinationEvent(coordinationId, eventType, details) {
    try {
      const event = {
        coordinationId,
        eventType,
        details,
        timestamp: new Date().toISOString()
      };

      // Publish event
      await this.messageBroker.publishCoordinationEvent(coordinationId, eventType, event);

      logger.debug(`Coordination event: ${eventType}`, { coordinationId, details });
    } catch (error) {
      logger.error(`Failed to log coordination event: ${eventType}`, error);
    }
  }

  async notifyParticipants(coordinationId, eventType, data) {
    const coordination = this.activeCoordinations.get(coordinationId);
    if (!coordination) return;

    for (const participant of coordination.participants) {
      await this.messageBroker.sendToAgent(participant, {
        eventType,
        coordinationId,
        data
      });
    }
  }

  // Utility methods
  getStepDelay(step) {
    // Different delays based on step complexity
    const complexityDelays = {
      'king': 2000,    // King decisions take longer
      'serf': 1500,    // Serf actions are moderate
      'peasant': 2500, // Peasant processing takes time
      'system': 1000   // System actions are quick
    };

    return complexityDelays[step.agent] || 1500;
  }

  calculateEfficiencyScore(coordination) {
    const durationMinutes = coordination.duration / (1000 * 60);
    let score = 100;

    // Deduct points for longer duration
    if (durationMinutes > 2) score -= (durationMinutes - 2) * 5;

    // Add points for successful completion
    if (coordination.outcome === 'success') score += 10;

    // Deduct points for errors
    score -= coordination.metrics.errors * 10;

    // Add points for effective communication
    if (coordination.metrics.messagesExchanged > 0 && coordination.metrics.messagesExchanged < 15) {
      score += 10;
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

  // Public API methods
  getCoordination(coordinationId) {
    return this.activeCoordinations.get(coordinationId) || 
           this.coordinationHistory.find(c => c.id === coordinationId);
  }

  getActiveCoordinations() {
    return Array.from(this.activeCoordinations.values());
  }

  getCoordinationHistory(limit = 10) {
    return this.coordinationHistory.slice(-limit);
  }

  getAvailableScenarios() {
    return Array.from(this.scenarios.values());
  }

  async handleCoordinationRequest(request) {
    const { action, scenarioId, coordinationId, data } = request;

    switch (action) {
      case 'start':
        return this.startCoordination(scenarioId, data);
      
      case 'get_status':
        return this.getCoordination(coordinationId);
      
      case 'get_scenarios':
        return this.getAvailableScenarios();
      
      case 'get_active':
        return this.getActiveCoordinations();
      
      case 'get_history':
        return this.getCoordinationHistory(data?.limit);
      
      default:
        throw new Error(`Unknown coordination action: ${action}`);
    }
  }

  handleCoordinationMessage(channel, message) {
    const coordinationId = channel.replace('coordination.', '');
    logger.debug(`Coordination message received:`, { coordinationId, message });
  }
}

export default CoordinationEngine;