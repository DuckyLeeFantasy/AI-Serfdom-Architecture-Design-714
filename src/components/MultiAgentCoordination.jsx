import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { KingAIService, SerfAgentService, PeasantAgentService } from '../services/aiSerfdomService';

const {
  FiCrown, FiUsers, FiServer, FiArrowRight, FiArrowDown, FiMessageCircle,
  FiCpu, FiActivity, FiZap, FiTarget, FiCheck, FiClock, FiAlertTriangle
} = FiIcons;

const MultiAgentCoordination = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [coordinationLog, setCoordinationLog] = useState([]);
  const [agentStates, setAgentStates] = useState({
    king: { status: 'idle', currentTask: null, workload: 15 },
    serf: { status: 'idle', currentTask: null, workload: 35 },
    peasant: { status: 'idle', currentTask: null, workload: 60 }
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [communicationFlow, setCommunicationFlow] = useState([]);

  const { logUserInteraction } = useSupabaseData();

  useEffect(() => {
    logUserInteraction({
      interaction_type: 'page_view',
      page_path: '/multi-agent-coordination',
      data: { component: 'MultiAgentCoordination' }
    });
  }, [logUserInteraction]);

  const scenarios = [
    {
      id: 'customer_service',
      title: 'Customer Service Escalation',
      description: 'Complex customer inquiry requiring multi-agent collaboration',
      complexity: 'high',
      estimatedTime: '45s',
      icon: FiUsers,
      color: 'emerald'
    },
    {
      id: 'data_analysis',
      title: 'Real-time Data Analysis',
      description: 'Large dataset processing with visualization requirements',
      complexity: 'medium',
      estimatedTime: '30s',
      icon: FiCpu,
      color: 'blue'
    },
    {
      id: 'system_optimization',
      title: 'System Performance Optimization',
      description: 'Comprehensive system analysis and optimization',
      complexity: 'high',
      estimatedTime: '60s',
      icon: FiZap,
      color: 'gold'
    },
    {
      id: 'security_incident',
      title: 'Security Incident Response',
      description: 'Coordinated response to security threat detection',
      complexity: 'critical',
      estimatedTime: '90s',
      icon: FiAlertTriangle,
      color: 'red'
    }
  ];

  const addToLog = (entry) => {
    setCoordinationLog(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...entry
    }, ...prev.slice(0, 19)]);
  };

  const addCommunication = (from, to, message, type = 'command') => {
    setCommunicationFlow(prev => [{
      id: Date.now(),
      from,
      to,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);
  };

  const updateAgentState = (agent, updates) => {
    setAgentStates(prev => ({
      ...prev,
      [agent]: { ...prev[agent], ...updates }
    }));
  };

  const executeScenario = async (scenario) => {
    if (isExecuting) return;

    setIsExecuting(true);
    setActiveScenario(scenario);
    setCoordinationLog([]);
    setCommunicationFlow([]);

    addToLog({
      agent: 'system',
      action: `Starting ${scenario.title}`,
      status: 'info',
      details: scenario.description
    });

    try {
      switch (scenario.id) {
        case 'customer_service':
          await executeCustomerServiceScenario();
          break;
        case 'data_analysis':
          await executeDataAnalysisScenario();
          break;
        case 'system_optimization':
          await executeSystemOptimizationScenario();
          break;
        case 'security_incident':
          await executeSecurityIncidentScenario();
          break;
        default:
          await executeGenericScenario(scenario);
      }

      addToLog({
        agent: 'system',
        action: `${scenario.title} completed successfully`,
        status: 'success',
        details: 'All agents coordinated effectively'
      });
    } catch (error) {
      addToLog({
        agent: 'system',
        action: 'Scenario execution failed',
        status: 'error',
        details: error.message
      });
    } finally {
      setIsExecuting(false);
      // Reset agent states
      setTimeout(() => {
        setAgentStates({
          king: { status: 'idle', currentTask: null, workload: 15 },
          serf: { status: 'idle', currentTask: null, workload: 35 },
          peasant: { status: 'idle', currentTask: null, workload: 60 }
        });
      }, 2000);
    }
  };

  const executeCustomerServiceScenario = async () => {
    // Step 1: Customer inquiry received by Serf
    updateAgentState('serf', { status: 'processing', currentTask: 'Analyzing customer inquiry' });
    addToLog({
      agent: 'serf',
      action: 'Customer inquiry received',
      status: 'info',
      details: 'Complex billing dispute requiring escalation'
    });
    await delay(2000);

    // Step 2: Serf analyzes and determines escalation needed
    addCommunication('serf', 'king', 'Customer inquiry requires strategic decision', 'escalation');
    addToLog({
      agent: 'serf',
      action: 'Escalating to King AI Overseer',
      status: 'info',
      details: 'Issue complexity exceeds Serf authority level'
    });
    await delay(1500);

    // Step 3: King AI makes strategic decision
    updateAgentState('king', { status: 'processing', currentTask: 'Strategic analysis' });
    try {
      const decision = await KingAIService.makeDecision(
        'customer_service_escalation',
        'Authorize refund and process improvement',
        'Customer satisfaction priority with system learning',
        92.5
      );
      addToLog({
        agent: 'king',
        action: 'Strategic decision made',
        status: 'success',
        details: `Decision ID: ${decision[0]?.id}`
      });
    } catch (error) {
      addToLog({
        agent: 'king',
        action: 'Strategic decision made',
        status: 'success',
        details: 'Customer service strategy formulated'
      });
    }
    await delay(2000);

    // Step 4: King delegates data analysis to Peasant
    addCommunication('king', 'peasant', 'Analyze billing patterns for improvements', 'delegation');
    updateAgentState('peasant', { status: 'processing', currentTask: 'Data analysis' });
    try {
      const task = await KingAIService.assignTask(
        'peasant',
        'Billing Pattern Analysis',
        'Analyze customer billing data to prevent future disputes',
        4
      );
      addToLog({
        agent: 'king',
        action: 'Task delegated to Peasant',
        status: 'info',
        details: `Task ID: ${task[0]?.id}`
      });
    } catch (error) {
      addToLog({
        agent: 'king',
        action: 'Task delegated to Peasant',
        status: 'info',
        details: 'Billing analysis task assigned'
      });
    }
    await delay(3000);

    // Step 5: Peasant completes analysis
    try {
      await PeasantAgentService.logMetric('data_analysis_completion', 1, 'count', {
        records_analyzed: 15000,
        patterns_found: 3,
        recommendations: 5
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'peasant',
      action: 'Data analysis completed',
      status: 'success',
      details: 'Identified 3 billing pattern issues'
    });
    await delay(1500);

    // Step 6: Serf implements customer resolution
    addCommunication('king', 'serf', 'Implement customer resolution plan', 'command');
    try {
      await SerfAgentService.logMetric('customer_satisfaction', 98.5, '%', {
        resolution_time: '12 minutes',
        escalation_successful: true
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'serf',
      action: 'Customer resolution implemented',
      status: 'success',
      details: 'Customer satisfied, process improved'
    });
  };

  const executeDataAnalysisScenario = async () => {
    // Step 1: King initiates data analysis strategy
    updateAgentState('king', { status: 'processing', currentTask: 'Analysis strategy' });
    addToLog({
      agent: 'king',
      action: 'Initiating data analysis strategy',
      status: 'info',
      details: 'Large dataset requires coordinated processing'
    });
    await delay(1500);

    // Step 2: Delegate processing to Peasant
    addCommunication('king', 'peasant', 'Process dataset with statistical analysis', 'delegation');
    updateAgentState('peasant', { status: 'processing', currentTask: 'Data processing' });
    await delay(2500);

    // Step 3: Peasant processes data
    try {
      await PeasantAgentService.logMetric('data_processing_rate', 2.3, 'GB/s', {
        total_records: 500000,
        processing_time: '18 seconds'
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'peasant',
      action: 'Data processing completed',
      status: 'success',
      details: '500K records processed in 18 seconds'
    });
    await delay(2000);

    // Step 4: Delegate visualization to Serf
    addCommunication('king', 'serf', 'Create interactive data visualization', 'delegation');
    updateAgentState('serf', { status: 'processing', currentTask: 'Creating visualization' });
    await delay(2000);

    // Step 5: Serf creates visualization
    try {
      await SerfAgentService.logMetric('visualization_creation', 1, 'count', {
        charts_created: 5,
        interactivity_level: 'high',
        user_engagement_prediction: 94
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'serf',
      action: 'Interactive visualization created',
      status: 'success',
      details: '5 charts with high interactivity'
    });
  };

  const executeSystemOptimizationScenario = async () => {
    // Step 1: King analyzes system performance
    updateAgentState('king', { status: 'processing', currentTask: 'System analysis' });
    addToLog({
      agent: 'king',
      action: 'Analyzing system performance',
      status: 'info',
      details: 'Comprehensive optimization strategy development'
    });
    await delay(2000);

    // Step 2: Coordinate optimization tasks
    addCommunication('king', 'peasant', 'Optimize database performance', 'command');
    addCommunication('king', 'serf', 'Optimize user interface responsiveness', 'command');
    updateAgentState('peasant', { status: 'processing', currentTask: 'Database optimization' });
    updateAgentState('serf', { status: 'processing', currentTask: 'UI optimization' });
    await delay(3000);

    // Step 3: Peasant optimizes backend
    try {
      await PeasantAgentService.logMetric('database_optimization', 25, '% improvement', {
        query_speed_improvement: 25,
        index_optimization: true,
        cache_hit_rate: 95
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'peasant',
      action: 'Database optimization completed',
      status: 'success',
      details: '25% query speed improvement achieved'
    });
    await delay(1500);

    // Step 4: Serf optimizes frontend
    try {
      await SerfAgentService.logMetric('ui_optimization', 40, '% improvement', {
        load_time_reduction: 40,
        responsive_design: true,
        accessibility_score: 98
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'serf',
      action: 'UI optimization completed',
      status: 'success',
      details: '40% load time reduction achieved'
    });
    await delay(1500);

    // Step 5: King validates optimization results
    addToLog({
      agent: 'king',
      action: 'System optimization validated',
      status: 'success',
      details: 'Overall system performance improved by 32%'
    });
  };

  const executeSecurityIncidentScenario = async () => {
    // Step 1: Security threat detected
    addToLog({
      agent: 'system',
      action: 'Security threat detected',
      status: 'warning',
      details: 'Unusual access patterns identified'
    });
    await delay(1000);

    // Step 2: King initiates emergency response
    updateAgentState('king', { status: 'processing', currentTask: 'Emergency response' });
    addToLog({
      agent: 'king',
      action: 'Emergency response initiated',
      status: 'warning',
      details: 'Coordinating multi-agent security response'
    });
    await delay(1500);

    // Step 3: Coordinate security measures
    addCommunication('king', 'peasant', 'Implement security lockdown procedures', 'emergency');
    addCommunication('king', 'serf', 'Activate user notification protocols', 'emergency');
    updateAgentState('peasant', { status: 'processing', currentTask: 'Security lockdown' });
    updateAgentState('serf', { status: 'processing', currentTask: 'User notifications' });
    await delay(2500);

    // Step 4: Peasant secures backend
    try {
      await PeasantAgentService.logMetric('security_measures', 1, 'count', {
        access_restrictions: 'activated',
        audit_logging: 'enhanced',
        threat_mitigation: 'active'
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'peasant',
      action: 'Security lockdown implemented',
      status: 'success',
      details: 'Backend secured, audit logging enhanced'
    });
    await delay(2000);

    // Step 5: Serf manages user communication
    try {
      await SerfAgentService.logMetric('security_communication', 1, 'count', {
        users_notified: 1543,
        transparency_level: 'appropriate',
        user_confidence: 'maintained'
      });
    } catch (error) {
      console.log('Metric logging simulated');
    }
    addToLog({
      agent: 'serf',
      action: 'User notifications sent',
      status: 'success',
      details: '1,543 users notified with appropriate transparency'
    });
    await delay(1500);

    // Step 6: King validates security response
    addToLog({
      agent: 'king',
      action: 'Security incident resolved',
      status: 'success',
      details: 'Threat neutralized, system integrity maintained'
    });
  };

  const executeGenericScenario = async (scenario) => {
    updateAgentState('king', { status: 'processing', currentTask: 'Coordinating agents' });
    await delay(2000);
    updateAgentState('serf', { status: 'processing', currentTask: 'Frontend tasks' });
    updateAgentState('peasant', { status: 'processing', currentTask: 'Backend tasks' });
    await delay(3000);
    addToLog({
      agent: 'king',
      action: 'Generic coordination completed',
      status: 'success',
      details: 'All agents successfully coordinated'
    });
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getAgentIcon = (agent) => {
    switch (agent) {
      case 'king': return FiCrown;
      case 'serf': return FiUsers;
      case 'peasant': return FiServer;
      default: return FiActivity;
    }
  };

  const getAgentColor = (agent) => {
    switch (agent) {
      case 'king': return 'gold';
      case 'serf': return 'emerald';
      case 'peasant': return 'blue';
      default: return 'royal';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'gray';
      case 'processing': return 'blue';
      case 'success': return 'emerald';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'royal';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Multi-Agent Coordination</h2>
          <p className="text-royal-300">Real-time demonstration of hierarchical AI agent collaboration</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isExecuting ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'}`}></div>
          <span className={`text-sm ${isExecuting ? 'text-blue-400' : 'text-emerald-400'}`}>
            {isExecuting ? 'Coordinating...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Agent Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(agentStates).map(([agentId, state]) => (
          <motion.div
            key={agentId}
            className={`bg-royal-700/30 rounded-lg p-4 border border-${getAgentColor(agentId)}-500/30`}
            animate={{
              borderColor: state.status === 'processing' 
                ? `rgb(59 130 246 / 0.5)` 
                : `rgb(${getAgentColor(agentId) === 'gold' ? '245 158 11' : getAgentColor(agentId) === 'emerald' ? '16 185 129' : '59 130 246'} / 0.3)`
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-${getAgentColor(agentId)}-500/20`}>
                <SafeIcon icon={getAgentIcon(agentId)} className={`text-lg text-${getAgentColor(agentId)}-400`} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium capitalize">{agentId} AI</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-${getStatusColor(state.status)}-400 ${state.status === 'processing' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-royal-300 text-sm capitalize">{state.status}</span>
                </div>
              </div>
            </div>
            {state.currentTask && (
              <div className="mb-3">
                <p className="text-royal-300 text-xs mb-1">Current Task:</p>
                <p className="text-white text-sm">{state.currentTask}</p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-royal-400">Workload:</span>
                <span className="text-white">{state.workload}%</span>
              </div>
              <div className="w-full bg-royal-600 rounded-full h-1">
                <motion.div
                  className={`h-1 rounded-full bg-${getAgentColor(agentId)}-400`}
                  initial={{ width: 0 }}
                  animate={{ width: `${state.workload}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scenario Selection */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Coordination Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => executeScenario(scenario)}
              disabled={isExecuting}
              className={`p-4 rounded-lg border transition-all text-left ${
                isExecuting 
                  ? 'bg-royal-600/20 border-royal-500 cursor-not-allowed opacity-50'
                  : `bg-royal-600/30 border-${scenario.color}-500/30 hover:border-${scenario.color}-500/50 hover:bg-${scenario.color}-500/10`
              }`}
              whileHover={!isExecuting ? { scale: 1.02 } : {}}
              whileTap={!isExecuting ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-${scenario.color}-500/20 flex-shrink-0`}>
                  <SafeIcon icon={scenario.icon} className={`text-lg text-${scenario.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{scenario.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      scenario.complexity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      scenario.complexity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      scenario.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {scenario.complexity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-royal-300 text-sm mb-2">{scenario.description}</p>
                  <div className="flex items-center space-x-3 text-xs text-royal-400">
                    <span>Est. Time: {scenario.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Communication Flow */}
      {communicationFlow.length > 0 && (
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">Real-time Communication Flow</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {communicationFlow.map((comm) => (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 bg-royal-600/30 rounded p-2 border border-royal-500"
                >
                  <div className={`p-1 rounded bg-${getAgentColor(comm.from)}-500/20`}>
                    <SafeIcon icon={getAgentIcon(comm.from)} className={`text-sm text-${getAgentColor(comm.from)}-400`} />
                  </div>
                  <SafeIcon icon={FiArrowRight} className="text-royal-400 text-sm" />
                  <div className={`p-1 rounded bg-${getAgentColor(comm.to)}-500/20`}>
                    <SafeIcon icon={getAgentIcon(comm.to)} className={`text-sm text-${getAgentColor(comm.to)}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{comm.message}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-1 py-0.5 rounded ${
                        comm.type === 'emergency' ? 'bg-red-500/20 text-red-400' :
                        comm.type === 'escalation' ? 'bg-yellow-500/20 text-yellow-400' :
                        comm.type === 'delegation' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {comm.type.toUpperCase()}
                      </span>
                      <span className="text-royal-400">{comm.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Coordination Log */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Coordination Activity Log</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {coordinationLog.length === 0 ? (
            <p className="text-royal-400 text-sm">No coordination activities yet. Select a scenario to begin.</p>
          ) : (
            <AnimatePresence>
              {coordinationLog.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-royal-600/30 rounded p-3 border border-royal-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${getStatusColor(log.status)}-400`}></div>
                      <div className="flex items-center space-x-2">
                        {log.agent !== 'system' && (
                          <SafeIcon icon={getAgentIcon(log.agent)} className={`text-sm text-${getAgentColor(log.agent)}-400`} />
                        )}
                        <span className="text-white font-medium text-sm">{log.action}</span>
                      </div>
                    </div>
                    <span className="text-royal-400 text-xs">{log.timestamp}</span>
                  </div>
                  {log.details && (
                    <p className="text-royal-300 text-xs ml-4">{log.details}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Active Scenario Status */}
      {activeScenario && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-${activeScenario.color}-500/10 border border-${activeScenario.color}-500/30 rounded-lg p-4`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${activeScenario.color}-500/20`}>
              <SafeIcon icon={activeScenario.icon} className={`text-lg text-${activeScenario.color}-400`} />
            </div>
            <div>
              <h4 className="text-white font-medium">Active Scenario: {activeScenario.title}</h4>
              <p className="text-royal-300 text-sm">{activeScenario.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="text-royal-400">Complexity: {activeScenario.complexity}</span>
                <span className="text-royal-400">Est. Time: {activeScenario.estimatedTime}</span>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={isExecuting ? FiClock : FiCheck} className={isExecuting ? 'text-blue-400' : 'text-emerald-400'} />
                  <span className={isExecuting ? 'text-blue-400' : 'text-emerald-400'}>
                    {isExecuting ? 'In Progress' : 'Completed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MultiAgentCoordination;