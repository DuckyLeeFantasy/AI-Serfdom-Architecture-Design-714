import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { KingAIService, SerfAgentService, PeasantAgentService } from '../services/aiSerfdomService';

const { FiPlay, FiDatabase, FiCpu, FiUsers, FiServer } = FiIcons;

const SupabaseIntegration = () => {
  const [actionLog, setActionLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const logAction = (action, status, details = '') => {
    setActionLog(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      status,
      details
    }, ...prev.slice(0, 19)]);
  };

  const simulateAgentActivity = async () => {
    setIsRunning(true);
    logAction('Starting AI Agent Simulation', 'info', 'Initializing all agents');

    try {
      // King AI makes a decision
      const decision = await KingAIService.makeDecision(
        'resource_allocation',
        'Optimize system resources for peak performance',
        'Current load indicates need for resource rebalancing',
        94.5
      );
      logAction('King AI Decision', 'success', `Decision ID: ${decision[0]?.id}`);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // King AI assigns task to Serf
      const serfTask = await KingAIService.assignTask(
        'serf',
        'Update User Interface Components',
        'Enhance user experience based on recent feedback',
        4
      );
      logAction('Task Assignment', 'success', `Task assigned to Serf: ${serfTask[0]?.id}`);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // King AI assigns task to Peasant
      const peasantTask = await KingAIService.assignTask(
        'peasant',
        'Database Performance Optimization',
        'Implement query optimization and indexing improvements',
        5
      );
      logAction('Task Assignment', 'success', `Task assigned to Peasant: ${peasantTask[0]?.id}`);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Serf logs metrics
      await SerfAgentService.logMetric('user_satisfaction', 97.3, '%', {
        survey_responses: 1543,
        improvement: 2.1
      });
      logAction('Serf Metrics', 'success', 'User satisfaction metrics logged');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Peasant logs performance metrics
      await PeasantAgentService.logMetric('query_performance', 0.23, 'seconds', {
        avg_response_time: 0.23,
        optimization_applied: true
      });
      logAction('Peasant Metrics', 'success', 'Performance metrics logged');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Serf sends communication to Peasant
      await SerfAgentService.sendMessage(
        'peasant',
        'data_request',
        {
          request_type: 'user_analytics',
          time_range: 'last_24h',
          priority: 'normal'
        },
        'data_channel',
        3
      );
      logAction('Inter-Agent Communication', 'success', 'Serf → Peasant data request');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update task progress
      if (serfTask[0]) {
        await SerfAgentService.updateTaskProgress(serfTask[0].id, 65);
        logAction('Task Progress', 'info', 'Serf task updated to 65%');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log security events
      await KingAIService.logSecurityEvent(
        'system_scan',
        'low',
        'Routine security scan completed successfully',
        {
          scan_type: 'vulnerability_assessment',
          threats_found: 0,
          recommendations: ['continue_monitoring']
        }
      );
      logAction('Security Event', 'success', 'Security scan logged');

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create workflow
      const workflow = await PeasantAgentService.createWorkflow(
        'Data Processing Pipeline',
        'Automated data ingestion and processing workflow',
        {
          stages: ['collect', 'validate', 'transform', 'store'],
          timeout: '10m',
          retry_count: 3
        },
        'in_progress'
      );
      logAction('Workflow Created', 'success', `Workflow ID: ${workflow[0]?.id}`);

      logAction('Simulation Complete', 'success', 'All agent activities completed successfully');

    } catch (error) {
      console.error('Simulation error:', error);
      logAction('Simulation Error', 'error', error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const demoActions = [
    {
      title: 'King AI Decision Making',
      description: 'Demonstrate strategic decision-making capabilities',
      icon: FiCpu,
      color: 'gold'
    },
    {
      title: 'Task Delegation',
      description: 'Show hierarchical task assignment system',
      icon: FiUsers,
      color: 'emerald'
    },
    {
      title: 'Performance Monitoring',
      description: 'Real-time metrics collection and analysis',
      icon: FiServer,
      color: 'blue'
    },
    {
      title: 'Inter-Agent Communication',
      description: 'Secure communication between AI agents',
      icon: FiDatabase,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Supabase Backend Integration</h2>
          <p className="text-royal-300">Live demonstration of AI-Serfdom system capabilities</p>
        </div>
        <button
          onClick={simulateAgentActivity}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-royal-600 text-royal-400 cursor-not-allowed' 
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
          }`}
        >
          <SafeIcon icon={FiPlay} className={isRunning ? 'animate-spin' : ''} />
          <span>{isRunning ? 'Running...' : 'Start Simulation'}</span>
        </button>
      </div>

      {/* Demo Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoActions.map((action, index) => (
          <motion.div
            key={action.title}
            className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-${action.color}-500/20`}>
                <SafeIcon icon={action.icon} className={`text-lg text-${action.color}-400`} />
              </div>
            </div>
            <h3 className="text-white font-medium mb-2">{action.title}</h3>
            <p className="text-royal-300 text-sm">{action.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {actionLog.length === 0 ? (
            <p className="text-royal-400 text-sm">No activities yet. Start the simulation to see live updates.</p>
          ) : (
            actionLog.map((log) => (
              <motion.div
                key={log.id}
                className="bg-royal-600/30 rounded p-3 border border-royal-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-400' :
                      log.status === 'error' ? 'bg-red-400' :
                      log.status === 'warning' ? 'bg-yellow-400' :
                      'bg-blue-400'
                    }`}></div>
                    <span className="text-white font-medium text-sm">{log.action}</span>
                  </div>
                  <span className="text-royal-400 text-xs">{log.timestamp}</span>
                </div>
                {log.details && (
                  <p className="text-royal-300 text-xs ml-4">{log.details}</p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Database Schema Info */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Database Schema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { table: 'agents_system_7x9k2m', description: 'AI agent definitions and configurations' },
            { table: 'system_metrics_7x9k2m', description: 'Real-time performance metrics' },
            { table: 'decisions_7x9k2m', description: 'AI decision tracking and audit trail' },
            { table: 'tasks_7x9k2m', description: 'Task assignment and progress tracking' },
            { table: 'communications_7x9k2m', description: 'Inter-agent communication logs' },
            { table: 'security_events_7x9k2m', description: 'Security monitoring and events' },
            { table: 'workflows_7x9k2m', description: 'Automated workflow execution' },
            { table: 'resource_allocations_7x9k2m', description: 'System resource management' },
            { table: 'user_interactions_7x9k2m', description: 'Frontend user activity tracking' }
          ].map((schema, index) => (
            <motion.div
              key={schema.table}
              className="bg-royal-600/30 rounded p-3 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <h4 className="text-white font-mono text-sm mb-1">{schema.table}</h4>
              <p className="text-royal-300 text-xs">{schema.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <div>
            <h4 className="text-emerald-400 font-medium">Supabase Connected</h4>
            <p className="text-emerald-300 text-sm">
              Real-time database connection established • Project: elpwpvhpesehgeksvych
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseIntegration;