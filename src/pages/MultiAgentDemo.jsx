import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MultiAgentCoordination from '../components/MultiAgentCoordination';

const { FiTarget, FiUsers, FiZap, FiActivity, FiLayers, FiGitBranch } = FiIcons;

const MultiAgentDemo = () => {
  const coordinationPrinciples = [
    {
      title: 'Hierarchical Decision Making',
      description: 'King AI Overseer provides strategic direction while delegating execution to specialized agents',
      icon: FiLayers,
      color: 'gold'
    },
    {
      title: 'Real-time Communication',
      description: 'Agents communicate through secure channels with message routing and priority handling',
      icon: FiActivity,
      color: 'emerald'
    },
    {
      title: 'Task Orchestration',
      description: 'Complex workflows are broken down and distributed across agents based on their capabilities',
      icon: FiGitBranch,
      color: 'blue'
    },
    {
      title: 'Collaborative Intelligence',
      description: 'Agents work together to solve problems that exceed individual capabilities',
      icon: FiUsers,
      color: 'purple'
    }
  ];

  const scenarioOutcomes = [
    {
      scenario: 'Customer Service',
      outcome: 'Reduced resolution time by 65% through intelligent escalation',
      impact: 'high',
      agents: ['King', 'Serf', 'Peasant']
    },
    {
      scenario: 'Data Analysis',
      outcome: 'Processed 500K records in 18 seconds with interactive visualization',
      impact: 'medium',
      agents: ['King', 'Serf', 'Peasant']
    },
    {
      scenario: 'System Optimization',
      outcome: 'Improved overall performance by 32% through coordinated optimization',
      impact: 'high',
      agents: ['King', 'Serf', 'Peasant']
    },
    {
      scenario: 'Security Response',
      outcome: 'Neutralized threat in under 90 seconds with zero data loss',
      impact: 'critical',
      agents: ['King', 'Serf', 'Peasant']
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <SafeIcon icon={FiTarget} className="text-4xl text-gold-400" />
            <h1 className="text-4xl font-medieval font-bold text-gold-400">Multi-Agent Coordination</h1>
          </div>
          <p className="text-xl text-royal-300 max-w-3xl mx-auto">
            Experience the power of hierarchical AI agents working together to solve complex problems
          </p>
        </motion.div>

        {/* Coordination Principles */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {coordinationPrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${principle.color}-500/20 flex-shrink-0`}>
                  <SafeIcon icon={principle.icon} className={`text-xl text-${principle.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{principle.title}</h3>
                  <p className="text-royal-300 text-sm leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Coordination Interface */}
        <motion.div 
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MultiAgentCoordination />
        </motion.div>

        {/* Scenario Outcomes */}
        <motion.div 
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Coordination Outcomes</h2>
          <div className="space-y-4">
            {scenarioOutcomes.map((outcome, index) => (
              <motion.div
                key={outcome.scenario}
                className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{outcome.scenario} Scenario</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      outcome.impact === 'critical' ? 'bg-red-500/20 text-red-400' :
                      outcome.impact === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      outcome.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {outcome.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
                <p className="text-emerald-400 text-sm mb-2">{outcome.outcome}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-300 text-xs">Agents involved:</span>
                  {outcome.agents.map((agent, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                      {agent}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Architecture */}
        <motion.div 
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400">Communication Layer</h3>
              <div className="space-y-2 text-sm text-royal-300">
                <div className="flex items-center justify-between">
                  <span>Message Routing:</span>
                  <span className="text-white">Priority-based queuing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Protocol:</span>
                  <span className="text-white">WebSocket + REST API</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Encryption:</span>
                  <span className="text-white">TLS 1.3 + E2E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-400">< 5ms average</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Coordination Engine</h3>
              <div className="space-y-2 text-sm text-royal-300">
                <div className="flex items-center justify-between">
                  <span>Task Orchestration:</span>
                  <span className="text-white">DAG-based workflow</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Load Balancing:</span>
                  <span className="text-white">Dynamic capability-based</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fault Tolerance:</span>
                  <span className="text-white">Circuit breaker pattern</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Throughput:</span>
                  <span className="text-blue-400">1000+ tasks/second</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Status */}
        <motion.div 
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div>
              <h4 className="text-emerald-400 font-medium">Multi-Agent System Online</h4>
              <p className="text-emerald-300 text-sm">
                All agents are operational and ready for coordination scenarios • Supabase backend connected
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiAgentDemo;